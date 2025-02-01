import React from "react";
import { useTranslation } from "react-i18next";

const ManageOrderItems = ({ orderItems, handleOrderItemChange }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-4">
        {t("manageOrderItems.orderItems")}
      </h3>
      {orderItems?.length === 0 ? (
        <div className="text-gray-600 text-center">
          {t("manageOrderItems.noOrderItems")}
        </div>
      ) : (
        orderItems?.map((item, index) => (
          <div key={item.orderItemID} className="grid grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("manageOrderItems.productID")}
              </label>
              <input
                type="number"
                value={item.productID}
                onChange={(e) =>
                  handleOrderItemChange(index, "productID", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("manageOrderItems.productName")}
              </label>
              <input
                type="text"
                value={item.productName}
                onChange={(e) =>
                  handleOrderItemChange(index, "productName", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("manageOrderItems.quantity")}
              </label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleOrderItemChange(index, "quantity", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("manageOrderItems.price")}
              </label>
              <input
                type="number"
                value={item.price}
                onChange={(e) =>
                  handleOrderItemChange(index, "price", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
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
  );
};

export default ManageOrderItems;
