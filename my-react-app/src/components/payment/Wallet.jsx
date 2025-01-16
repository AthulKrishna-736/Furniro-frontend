import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, Divider, Pagination } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { showErrorToast } from '../../utils/toastUtils';

const Wallet = () => {
  const [wallet, setWallet] = useState({
    balance: 0,
    transactions: [],
  });
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalTransactions: 0,
  })
  const [page, setPage] = useState(1);

  const fetchWallet = async (page = 1) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axiosInstance.get(`/user/getWallet/${userId}`,{ params:{ page:page } });
      console.log('res wallet: ', response.data)
      setPagination(response.data?.pagination)
      setWallet(response.data.wallet);
    } catch (error) {
      showErrorToast(error.response?.data.message || 'Failed to load wallet data');
    }
  };

  const handlePageChange = (event, value) =>{
    setPage(value)
  }

  useEffect(()=>{
    fetchWallet(page);
  },[page])

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width:'95%',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      {/* Wallet Title */}
      <Typography variant="h4" sx={{ mb: 3 }}>
        Wallet
      </Typography>

      {/* Wallet Balance */}
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          p: 3,
          textAlign: 'center',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Your Wallet Balance
        </Typography>
        <Typography
          variant="h3"
          sx={{
            py: 2,
            backgroundColor: '#e3f2fd',
            borderRadius: 2,
            fontWeight: 'bold',
            color: 'primary.main',
          }}
        >
          ₹{wallet.balance}
        </Typography>
      </Paper>

      {/* Transaction History */}
      <Box sx={{ width: '100%', mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Transaction History
        </Typography>
        <Paper
          elevation={1}
          sx={{
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          {wallet.transactions && wallet.transactions.length === 0 ? (
            <Typography
              color="text.secondary"
              sx={{ textAlign: 'center', p: 3 }}
            >
              No transactions yet
            </Typography>
          ) : (
            <List>
              {wallet.transactions?.map((transaction, index) => (
                <div key={transaction._id}>
                  <ListItem
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      py: 1,
                      px: 2,
                      backgroundColor:
                        transaction.type === 'credit' ? '#e8f5e9' : '#ffebee',
                    }}
                  >
                    <Typography variant="body1">
                      {transaction.description || 'Transaction'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(transaction.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour:'2-digit', minute:'2-digit' })}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        color:
                          transaction.type === 'credit' ? 'green' : 'red',
                      }}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}₹
                      {transaction.amount}
                    </Typography>
                  </ListItem>
                  {index < wallet.transactions.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          )}
        </Paper>
      </Box>
      {/* Pagination */}
      <Pagination
        count={pagination.totalPages}
        page={page}
        onChange={handlePageChange}
        sx={{ mt: 3 }}
      />
    </Box>
  );
};

export default Wallet;
