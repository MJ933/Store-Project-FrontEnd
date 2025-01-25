import React, { useEffect, useState, useCallback } from "react";
import AddNewUpdateOrder from "./AddUpdateOrder";
import OrderPage from "./OrderPage";
import clsOrders from "../../Classes/clsOrders";
import { FiEye, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import API from "../../Classes/clsAPI";
import Alert from "../../components/Alert";
import ModernLoader from "../../components/ModernLoader";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "orderDate",
    direction: "desc",
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success"); // 'success' or 'error'

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Shipped: "bg-blue-100 text-blue-800",
    Delivered: "bg-green-100 text-green-800",
    Canceled: "bg-red-100 text-red-800",
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000); // Hide alert after 3 seconds
  };

  const fetchOrders = useCallback(async () => {
    try {
      const orderInstance = new clsOrders();
      const data = await orderInstance.fetchOrders();
      setOrders(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [selectedOrder]);

  const handleView = (view, order = null) => {
    setCurrentView(view);
    setSelectedOrder(order);
  };

  const handleSort = useCallback(
    (key) => {
      let direction = "asc";
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ key, direction });
    },
    [sortConfig]
  );

  const sortedOrders = React.useMemo(() => {
    if (!sortConfig.key) return orders;

    return [...orders].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [orders, sortConfig]);

  const api = new API();
  const handleCancelOrder = async (orderID) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${api.baseURL()}/API/OrdersAPI/UpdateStatus/${orderID}`, // Updated endpoint
        {
          method: "PATCH", // Changed to PATCH
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json", // Set content type to JSON
            accept: "*/*", // Add accept header
          },
          body: JSON.stringify("Canceled"), // Send the plain string as JSON
        }
      );

      console.log(response);

      if (!response.ok) {
        const errorResponse = await response.json(); // Parse the error response
        console.error("Error response:", errorResponse);
        throw new Error("Failed to cancel the order");
      }

      // Update the orders list after canceling
      const updatedOrders = orders.map((order) =>
        order.orderID === orderID
          ? { ...order, orderStatus: "Canceled" } // Ensure status matches API response
          : order
      );
      setOrders(updatedOrders);

      // Show success alert
      showAlert("Order canceled successfully!", "success");
    } catch (err) {
      setError(err.message);
      showAlert("Failed to cancel the order.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ModernLoader />;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (orders.length === 0)
    return <div className="p-4 text-gray-500">No orders found</div>;

  return (
    <div>
      <Alert
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertMessage(null)}
      />

      {currentView === null ? (
        <div className="p-4 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-xl font-semibold text-gray-800 w-full md:w-auto">
              Orders
            </h1>
            <button
              onClick={() => handleView("add")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <FiPlus className="text-lg" />
              <span className="hidden sm:inline">New Order</span>
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-2 py-2 md:px-4 md:py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort("orderID")}
                  >
                    Order ID
                    {sortConfig.key === "orderID" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    className="px-2 py-2 md:px-4 md:py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort("orderDate")}
                  >
                    Date
                    {sortConfig.key === "orderDate" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort("total")}
                  >
                    Total
                    {sortConfig.key === "total" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 text-left text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedOrders.map((order) => (
                  <tr key={order.orderID} className="hover:bg-gray-50">
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-700">
                      {/* <span className="md:hidden font-medium">Order #</span> */}
                      {order.orderID}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-sm font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusStyles[order.orderStatus] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3">
                      <div className="flex items-center gap-2 md:gap-3">
                        <button
                          onClick={() => handleView("read", order)}
                          className="text-gray-600 hover:text-blue-600"
                          title="View"
                        >
                          <FiEye className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => handleView("update", order)}
                          className="text-gray-600 hover:text-green-600"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => handleCancelOrder(order.orderID)}
                          className="text-gray-600 hover:text-red-600"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          {(currentView === "add" || currentView === "update") && (
            <AddNewUpdateOrder
              order={currentView === "update" ? selectedOrder : null}
              isShow={true}
              onClose={() => handleView(null)}
              showAlert={showAlert}
              refreshOrders={fetchOrders}
            />
          )}

          {currentView === "read" && (
            <OrderPage
              order={selectedOrder}
              isShow={true}
              onClose={() => handleView(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
