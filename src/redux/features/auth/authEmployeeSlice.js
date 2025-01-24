import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentEmployee: JSON.parse(localStorage.getItem("currentEmployee")), // Parse the stored data
  isAuthenticated: !!localStorage.getItem("currentEmployee"),
};

const authEmployeeSlice = createSlice({
  name: "authEmployee",
  initialState,
  reducers: {
    loginSuccessEmployee: (state, action) => {
      state.currentEmployee = action.payload;
      state.isAuthenticated = true;
    },
    logoutEmployee: (state) => {
      state.currentEmployee = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
  },
});

export const { loginSuccessEmployee, logoutEmployee } =
  authEmployeeSlice.actions;
export default authEmployeeSlice.reducer;
