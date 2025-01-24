import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productID, quantity, price, imageUrl, productName } =
        action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.productID === productID
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({
          productID,
          quantity,
          price,
          imageUrl,
          productName,
        });
      }
    },
    removeFromCart: (state, action) => {
      const { productID } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.productID !== productID
      );
    },
    updateQuantity: (state, action) => {
      const { productID, quantity } = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.productID === productID
      );
      if (existingItem) {
        existingItem.quantity += quantity;
        if (existingItem.quantity <= 0) {
          state.cartItems = state.cartItems.filter(
            (item) => item.productID !== productID
          );
        }
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
