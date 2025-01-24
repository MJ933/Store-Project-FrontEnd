import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../Classes/clsAPI";

export default function AddUpdateEmployee({ employee = {}, isShow, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const isUpdateEmployee = Boolean(employee?.employeeID);

  const initialFormData = {
    employeeID: employee?.employeeID || 0,
    userName: employee?.userName || "",
    password: employee?.password || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    role: employee?.role || "Employee",
    isActive: employee?.isActive || true,
  };
  const api = new API();

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    setFormData({
      employeeID: employee?.employeeID || 0,
      userName: employee?.userName || "",
      password: employee?.password || "",
      email: employee?.email || "",
      phone: employee?.phone || "",
      role: employee?.role || "Employee",
      isActive: employee?.isActive || true,
    });
  }, [employee]);

  const apiConfig = {
    method: isUpdateEmployee ? "PUT" : "POST",
    url: isUpdateEmployee
      ? `${api.baseURL()}API/EmployeesAPI/Update/${employee.employeeID}`
      : `${api.baseURL()}API/EmployeesAPI/Create`,
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
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to add/update the employee"
        );
      }

      const result = await response.json();
      setSuccess(true);
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
            <input
              type="hidden"
              name="employeeID"
              value={formData.employeeID}
            />
            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
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
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>
              </select>
            </div>
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
              <span className="text-sm">Employee is active</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading
                ? isUpdateEmployee
                  ? "Updating..."
                  : "Adding..."
                : isUpdateEmployee
                ? "Update Employee"
                : "Add Employee"}
            </button>
          </div>
          {error && <div className="text-red-600 mt-4">{error}</div>}
          {success && (
            <div className="text-green-600 mt-4">
              Employee {isUpdateEmployee ? "Updated" : "Added"} successfully!
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
