import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../Classes/clsAPI";
import { useTranslation } from "react-i18next";
import { handleError } from "../../utils/handleError";

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
        formattedRole = "Marketing";
      } else if (employee.role.toLowerCase() === "admin") {
        formattedRole = "Admin";
      } else {
        formattedRole = employee.role;
      }
    }

    setFormData({
      employeeID: employee?.employeeID || 0,
      userName: employee?.userName || "",
      password: employee?.password || "",
      email: employee?.email || "",
      phone: employee?.phone || "",
      role: formattedRole,
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
      console.log(JSON.stringify(formData));
      if (!response.ok) {
        const errorData = await response.text();
        let parsedError;
        try {
          parsedError = JSON.parse(errorData);
        } catch {
          parsedError = { message: errorData };
        }
        const error = {
          response: {
            status: response.status,
            data: parsedError,
          },
        };
        throw error;
      }
      const result = await response.json();
      setSuccess(true);
      showAlert(t("addUpdateEmployee.addUpdateSuccess"), "success");
      refreshEmployees();
      handleClose();
    } catch (error) {
      handleError(error);
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
    <div className="mb-8 px-4">
      {isShow && (
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md"
        >
          <h3
            className="mb-4 text-center font-medium text-gray-900"
            style={{ fontSize: "calc(1em + 1vw)" }}
          >
            {t("addUpdateEmployee.addUpdateEmployee")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="hidden"
              name="employeeID"
              value={formData.employeeID}
            />
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("addUpdateEmployee.employeeID")}
              </label>
              <input
                type="number"
                name="employeeID"
                value={formData.employeeID}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
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
            <div>
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
            <div>
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
            <div>
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
            <div>
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
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-2 leading-tight"
              />
              <label className="text-gray-700 text-sm font-bold">
                {t("addUpdateEmployee.activeEmployee")}
              </label>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between mt-6">
            <button
              type="submit"
              className="w-full md:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
              type="button"
              className="w-full md:w-auto mt-4 md:mt-0 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline md:ml-4"
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
