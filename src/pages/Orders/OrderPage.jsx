import React, { useState, useEffect } from "react";
import clsOrders from "../../Classes/clsOrders";
import clsOrderItems from "../../Classes/clsOrderItems";
import ManageOrderItems from "../OrderItems/ManageOrderItems";

const OrderPage = ({ order, isShow, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    if (isShow && order?.orderID) {
      fetchOrderItems(order.orderID);
    }
  }, [order?.orderID, isShow]);

  const fetchOrderItems = async (orderID) => {
    try {
      const orderItemInstance = new clsOrderItems();
      const data = await orderItemInstance.fetchOrderItemsByOrderID(orderID);
      setOrderItems(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const initialFormData = {
    orderID: order?.orderID || 0,
    customerID: order?.customerID || 0,
    orderDate:
      order?.orderDate || new Date().toISOString().slice(0, 19) + ".000",
    total: order?.total || 0,
    orderStatus: order?.orderStatus || "Pending",
    shippingAddress: order?.shippingAddress || "",
    notes: order?.notes || "",
  };

  const [formData] = useState(initialFormData);

  return (
    <div className="mb-8">
      {isShow && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-2 gap-4">
            <input type="hidden" name="orderID" value={formData.orderID} />

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Customer ID
              </label>
              <input
                type="number"
                name="customerID"
                value={formData.customerID}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Order Date
              </label>
              <input
                type="datetime-local"
                name="orderDate"
                value={formData.orderDate}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Total
              </label>
              <input
                type="number"
                name="total"
                value={formData.total}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Order Status
              </label>
              <input
                type="text"
                name="orderStatus"
                value={formData.orderStatus}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Shipping Address
              </label>
              <input
                type="text"
                name="shippingAddress"
                value={formData.shippingAddress}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">Order Items</h3>
            {orderItems.length === 0 ? (
              <div className="text-gray-600 text-center">
                No order items found.
              </div>
            ) : (
              orderItems.map((item, index) => (
                <div
                  key={item.orderItemID}
                  className="grid grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Product ID
                    </label>
                    <input
                      type="number"
                      value={item.productID}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={item.productName}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      value={item.price}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          {error && <div className="text-red-600 mt-4">{error}</div>}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
