import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Avatar,
    Button,
    alpha,
} from "@mui/material";

const FlightCard = ({ flight }) => {
    if (!flight) return null;

    // Format time from ISO string to HH:MM
    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    // Format duration from minutes to readable format
    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <Card
            sx={{
                mb: 2,
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": { boxShadow: 4 },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        flexDirection: { xs: "column", sm: "row" },
                    }}
                >
                    {/* Airline Section */}
                    <Box
                        sx={{
                            width: { xs: "100%", sm: "25%" },
                            flexShrink: 0,
                        }}
                    >
                        <Box display='flex' alignItems='center' gap={2}>
                            <Avatar
                                src={flight.logo}
                                variant='rounded'
                                sx={{
                                    width: 48,
                                    height: 48,
                                    border: "1px solid #f0f0f0",
                                }}
                            >
                                {flight.airline?.[0] || "F"}
                            </Avatar>
                            <Typography variant='subtitle1' fontWeight='700'>
                                {flight.airline}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Flight Details Section */}
                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            width: { xs: "100%", sm: "auto" },
                        }}
                    >
                        <Box
                            display='flex'
                            justifyContent='space-between'
                            alignItems='center'
                        >
                            <Box textAlign='center'>
                                <Typography variant='h6' fontWeight='800'>
                                    {formatTime(flight.departure.time)}
                                </Typography>
                                <Typography
                                    variant='body2'
                                    color='text.secondary'
                                >
                                    {flight.departure.code}
                                </Typography>
                            </Box>

                            <Box sx={{ flex: 1, px: 3, textAlign: "center" }}>
                                <Typography
                                    variant='caption'
                                    color='text.secondary'
                                    sx={{ fontWeight: 600 }}
                                >
                                    {formatDuration(flight.durationMinutes)}
                                </Typography>
                                <Box
                                    sx={{
                                        height: "2px",
                                        bgcolor: "divider",
                                        my: 1,
                                        position: "relative",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: -4,
                                            left: 0,
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            bgcolor: "primary.main",
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: -4,
                                            right: 0,
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            bgcolor: "primary.main",
                                        }}
                                    />
                                </Box>
                                <Chip
                                    label={
                                        flight.stops === 0
                                            ? "Non-stop"
                                            : `${flight.stops} stop${
                                                  flight.stops > 1 ? "s" : ""
                                              }`
                                    }
                                    size='small'
                                    sx={{
                                        height: 20,
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                        bgcolor:
                                            flight.stops === 0
                                                ? alpha("#4caf50", 0.1)
                                                : alpha("#f44336", 0.1),
                                        color:
                                            flight.stops === 0
                                                ? "#2e7d32"
                                                : "#d32f2f",
                                    }}
                                />
                            </Box>

                            <Box textAlign='center'>
                                <Typography variant='h6' fontWeight='800'>
                                    {formatTime(flight.arrival.time)}
                                </Typography>
                                <Typography
                                    variant='body2'
                                    color='text.secondary'
                                >
                                    {flight.arrival.code}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Price Section */}
                    <Box
                        sx={{
                            width: { xs: "100%", sm: "25%" },
                            flexShrink: 0,
                            textAlign: { xs: "center", sm: "right" },
                        }}
                    >
                        <Typography
                            variant='h5'
                            color='primary'
                            fontWeight='900'
                        >
                            ${flight.price.toFixed(2)}
                        </Typography>
                        <Typography
                            variant='caption'
                            display='block'
                            color='text.secondary'
                            sx={{ mb: 0.5 }}
                        >
                            {flight.cabin}
                        </Typography>
                        {flight.refundable && (
                            <Chip
                                label='Refundable'
                                size='small'
                                sx={{
                                    height: 18,
                                    fontSize: "0.65rem",
                                    fontWeight: 700,
                                    bgcolor: alpha("#2196f3", 0.1),
                                    color: "#1976d2",
                                    mb: 1,
                                }}
                            />
                        )}
                        <Button
                            variant='contained'
                            color='primary'
                            fullWidth
                            sx={{ borderRadius: 2, px: 4 }}
                        >
                            Select
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default FlightCard;
