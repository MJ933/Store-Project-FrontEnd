import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { handleError } from "../../utils/handleError";
import API from "../../Classes/clsAPI";

export default function DetailedProductPage({ product, onClose }) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollPositionRef = useRef(0);

  const [formData, setFormData] = useState({
    productID: "",
    productName: "",
    initialPrice: "",
    sellingPrice: "",
    description: "",
    categoryID: "",
    stockQuantity: "",
    isActive: false,
    images: [],
  });

  const fetchPaginatedCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    // scrollPositionRef.current = window.scrollY;
    try {
      const url = new URL(
        `${new API().baseURL()}/API/CategoriesAPI/GetCategoriesPaginatedWithFilters`
      );
      const params = new URLSearchParams();
      params.append("pageNumber", 1);
      params.append("pageSize", 1);
      if (product.product?.categoryID)
        params.append("categoryID", product.product?.categoryID);
      else params.append("categoryID", 0);
      url.search = params.toString();

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text(); // First get as text
        let parsedError;
        if (response.status === 404) {
          setCategory();
          setTotalCount(0);
          setTotalPages(0);
          return;
        }
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

      const data = await response.json();
      setCategory(data.categoriesList[0].categoryName);
      setTotalCount(data.totalCount);
      setTotalPages(Math.ceil(data.totalCount / pageSize));
      fetchProduct();
    } catch (err) {
      setError(err.message);
      setCategory([]);
      setTotalCount(0);
      setTotalPages(0);
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchPaginatedCategories();
  }, [fetchPaginatedCategories]);

  // Initialize form data with the product details

  useEffect(() => {
    fetchProduct();
  }, [product]);

  const fetchProduct = async (callback) => {
    if (product) {
      setFormData({
        productID: product.product?.productID || "",
        productName: product.product?.productName || "",
        initialPrice: product.product?.initialPrice || "",
        sellingPrice: product.product?.sellingPrice || "",
        description: product.product?.description || "",
        categoryID: category ? category : "",
        stockQuantity: product.product?.stockQuantity ?? "", // Use '??' here
        isActive: product.product?.isActive || false,
        images: product?.images || [],
      });
      if (callback) callback();
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      {/* Title */}
      <h3 className="text-center text-2xl font-bold mb-6">
        {t("detailedProductPage.productDetails")}
      </h3>

      {/* Responsive Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Product ID */}
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm font-bold mb-1">
            {t("detailedProductPage.productID")}
          </label>
          <p className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
            {formData.productID}
          </p>
        </div>

        {/* Product Name */}
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm font-bold mb-1">
            {t("detailedProductPage.productNameLabel")}
          </label>
          <p className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
            {formData.productName}
          </p>
        </div>

        {/* Initial Price */}
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm font-bold mb-1">
            {t("detailedProductPage.initialPriceLabel")}
          </label>
          <p className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
            {formData.initialPrice}{" "}
            <span className="text-gray-500 text-sm">{t("Currency")}</span>
          </p>
        </div>

        {/* Selling Price */}
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm font-bold mb-1">
            {t("detailedProductPage.sellingPriceLabel")}
          </label>
          <p className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
            {formData.sellingPrice}{" "}
            <span className="text-gray-500 text-sm">{t("Currency")}</span>
          </p>
        </div>

        {/* Description (spanning two columns on sm and larger) */}
        <div className="flex flex-col sm:col-span-2">
          <label className="text-gray-700 text-sm font-bold mb-1">
            {t("detailedProductPage.descriptionLabel")}
          </label>
          <p className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
            {formData.description}
          </p>
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm font-bold mb-1">
            {t("detailedProductPage.categoryIDLabel")}
          </label>
          <p className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
            {category}
          </p>
        </div>

        {/* Stock Quantity */}
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm font-bold mb-1">
            {t("detailedProductPage.stockQuantityLabel")}
          </label>
          <p className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
            {formData.stockQuantity}
          </p>
        </div>

        {/* Active Status */}
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm font-bold mb-1">
            {t("detailedProductPage.productIsActiveLabel")}
          </label>
          <p className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
            {formData.isActive
              ? t("detailedProductPage.yes")
              : t("detailedProductPage.no")}
          </p>
        </div>
      </div>

      {/* Images Section */}
      {formData.images && formData.images.length > 0 && (
        <div className="mt-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t("detailedProductPage.imagesLabel")}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative w-full h-32">
                <img
                  src={image.imageURL || image.imageUrl}
                  alt={`Product Image ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-gray-300"
                />
                {image.isPrimary && (
                  <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {t("detailedProductPage.primaryLabel")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
        >
          {t("detailedProductPage.cancel")}
        </button>
      </div>
    </div>
  );
}
