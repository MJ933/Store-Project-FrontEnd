import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../Classes/clsAPI";

const CustomerOrders = ({ customer, isShow, onClose }) => {
  const [orders, setOrders] = useState([]); // Stores the list of orders
  const [selectedOrder, setSelectedOrder] = useState(null); // Stores the selected order's details
  const [orderItems, setOrderItems] = useState([]); // Stores the items of the selected order
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState(null); // Tracks errors
  const [alertMessage, setAlertMessage] = useState(null); // Tracks alert message
  const navigate = useNavigate();

  // Fetch orders for the customer
  if (!customer?.customerID) {
    customer = JSON.parse(localStorage.getItem("currentCustomer"));
  }

  if (!customer) {
    return <h1> You do not have any orders</h1>; // Don't render if the component is not shown or customer data is missing
  }
  const api = new API();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${api.baseURL()}/API/OrdersAPI/GetOrdersByCustomerID/${
            customer.customerID
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Fetch items for the selected order
  useEffect(() => {
    if (!selectedOrder) return;

    const fetchOrderItems = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const response = await fetch(
          `${api.baseURL()}/API/OrderItemsAPI/GetOrderItemByOrderID/${
            selectedOrder.orderID
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch order items");
        }
        const data = await response.json();
        setOrderItems(data);
      } catch (err) {
        setError(err.message); // Set error state if fetching fails
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, [selectedOrder]);

  // Handle order selection
  const handleOrderClick = (order) => {
    setSelectedOrder(order === selectedOrder ? null : order); // Toggle selected order
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  // Function to cancel an order
  const handleCancelOrder = async (orderID) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${api.baseURL()}/API/OrdersAPI/UpdateOrderStatusByOrderID/${orderID}/Canceled`,
        {
          method: "Put",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel the order");
      }

      // Update the orders list after canceling
      const updatedOrders = orders.map((order) =>
        order.orderID === orderID
          ? { ...order, orderStatus: "Cancelled" }
          : order
      );
      setOrders(updatedOrders);

      // Show success alert
      setAlertMessage("Order canceled successfully!");
      setTimeout(() => setAlertMessage(null), 2000); // Hide alert after 2 seconds
    } catch (err) {
      setError(err.message);
      setAlertMessage("Failed to cancel the order.");
      setTimeout(() => setAlertMessage(null), 2000); // Hide alert after 2 seconds
    } finally {
      setLoading(false);
    }
  };

  // Render the component
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Customer Orders</h1>
      {loading && <p className="text-gray-600">Loading...</p>}

      {/* Alert Message */}
      {alertMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {alertMessage}
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={handleClose}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none"
        >
          Close
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Orders</h2>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.orderID}
              className={`p-4 bg-white rounded-lg shadow-md cursor-pointer transition-all ${
                selectedOrder?.orderID === order.orderID
                  ? "border-2 border-blue-500"
                  : "hover:shadow-lg"
              }`}
              onClick={() => handleOrderClick(order)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    Order #{order.orderID}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Date: {formatDate(order.orderDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-800">
                    ${order.total}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      order.orderStatus === "Delivered"
                        ? "text-green-600"
                        : order.orderStatus === "Cancelled"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.orderStatus}
                  </p>
                </div>
              </div>

              {/* Cancel Button */}
              {order.orderStatus !== "Cancelled" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent onClick
                    handleCancelOrder(order.orderID);
                  }}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Cancel Order
                </button>
              )}

              {/* Order Items (shown if this order is selected) */}
              {selectedOrder?.orderID === order.orderID && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Items
                  </h3>
                  {loading ? (
                    <p className="text-gray-600">Loading items...</p>
                  ) : error ? (
                    <p className="text-red-600">{error}</p>
                  ) : orderItems.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-gray-100 rounded-lg">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                              Image
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                              Product Name
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                              Quantity
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                              Price
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderItems.map((item) => (
                            <tr
                              key={item.orderItemID}
                              className="bg-white hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 py-2">
                                <img
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-700">
                                {item.productName}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-700">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-700">
                                ${item.price}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-700">
                                ${item.price * item.quantity}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      No items found for this order.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <h1>No Orders Found</h1>
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;
