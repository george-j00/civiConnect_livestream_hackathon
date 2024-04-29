
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isLoggedIn : false,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,   
    reducers: { 
        setLogin: (state, action) => {
            console.log('action payload:', action.payload);
            state.user = action.payload.user;
            state.isLoggedIn = action.payload.isLoggedIn;
        },
        setLogout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        }, 
        updateProfileReducer: (state, action) => {
            state.user = null;
            state.user = action.payload.user
        },
    },
    
});

export const { setLogin, setLogout , updateProfileReducer } = authSlice.actions;
export default authSlice.reducer;