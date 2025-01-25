import React, { useEffect, useState } from "react";
import API from "../../Classes/clsAPI";

const ShowAllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const api = new API();

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${api.baseURL()}/API/CategoriesAPI/GetAll`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = () => {
    // Implement create functionality
    console.log("Create button clicked");
  };

  const handleRead = (categoryID) => {
    // Implement read functionality
    console.log("Read button clicked for categoryID:", categoryID);
  };

  const handleUpdate = (categoryID) => {
    // Implement update functionality
    console.log("Update button clicked for categoryID:", categoryID);
  };

  const handleDelete = (categoryID) => {
    // Implement delete functionality
    console.log("Delete button clicked for categoryID:", categoryID);
  };

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        Categories List
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base">
                Category ID
              </th>
              <th className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base">
                Category Name
              </th>
              <th className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base">
                Parent Category ID
              </th>
              <th className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base">
                Is Active
              </th>
              <th className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((item) => {
              if (!item) {
                return null;
              }
              return (
                <tr key={item.categoryID} className="hover:bg-gray-50">
                  <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                    {item.categoryID}
                  </td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                    {item.categoryName}
                  </td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                    {item.parentCategoryID}
                  </td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                    {item.isActive ? "Yes" : "No"}
                  </td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4 border-b">
                    <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                      <button
                        onClick={() => handleRead(item.categoryID)}
                        className="bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-blue-600 text-sm sm:text-base"
                      >
                        Read
                      </button>
                      <button
                        onClick={() => handleUpdate(item.categoryID)}
                        className="bg-green-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-green-600 text-sm sm:text-base"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(item.categoryID)}
                        className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-red-600 text-sm sm:text-base"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={handleCreate}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-sm sm:text-base"
        >
          Create New Category
        </button>
      </div>
    </div>
  );
};

export default ShowAllCategories;
