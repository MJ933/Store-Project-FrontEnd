import React, { useState } from "react";
import API from "../../Classes/clsAPI";

export default function AddNewCategory() {
  const [formData, setFormData] = useState({
    categoryName: "",
    parentCategoryID: "",
    isActive: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const api = new API();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    console.log("Form Data:", formData); // Log form data

    try {
      const response = await fetch(`${api.baseURL()}API/CategoriesAPI/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          categoryName: formData.categoryName,
          parentCategoryID: formData.parentCategoryID
            ? parseInt(formData.parentCategoryID, 10)
            : null, // Use 0 as default
          isActive: formData.isActive,
        }),
      });

      console.log("Response:", response); // Log response

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        throw new Error(
          errorData.errors?.CategoryName?.[0] ||
            errorData.message ||
            "Network response was not ok"
        );
      }

      const data = await response.json();
      console.log("Success Data:", data); // Log success data
      setSuccess(true);
      setFormData({
        categoryName: "",
        parentCategoryID: "",
        isActive: false, // Reset to false
      });
    } catch (error) {
      console.error("Error:", error); // Log error
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="categoryName"
          >
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="parentCategoryID"
          >
            Parent Category ID
          </label>
          <input
            type="number"
            id="parentCategoryID"
            name="parentCategoryID"
            value={formData.parentCategoryID}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="isActive"
          >
            Is Active
          </label>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="mr-2 leading-tight"
          />
          <span className="text-sm">Mark this category as active</span>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </div>
        {error && <div className="text-red-600 mt-4">{error}</div>}
        {success && (
          <div className="text-green-600 mt-4">
            Category added successfully!
          </div>
        )}
      </form>
    </div>
  );
}
