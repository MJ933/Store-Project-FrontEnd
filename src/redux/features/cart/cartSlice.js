import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const loadState = () => {
  try {
    const cartItems = localStorage.getItem("cartItems");
    return cartItems ? JSON.parse(cartItems) : [];
  } catch (error) {
    return [];
  }
};
const initialState = {
  cartItems: loadState(),
};

// Function to safely parse localStorage data

// Function to persist cart items to localStorage
const saveState = (cartItems) => {
  try {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  } catch (error) {
    // Handle storage errors (e.g., quota exceeded)
    console.error("Failed to save cart items to localStorage:", error);
  }
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
      saveState(state.cartItems); // Save to localStorage
    },
    removeFromCart: (state, action) => {
      const { productID } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.productID !== productID
      );
      saveState(state.cartItems); // Save to localStorage
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
      saveState(state.cartItems); // Save to localStorage
    },
    clearCart: (state) => {
      state.cartItems = [];
      saveState(state.cartItems); // Save to localStorage
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
