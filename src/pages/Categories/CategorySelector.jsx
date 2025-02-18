import React, { useState, useEffect } from "react";
import API from "../../Classes/clsAPI";
import Pagination from "../../components/Pagination";
import { useTranslation } from "react-i18next";

const CategorySelector = ({ onCategorySelect }) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false); // Controls dropdown visibility
  const [selectedCategory, setSelectedCategory] = useState(null); // Tracks selected category

  // Fetch paginated and filtered categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(
        `${new API().baseURL()}/API/CategoriesAPI/GetCategoriesPaginatedWithFilters`
      );
      const params = new URLSearchParams();
      params.append("pageNumber", currentPage);
      params.append("pageSize", pageSize);
      params.append("isActive", "true"); // Only fetch active categories
      if (searchTerm) params.append("categoryName", searchTerm); // Search by category name
      url.search = params.toString();

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        let parsedError;
        try {
          parsedError = JSON.parse(errorData);
        } catch {
          parsedError = { message: errorData };
        }
        throw new Error(parsedError.message || t("categorySelector.error"));
      }

      const data = await response.json();
      setCategories(data.categoriesList);
      setTotalPages(Math.ceil(data.totalCount / pageSize));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      fetchCategories(); // Fetch categories only when the dropdown is visible
    }
  }, [currentPage, pageSize, searchTerm, showDropdown]);

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category); // Update the selected category
    onCategorySelect(category.categoryID); // Pass the categoryID to the parent component
    console.log("this is the category id", category.categoryID);
    setShowDropdown(false); // Hide the dropdown after selection
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  return (
    <div className={`w-full relative ${showDropdown ? "h-80" : "h-16"}`}>
      {/* Input Field */}
      <div
        className="w-full relative mb-4"
        onClick={() => {
          setShowDropdown((prev) => !prev);
        }} // Toggle dropdown visibility
      >
        <input
          type="text"
          placeholder={t("categorySelector.placeholder.select")}
          value={selectedCategory?.categoryName || ""}
          readOnly // Make the input read-only to prevent manual editing
          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm cursor-pointer"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Dropdown List */}
      {showDropdown && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {/* Search Input Inside Dropdown */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder={t("categorySelector.placeholder.search")}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm p-2">{error}</p>}

          {/* Categories List */}
          <div className="p-2">
            {loading ? (
              <p className="text-gray-500">{t("categorySelector.loading")}</p>
            ) : categories.length === 0 ? (
              <p className="text-gray-500">
                {t("categorySelector.noCategories")}
              </p>
            ) : (
              categories.map((category) => (
                <div
                  key={category.categoryID}
                  className={`px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                    selectedCategory?.categoryID === category.categoryID
                      ? "bg-blue-100"
                      : ""
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category.categoryName}
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
