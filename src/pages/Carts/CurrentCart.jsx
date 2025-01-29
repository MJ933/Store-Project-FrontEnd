import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../redux/features/cart/cartSlice"; // Adjust the path as needed
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa"; // Icons for buttons
import clsOrders from "../../Classes/clsOrders"; // Import the clsOrders class
import clsOrderItems from "../../Classes/clsOrderItems"; // Import the clsOrderItems class

const CurrentCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const currentCustomer = useSelector(
    (state) => state.authCustomer.currentCustomer
  );

  // State for shipping address and notes
  const [shippingAddress, setShippingAddress] = useState("karbala");
  const [notes, setNotes] = useState("99999");

  // Handle increasing the quantity of a product
  const handleIncreaseQuantity = (productID) => {
    dispatch(addToCart({ productID, quantity: 1 }));
  };

  // Handle decreasing the quantity of a product
  const handleDecreaseQuantity = (productID) => {
    dispatch(updateQuantity({ productID, quantity: -1 }));
  };

  // Handle removing a product from the cart
  const handleRemoveProduct = (productID) => {
    dispatch(removeFromCart({ productID }));
  };

  // Handle sending the order
  const handleSendOrder = async () => {
    try {
      const orderInstance = new clsOrders();
      const orderItemInstance = new clsOrderItems();

      // Calculate the total price of the order
      const total = cartItems.reduce((sum, item) => {
        if (item.price) {
          return sum + item.quantity * item.price;
        } else {
          console.error("Price is missing for item:", item);
          return sum;
        }
      }, 0);

      // Prepare the order data
      const orderData = {
        orderID: 0, // Will be assigned by the server
        customerID: currentCustomer?.customerID || 1, // Default user ID
        orderDate: new Date().toISOString(), // Current date/time
        total: total, // Use the calculated total
        orderStatus: "Pending", // Default status
        shippingAddress: shippingAddress, // Use the shipping address from state
        notes: notes, // Use the notes from state
      };

      // Step 1: Create the order
      const createdOrder = await orderInstance.createOrder(orderData);
      const orderID = createdOrder.orderID; // Get the orderID from the created order
      console.log(orderID);
      // Step 2: Create the order items
      for (const item of cartItems) {
        const orderItemData = {
          orderItemID: 0, // Will be assigned by the server
          orderID: orderID, // Use the orderID from the created order
          productID: item.productID,
          quantity: item.quantity,
          price: item.price,
          imageUrl: item.imageUrl,
          productName: item.productName,
        };

        await orderItemInstance.addOrderItem(orderItemData);
      }

      // Clear the cart after the order is successfully created
      dispatch(clearCart());
      alert("Order created successfully!");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("An error occurred while creating the order.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <p className="text-gray-700 font-semibold">
                    {item.productName}
                  </p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-gray-600">Price: ${item.price}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {/* Increase Quantity Button */}
                <button
                  onClick={() => handleIncreaseQuantity(item.productID)}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200"
                >
                  <FaPlus className="w-4 h-4" />
                </button>

                {/* Decrease Quantity Button */}
                <button
                  onClick={() => handleDecreaseQuantity(item.productID)}
                  className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-all duration-200"
                >
                  <FaMinus className="w-4 h-4" />
                </button>

                {/* Remove Product Button */}
                <button
                  onClick={() => handleRemoveProduct(item.productID)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shipping Address and Notes Input Fields */}
      {cartItems.length > 0 && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Shipping Address
            </label>
            <input
              type="text"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your shipping address"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter any additional notes"
            />
          </div>
        </div>
      )}

      {/* Send Order Button */}
      {cartItems.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleSendOrder}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all duration-200"
          >
            Send Order
          </button>
        </div>
      )}
    </div>
  );
};

export default CurrentCart;
