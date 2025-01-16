import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Select,
  MenuItem,
  CircularProgress,
  Pagination,
  TextField,
  Button,
} from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { DeleteOutlineOutlined } from '@mui/icons-material';

const SalesReport = () => {
  const [salesData, setSalesData] = useState(null);
  const [filter, setFilter] = useState('overall');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchSalesReport = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/admin/getSalesReport', {
        params: {
          filter,
          page,
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      });
      console.log('Date range sales data:', data);
      setSalesData(data);
    } catch (error) {
      console.error('Error fetching sales report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesReport();
  }, [filter, page, startDate, endDate]);

  const handlePdfDownload = async () => {
    try {
      const salesStatistics = salesData.statistics; 
  
      // Making a GET request to fetch the PDF
      const response = await axiosInstance.get('/admin/downloadPdf', {
        responseType: 'arraybuffer', // Use arraybuffer instead of blob
        params: {
          totalSales: salesStatistics.totalSales,
          totalOrders: salesStatistics.totalOrders,
        },
      });
  
      // Log the response to ensure it’s received correctly
      console.log('PDF response:', response.data);
  
      // Convert the arraybuffer to a Blob (since Blob works better for creating URLs)
      const blob = new Blob([response.data], { type: 'application/pdf' });
  
      // Create a downloadable URL for the Blob
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob); // Create an object URL for the blob
      link.download = 'sales_report.pdf'; // Set the name of the downloaded file
      link.click(); // Trigger the download
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };
  
  

  const handleExcelDownload = async ()=>{
    console.log('excel downloaded')
  }

  const StatisticsCard = ({ title, value }) => (
    <Grid item xs={12} sm={4}>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h5">{value}</Typography>
      </Paper>
    </Grid>
  );

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2} align="center">
        Sales Report
      </Typography>

      {/* Filter */}
      <Box display="flex" alignItems="center" mb={2} justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Typography variant="h6" marginRight={2}>Filter by:</Typography>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ marginRight: 2 }}>
            {['overall', 'daily', 'weekly', 'yearly'].map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box display="flex" gap={2}>
          <Button variant="contained" color="primary" sx={{ backgroundColor: '#e3f2fd', color: '#000' }} onClick={handlePdfDownload}>
            Download PDF
          </Button>
          <Button variant="contained" color="primary" sx={{ backgroundColor: '#e8f5e9', color: '#000' }} onClick={handleExcelDownload}>
            Download Excel
          </Button>
        </Box>
      </Box>

      {/* Custom Date Range */}
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h6" marginRight={2}>Custom Date Range:</Typography>
        <TextField
          type="date"
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={{ marginRight: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="date"
          label="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={{ marginRight: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setStartDate('');
            setEndDate('');  
            setFilter('overall'); 
            setPage(1);       
            fetchSalesReport(); 
          }}
        >
          <DeleteOutlineOutlined/>
        </Button>
      </Box>

      {/* Content */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : salesData ? (
        <>
          {/* Statistics */}
          <Grid container spacing={3} mb={3}>
            <StatisticsCard title="Overall Sales Count" value={salesData.statistics.totalOrders} />
            <StatisticsCard title="Overall Order Amount" value={`₹${salesData.statistics.totalSales}`} />
            <StatisticsCard title="Overall Discount" value={`₹${salesData.statistics.totalDiscount}`} />
          </Grid>

          {/* Sales Table */}
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#1472f9' }}>
                  {['Order ID', 'Customer Name', 'Products', 'Total Price', 'Order Date', 'Status'].map((head) => (
                    <TableCell key={head} sx={{ color: 'white', fontWeight: 'bold' }}>
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {salesData.tableData.map((order) => (
                  <TableRow
                    key={order.orderId}
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                      '&:nth-of-type(even)': { backgroundColor: '#ffffff' },
                      '&:hover': { backgroundColor: '#f0f8ff' },
                    }}
                  >
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      {order.products.map((product, index) => (
                        <Typography key={index} variant="body2" sx={{ fontSize: '0.9rem', color: '#555' }}>
                          {product.name} (x{product.quantity})
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#2e7d32' }}>₹{order.totalPrice}</TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        color:
                          order.status === 'Delivered'
                            ? '#388e3c'
                            : order.status === 'Cancelled'
                            ? '#d32f2f'
                            : '#f57c00',
                      }}
                    >
                      {order.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={salesData.pagination?.totalPages || 1}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      ) : (
        <Typography variant="body1" align="center" mt={3}>
          No sales data available.
        </Typography>
      )}
    </Box>
  );
};

export default SalesReport;
