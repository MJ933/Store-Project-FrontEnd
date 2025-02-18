import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CustomerPage({ customer, isShow = false, onClose }) {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.authCustomer.currentCustomer);
  const { t } = useTranslation();

  // Ensure customer data exists
  if (!customer?.customerID) {
    customer =
      userInfo?.identifier ||
      JSON.parse(localStorage.getItem("currentCustomer"));
  }

  // If not shown or no customer data, return null
  if (!isShow || !customer) {
    return null;
  }

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-full md:max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button for Mobile */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-gray-800">
          {t("customerPage.customerDetails")}
        </h2>

        {/* Customer Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Customer ID */}
          <DetailCard
            iconColor="bg-blue-100"
            icon="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
            label={t("customerPage.customerID")}
            value={customer.customerID}
          />

          {/* First Name */}
          <DetailCard
            iconColor="bg-purple-100"
            icon="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            label={t("customerPage.firstName")}
            value={customer.firstName}
          />

          {/* Last Name */}
          <DetailCard
            iconColor="bg-green-100"
            icon="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            label={t("customerPage.lastName")}
            value={customer.lastName}
          />

          {/* Email */}
          <DetailCard
            iconColor="bg-yellow-100"
            icon="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
            label={t("customerPage.email")}
            value={customer.email}
          />

          {/* Phone */}
          <DetailCard
            iconColor="bg-red-100"
            icon="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
            label={t("customerPage.phone")}
            value={customer.phone}
          />

          {/* Registered At */}
          <DetailCard
            iconColor="bg-pink-100"
            icon="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            label={t("customerPage.registeredAt")}
            value={new Date(customer.registeredAt).toLocaleDateString()}
          />

          {/* Active Status */}
          <DetailCard
            iconColor="bg-indigo-100"
            icon="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            label={t("customerPage.isActive")}
            value={
              customer.isActive ? t("customerPage.yes") : t("customerPage.no")
            }
          />
        </div>

        {/* Close Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleClose}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none"
          >
            {t("customerPage.close")}
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable Detail Card Component
function DetailCard({ iconColor, icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`w-8 h-8 ${iconColor} rounded-full flex items-center justify-center`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-700"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d={icon} />
        </svg>
      </div>
      <div>
        <label className="mx-2 block text-gray-600 text-sm font-semibold mb-1">
          {label}
        </label>
        <p className="mx-2 text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  );
}
