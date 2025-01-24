import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../Classes/clsAPI";

export default function AddUpdateCategory({ category = {}, isShow, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const isUpdateCategory = Boolean(category?.categoryID);

  const [formData, setFormData] = useState({
    categoryName: category?.categoryName || "",
    parentCategoryID: category?.parentCategoryID || "",
    isActive: category?.isActive || true,
  });

  useEffect(
    () => {
      // if (isUpdateCategory) {
      setFormData({
        categoryName: category?.categoryName || "",
        parentCategoryID: category?.parentCategoryID || "",
        isActive: category?.isActive || true,
      });
    },
    // }
    [category]
  );
  const api = new API();

  const apiConfig = {
    methodCategory: isUpdateCategory ? "Put" : "Post",
    urlCategory: isUpdateCategory
      ? `${api.baseURL()}API/CategoriesAPI/Update/${category.categoryID}`
      : `${api.baseURL()}API/CategoriesAPI/Create`,
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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

    console.log("Form Data:", formData); // Log form data

    try {
      const response = await fetch(apiConfig.urlCategory, {
        method: apiConfig.methodCategory,
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
    } catch (error) {
      console.error("Error:", error); // Log error
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    console.log(onClose);
    if (onClose) {
      onClose();
    } else {
      navigate("/");
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
            value={formData.parentCategoryID || ""}
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
            {loading
              ? isUpdateCategory
                ? "Updating..."
                : "Adding..."
              : isUpdateCategory
              ? "Update Category"
              : "Add Category"}
          </button>
        </div>
        {error && <div className="text-red-600 mt-4">{error}</div>}
        {success && (
          <div className="text-green-600 mt-4">
            Category {isUpdateCategory ? "Updated" : "Added"} successfully!
          </div>
        )}
      </form>
      <div>
        <button
          className="ml-96 mt-10 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
