import React, { useState, useEffect } from "react";
import clsOrders from "../../Classes/clsOrders";
import clsOrderItems from "../../Classes/clsOrderItems";
import ManageOrderItems from "../OrderItems/ManageOrderItems";
import ModernLoader from "../../components/ModernLoader";
import ErrorComponent from "../../components/Error";
import { useTranslation } from "react-i18next";
import { handleError } from "../../utils/handleError";

export default function AddNewUpdateOrder({
  order = {},
  isShow,
  onClose,
  showAlert,
  refreshOrders,
}) {
  const [loading, setLoading] = useState(false);
  const [loadingOrderItems, setLoadingOrderItems] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const { t } = useTranslation();

  const isUpdateOrder = Boolean(order?.orderID);

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

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isUpdateOrder && order?.orderID) {
      fetchOrderItems(order.orderID);
    }
  }, [order?.orderID, isUpdateOrder]);

  const fetchOrderItems = async (orderID) => {
    setLoadingOrderItems(true);
    try {
      const orderItemInstance = new clsOrderItems();
      const data = await orderItemInstance.fetchOrderItemsByOrderID(orderID);
      console.log("this is the order items data : ", data);
      setOrderItems(data);
    } catch (error) {
      setError(error.message);
      handleError(error);
    } finally {
      setLoadingOrderItems(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOrderItemChange = (index, field, value) => {
    const updatedOrderItems = [...orderItems];
    updatedOrderItems[index][field] = value;
    setOrderItems(updatedOrderItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate orderItems before proceeding
      if (!Array.isArray(orderItems)) {
        throw new TypeError("orderItems is not iterable. Expected an array.");
      }
      const orderInstance = new clsOrders();
      const orderResult = isUpdateOrder
        ? await orderInstance.updateOrder(order.orderID, formData)
        : await orderInstance.createOrder(formData);

      if (isUpdateOrder) {
        const orderItemInstance = new clsOrderItems();
        for (const item of orderItems) {
          await orderItemInstance.updateOrderItem(item.orderItemID, item);
        }
      }

      setSuccess(true);
      refreshOrders();
      showAlert(t("addNewUpdateOrder.orderSuccess"), "success");
      onClose();
    } catch (error) {
      // setError(error.message);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      {isShow && (
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md"
        >
          {loadingOrderItems && <ModernLoader />}
          {/* {error && (
            <ErrorComponent
              message={error}
              onClose={() => setError(null)} // Clear the error when the user closes it
            />
          )} */}
          <div className="grid grid-cols-2 gap-4">
            <input type="hidden" name="orderID" value={formData.orderID} />

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("addNewUpdateOrder.customerID")}
              </label>
              <input
                type="number"
                name="customerID"
                value={formData.customerID}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("addNewUpdateOrder.orderDate")}
              </label>
              <input
                type="datetime-local"
                name="orderDate"
                value={formData.orderDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("addNewUpdateOrder.total")}
              </label>
              <input
                type="number"
                name="total"
                value={formData.total}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("addNewUpdateOrder.orderStatus")}
              </label>
              <select
                name="orderStatus"
                value={formData.orderStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                <option value="Pending">
                  {t("addNewUpdateOrder.pending")}
                </option>
                <option value="Shipped">
                  {t("addNewUpdateOrder.shipped")}
                </option>
                <option value="Delivered">
                  {t("addNewUpdateOrder.delivered")}
                </option>
                <option value="Cancelled">
                  {t("addNewUpdateOrder.cancelled")}
                </option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("addNewUpdateOrder.shippingAddress")}
              </label>
              <input
                type="text"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("addNewUpdateOrder.notes")}
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <ManageOrderItems
            orderItems={orderItems}
            handleOrderItemChange={handleOrderItemChange}
          />

          <div className="flex items-center justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading || loadingOrderItems}
            >
              {loading
                ? isUpdateOrder
                  ? t("addNewUpdateOrder.updating")
                  : t("addNewUpdateOrder.adding")
                : isUpdateOrder
                ? t("addNewUpdateOrder.updateOrder")
                : t("addNewUpdateOrder.addOrder")}
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={onClose}
            >
              {t("addNewUpdateOrder.close")}
            </button>
          </div>

          {/* {error && <div className="text-red-600 mt-4">{error}</div>} */}

          {success && (
            <div className="text-green-600 mt-4">
              {t("addNewUpdateOrder.orderSuccess")}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
