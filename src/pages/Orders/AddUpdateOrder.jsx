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
  const { i18n: i18nInstance } = useTranslation();
  const [isArabic, setIsArabic] = useState(false);
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
      // console.log("this is the order items data : ", data);
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
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Apply notranslate class immediately when component mounts
    document.documentElement.classList.add("notranslate");

    const lang = i18nInstance.language;
    if (lang === "ar") {
      setIsArabic(true);
    } else {
      setIsArabic(false);
    }
  }, [i18nInstance.language]);

  return (
    <div className="mb-8">
      {isShow && (
        <form
          onSubmit={handleSubmit}
          className="max-w-full mx-auto bg-white p-4 rounded-lg shadow-md"
          style={{
            maxWidth: "calc(100vw - 20px)", // Adjust max-width for small screens
          }}
        >
          {loadingOrderItems && <ModernLoader />}
          <h3
            className="m-4 text-center font-medium text-gray-900"
            style={{
              fontSize: "calc(1em + 1vw)", // Responsive font size
            }}
          >
            {t("addNewUpdateOrder.addNewUpdateOrder")}
          </h3>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", // Responsive grid
            }}
          >
            <input type="hidden" name="orderID" value={formData.orderID} />

            {/* Order ID */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("addNewUpdateOrder.orderID")}
              </label>
              <input
                type="number"
                name="orderID"
                value={formData.orderID}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Customer ID */}
            <div>
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

            {/* Order Date */}
            <div>
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

            {/* Total */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("addNewUpdateOrder.total")}
              </label>
              <div className="relative">
                <span
                  className={`absolute inset-y-0 ${
                    isArabic ? "left-0" : "right-0"
                  }   p-3 flex items-center text-gray-500  `}
                >
                  {t("Currency")}
                </span>
                <input
                  type="number"
                  name="total"
                  value={formData.total}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Order Status */}
            <div>
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

            {/* Shipping Address */}
            <div className="col-span-full">
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

            {/* Notes */}
            <div className="col-span-full">
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

          {/* Manage Order Items */}
          <ManageOrderItems
            orderItems={orderItems}
            handleOrderItemChange={handleOrderItemChange}
          />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto mb-2 sm:mb-0"
              disabled={loading || loadingOrderItems}
              style={{
                fontSize: "calc(0.8em + 0.5vw)", // Responsive font size
              }}
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
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto"
              onClick={onClose}
              style={{
                fontSize: "calc(0.8em + 0.5vw)", // Responsive font size
              }}
            >
              {t("addNewUpdateOrder.close")}
            </button>
          </div>

          {/* Success Message */}
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
