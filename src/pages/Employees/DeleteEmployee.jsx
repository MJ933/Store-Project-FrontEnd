import React, { useEffect, useState } from "react";
import API from "../../Classes/clsAPI";
import { useTranslation } from "react-i18next";
import { handleError } from "../../utils/handleError";

const DeleteEmployee = ({
  employee = {},
  isShow,
  onClose,
  showAlert,
  refreshEmployees,
}) => {
  const [employeeID, setEmployeeID] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const api = new API();
  const { t } = useTranslation();

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
      setError(t("deleteEmployee.enterIDError"));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${api.baseURL()}/API/EmployeesAPI/Delete/${employeeID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.text(); // First get as text
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

      setSuccess(true);
      showAlert(t("deleteEmployee.deleteSuccess"), "success");
      refreshEmployees();
      onClose();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isShow) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full transform transition-all duration-300 ease-in-out relative">
        {/* Close Button for Mobile */}
        <button
          onClick={onClose}
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
          {t("deleteEmployee.title")}
        </h2>

        {/* Form */}
        <form onSubmit={handleDeleteEmployee} className="space-y-6">
          {/* Employee ID Input */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              {t("deleteEmployee.employeeIDLabel")}
            </label>
            <input
              type="number"
              value={employeeID}
              onChange={(e) => setEmployeeID(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t("deleteEmployee.employeeIDPlaceholder")}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-all duration-300 focus:outline-none"
            >
              {t("deleteEmployee.cancelButton")}
            </button>
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 focus:outline-none"
              disabled={loading}
            >
              {loading
                ? t("deleteEmployee.deletingButton")
                : t("deleteEmployee.deleteButton")}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {t("deleteEmployee.deleteSuccess")}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default DeleteEmployee;
