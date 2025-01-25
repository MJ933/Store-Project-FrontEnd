import React, { useEffect, useState } from "react";
import API from "../../Classes/clsAPI";

const DeleteCustomer = ({
  customer = {},
  isShow,
  onClose,
  showAlert,
  refresh,
}) => {
  const [customerID, setCustomerID] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const api = new API();

  useEffect(() => {
    if (customer?.customerID) {
      setCustomerID(customer.customerID);
    }
  }, [customer]); // Watch for changes in the customer prop

  const handleDeleteCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!customerID) {
      setError("Please enter a customer ID.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${api.baseURL()}/API/CustomersAPI/Delete/${customerID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "Customer not found. Please check the ID and try again."
          );
        } else {
          throw new Error("Failed to delete the customer.");
        }
      }

      setSuccess(true);
      // setCustomerID(0); // Reset the input field
      showAlert("Customer deleted successfully!", "success");
      refresh(); // Refresh the customer list
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isShow) {
    return null; // Don't render if the component is not shown
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Delete Customer</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
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
        </div>
        <form onSubmit={handleDeleteCustomer} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Customer ID
            </label>
            <input
              type="number"
              value={customerID}
              onChange={(e) => setCustomerID(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Customer ID"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              Customer deleted successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default DeleteCustomer;
