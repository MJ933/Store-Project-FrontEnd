import React, { useEffect, useState, useCallback } from "react";
import AddNewUpdateOrder from "./AddUpdateOrder";
import OrderPage from "./OrderPage";
import clsOrders from "../../Classes/clsOrders";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [showUpdateOrder, setShowUpdateOrder] = useState(false);
  const [showDeleteOrder, setShowDeleteOrder] = useState(false);
  const [showReadOrder, setShowReadOrder] = useState(false);
  const [order, setOrder] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "orderID",
    direction: "desc",
  });

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
  }, [order]);

  const handleAdd = () => {
    setShowAddOrder(true);
    setShowUpdateOrder(false);
    setShowReadOrder(false);
    setShowDeleteOrder(false);
    setOrder(null);
  };

  const handleRead = (currentOrder) => {
    setShowReadOrder(true);
    setShowAddOrder(false);
    setShowUpdateOrder(false);
    setShowDeleteOrder(false);
    setOrder(currentOrder);
  };

  const handleUpdate = (currentOrder) => {
    setShowAddOrder(false);
    setShowUpdateOrder(true);
    setShowReadOrder(false);
    setShowDeleteOrder(false);
    setOrder(currentOrder);
  };

  const handleDelete = (currentOrder) => {
    setShowReadOrder(false);
    setShowAddOrder(false);
    setShowUpdateOrder(false);
    setShowDeleteOrder(true);
    setOrder(currentOrder);
  };

  const handleCloseCRUDOperationOrder = () => {
    setShowReadOrder(false);
    setShowUpdateOrder(false);
    setShowAddOrder(false);
    setShowDeleteOrder(false);
    setOrder(null);
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

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center text-gray-600">No orders found.</div>;
  }

  return (
    <div>
      {showAddOrder && (
        <AddNewUpdateOrder
          order={null}
          isShow={showAddOrder}
          onClose={handleCloseCRUDOperationOrder}
        />
      )}
      {showUpdateOrder && (
        <AddNewUpdateOrder
          order={order}
          isShow={showUpdateOrder}
          onClose={handleCloseCRUDOperationOrder}
        />
      )}
      {showReadOrder && (
        <OrderPage
          order={order}
          isShow={showReadOrder}
          onClose={handleCloseCRUDOperationOrder}
        />
      )}
      {!showAddOrder &&
        !showUpdateOrder &&
        !showDeleteOrder &&
        !showReadOrder && (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
              Orders List
            </h1>
            <div className="mb-6 text-center">
              <button
                onClick={handleAdd}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-sm sm:text-base"
              >
                Add Order
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-100">
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("orderID")}
                    >
                      Order ID
                      {sortConfig.key === "orderID" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("customerID")}
                    >
                      Customer ID
                      {sortConfig.key === "customerID" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("orderDate")}
                    >
                      Order Date
                      {sortConfig.key === "orderDate" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("total")}
                    >
                      Total
                      {sortConfig.key === "total" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("orderStatus")}
                    >
                      Order Status
                      {sortConfig.key === "orderStatus" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("shippingAddress")}
                    >
                      Shipping Address
                      {sortConfig.key === "shippingAddress" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("notes")}
                    >
                      Notes
                      {sortConfig.key === "notes" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map((order) => (
                    <tr key={order.orderID} className="hover:bg-gray-50">
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {order.orderID}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {order.customerID}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {order.orderStatus}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {order.shippingAddress}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {order.notes}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b">
                        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                          <button
                            onClick={() => handleRead(order)}
                            className="bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-blue-600 text-sm sm:text-base"
                          >
                            Read
                          </button>
                          <button
                            onClick={() => handleUpdate(order)}
                            className="bg-green-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-green-600 text-sm sm:text-base"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(order)}
                            className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-red-600 text-sm sm:text-base"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
};

export default ManageOrders;
