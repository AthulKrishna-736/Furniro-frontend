import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userId:null,
    adminId:null,
    userEmail:null,
    userDetails:null,
}

const userAuthSlice = createSlice({
    name:'userAuth',
    initialState,
    reducers:{
        setUserId:(state, action)=>{
            state.userId = action.payload;
        },
        setAdminId:(state, action)=>{
            state.adminId = action.payload;

        },
        setUserEmail:(state, action)=>{
            state.userEmail = action.payload;
        },
        setUserDetails:(state, action)=>{
            state.userDetails = action.payload;
        },
        logoutUser:(state)=>{
            state.userId = null;
            state.adminId = null;
            state.userEmail = null;
            state.userDetails = null;
            localStorage.removeItem('adminId');
            localStorage.removeItem('userId');
            localStorage.removeItem('email');
        }
    }
})

export const { setUserId, logoutUser, setAdminId, setUserEmail, setUserDetails } = userAuthSlice.actions;

export default userAuthSlice.reducer;