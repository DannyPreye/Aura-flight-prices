import React, { useState, useEffect, useMemo } from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    AppBar,
    Toolbar,
    CssBaseline,
    ThemeProvider,
    Paper,
    Drawer,
    Button,
    Alert,
    Snackbar,
    useMediaQuery,
    useTheme as useMuiTheme,
    alpha,
    IconButton,
    Fab,
    Stack,
    Pagination,
} from "@mui/material";
import {
    FilterList as FilterIcon,
    Flight as FlightIcon,
    Explore,
    SupportAgent,
    NotificationsNone,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import theme from "./theme";
import SearchForm from "./components/SearchForm";
import FlightCard from "./components/FlightCard";
import PriceGraph from "./components/PriceGraph";
import Filters from "./components/Filters";
import {
    FlightCardSkeleton,
    PriceGraphSkeleton,
} from "./components/SkeletonLoaders";
import { searchFlights } from "./services/api";

const App = () => {
    const [loading, setLoading] = useState(false);
    const [flights, setFlights] = useState([]);
    const [trends, setTrends] = useState([]);
    const [filters, setFilters] = useState({
        maxPrice: 1500,
        stops: "",
        airlines: [],
        cabinClass: "",
        departTimeRange: null,
        maxDurationMinutes: null,
    });
    const [searchParams, setSearchParams] = useState(null);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

    // Get unique airlines from the flights data for filtering
    const availableAirlines = useMemo(() => {
        const seen = new Set();
        return flights
            .map((f) => ({
                airline: f.airline,
                code: f.airlineCode,
            }))
            .filter((item) => {
                const key = item.code;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            })
            .sort((a, b) => a.airline.localeCompare(b.airline));
    }, [flights]);

    console.log("Available airlines for filtering:", flights);

    // Pagination logic
    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.ceil(flights.length / ITEMS_PER_PAGE);
    const paginatedFlights = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return flights.slice(startIndex, endIndex);
    }, [flights, currentPage]);

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSearch = async (params) => {
        setLoading(true);
        setError(null);
        setSearchParams(params);
        setCurrentPage(1); // Reset to first page on new search
        try {
            const result = await searchFlights({ ...params, ...filters });
            setFlights(result.flights);
            setTrends(result.trends);
            if (result.flights.length === 0) {
                setError("No flights found for this route and date.");
            }
        } catch (err) {
            console.error("Search failed", err);
            setError(
                "Failed to fetch flights. Please check your connection or API keys."
            );
        } finally {
            setTimeout(() => setLoading(false), 500); // Smoother transition
        }
    };

    useEffect(() => {
        if (searchParams) {
            const fetchWithFilters = async () => {
                setLoading(true);
                setError(null);
                setCurrentPage(1);
                try {
                    const result = await searchFlights({
                        ...searchParams,
                        ...filters,
                    });
                    setFlights(result.flights);
                    setTrends(result.trends);
                    if (result.flights.length === 0) {
                        setError("No flights found for this route and date.");
                    }
                } catch (err) {
                    console.error("Search failed", err);
                    setError(
                        "Failed to fetch flights. Please check your connection or API keys."
                    );
                } finally {
                    setTimeout(() => setLoading(false), 500);
                }
            };
            fetchWithFilters();
        }
    }, [filters, searchParams]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    console.log("trends:", trends);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    flexGrow: 1,
                    minHeight: "100vh",
                    bgcolor: "background.default",
                }}
            >
                {/* Cinematic Header */}
                <Box
                    sx={{
                        height: { xs: 350, md: 450 },
                        position: "relative",
                        overflow: "hidden",
                        background:
                            "linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%)",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Animated Background Circles */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: -100,
                            right: -100,
                            width: 400,
                            height: 400,
                            borderRadius: "50%",
                            background: "rgba(99, 102, 241, 0.2)",
                            filter: "blur(80px)",
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: -50,
                            left: -50,
                            width: 300,
                            height: 300,
                            borderRadius: "50%",
                            background: "rgba(14, 165, 233, 0.2)",
                            filter: "blur(60px)",
                        }}
                    />

                    <AppBar
                        position='static'
                        color='transparent'
                        elevation={0}
                        sx={{ pt: 2 }}
                    >
                        <Container
                            maxWidth={false}
                            disableGutters
                            sx={{ px: { xs: 2, md: 3 } }}
                        >
                            <Toolbar
                                disableGutters
                                sx={{ justifyContent: "space-between" }}
                            >
                                <Box
                                    display='flex'
                                    alignItems='center'
                                    gap={1.5}
                                >
                                    <Box
                                        sx={{
                                            width: 45,
                                            height: 45,
                                            borderRadius: "12px",
                                            bgcolor: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow:
                                                "0 8px 16px rgba(0,0,0,0.1)",
                                        }}
                                    >
                                        <FlightIcon
                                            sx={{
                                                color: "primary.main",
                                                fontSize: 28,
                                            }}
                                        />
                                    </Box>
                                    <Typography
                                        variant='h5'
                                        sx={{
                                            color: "white",
                                            fontWeight: 900,
                                            letterSpacing: "-0.02em",
                                        }}
                                    >
                                        AURA
                                    </Typography>
                                </Box>

                                {!isMobile && (
                                    <Box
                                        display='flex'
                                        alignItems='center'
                                        gap={4}
                                    >
                                        {["Explore", "Bookings", "Hotels"].map(
                                            (item) => (
                                                <Typography
                                                    key={item}
                                                    variant='body2'
                                                    sx={{
                                                        color: alpha(
                                                            "#fff",
                                                            0.8
                                                        ),
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                        "&:hover": {
                                                            color: "#fff",
                                                        },
                                                    }}
                                                >
                                                    {item}
                                                </Typography>
                                            )
                                        )}
                                        <IconButton sx={{ color: "white" }}>
                                            <NotificationsNone />
                                        </IconButton>
                                        <IconButton sx={{ color: "white" }}>
                                            <SupportAgent />
                                        </IconButton>
                                    </Box>
                                )}
                            </Toolbar>
                        </Container>
                    </AppBar>

                    <Container
                        maxWidth={false}
                        disableGutters
                        sx={{
                            mt: { xs: 4, md: 8 },
                            px: { xs: 2, md: 3 },
                            position: "relative",
                            zIndex: 1,
                            textAlign: "center",
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Typography
                                variant='h1'
                                sx={{
                                    color: "white",
                                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                                    lineHeight: 1.1,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 2,
                                    mb: 2,
                                    textShadow: "0 10px 30px rgba(0,0,0,0.2)",
                                }}
                            >
                                The world is yours{" "}
                                <Explore
                                    sx={{
                                        fontSize: { xs: 40, md: 50 },
                                        color: "accent.main",
                                    }}
                                />
                            </Typography>
                            <Typography
                                variant='h6'
                                sx={{
                                    color: alpha("#fff", 0.7),
                                    fontWeight: 400,
                                    maxWidth: 600,
                                    mx: "auto",
                                }}
                            >
                                Search over 400 airlines worldwide and get
                                real-time price insights.
                            </Typography>
                        </motion.div>
                    </Container>
                </Box>

                {/* Search Component (Z-indexed over header) */}
                <Container
                    maxWidth={false}
                    disableGutters
                    sx={{ mb: 8, px: { xs: 2, md: 3 } }}
                >
                    <Box sx={{ mt: -6, position: "relative", zIndex: 10 }}>
                        <SearchForm onSearch={handleSearch} />
                    </Box>

                    {!searchParams ? (
                        <Box
                            sx={{
                                mt: 8,
                                position: "relative",
                                borderRadius: 8,
                                overflow: "hidden",
                                p: { xs: 4, md: 10 },
                                textAlign: "center",
                                background:
                                    "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(14, 165, 233, 0.05) 100%)",
                                border: "1px solid rgba(99, 102, 241, 0.1)",
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Box
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: "30px",
                                        bgcolor: "white",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mx: "auto",
                                        mb: 4,
                                        boxShadow:
                                            "0 20px 40px rgba(0,0,0,0.05)",
                                        transform: "rotate(-10deg)",
                                    }}
                                >
                                    <Explore
                                        sx={{
                                            fontSize: 50,
                                            color: "primary.main",
                                        }}
                                    />
                                </Box>
                                <Typography
                                    variant='h2'
                                    sx={{
                                        fontWeight: 900,
                                        mb: 2,
                                        fontSize: { xs: "2rem", md: "3rem" },
                                        background:
                                            "linear-gradient(135deg, #1e293b 0%, #64748b 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    Where to next?
                                </Typography>
                                <Typography
                                    variant='h6'
                                    color='text.secondary'
                                    sx={{
                                        maxWidth: 600,
                                        mx: "auto",
                                        fontWeight: 400,
                                        mb: 4,
                                    }}
                                >
                                    Your journey begins with a single search.
                                    Discover exclusive deals and plan your dream
                                    escape today.
                                </Typography>
                                <Stack
                                    direction='row'
                                    spacing={2}
                                    justifyContent='center'
                                    sx={{ opacity: 0.7 }}
                                >
                                    {[
                                        "400+ Airlines",
                                        "Global Reach",
                                        "Live Updates",
                                    ].map((feature) => (
                                        <Typography
                                            key={feature}
                                            variant='caption'
                                            sx={{
                                                fontWeight: 700,
                                                letterSpacing: "0.1em",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            • {feature}
                                        </Typography>
                                    ))}
                                </Stack>
                            </motion.div>
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                mt: 2,
                                display: "flex",
                                gap: 4,
                                flexDirection: { xs: "column", md: "row" },
                            }}
                        >
                            {/* Sidebar Filters */}
                            <Box
                                sx={{
                                    display: { xs: "none", md: "block" },
                                    width: { md: "280px", lg: "300px" },
                                    flexShrink: 0,
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "sticky",
                                        top: 24,
                                        zIndex: 5,
                                        maxHeight: "calc(100vh - 48px)",
                                        overflowY: "auto",
                                        pr: 1,
                                        "&::-webkit-scrollbar": {
                                            width: "4px",
                                        },
                                        "&::-webkit-scrollbar-thumb": {
                                            bgcolor: alpha("#6366f1", 0.1),
                                            borderRadius: 2,
                                        },
                                    }}
                                >
                                    <Paper
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            border: "1px solid rgba(0,0,0,0.06)",
                                            boxShadow:
                                                "0 10px 40px -10px rgba(0,0,0,0.04)",
                                            bgcolor: "background.paper",
                                        }}
                                    >
                                        <Filters
                                            filters={filters}
                                            onFilterChange={handleFilterChange}
                                            availableAirlines={
                                                availableAirlines
                                            }
                                        />
                                    </Paper>
                                </Box>
                            </Box>

                            {/* Results Area */}
                            <Box
                                sx={{
                                    flex: 1,
                                    minWidth: 0,
                                }}
                            >
                                <AnimatePresence mode='wait'>
                                    {loading ? (
                                        <Box
                                            key='loading'
                                            sx={{ width: "100%" }}
                                        >
                                            {searchParams && (
                                                <PriceGraphSkeleton />
                                            )}
                                            {[1, 2, 3].map((i) => (
                                                <FlightCardSkeleton key={i} />
                                            ))}
                                        </Box>
                                    ) : (
                                        <motion.div
                                            key='results'
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                            style={{ width: "100%" }}
                                        >
                                            <>
                                                {flights.length > 0 && (
                                                    <Box sx={{ mb: 4 }}>
                                                        <PriceGraph
                                                            data={trends}
                                                        />
                                                    </Box>
                                                )}

                                                {isMobile && (
                                                    <Box
                                                        sx={{
                                                            mb: 3,
                                                            display: "flex",
                                                            justifyContent:
                                                                "flex-end",
                                                        }}
                                                    >
                                                        <Button
                                                            startIcon={
                                                                <FilterIcon />
                                                            }
                                                            onClick={() =>
                                                                setMobileFilterOpen(
                                                                    true
                                                                )
                                                            }
                                                            variant='outlined'
                                                            sx={{
                                                                borderRadius: 20,
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            Filters
                                                        </Button>
                                                    </Box>
                                                )}

                                                {flights.length > 0 ? (
                                                    <Box>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "space-between",
                                                                alignItems:
                                                                    "center",
                                                                mb: 3,
                                                            }}
                                                        >
                                                            <Typography
                                                                variant='h5'
                                                                sx={{
                                                                    fontWeight: 800,
                                                                }}
                                                            >
                                                                {flights.length}{" "}
                                                                Results Found
                                                            </Typography>
                                                            {!isMobile && (
                                                                <Typography
                                                                    variant='body2'
                                                                    color='text.secondary'
                                                                    sx={{
                                                                        fontWeight: 600,
                                                                    }}
                                                                >
                                                                    Prices
                                                                    include
                                                                    taxes and
                                                                    fees
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                        <Stack spacing={2}>
                                                            {paginatedFlights.map(
                                                                (flight) => (
                                                                    <FlightCard
                                                                        key={
                                                                            flight.id
                                                                        }
                                                                        flight={
                                                                            flight
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                        </Stack>

                                                        {/* Pagination */}
                                                        {totalPages > 1 && (
                                                            <Box
                                                                sx={{
                                                                    mt: 4,
                                                                    display:
                                                                        "flex",
                                                                    justifyContent:
                                                                        "center",
                                                                }}
                                                            >
                                                                <Pagination
                                                                    count={
                                                                        totalPages
                                                                    }
                                                                    page={
                                                                        currentPage
                                                                    }
                                                                    onChange={
                                                                        handlePageChange
                                                                    }
                                                                    color='primary'
                                                                    size={
                                                                        isMobile
                                                                            ? "medium"
                                                                            : "large"
                                                                    }
                                                                    sx={{
                                                                        "& .MuiPaginationItem-root":
                                                                            {
                                                                                fontWeight: 600,
                                                                            },
                                                                    }}
                                                                />
                                                            </Box>
                                                        )}
                                                    </Box>
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            py: 10,
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        <Typography
                                                            variant='h5'
                                                            sx={{
                                                                fontWeight: 800,
                                                            }}
                                                        >
                                                            No results found
                                                        </Typography>
                                                        <Typography
                                                            variant='body1'
                                                            color='text.secondary'
                                                        >
                                                            Try adjusting your
                                                            filters or search
                                                            criteria.
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Box>
                        </Box>
                    )}
                </Container>

                {/* Mobile Filters Drawer */}
                <Drawer
                    anchor='bottom'
                    open={mobileFilterOpen}
                    onClose={() => setMobileFilterOpen(false)}
                    PaperProps={{
                        sx: {
                            borderTopLeftRadius: 32,
                            borderTopRightRadius: 32,
                            p: 4,
                            maxHeight: "85vh",
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: "40px",
                            height: "4px",
                            bgcolor: "divider",
                            borderRadius: 2,
                            mx: "auto",
                            mb: 4,
                        }}
                    />
                    <Filters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        availableAirlines={availableAirlines}
                    />
                    <Button
                        variant='contained'
                        fullWidth
                        onClick={() => setMobileFilterOpen(false)}
                        sx={{
                            mt: 4,
                            py: 1.5,
                            borderRadius: 3,
                            fontWeight: 800,
                        }}
                    >
                        Show {flights.length} results
                    </Button>
                </Drawer>

                {/* Quick Action FAB for Mobile */}
                {isMobile && searchParams && !loading && (
                    <Fab
                        color='primary'
                        aria-label='search'
                        sx={{
                            position: "fixed",
                            bottom: 24,
                            right: 24,
                            boxShadow: "0 8px 16px rgba(99,102,241,0.4)",
                        }}
                        onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                    >
                        <FlightIcon />
                    </Fab>
                )}

                {/* Error Snackbar */}
                <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={() => setError(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert
                        onClose={() => setError(null)}
                        severity='error'
                        variant='filled'
                        sx={{ width: "100%", borderRadius: 4, fontWeight: 600 }}
                    >
                        {error}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
};

export default App;
