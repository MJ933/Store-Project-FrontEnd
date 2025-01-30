import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../redux/features/cart/cartSlice";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import clsOrders from "../../Classes/clsOrders";
import clsOrderItems from "../../Classes/clsOrderItems";
import LocationSelector from "../../components/LocationSelector"; // Import LocationSelector
// Assuming you have a translation function 't' from your i18n setup
import { useTranslation } from "react-i18next"; // or your translation hook/function

const CurrentCart = () => {
  const { t } = useTranslation(); // if using react-i18next, otherwise use your translation function
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const currentCustomer = useSelector(
    (state) => state.authCustomer.currentCustomer
  );

  const [shippingAddress, setShippingAddress] = useState(""); // Initialize as empty
  const [notes, setNotes] = useState("");
  const [showLocationSelector, setShowLocationSelector] = useState(false); // Control visibility

  const handleIncreaseQuantity = (productID) => {
    dispatch(addToCart({ productID, quantity: 1 }));
  };

  const handleDecreaseQuantity = (productID) => {
    dispatch(updateQuantity({ productID, quantity: -1 }));
  };

  const handleRemoveProduct = (productID) => {
    dispatch(removeFromCart({ productID }));
  };

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
      alert(t("currentCart.orderSuccessMessage")); // Use translation for success alert
    } catch (error) {
      console.error("Error creating order:", error);
      alert(t("currentCart.orderErrorMessage")); // Use translation for error alert
    }
  };

  const handleLocationSelect = (location) => {
    setShippingAddress(location);
    setShowLocationSelector(false); // Hide after selection
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {t("currentCart.title")}
      </h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-center">
          {t("currentCart.emptyMessage")}
        </p>
      ) : (
        <div className="gap-y-4">
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <div className=" flex items-center gap-x-4">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="mx-2 w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <p className="text-gray-700 font-semibold">
                    {item.productName}
                  </p>
                  <p className="text-gray-600">
                    {t("currentCart.quantityLabel")} {item.quantity}
                  </p>
                  <p className="text-gray-600">
                    {t("currentCart.priceLabel")} ${item.price}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-x-3">
                {/* Increase Quantity Button */}
                <button
                  onClick={() => handleIncreaseQuantity(item.productID)}
                  className=" p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200"
                >
                  <FaPlus className=" w-4 h-4" />
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
        <div className="mt-6 gap-y-4">
          {/* Location Selector Button */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              {t("currentCart.selectShippingLocation")}
            </label>
            <button
              onClick={() => setShowLocationSelector(!showLocationSelector)}
              className="w-full p-2 border border-gray-300 rounded-lg text-left"
            >
              {shippingAddress || t("currentCart.selectLocationPlaceholder")}
            </button>

            {/* Location Selector Dropdown */}
            {showLocationSelector && (
              <LocationSelector
                onLocationSelect={handleLocationSelect}
                onClose={() => setShowLocationSelector(false)}
              />
            )}
          </div>

          {/* Shipping Address Display/Edit */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              {t("currentCart.shippingAddressLabel")}
            </label>
            <input
              type="text"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder={t("currentCart.shippingAddressPlaceholder")}
              // readOnly={!!shippingAddress} // Readonly if address is from selector
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              {t("currentCart.notesLabel")}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder={t("currentCart.notesPlaceholder")}
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
            {t("currentCart.sendOrderButton")}
          </button>
        </div>
      )}
    </div>
  );
};

export default CurrentCart;
