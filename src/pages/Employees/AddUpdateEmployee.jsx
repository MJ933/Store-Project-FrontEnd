import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../Classes/clsAPI";
import { useTranslation } from "react-i18next";

export default function AddUpdateEmployee({
  employee = {},
  isShow,
  onClose,
  showAlert,
  refreshEmployees,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const isUpdateEmployee = Boolean(employee?.employeeID);
  const { t } = useTranslation();

  const initialFormData = {
    employeeID: employee?.employeeID || 0,
    userName: employee?.userName || "",
    password: employee?.password || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    role: employee?.role || "",
    isActive: employee?.isActive || true,
  };
  const api = new API();

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    let formattedRole = "";
    if (employee?.role) {
      if (employee.role.toLowerCase() === "marketing") {
        formattedRole = "Marketing"; // Ensure it matches the option value exactly for "Marketing" option
      } else if (employee.role.toLowerCase() === "admin") {
        formattedRole = "Admin"; // Ensure it matches the option value exactly for "Admin" option
      } else {
        formattedRole = employee.role; // For any other role, keep the original value as is
      }
    }

    setFormData({
      employeeID: employee?.employeeID || 0,
      userName: employee?.userName || "",
      password: employee?.password || "",
      email: employee?.email || "",
      phone: employee?.phone || "",
      role: formattedRole, // Use the formatted role here
      isActive: employee?.isActive || true,
    });
  }, [employee]);

  const apiConfig = {
    method: isUpdateEmployee ? "PUT" : "POST",
    url: isUpdateEmployee
      ? `${api.baseURL()}/API/EmployeesAPI/Update/${employee.employeeID}`
      : `${api.baseURL()}/API/EmployeesAPI/Create`,
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
      console.log("Here is the value of the body being sent:");
      console.log(JSON.stringify(formData)); // Log the body here
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || t("addUpdateEmployee.addUpdateError")
        );
      }

      const result = await response.json();
      setSuccess(true);
      showAlert(t("addUpdateEmployee.addUpdateSuccess"), "success");
      refreshEmployees();
      handleClose();
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
                {t("addUpdateEmployee.userName")}
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
                {t("addUpdateEmployee.password")}
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
                {t("addUpdateEmployee.email")}
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
                {t("addUpdateEmployee.phone")}
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
                {t("addUpdateEmployee.role")}
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                {" "}
                {formData.role &&
                  formData.role !== "Admin" &&
                  formData.role !== "Marketing" && (
                    <option value={formData.role}>{formData.role}</option>
                  )}
                <option value="Admin">{t("addUpdateEmployee.admin")}</option>
                <option value="Marketing">
                  {t("addUpdateEmployee.marketing")}
                </option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("addUpdateEmployee.isActive")}
              </label>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-2 leading-tight"
              />
              <span className="text-sm">
                {t("addUpdateEmployee.activeEmployee")}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
              type="submit"
              className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading
                ? isUpdateEmployee
                  ? t("addUpdateEmployee.updating")
                  : t("addUpdateEmployee.adding")
                : isUpdateEmployee
                ? t("addUpdateEmployee.updateEmployee")
                : t("addUpdateEmployee.addEmployee")}
            </button>
            <button
              className="ml-96 mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleClose}
            >
              {t("addUpdateEmployee.close")}
            </button>
          </div>
          {error && <div className="text-red-600 mt-4">{error}</div>}
          {success && (
            <div className="text-green-600 mt-4">
              {isUpdateEmployee
                ? t("addUpdateEmployee.updateSuccess")
                : t("addUpdateEmployee.addSuccess")}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
