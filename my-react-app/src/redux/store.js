import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from './features/userAuth';
import userWalletReducer from './features/userWallet';

const store = configureStore({
    reducer:{
        userAuth: userAuthReducer,
        userWallet: userWalletReducer,
    },
})

export default store;

