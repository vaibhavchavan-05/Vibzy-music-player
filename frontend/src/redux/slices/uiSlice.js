import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    authModalOpen: false,
    authMode: "Login",
  },
  reducers: {
    openAuthModal: (state, action) => {
      state.authModalOpen = true; // <-- fixed comma to semicolon
      state.authMode = action.payload || "Login"; // be consistent with casing
    },
    closeAuthModal: (state) => {
      state.authModalOpen = false;
      state.authMode = "Login";
    },
    switchAuthMode: (state, action) => {
      state.authMode = action.payload;
    },
  },
});

export const { openAuthModal, closeAuthModal, switchAuthMode } = uiSlice.actions;
export default uiSlice.reducer;
