import React from "react";
import {
    Box,
    Typography,
    Slider,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Divider,
    Button,
    alpha,
    Stack,
} from "@mui/material";
import {
    Tune as TuneIcon,
    AttachMoney as MoneyIcon,
    FilterList as FilterIcon,
    AirlineSeatReclineExtra as AirlineIcon,
    History as HistoryIcon,
} from "@mui/icons-material";

const Filters = ({ filters, onFilterChange, availableAirlines = [] }) => {
    const handlePriceChange = (event, newValue) => {
        onFilterChange({ ...filters, maxPrice: newValue });
    };

    const handleStopsChange = (stop) => {
        onFilterChange({ ...filters, stops: stop });
    };

    const handleAirlineToggle = (airline) => {
        const current = filters.airlines || [];
        const updated = current.includes(airline)
            ? current.filter((a) => a !== airline)
            : [...current, airline];
        onFilterChange({ ...filters, airlines: updated });
    };

    const handleCabinClassChange = (cabinClass) => {
        onFilterChange({ ...filters, cabinClass });
    };

    const handleDurationChange = (event, newValue) => {
        onFilterChange({
            ...filters,
            maxDurationMinutes: newValue === 720 ? null : newValue,
        });
    };

    const handleTimeRangeChange = (range) => {
        onFilterChange({ ...filters, departTimeRange: range });
    };

    const clearAll = () => {
        onFilterChange({
            maxPrice: 1500,
            stops: "",
            airlines: [],
            cabinClass: "",
            departTimeRange: null,
            maxDurationMinutes: null,
        });
    };

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography
                    variant='subtitle1'
                    sx={{
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <TuneIcon fontSize='small' color='primary' />
                    Filters
                </Typography>
                <Button
                    variant='text'
                    size='small'
                    onClick={clearAll}
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "text.secondary",
                        "&:hover": { color: "primary.main" },
                    }}
                >
                    Reset
                </Button>
            </Box>

            {/* Price Filter */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant='caption'
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: "text.secondary",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        letterSpacing: "0.05em",
                    }}
                >
                    <MoneyIcon fontSize='inherit' />
                    MAX PRICE
                </Typography>
                <Typography
                    variant='h6'
                    sx={{ fontWeight: 900, mb: 0.5, color: "primary.main" }}
                >
                    ${filters.maxPrice || 1500}
                </Typography>
                <Slider
                    value={filters.maxPrice || 1500}
                    onChange={handlePriceChange}
                    min={100}
                    max={1500}
                    sx={{
                        color: "primary.main",
                        height: 6,
                        "& .MuiSlider-thumb": {
                            width: 20,
                            height: 20,
                            backgroundColor: "#fff",
                            border: "2px solid currentColor",
                            "&:hover": {
                                boxShadow: "0 0 0 8px rgba(99, 102, 241, 0.16)",
                            },
                        },
                        "& .MuiSlider-track": { border: "none" },
                        "& .MuiSlider-rail": { opacity: 0.2 },
                    }}
                />
                <Box
                    display='flex'
                    justifyContent='space-between'
                    sx={{ mt: 1 }}
                >
                    <Typography
                        variant='caption'
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                    >
                        $100
                    </Typography>
                    <Typography
                        variant='caption'
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                    >
                        $1500+
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 3, borderStyle: "dashed" }} />

            {/* Stops Filter */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant='caption'
                    sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        color: "text.secondary",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        letterSpacing: "0.05em",
                    }}
                >
                    <HistoryIcon fontSize='inherit' />
                    STOPS
                </Typography>
                <Stack spacing={1}>
                    {[
                        { label: "Any number of stops", value: "" },
                        { label: "Non-stop only", value: 0 },
                        { label: "Max 1 stop", value: 1 },
                    ].map((option) => (
                        <Box
                            key={option.label}
                            onClick={() => handleStopsChange(option.value)}
                            sx={{
                                p: 1.2,
                                borderRadius: 2,
                                cursor: "pointer",
                                border: "1px solid",
                                borderColor:
                                    filters.stops === option.value
                                        ? "primary.main"
                                        : "transparent",
                                bgcolor:
                                    filters.stops === option.value
                                        ? alpha("#6366f1", 0.05)
                                        : "transparent",
                                transition: "all 0.2s",
                                "&:hover": {
                                    bgcolor:
                                        filters.stops === option.value
                                            ? alpha("#6366f1", 0.1)
                                            : alpha("#000", 0.02),
                                },
                            }}
                        >
                            <Typography
                                variant='body2'
                                sx={{
                                    fontWeight:
                                        filters.stops === option.value
                                            ? 700
                                            : 500,
                                    color:
                                        filters.stops === option.value
                                            ? "primary.main"
                                            : "text.primary",
                                }}
                            >
                                {option.label}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>

            <Divider sx={{ my: 3, borderStyle: "dashed" }} />

            {/* Cabin Class Filter */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant='caption'
                    sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        color: "text.secondary",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        letterSpacing: "0.05em",
                    }}
                >
                    <AirlineIcon fontSize='inherit' />
                    CABIN CLASS
                </Typography>
                <Stack spacing={1}>
                    {[
                        { label: "Any Class", value: "" },
                        { label: "Economy", value: "ECONOMY" },
                        { label: "Premium Economy", value: "PREMIUM_ECONOMY" },
                        { label: "Business", value: "BUSINESS" },
                        { label: "First Class", value: "FIRST" },
                    ].map((option) => (
                        <Box
                            key={option.value}
                            onClick={() => handleCabinClassChange(option.value)}
                            sx={{
                                p: 1.2,
                                borderRadius: 2,
                                cursor: "pointer",
                                border: "1px solid",
                                borderColor:
                                    filters.cabinClass === option.value
                                        ? "primary.main"
                                        : "transparent",
                                bgcolor:
                                    filters.cabinClass === option.value
                                        ? alpha("#6366f1", 0.05)
                                        : "transparent",
                                transition: "all 0.2s",
                                "&:hover": {
                                    bgcolor:
                                        filters.cabinClass === option.value
                                            ? alpha("#6366f1", 0.1)
                                            : alpha("#000", 0.02),
                                },
                            }}
                        >
                            <Typography
                                variant='body2'
                                sx={{
                                    fontWeight:
                                        filters.cabinClass === option.value
                                            ? 700
                                            : 500,
                                    color:
                                        filters.cabinClass === option.value
                                            ? "primary.main"
                                            : "text.primary",
                                }}
                            >
                                {option.label}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>

            <Divider sx={{ my: 3, borderStyle: "dashed" }} />

            {/* Max Duration Filter */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant='caption'
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: "text.secondary",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        letterSpacing: "0.05em",
                    }}
                >
                    <HistoryIcon fontSize='inherit' />
                    MAX DURATION
                </Typography>
                <Typography
                    variant='h6'
                    sx={{ fontWeight: 900, mb: 0.5, color: "primary.main" }}
                >
                    {filters.maxDurationMinutes
                        ? `${Math.floor(filters.maxDurationMinutes / 60)}h ${
                              filters.maxDurationMinutes % 60
                          }m`
                        : "Any"}
                </Typography>
                <Slider
                    value={filters.maxDurationMinutes || 720}
                    onChange={handleDurationChange}
                    min={60}
                    max={720}
                    step={30}
                    sx={{
                        color: "primary.main",
                        height: 6,
                        "& .MuiSlider-thumb": {
                            width: 20,
                            height: 20,
                            backgroundColor: "#fff",
                            border: "2px solid currentColor",
                            "&:hover": {
                                boxShadow: "0 0 0 8px rgba(99, 102, 241, 0.16)",
                            },
                        },
                        "& .MuiSlider-track": { border: "none" },
                        "& .MuiSlider-rail": { opacity: 0.2 },
                    }}
                />
                <Box
                    display='flex'
                    justifyContent='space-between'
                    sx={{ mt: 1 }}
                >
                    <Typography
                        variant='caption'
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                    >
                        1h
                    </Typography>
                    <Typography
                        variant='caption'
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                    >
                        12h+
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 3, borderStyle: "dashed" }} />

            {/* Airlines Filter */}
            <Box>
                <Typography
                    variant='caption'
                    sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        color: "text.secondary",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        letterSpacing: "0.05em",
                    }}
                >
                    <AirlineIcon fontSize='inherit' />
                    AIRLINES
                </Typography>
                <FormGroup>
                    {availableAirlines.length > 0 ? (
                        availableAirlines.map((airline) => (
                            <FormControlLabel
                                key={airline}
                                control={
                                    <Checkbox
                                        size='small'
                                        checked={
                                            (filters.airlines || []).includes(
                                                airline
                                            ) ||
                                            (filters.airlines || []).length ===
                                                0
                                        }
                                        onChange={() =>
                                            handleAirlineToggle(airline)
                                        }
                                        sx={{
                                            color: alpha("#64748b", 0.3),
                                            "&.Mui-checked": {
                                                color: "primary.main",
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Typography
                                        variant='body2'
                                        sx={{
                                            fontWeight: 600,
                                            color: "text.primary",
                                        }}
                                    >
                                        {airline}
                                    </Typography>
                                }
                                sx={{ mb: 0.5 }}
                            />
                        ))
                    ) : (
                        <Typography variant='caption' color='text.secondary'>
                            No airlines available for this route.
                        </Typography>
                    )}
                </FormGroup>
            </Box>

            <Box
                sx={{
                    mt: 4,
                    p: 2,
                    borderRadius: 3,
                    bgcolor: alpha("#6366f1", 0.05),
                    border: "1px solid",
                    borderColor: alpha("#6366f1", 0.1),
                }}
            >
                <Typography
                    variant='caption'
                    sx={{
                        color: "primary.main",
                        fontWeight: 700,
                        display: "block",
                        mb: 0.5,
                    }}
                >
                    PRO TIP
                </Typography>
                <Typography
                    variant='caption'
                    sx={{ color: "text.secondary", fontWeight: 500 }}
                >
                    Booking at least 3 weeks in advance can save you up to 20%
                    on this route.
                </Typography>
            </Box>
        </Box>
    );
};

export default Filters;
