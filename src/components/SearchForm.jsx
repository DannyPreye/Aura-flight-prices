import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Autocomplete,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  CalendarMonth,
  SwapHoriz
} from '@mui/icons-material';
import { searchAirports } from '../services/api';

const SearchForm = ({ onSearch }) => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [originOptions, setOriginOptions] = useState([]);
  const [destOptions, setDestOptions] = useState([]);
  const [originInput, setOriginInput] = useState('');
  const [destInput, setDestInput] = useState('');
  const [loadingOrigin, setLoadingOrigin] = useState(false);
  const [loadingDest, setLoadingDest] = useState(false);
  const [departureDate, setDepartureDate] = useState('2026-02-20');

  // Debounced search for Origin
  useEffect(() => {
    if (originInput.length < 2) {
      setOriginOptions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingOrigin(true);
      try {
        const options = await searchAirports(originInput);
        setOriginOptions(options || []);
      } catch (error) {
        console.error("Error fetching origin airports:", error);
      } finally {
        setLoadingOrigin(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [originInput]);

  // Debounced search for Destination
  useEffect(() => {
    if (destInput.length < 2) {
      setDestOptions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingDest(true);
      try {
        const options = await searchAirports(destInput);
        setDestOptions(options || []);
      } catch (error) {
        console.error("Error fetching destination airports:", error);
      } finally {
        setLoadingDest(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [destInput]);

  const handleSwap = () => {
    const tempO = origin;
    const tempOI = originInput;
    const tempD = destination;
    const tempDI = destInput;

    setOrigin(tempD);
    setOriginInput(tempDI);
    setDestination(tempO);
    setDestInput(tempOI);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (origin && destination && origin.code && destination.code) {
      onSearch({
        origin: origin.code,
        destination: destination.code,
        departureDate
      });
    }
  };

  return (
    <Paper
      elevation={8}
      sx={{
        p: { xs: 2, sm: 3 },
        width: '100%',
        borderRadius: '24px',
        position: 'relative',
        zIndex: 10,
        backgroundColor: '#ffffff',
        border: '1px solid',
        borderColor: 'rgba(226, 232, 240, 0.8)',
        boxShadow: '0 25px 50px -20px rgba(0, 0, 0, 0.2)',
      }}
    >
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 2,
            width: '100%'
          }}
        >
          {/* Origin */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' }, width: '100%' }}>
            <Autocomplete
              options={originOptions}
              getOptionLabel={(option) => option.label || ""}
              isOptionEqualToValue={(option, value) => option.code === value.code}
              value={origin}
              onChange={(e, v) => setOrigin(v)}
              inputValue={originInput}
              onInputChange={(e, v) => setOriginInput(v)}
              loading={loadingOrigin}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="From"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <FlightTakeoff color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          {/* Swap Button */}
          <IconButton
            onClick={handleSwap}
            color="primary"
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              display: { xs: 'none', md: 'flex' }
            }}
          >
            <SwapHoriz />
          </IconButton>

          {/* Destination */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' }, width: '100%' }}>
            <Autocomplete
              options={destOptions}
              getOptionLabel={(option) => option.label || ""}
              isOptionEqualToValue={(option, value) => option.code === value.code}
              value={destination}
              onChange={(e, v) => setDestination(v)}
              inputValue={destInput}
              onInputChange={(e, v) => setDestInput(v)}
              loading={loadingDest}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="To"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <FlightLand sx={{ color: '#0ea5e9' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          {/* Date */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 20%' }, width: '100%' }}>
            <TextField
              type="date"
              label="Departure"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonth color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Search Button */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 15%' }, width: '100%' }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={!origin || !destination}
              sx={{
                height: '56px',
                fontWeight: 800,
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4)',
              }}
            >
              Search
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>


  );
};

export default SearchForm;
