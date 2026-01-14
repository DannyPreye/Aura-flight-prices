import axios from "axios";

const API_KEY = import.meta.env.VITE_AMADEUS_API_KEY;
const API_SECRET = import.meta.env.VITE_AMADEUS_API_SECRET;
const BASE_URL = "https://test.api.amadeus.com";

let accessToken = "";
let tokenExpiry = 0;

const getAuthToken = async () => {
    if (accessToken && Date.now() < tokenExpiry) {
        return accessToken;
    }

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", API_KEY);
    params.append("client_secret", API_SECRET);

    try {
        const response = await axios.post(
            `${BASE_URL}/v1/security/oauth2/token`,
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        accessToken = response.data.access_token;
        tokenExpiry = Date.now() + response.data.expires_in * 1000;
        return accessToken;
    } catch (error) {
        console.error("Error fetching Amadeus token:", error);
        throw error;
    }
};

export const searchAirports = async (query) => {
    if (!query || query.length < 2) return [];

    try {
        const token = await getAuthToken();
        const response = await axios.get(
            `${BASE_URL}/v1/reference-data/locations`,
            {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    keyword: query,
                    subType: "AIRPORT,CITY",
                },
            }
        );

        return response.data.data.map((location) => ({
            label: `${location.name} (${location.iataCode})`,
            code: location.iataCode,
            city: location.address.cityName,
        }));
    } catch (error) {
        console.error("Error searching airports:", error);
        return [];
    }
};

export const searchFlights = async (params) => {
    const {
        origin,
        destination,
        departureDate,
        maxPrice,
        stops,
        airlines,
        cabinClass,
        nonStop,
        departTimeRange,
        maxDurationMinutes,
    } = params;

    try {
        const token = await getAuthToken();

        const response = await axios.get(
            `${BASE_URL}/v2/shopping/flight-offers`,
            {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    originLocationCode: origin,
                    destinationLocationCode: destination,
                    departureDate,
                    adults: 1,
                    max: 20,
                    currencyCode: "USD",

                    // 🔥 API-level filters
                    ...(airlines?.length && {
                        includedAirlineCodes: airlines.join(","),
                    }),
                    ...(cabinClass && {
                        travelClass: cabinClass,
                    }),
                    ...(nonStop !== undefined && {
                        nonStop,
                    }),
                },
            }
        );

        const { data, dictionaries = {} } = response.data;

        let flights = data.map((offer) => {
            const itinerary = offer.itineraries[0];
            const segments = itinerary.segments;
            const first = segments[0];
            const last = segments[segments.length - 1];

            const carrierCode = first.carrierCode;

            const departureTime = new Date(first.departure.at);
            const arrivalTime = new Date(last.arrival.at);

            const durationMinutes = segments.reduce((acc, s) => {
                const start = new Date(s.departure.at);
                const end = new Date(s.arrival.at);
                return acc + (end - start) / 60000;
            }, 0);

            return {
                id: offer.id,
                airline: dictionaries.carriers?.[carrierCode] || carrierCode,
                airlineCode: carrierCode,
                logo: `https://www.gstatic.com/flights/airline_logos/70px/${carrierCode}.png`,
                departure: {
                    code: first.departure.iataCode,
                    time: departureTime,
                },
                arrival: {
                    code: last.arrival.iataCode,
                    time: arrivalTime,
                },
                durationMinutes,
                price: Number(offer.price.total),
                stops: segments.length - 1,
                cabin: offer.travelerPricings[0].fareDetailsBySegment[0].cabin,
                refundable:
                    offer.travelerPricings[0].fareDetailsBySegment[0].fareBasis?.includes(
                        "REF"
                    ),
            };
        });

        // 🔥 Local filters (precision layer)

        if (maxPrice) {
            flights = flights.filter((f) => f.price <= maxPrice);
        }

        if (stops !== undefined && stops !== "") {
            flights = flights.filter((f) => f.stops === Number(stops));
        }

        if (departTimeRange) {
            const { from, to } = departTimeRange;
            flights = flights.filter((f) => {
                const time =
                    f.departure.time.getHours() * 60 +
                    f.departure.time.getMinutes();
                const fromMin = Number(from.split(":")[0]) * 60;
                const toMin = Number(to.split(":")[0]) * 60;
                return time >= fromMin && time <= toMin;
            });
        }

        if (maxDurationMinutes) {
            flights = flights.filter(
                (f) => f.durationMinutes <= maxDurationMinutes
            );
        }

        // Generate trends based on departure date and average price
        const avgPrice =
            flights.length > 0
                ? flights.reduce((sum, f) => sum + f.price, 0) / flights.length
                : 500;
        const trends = generateRealisticTrends(departureDate, avgPrice);

        return { flights, trends };
    } catch (error) {
        console.error("Error searching flights:", error);
        throw error;
    }
};

const generateRealisticTrends = (departureDate, basePrice) => {
    const trends = [];
    const departure = new Date(departureDate);

    // Generate trend data for 11 days (5 days before to 5 days after departure date)
    for (let i = -5; i <= 5; i++) {
        const date = new Date(departure);
        date.setDate(departure.getDate() + i);

        const dayStr = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });

        // Calculate price variance based on multiple factors
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 || dayOfWeek === 5; // Fri, Sat, Sun

        // Base variance: prices fluctuate +/- 15%
        const randomVariance = (Math.random() - 0.5) * 0.3 * basePrice;

        // Weekend premium: 10-20% higher on weekends
        const weekendPremium = isWeekend
            ? basePrice * (0.1 + Math.random() * 0.1)
            : 0;

        // Distance from departure: prices tend to be lower when booking further out
        const daysFromDeparture = Math.abs(i);
        const advanceBookingDiscount =
            daysFromDeparture > 2 ? basePrice * 0.05 : 0;

        // Same day or next day: significantly more expensive
        const lastMinutePremium =
            daysFromDeparture <= 1
                ? basePrice * (0.3 + Math.random() * 0.2)
                : 0;

        const finalPrice =
            basePrice +
            randomVariance +
            weekendPremium -
            advanceBookingDiscount +
            lastMinutePremium;

        trends.push({
            date: dayStr,
            price: Math.max(100, Math.round(finalPrice)),
        });
    }

    return trends;
};
