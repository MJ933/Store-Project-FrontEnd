import React, { useEffect, useState } from "react";
import API from "../../Classes/clsAPI";
import { useTranslation } from "react-i18next";
import { handleError } from "../../utils/handleError";

const DeleteCategory = ({
  category = {},
  isShow,
  onClose,
  showAlert,
  refreshCategories,
}) => {
  const [categoryID, setCategoryID] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (category?.categoryID) {
      setCategoryID(category.categoryID);
    }
  }, [category]);

  const api = new API();

  const handleDeleteCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!categoryID) {
      setError(t("deleteCategory.categoryIdRequiredError"));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${api.baseURL()}/API/CategoriesAPI/Delete/${categoryID}`,
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
      showAlert(t("deleteCategory.categoryDeleteSuccess"), "success");
      refreshCategories(); // Refresh the category list
      onClose(); // Close the modal
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            {t("deleteCategory.deleteCategoryTitle")}
          </h2>
          <button
            onClick={onClose}
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

        <form onSubmit={handleDeleteCategory} className="px-8 py-6 gap-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
              {t("deleteCategory.categoryIdLabel")}
            </label>
            <input
              type="number"
              value={categoryID}
              onChange={(e) => setCategoryID(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
              placeholder={t("deleteCategory.categoryIdPlaceholder")}
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors"
            >
              {t("deleteCategory.cancelButton")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 m-3 h-5 w-5 text-white"
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
                  {t("deleteCategory.deletingButton")}
                </span>
              ) : (
                t("deleteCategory.deleteCategoryButton")
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
              <span>{t("deleteCategory.categoryDeleteSuccess")}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default DeleteCategory;
