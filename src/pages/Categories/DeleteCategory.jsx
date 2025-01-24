import React, { useEffect, useState } from "react";
import { use } from "react";
import API from "../../Classes/clsAPI";

const DeleteCategory = ({ category = {}, isShow, onClose }) => {
  const [categoryID, setCategoryID] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (category?.categoryID) {
      setCategoryID(category.categoryID);
    }
  }, [category]); // Watch for changes in the category prop
  const api = new API();

  const handleDeleteCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    console.log("categoryID:", categoryID);
    if (!categoryID) {
      setError("Please enter a category ID.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${api.baseURL()}API/CategoriesAPI/Delete/${categoryID}`,
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
            "category not found. Please check the ID and try again."
          );
        } else {
          throw new Error("Failed to delete the category.");
        }
      }

      setSuccess(true);
      setCategoryID(""); // Reset the input field
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Delete category</h1>
        <form onSubmit={handleDeleteCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              category ID:
            </label>
            <input
              type="number"
              value={categoryID}
              onChange={(e) => setCategoryID(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter category ID"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete category"}
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={onClose}
          >
            Close
          </button>
          {/* Display error message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Display success message */}
          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
              category deleted successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default DeleteCategory;
