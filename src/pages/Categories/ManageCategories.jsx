import React, { useEffect, useState, useCallback } from "react";
import AddUpdateCategory from "./AddUpdateCategory"; // Assuming this component exists
import DeleteCategory from "./DeleteCategory"; // Assuming this component exists
import API from "../../Classes/clsAPI";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showUpdateCategory, setShowUpdateCategory] = useState(false);
  const [showDeleteCategory, setShowDeleteCategory] = useState(false);
  const [showReadCategory, setShowReadCategory] = useState(false);
  const [category, setCategory] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "categoryID",
    direction: "desc",
  });
  const api = new API();

  // Fetch categories from the API
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${api.baseURL()}API/CategoriesAPI/GetALL`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories when the component mounts

  useEffect(() => {
    fetchCategories();
  }, [category, categories]);

  const handleAdd = () => {
    setShowAddCategory(true);
    setShowUpdateCategory(false);
    setShowReadCategory(false);
    setShowDeleteCategory(false);
    setCategory(null); // Reset the category state
    fetchCategories();
  };

  const handleRead = (currentCategory) => {
    setShowReadCategory(true);
    setShowAddCategory(false);
    setShowUpdateCategory(false);
    setShowDeleteCategory(false);
    setCategory(currentCategory);
  };

  const handleUpdate = (currentCategory) => {
    setShowAddCategory(false);
    setShowUpdateCategory(true);
    setShowReadCategory(false);
    setShowDeleteCategory(false);
    setCategory(currentCategory);
  };

  const handleDelete = (currentCategory) => {
    setShowReadCategory(false);
    setShowAddCategory(false);
    setShowUpdateCategory(false);
    setShowDeleteCategory(true);
    setCategory(currentCategory);
  };

  const handleCloseCRUDOperationCategory = () => {
    setShowReadCategory(false);
    setShowUpdateCategory(false);
    setShowAddCategory(false);
    setShowDeleteCategory(false);
    setCategory(null);
  };

  // Sorting function
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

  // Sort categories based on sortConfig
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

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  if (categories.length === 0) {
    return (
      <div className="text-center text-gray-600">No categories found.</div>
    );
  }

  return (
    <div>
      {showAddCategory && (
        <AddUpdateCategory
          category={null}
          isShow={showAddCategory}
          onClose={handleCloseCRUDOperationCategory}
        />
      )}
      {showUpdateCategory && (
        <AddUpdateCategory
          category={category}
          isShow={showUpdateCategory}
          onClose={handleCloseCRUDOperationCategory}
        />
      )}
      {showDeleteCategory && (
        <DeleteCategory
          category={category}
          isShow={showDeleteCategory}
          onClose={handleCloseCRUDOperationCategory}
        />
      )}
      {!showAddCategory &&
        !showUpdateCategory &&
        !showDeleteCategory &&
        !showReadCategory && (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
              Categories List
            </h1>
            <div className="mb-6 text-center">
              <button
                onClick={handleAdd}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-sm sm:text-base"
              >
                Add Category
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-100">
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("categoryID")}
                    >
                      Category ID
                      {sortConfig.key === "categoryID" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("categoryName")}
                    >
                      Category Name
                      {sortConfig.key === "categoryName" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("parentCategoryID")}
                    >
                      Parent Category ID
                      {sortConfig.key === "parentCategoryID" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("isActive")}
                    >
                      Is Active
                      {sortConfig.key === "isActive" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCategories.map((category) => (
                    <tr key={category.categoryID} className="hover:bg-gray-50">
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {category.categoryID}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {category.categoryName}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {category.parentCategoryID || "N/A"}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {category.isActive ? "Yes" : "No"}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b">
                        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                          {/* <button
                            onClick={() => handleRead(category)}
                            className="bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-blue-600 text-sm sm:text-base"
                          >
                            Read
                          </button> */}
                          <button
                            onClick={() => handleUpdate(category)}
                            className="bg-green-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-green-600 text-sm sm:text-base"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(category)}
                            className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-red-600 text-sm sm:text-base"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
};

export default ManageCategories;
