import { createSlice } from "@reduxjs/toolkit";

// Load cart items from localStorage
const loadState = () => {
  try {
    const cartItems = localStorage.getItem("cartItems");
    return cartItems ? JSON.parse(cartItems) : [];
  } catch (error) {
    console.error("Failed to load cart items from localStorage:", error);
    return []; // Return an empty array on error
  }
};

// Save cart items to localStorage
const saveState = (cartItems) => {
  try {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  } catch (error) {
    console.error("Failed to save cart items to localStorage:", error);
  }
};

// Initial state for the cart slice
const initialState = {
  cartItems: loadState(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productID, quantity, price, imageUrl, productName, maxQuantity } =
        action.payload;

      const existingItem = state.cartItems.find(
        (item) => item.productID === productID
      );

      const productData = {
        productID,
        quantity: quantity || 1,
        price: price || existingItem?.price,
        imageUrl: imageUrl || existingItem?.imageUrl,
        productName: productName || existingItem?.productName,
        maxQuantity: maxQuantity || existingItem?.maxQuantity,
      };

      if (
        !productData.price ||
        !productData.imageUrl ||
        !productData.productName
      ) {
        console.warn(`Incomplete product data for productID ${productID}`);
        return;
      }

      if (existingItem) {
        const newQuantity = existingItem.quantity + productData.quantity;
        if (
          productData.maxQuantity !== undefined &&
          newQuantity > productData.maxQuantity
        ) {
          existingItem.quantity = productData.maxQuantity;
        } else {
          existingItem.quantity = newQuantity;
        }
      } else {
        state.cartItems.push(productData);
      }

      saveState(state.cartItems);
    },

    removeFromCart: (state, action) => {
      const { productID } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.productID !== productID
      );
      saveState(state.cartItems);
    },

    updateQuantity: (state, action) => {
      const { productID, quantity } = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.productID === productID
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (
          existingItem.maxQuantity !== undefined &&
          newQuantity > existingItem.maxQuantity
        ) {
          existingItem.quantity = existingItem.maxQuantity;
        } else if (newQuantity > 0) {
          existingItem.quantity = newQuantity;
        }

        // Remove the item if the quantity becomes zero or negative
        if (existingItem.quantity <= 0) {
          state.cartItems = state.cartItems.filter(
            (item) => item.productID !== productID
          );
        }

        saveState(state.cartItems);
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
      saveState(state.cartItems);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
