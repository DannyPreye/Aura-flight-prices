import React from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { Paper, Typography, Box, alpha } from "@mui/material";

const PriceGraph = ({ data }) => {
    if (!data || data.length === 0) return null;

    console.log("PriceGraph data:", data);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                mb: 4,
                bgcolor: "#f8fafc",
                borderRadius: 4,
                border: "1px solid #e2e8f0",
            }}
        >
            <Typography variant='h6' fontWeight='700' gutterBottom>
                Price Trends
            </Typography>
            <Box sx={{ width: "100%", height: 200, mt: 2 }}>
                <ResponsiveContainer>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient
                                id='colorPrice'
                                x1='0'
                                y1='0'
                                x2='0'
                                y2='1'
                            >
                                <stop
                                    offset='5%'
                                    stopColor='#6366f1'
                                    stopOpacity={0.1}
                                />
                                <stop
                                    offset='95%'
                                    stopColor='#6366f1'
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray='3 3'
                            vertical={false}
                            stroke='#e2e8f0'
                        />
                        <XAxis
                            dataKey='date'
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fontSize: 11,
                                fill: "#64748b",
                                fontWeight: 600,
                            }}
                        />
                        <YAxis
                            hide
                            domain={["dataMin - 100", "dataMax + 100"]}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: 12,
                                border: "none",
                                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                            }}
                            formatter={(value) => [`$${value}`, "Price"]}
                        />
                        <Area
                            type='monotone'
                            dataKey='price'
                            stroke='#6366f1'
                            strokeWidth={3}
                            fillOpacity={1}
                            fill='url(#colorPrice)'
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default PriceGraph;
