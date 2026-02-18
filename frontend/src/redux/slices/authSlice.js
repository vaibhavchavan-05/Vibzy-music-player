import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user: null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    authModal:null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        //Set loading state  during api calls(login,register, fetchUser)
        setLoading:(state, action) =>{
            state.isLoading = action.payload;
            state.error = null;
        },
        openAuthModal: (state, action) => {
            state.authModal = action.payload; 
        },


        //Set user after successfull login/register/fetchuser
        // also stores token in localStorage for persistance 
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;

            if(action.payload.token) 
                localStorage.setItem("token", action.payload.token);
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },

        //Clear all auth state and remove token from localstorage
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem("token");

        },
         updateFavourites:(state, action) => {
            if(state.user) {
                state.user.favourites = action.payload;
            }
         },

         clearError:(state) => {
            state.error = null;
         },


    },

});
export const {
    setLoading,
    setUser,
    setError,
    logout,
    clearError,
    updateFavourites,
    openAuthModal,
} =authSlice.actions;

export default authSlice.reducer;