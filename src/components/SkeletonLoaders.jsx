import React from 'react';
import { Box, Skeleton, Card, CardContent, Grid, Paper } from '@mui/material';

export const FlightCardSkeleton = () => (
  <Card sx={{ mb: 2, borderRadius: 3 }}>
    <CardContent sx={{ p: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <Skeleton variant="rounded" width={48} height={48} />
            <Skeleton variant="text" width={100} height={24} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box textAlign="center">
                <Skeleton variant="text" width={60} height={32} />
                <Skeleton variant="text" width={40} height={20} />
            </Box>
            <Box sx={{ flex: 1, px: 3 }}>
              <Skeleton variant="text" width="100%" height={10} />
            </Box>
            <Box textAlign="center">
                <Skeleton variant="text" width={60} height={32} />
                <Skeleton variant="text" width={40} height={20} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3} textAlign={{ xs: 'center', sm: 'right' }}>
          <Skeleton variant="text" width={80} height={40} sx={{ ml: 'auto' }} />
          <Skeleton variant="rectangular" width={100} height={36} sx={{ ml: 'auto', mt: 1, borderRadius: 2 }} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export const PriceGraphSkeleton = () => (
  <Paper sx={{ p: 3, mb: 4, borderRadius: 4, height: 260 }}>
    <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" width="100%" height={180} sx={{ borderRadius: 2 }} />
  </Paper>
);
