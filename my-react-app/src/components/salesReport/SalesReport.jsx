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
import * as XLSX from 'xlsx';

const SalesReport = () => {
  const [salesData, setSalesData] = useState(null);
  const [filter, setFilter] = useState('overall');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const fetchSalesReport = async () => {
    setLoading(true);
    setError('')
    try {
      const response = await axiosInstance.get('/admin/getSalesReport', {
        params: {
          filter,
          page,
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      });
      
      if (response && response.data) {
        const { data } = response; 
        console.log('Date range sales data:', data);
        setSalesData(data);
      } else {
        console.error('No data received in the response');
      }
    } catch (error) {
      console.error('Error fetching sales report:', error);
      setError(error.response.data.message)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesReport();
  }, [filter, page, startDate, endDate]);

  const handlePdfDownload = async () => {  
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ format: [400, 310] });
  
    doc.setFontSize(30);
    doc.text("Sales Report", 14, 20);
  
    doc.setFontSize(16);
    doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 30);
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Sales: Rs ${salesData.statistics.totalSales}`, 14, 40);
    doc.text(`Total Discount: Rs ${salesData.statistics.totalDiscount}`, 14, 50);
  
    const headers = ['Order ID', 'Customer Name', 'Order Date', 'Products', 'Total Price'];
    
    const columnWidths = [60, 50, 30, 80, 60]; 
    const yStart = 60; 
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    let xPos = 14;
    headers.forEach((header, index) => {
      doc.text(header, xPos, yStart);
      xPos += columnWidths[index]; 
    });
  
    doc.setFont("helvetica", "normal");
    const salesDataRows = salesData.allOrdersData;
  
    const rowHeight = 10; 
    let currentY = yStart + rowHeight; 
  
    salesDataRows.forEach((order) => {
      let xPos = 14;
  
      const productsString = order.products
        .map((product) => `${product.name} (Qty: ${product.quantity})`)
        .join(", ");
  
      doc.text(order.orderId, xPos, currentY);
      xPos += columnWidths[0];
      doc.text(order.customerName, xPos, currentY); 
      xPos += columnWidths[1];
      doc.text(order.orderDate, xPos, currentY); 
      xPos += columnWidths[2];
      doc.text(productsString, xPos, currentY); 
      xPos += columnWidths[3];
      doc.text(order.totalPrice, xPos, currentY); 
  
      currentY += rowHeight;
    });
  
    doc.save("sales_report.pdf");
  };
  
  const handleExcelDownload = async ()=>{
    console.log('Excel download initiated');

    const data = salesData.allOrdersData.map((order) => {
      return {
        'Order ID': order.orderId,
        'Customer Name': order.customerName,
        'Order Date': order.orderDate,
        'Products': order.products
          .map((product) => `${product.name} (Qty: ${product.quantity})`)
          .join(", "),
        'Total Price': order.totalPrice,
      };
    });
  
    const statistics = {
      'Total Sales': salesData.statistics.totalSales,
      'Total Discount': salesData.statistics.totalDiscount,
      'Total Orders': salesData.statistics.totalOrders,
      'Generated Date': new Date().toLocaleDateString(),
    };
  
    const wsOrders = XLSX.utils.json_to_sheet(data);
  
    const wsStats = XLSX.utils.json_to_sheet([statistics]);
  
    const wb = XLSX.utils.book_new();
  
    XLSX.utils.book_append_sheet(wb, wsStats, "Sales Report - Statistics");
  
    XLSX.utils.book_append_sheet(wb, wsOrders, "Sales Report - Orders");
  
    XLSX.writeFile(wb, 'sales_report.xlsx');
  };

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
) : error ? (
  // Display the error message when there is an error, such as no data available
  <Typography variant="body1" align="center" mt={3} color="error">
    {error.message || "No sales data available for the selected filter or date range."}
  </Typography>
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
