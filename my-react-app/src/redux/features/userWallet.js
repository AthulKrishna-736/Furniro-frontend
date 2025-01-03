import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: parseFloat(localStorage.getItem("walletBalance")) || 5000,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setBalance: (state, action) => {
      state.balance = action.payload;
      localStorage.setItem("walletBalance", state.balance); 
    },
    addAmount: (state, action) => {
      state.balance += action.payload;
      localStorage.setItem("walletBalance", state.balance); 
    },
    deductAmount: (state, action) => {
      state.balance -= action.payload;
      localStorage.setItem("walletBalance", state.balance); 
    },
  },
});

export const { setBalance, addAmount, deductAmount } = walletSlice.actions;

export default walletSlice.reducer;
