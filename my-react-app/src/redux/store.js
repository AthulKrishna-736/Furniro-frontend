import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from './features/userAuth';
import userBlockReducer from './features/userBlock';

const store = configureStore({
    reducer:{
        userAuth: userAuthReducer,
        userBlock: userBlockReducer,
    }
})

export default store;
