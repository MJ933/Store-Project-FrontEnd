import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../Classes/clsAPI";
import { useTranslation } from "react-i18next";

export default function AddNewUpdateCustomer({
  customer = {},
  isShow,
  onClose,
  isSignUp = false,
  showAlert,
  refresh,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isUpdateCustomer = Boolean(customer?.customerID);

  const initialFormData = {
    customerID: customer?.customerID || 0,
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    registeredAt: customer?.registeredAt || new Date().toISOString(),
    isActive: customer?.isActive || true,
    password: customer?.password || "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    setFormData(initialFormData);
  }, [customer]);

  const api = new API();

  const apiConfig = {
    method: isUpdateCustomer ? "PUT" : "POST",
    url: isUpdateCustomer
      ? `${api.baseURL()}/API/CustomersAPI/update/${customer.customerID}`
      : `${api.baseURL()}/API/CustomersAPI/Create`,
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(apiConfig.url, {
        method: apiConfig.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          customerID: formData.customerID,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          registeredAt: formData.registeredAt,
          isActive: formData.isActive,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          throw new Error(t("addNewUpdateCustomer.emailOrPhoneUsed"));
        } else {
          throw new Error(
            errorData.message || t("addNewUpdateCustomer.failedAddUpdate")
          );
        }
      }

      const result = await response.json();
      setSuccess(true);
      showAlert(
        isSignUp
          ? t("addNewUpdateCustomer.signUpSuccess")
          : t("addNewUpdateCustomer.customerSuccess", {
              action: isUpdateCustomer
                ? t("addNewUpdateCustomer.updated")
                : t("addNewUpdateCustomer.added"),
            }),
        "success"
      );

      if (isSignUp) {
        navigate("/login", {
          state: {
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          },
        });
      } else {
        refresh(); // Refresh the customer list
        onClose(); // Close the modal
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      showAlert(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isSignUp
              ? t("addNewUpdateCustomer.signUp")
              : isUpdateCustomer
              ? t("addNewUpdateCustomer.editCustomer")
              : t("addNewUpdateCustomer.createCustomer")}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 gap-y-6">
          <div className="grid grid-cols-2 gap-6">
            {!isSignUp && (
              <input
                type="hidden"
                name="customerID"
                value={formData.customerID}
              />
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                {t("addNewUpdateCustomer.firstName")}
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                placeholder={t("addNewUpdateCustomer.firstNamePlaceholder")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                {t("addNewUpdateCustomer.lastName")}
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                placeholder={t("addNewUpdateCustomer.lastNamePlaceholder")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                {t("addNewUpdateCustomer.email")}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                placeholder={t("addNewUpdateCustomer.emailPlaceholder")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                {t("addNewUpdateCustomer.phone")}
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                placeholder={t("addNewUpdateCustomer.phonePlaceholder")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                {t("addNewUpdateCustomer.password")}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                placeholder={t("addNewUpdateCustomer.passwordPlaceholder")}
                required
              />
            </div>

            {!isSignUp && (
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 cursor-pointer transition-all"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-3 text-sm text-gray-600 cursor-pointer select-none"
                  >
                    {t("addNewUpdateCustomer.activeStatus")}
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors"
            >
              {t("addNewUpdateCustomer.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isSignUp
                    ? t("addNewUpdateCustomer.signingUp")
                    : isUpdateCustomer
                    ? t("addNewUpdateCustomer.updating")
                    : t("addNewUpdateCustomer.creating")}
                </span>
              ) : isSignUp ? (
                t("addNewUpdateCustomer.signUp")
              ) : isUpdateCustomer ? (
                t("addNewUpdateCustomer.updateCustomer")
              ) : (
                t("addNewUpdateCustomer.createCustomer")
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                {isSignUp
                  ? t("addNewUpdateCustomer.signUpSuccess")
                  : t("addNewUpdateCustomer.customerSuccess", {
                      action: isUpdateCustomer
                        ? t("addNewUpdateCustomer.updated")
                        : t("addNewUpdateCustomer.added"),
                    })}
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
