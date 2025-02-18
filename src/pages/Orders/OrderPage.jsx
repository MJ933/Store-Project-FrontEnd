import React, { useState, useEffect } from "react";
import clsOrders from "../../Classes/clsOrders";
import clsOrderItems from "../../Classes/clsOrderItems";
import ManageOrderItems from "../OrderItems/ManageOrderItems";
import { useTranslation } from "react-i18next";

const OrderPage = ({ order, isShow, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const { t } = useTranslation();
  const { i18n: i18nInstance } = useTranslation();
  const [isArabic, setIsArabic] = useState(false);
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
      // Handle the error as needed
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
        <div
          className="mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md"
          style={{ width: "calc(100% - 20px)" }} // Ensures some padding on super small screens (e.g., 240px)
        >
          <h3 className="m-4 text-center text-[calc(1em+1vw)] font-medium text-gray-900">
            {t("orderPage.orderDetail")}
          </h3>
          {/* Responsive grid for order details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="hidden" name="orderID" value={formData.orderID} />

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("orderPage.orderID")}
              </label>
              <input
                type="number"
                name="orderID"
                value={formData.orderID}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("orderPage.customerID")}
              </label>
              <input
                type="number"
                name="customerID"
                value={formData.customerID}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("orderPage.orderDate")}
              </label>
              <input
                type="datetime-local"
                name="orderDate"
                value={formData.orderDate}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("orderPage.total")}
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
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("orderPage.orderStatus")}
              </label>
              <input
                type="text"
                name="orderStatus"
                value={formData.orderStatus}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("orderPage.shippingAddress")}
              </label>
              <input
                type="text"
                name="shippingAddress"
                value={formData.shippingAddress}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("orderPage.notes")}
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
            <h3 className="text-lg font-bold mb-4">
              {t("orderPage.orderItems")}
            </h3>
            {orderItems?.length === 0 ? (
              <div className="text-gray-600 text-center">
                {t("orderPage.noOrderItems")}
              </div>
            ) : (
              orderItems.map((item) => (
                <div
                  key={item.orderItemID}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      {t("orderPage.productID")}
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
                      {t("orderPage.productName")}
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
                      {t("orderPage.quantity")}
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
                      {t("orderPage.price")}
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
                        value={item.price}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
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
              {t("orderPage.close")}
            </button>
          </div>

          {error && <div className="text-red-600 mt-4">{error}</div>}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
