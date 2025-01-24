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

        const [chartResponse, topSellingResponse] = await Promise.all([
          axiosInstance.get(`/admin/chartData?filter=${filter}`),
          axiosInstance.get('/admin/topSelling'),
        ]);

        setChartData(chartResponse.data);
        setTopSelling({
          product: topSellingResponse.data.topProducts || [],
          category: topSellingResponse.data.topCategories || [],
        });
      } catch {
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  const createChartData = (labels, data, color) => ({
    labels,
    datasets: [
      {
        label: 'Units Sold',
        data,
        backgroundColor: `${color}70`, // Semi-transparent
        borderColor: color,
        borderWidth: 1,
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: { display: true, text: `${filter} Sales` },
    },
  };

  const productChartData = createChartData(
    topSelling?.product?.map((p) => p.productDetails?.name || 'Unknown'),
    topSelling.product?.map((p) => p.totalQuantity),
    'rgba(0, 200, 83, 1)'
  );

  const categoryChartData = createChartData(
    topSelling?.category?.map((c) => c.categoryDetails?.name || 'Unknown'),
    topSelling?.category?.map((c) => c.totalQuantity),
    'rgba(255, 87, 34, 1)'
  );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard - Sales Charts
      </Typography>

      <Box mb={3}>
        <Typography variant="subtitle1">Filter By:</Typography>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} displayEmpty>
          <MenuItem value="Yearly">Yearly</MenuItem>
          <MenuItem value="Monthly">Monthly</MenuItem>
          <MenuItem value="Weekly">Weekly</MenuItem>
        </Select>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          {/* Total Sales Chart */}
          <Box mb={5} style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <Bar
              data={{
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
              }}
              options={options}
              height={400}
            />
          </Box>

          {/* Top Selling Data Cards */}
          <Grid container spacing={3} mb={5}>
            <Grid item xs={12} md={6}>
              <Card style={{ backgroundColor: '#f1f8e9', borderRadius: '10px' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Selling Products
                  </Typography>
                  {topSelling.product.length > 0 ? (
                    topSelling.product.map((product, index) => (
                      <Typography key={product._id} style={{ margin: '5px 0' }}>
                        {index + 1}. {product.productDetails?.name || 'Unknown Product'} - {product.totalQuantity} units
                      </Typography>
                    ))
                  ) : (
                    <Typography>No data available.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card style={{ backgroundColor: '#ffebee', borderRadius: '10px' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Selling Categories
                  </Typography>
                  {topSelling.category.length > 0 ? (
                    topSelling.category.map((category, index) => (
                      <Typography key={category._id} style={{ margin: '5px 0' }}>
                        {index + 1}. {category.categoryDetails?.name || 'Unknown Category'} - {category.totalQuantity} units
                      </Typography>
                    ))
                  ) : (
                    <Typography>No data available.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Product and Category Charts */}
          <Box>
            <Typography variant="h5" gutterBottom>
              Top Selling Products Chart
            </Typography>
            <Box mb={5} style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <Bar data={productChartData} options={options} height={400} />
            </Box>

            <Typography variant="h5" gutterBottom>
              Top Selling Categories Chart
            </Typography>
            <Box style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <Bar data={categoryChartData} options={options} height={400} />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Chart;
