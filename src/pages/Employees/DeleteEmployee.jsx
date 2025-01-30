import React, { useEffect, useState } from "react";
import API from "../../Classes/clsAPI";
import { useTranslation } from "react-i18next";

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
        if (response.status === 404) {
          throw new Error(t("deleteEmployee.notFoundError"));
        } else {
          throw new Error(t("deleteEmployee.deleteFailedError"));
        }
      }

      setSuccess(true);
      showAlert(t("deleteEmployee.deleteSuccess"), "success");
      refreshEmployees();
      onClose();
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
          <h2 className="text-2xl font-bold text-gray-800">
            {t("deleteEmployee.title")}
          </h2>
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
        <form onSubmit={handleDeleteEmployee} className="gap-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              {t("deleteEmployee.employeeIDLabel")}
            </label>
            <input
              type="number"
              value={employeeID}
              onChange={(e) => setEmployeeID(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("deleteEmployee.employeeIDPlaceholder")}
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
            >
              {t("deleteEmployee.cancelButton")}
            </button>
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
              disabled={loading}
            >
              {loading
                ? t("deleteEmployee.deletingButton")
                : t("deleteEmployee.deleteButton")}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {t("deleteEmployee.deleteSuccess")}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default DeleteEmployee;
