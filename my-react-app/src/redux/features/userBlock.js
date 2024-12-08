import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isBlocked: false,
  };

  const userBlockSlice = createSlice({
    name:'userBlock',
    initialState,
    reducers:{
        setUserBlocked: (state, action)=>{
            state.isBlocked = action.payload;
        },
    },
  });

  export const { setUserBlocked } = userBlockSlice.actions;

  export default userBlockSlice.reducer;