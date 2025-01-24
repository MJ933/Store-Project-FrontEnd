import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../Classes/clsAPI";

export default function AddNewUpdateCustomer({
  customer = {},
  isShow,
  onClose,
  isSignUp = false, // New prop for sign-up flow
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Determine if this is an update or a new customer
  const isUpdateCustomer = Boolean(customer?.customerID);
  if (!isShow) {
    return null; // Don't render if the component is not shown or customer data is missing
  }
  // Initialize form data based on the `customer` prop
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

  // Update form data when the `customer` prop changes
  useEffect(() => {
    setFormData({
      customerID: customer?.customerID || 0,
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      registeredAt: customer?.registeredAt || new Date().toISOString(),
      isActive: customer?.isActive || true,
      password: customer?.password || "",
    });
  }, [customer]);
  const api = new API();

  // API configuration based on whether it's an update or a new customer
  const apiConfig = {
    method: isUpdateCustomer ? "PUT" : "POST",
    url: isUpdateCustomer
      ? `${api.baseURL()}API/CustomersAPI/update/${customer.customerID}`
      : `${api.baseURL()}API/CustomersAPI/Create`,
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
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
          throw new Error("Email or phone is already used in another account.");
        } else {
          throw new Error(
            errorData.message || "Failed to add/update the customer"
          );
        }
      }

      const result = await response.json();
      setSuccess(true);

      // Redirect after successful sign-up
      if (isSignUp) {
        navigate("/login", {
          state: {
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          },
        });
      }
    } catch (error) {
      setError(error.message);
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
    <div className="mb-8">
      {isShow && (
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md"
        >
          <div className="grid grid-cols-2 gap-4">
            {!isSignUp && (
              <input
                type="hidden"
                name="customerID"
                value={formData.customerID}
              />
            )}

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {!isSignUp && (
              <div className="col-span-1">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Is Active
                </label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="mr-2 leading-tight"
                />
                <span className="text-sm">Customer is active</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading
                ? isUpdateCustomer
                  ? "Updating..."
                  : "Adding..."
                : isSignUp
                ? "Sign Up"
                : isUpdateCustomer
                ? "Update Customer"
                : "Add Customer"}
            </button>
          </div>

          {error && <div className="text-red-600 mt-4">{error}</div>}
          {success && (
            <div className="text-green-600 mt-4">
              {isSignUp
                ? "Sign-up successful!"
                : "Customer added/updated successfully!"}
            </div>
          )}
        </form>
      )}

      <button
        className="ml-96 mt-10 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleClose}
      >
        Close
      </button>
    </div>
  );
}
