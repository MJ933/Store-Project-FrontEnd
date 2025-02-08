import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentCustomer: JSON.parse(localStorage.getItem("currentCustomer")) || null,
  isAuthenticated: !!localStorage.getItem("currentCustomer"), // Check if user exists in localStorage
};

const authCustomerSlice = createSlice({
  name: "authCustomer",
  initialState,
  reducers: {
    loginSuccessCustomer: (state, action) => {
      state.currentCustomer = action.payload;
      state.isAuthenticated = true;
    },
    logoutCustomer: (state) => {
      state.currentCustomer = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
  },
});

export const { loginSuccessCustomer, logoutCustomer } =
  authCustomerSlice.actions;
export default authCustomerSlice.reducer;
