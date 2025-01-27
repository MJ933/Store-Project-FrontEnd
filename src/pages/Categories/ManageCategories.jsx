import React, { useEffect, useState, useCallback } from "react";
import AddUpdateCategory from "./AddUpdateCategory";
import DeleteCategory from "./DeleteCategory";
import { FiEye, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import API from "../../Classes/clsAPI";
import Alert from "../../components/Alert";
import ModernLoader from "../../components/ModernLoader";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "categoryID",
    direction: "desc",
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");

  const statusStyles = {
    true: "bg-green-100 text-green-800",
    false: "bg-red-100 text-red-800",
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(
        `${new API().baseURL()}/API/CategoriesAPI/GetALL`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Network response not ok");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [selectedCategory]);

  const handleView = (view, category = null) => {
    setCurrentView(view);
    setSelectedCategory(category);
  };

  const handleSort = useCallback(
    (key) => {
      let direction = "asc";
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ key, direction });
    },
    [sortConfig]
  );

  const sortedCategories = React.useMemo(() => {
    if (!sortConfig.key) return categories;

    return [...categories].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [categories, sortConfig]);

  if (loading) return <ModernLoader />;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (categories.length === 0)
    return <div className="p-4 text-gray-500">No categories found</div>;

  return (
    <div>
      <Alert
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertMessage(null)}
      />

      {currentView === null ? (
        <div className="p-4 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-xl font-semibold text-gray-800 w-full md:w-auto">
              Categories
            </h1>
            <button
              onClick={() => handleView("add")}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <FiPlus className="text-lg" />
              <span className="hidden sm:inline">New Category</span>
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "categoryID",
                    "categoryName",
                    "parentCategoryID",
                    "isActive",
                  ].map((key) => (
                    <th
                      key={key}
                      className="px-2 py-2 md:px-4 md:py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort(key)}
                    >
                      {key === "categoryID"
                        ? "category ID"
                        : key === "parentCategoryID"
                        ? "parent Category ID"
                        : key.replace(/([A-Z])/g, " $1").trim()}
                      {sortConfig.key === key && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                  ))}
                  <th className="px-2 py-2 md:px-4 md:py-3 text-left text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedCategories.map((category) => (
                  <tr key={category.categoryID} className="hover:bg-gray-50">
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-700">
                      {category.categoryID}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                      {category.categoryName}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                      {category.parentCategoryID || "N/A"}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusStyles[category.isActive] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3">
                      <div className="flex items-center gap-2 md:gap-3">
                        {/* <button
                          onClick={() => handleView("read", category)}
                          className="text-gray-600 hover:text-blue-600"
                          title="View"
                        >
                          <FiEye className="w-4 h-4 md:w-5 md:h-5" />
                        </button> */}
                        <button
                          onClick={() => handleView("update", category)}
                          className="text-gray-600 hover:text-green-600"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => handleView("delete", category)}
                          className="text-gray-600 hover:text-red-600"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          {(currentView === "add" || currentView === "update") && (
            <AddUpdateCategory
              category={currentView === "update" ? selectedCategory : null}
              isShow={true}
              onClose={() => handleView(null)}
              showAlert={showAlert}
              refreshCategories={fetchCategories}
            />
          )}

          {currentView === "delete" && (
            <DeleteCategory
              category={selectedCategory}
              isShow={true}
              onClose={() => handleView(null)}
              showAlert={showAlert}
              refreshCategories={fetchCategories}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
