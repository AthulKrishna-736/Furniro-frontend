import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axiosInstance from '../../utils/axiosInstance';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart = () => {
  const [filter, setFilter] = useState('Yearly');
  const [chartData, setChartData] = useState([]);
  const [topSelling, setTopSelling] = useState({ product: null, category: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use Promise.all to fetch chart data and top-selling data concurrently
        const [chartResponse, topSellingResponse] = await Promise.all([
          axiosInstance.get(`/admin/chartData?filter=${filter}`),
          axiosInstance.get('/admin/topSelling'),
        ]);

        console.log('chartdata', chartResponse.data)
        console.log('top data: ', topSellingResponse.data)
        setChartData(chartResponse.data); // Update chart data
        setTopSelling({
          product: topSellingResponse.data.topProducts || null, // Expecting a single product
          category: topSellingResponse.data.topCategories || null, // Expecting a single category
        });
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  const barChartData = {
    labels: chartData.map((entry) => entry.period),
    datasets: [
      {
        label: 'Total Sales',
        data: chartData.map((entry) => entry.totalSales),
        backgroundColor: 'rgba(63, 81, 181, 0.7)',
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: { display: true },
      title: { display: true, text: `${filter} Sales` },
    },
  };
  

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard - Sales Chart
      </Typography>

      {/* Filter Dropdown */}
      <Box mb={3}>
        <Typography variant="subtitle1">Filter By:</Typography>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} displayEmpty>
          <MenuItem value="Yearly">Yearly</MenuItem>
          <MenuItem value="Monthly">Monthly</MenuItem>
          <MenuItem value="Weekly">Weekly</MenuItem>
        </Select>
      </Box>

      {/* Loading, Error, or Chart */}
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
      <Box mb={5} style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
        <Bar data={barChartData} options={options} height={400}/>
      </Box>
      )}
      {/* Top Selling Product and Category */}
      {!loading && !error && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Selling Product
                </Typography>
                <Box>
                {topSelling.product && topSelling.product.length > 0 ? (
                  topSelling.product.map((product, index) => (
                    <Typography key={product._id}>
                      {index + 1}. {product.productDetails?.name || 'Unknown Product'} - {product.totalQuantity} units sold
                    </Typography>
                  ))
                ) : (
                  <Typography>No top-selling product data available.</Typography>
                )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Selling Category
                </Typography>
                <Box>
                {topSelling.category && topSelling.category.length > 0 ? (
                  topSelling.category.map((category, index) => (
                    <Typography key={category._id}>
                      {index + 1}. {category.categoryDetails?.name || 'Unknown Category'} - {category.totalQuantity} units sold
                    </Typography>
                  ))
                ) : (
                  <Typography>No top-selling category data available.</Typography>
                )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Chart;
