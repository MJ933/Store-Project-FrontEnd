import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ManageOrderItems = ({ orderItems, handleOrderItemChange }) => {
  const { t } = useTranslation();
  const { i18n: i18nInstance } = useTranslation();
  const [isArabic, setIsArabic] = useState(false);
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
    <div className="mt-6">
      <h3
        className="text-lg font-bold mb-4"
        style={{
          fontSize: "calc(1em + 0.5vw)", // Responsive font size
        }}
      >
        {t("manageOrderItems.orderItems")}
      </h3>
      {orderItems?.length === 0 ? (
        <div className="text-gray-600 text-center">
          {t("manageOrderItems.noOrderItems")}
        </div>
      ) : (
        orderItems?.map((item, index) => (
          <div
            key={item.orderItemID}
            className="grid gap-4 mb-4 p-4 bg-gray-50 rounded-lg"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", // Responsive grid
            }}
          >
            {/* Product ID */}
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

            {/* Product Name */}
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

            {/* Quantity */}
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

            {/* Price */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("manageOrderItems.price")}
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
                  onChange={(e) =>
                    handleOrderItemChange(index, "price", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-16 h-16 object-cover rounded-lg"
                style={{
                  maxWidth: "100%", // Ensure image fits within container
                }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageOrderItems;
