import React, { useEffect, useState } from "react";
import API from "../../Classes/clsAPI";

const DeleteEmployee = ({ employee = {}, isShow, onClose }) => {
  const [employeeID, setEmployeeID] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const api = new API();

  useEffect(() => {
    if (employee?.employeeID) {
      setEmployeeID(employee.employeeID);
    }
  }, [employee]);

  const handleDeleteEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!employeeID) {
      setError("Please enter an employee ID.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${api.baseURL()}API/EmployeesAPI/Delete/${employeeID}`,
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
            "Employee not found. Please check the ID and try again."
          );
        } else {
          throw new Error("Failed to delete the employee.");
        }
      }

      setSuccess(true);
      setEmployeeID(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isShow) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Delete Employee</h2>
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
        <form onSubmit={handleDeleteEmployee} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Employee ID
            </label>
            <input
              type="number"
              value={employeeID}
              onChange={(e) => setEmployeeID(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Employee ID"
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
              Employee deleted successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default DeleteEmployee;
