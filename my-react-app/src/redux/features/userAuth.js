import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userId:null,
}

const userAuthSlice = createSlice({
    name:'userAuth',
    initialState,
    reducers:{
        setUserId:(state, action)=>{
            state.userId = action.payload;
        },
        logoutUser:(state)=>{
            state.userId = null;
            localStorage.removeItem('userId');
        }
    }
})

export const { setUserId, logoutUser } = userAuthSlice.actions;

export default userAuthSlice.reducer;