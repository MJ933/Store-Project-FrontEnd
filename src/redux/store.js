import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice";
import authCustomerReducer from "./features/auth/authCustomerSlice";
import authEmployeeReducer from "./features/auth/authEmployeeSlice";
import searchReducer from "./features/search/searchSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    authCustomer: authCustomerReducer,
    authEmployee: authEmployeeReducer,
    search: searchReducer,
  },
});
