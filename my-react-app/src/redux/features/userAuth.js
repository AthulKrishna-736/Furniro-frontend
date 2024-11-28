import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userId:null,
    adminId:null,
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
        logoutUser:(state)=>{
            state.userId = null;
            state.adminId = null;
            localStorage.removeItem('adminId');
            localStorage.removeItem('userId');
        }
    }
})

export const { setUserId, logoutUser, setAdminId } = userAuthSlice.actions;

export default userAuthSlice.reducer;