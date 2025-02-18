import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../Classes/clsAPI";
import { useTranslation } from "react-i18next";
import { handleError } from "../../utils/handleError";
import CategorySelector from "../Categories/CategorySelector";

export default function AddNewUpdateProduct({
  product,
  isShow,
  onClose,
  showAlert,
  refreshProducts,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const isUpdateProduct = Boolean(product?.product);
  const api = new API();
  const { t } = useTranslation();
  const { i18n: i18nInstance } = useTranslation();
  const [isArabic, setIsArabic] = useState(false);
  const initialFormData = {
    productID: product?.product?.productID || 1,
    productName: product?.product?.productName || "a",
    initialPrice: product?.product?.initialPrice || 1,
    sellingPrice: product?.product?.sellingPrice || 1,
    description: product?.product?.description || "a",
    categoryID: product?.product?.categoryID || 1,
    stockQuantity: product?.product?.stockQuantity || 1,
    isActive: product?.product?.isActive || true,
    images: product?.images || [], // Array to handle multiple images
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    setFormData(initialFormData);
  }, [product]);

  const apiConfig = {
    methodProduct: isUpdateProduct ? "Put" : "Post",
    routeProduct: isUpdateProduct ? "update" : "create",
    urlProduct: isUpdateProduct
      ? `${api.baseURL()}/API/ProductsAPI/update/${product.product.productID}`
      : `${api.baseURL()}/API/ProductsAPI/create`,
  };

  const handleChange = (e) => {
    const { name, value, files, checked, type } = e.target;

    if (type === "file") {
      const newImages = Array.from(files).map((file) => ({
        imageFile: file,
        isPrimary: formData.images.length === 0, // Make first image primary if no images exist
        imageURL: URL.createObjectURL(file),
      }));

      setFormData({
        ...formData,
        images: [...formData.images, ...newImages],
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // Function to remove an image from the array
  const [pendingChanges, setPendingChanges] = useState({
    removedImageIds: [],
    primaryImageId: null,
  });

  // Modify the remove and setPrimary handlers
  const handleRemoveImage = (index) => {
    const imageToRemove = formData.images[index];

    if (imageToRemove.imageID) {
      setPendingChanges((prev) => ({
        ...prev,
        removedImageIds: [...prev.removedImageIds, imageToRemove.imageID],
      }));
    }

    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSetPrimary = (index) => {
    const imageToSetPrimary = formData.images[index];
    const isCurrentlyPrimary = imageToSetPrimary.isPrimary;

    if (isCurrentlyPrimary) {
      // Unset primary if it's already primary
      setPendingChanges((prev) => ({
        ...prev,
        primaryImageId: null, // or keep the previous primary image id if needed to unset in backend explicitly
      }));
      setFormData({
        ...formData,
        images: formData.images.map((image, i) => ({
          ...image,
          isPrimary: i === index ? false : image.isPrimary, // Keep other images' primary status
        })),
      });
    } else {
      // Set primary if it's not primary
      if (imageToSetPrimary.imageID) {
        setPendingChanges((prev) => ({
          ...prev,
          primaryImageId: imageToSetPrimary.imageID,
        }));
      }
      setFormData({
        ...formData,
        images: formData.images.map((image, i) => ({
          ...image,
          isPrimary: i === index,
        })),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Update product details
      const productResponse = await fetch(apiConfig.urlProduct, {
        method: apiConfig.methodProduct,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          productID: formData.productID,
          productName: formData.productName,
          initialPrice: parseFloat(formData.initialPrice),
          sellingPrice: parseFloat(formData.sellingPrice),
          description: formData.description,
          categoryID: parseInt(formData.categoryID, 10),
          stockQuantity: parseInt(formData.stockQuantity, 10),
          isActive: formData.isActive,
        }),
      });

      if (!productResponse.ok) {
        const errorData = await productResponse.text(); // First get as text
        let parsedError;

        try {
          parsedError = JSON.parse(errorData);
        } catch {
          parsedError = { message: errorData };
        }

        const error = {
          response: {
            status: productResponse.status,
            data: parsedError,
          },
        };
        throw error;
      }

      const productResult = await productResponse.json();
      const productID = isUpdateProduct
        ? formData.productID
        : productResult.productID;
      // console.log("this product id: ", productResult);
      // Process removed images
      for (const imageId of pendingChanges.removedImageIds) {
        const response = await fetch(
          `${api.baseURL()}/API/ImagesAPI/Delete/${imageId}`,
          {
            method: "DELETE",
            headers: {
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
      }

      // Inside handleSubmit, modify the image processing loop:
      for (const image of formData.images) {
        if (image.imageID) {
          // Only handle existing images
          // Update isPrimary status for each image
          const response = await fetch(
            `${api.baseURL()}/API/ImagesAPI/UpdateIsPrimaryState/${
              image.imageID
            }/${image.isPrimary}`,
            {
              method: "PUT",
              headers: {
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
        }
      }

      // Upload or update each image
      // Inside handleSubmit, replace the image upload/update loop with:
      for (const image of formData.images) {
        const formDataImage = new FormData();

        // Case 1: Existing image that needs updating
        if (image.imageID) {
          if (image.imageFile) {
            // Only update if there's a new file
            formDataImage.append("imageFile", image.imageFile);
            const imageResponse = await fetch(
              `${api.baseURL()}/API/ImagesAPI/update/${image.imageID}/${
                image.isPrimary
              }`,
              {
                method: "Put",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formDataImage,
              }
            );

            if (!imageResponse.ok) {
              const errorData = await imageResponse.text(); // First get as text
              let parsedError;

              try {
                parsedError = JSON.parse(errorData);
              } catch {
                parsedError = { message: errorData };
              }

              const error = {
                response: {
                  status: imageResponse.status,
                  data: parsedError,
                },
              };
              throw error;
            }
          }
        }
        // Case 2: New image that needs to be created
        else if (image.imageFile) {
          formDataImage.append("imageFile", image.imageFile);
          const imageResponse = await fetch(
            `${api.baseURL()}/API/ImagesAPI/create/${productID}/${
              image.isPrimary
            }`,
            {
              method: "Post",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: formDataImage,
            }
          );

          if (!imageResponse.ok) {
            const errorData = await imageResponse.text(); // First get as text
            let parsedError;

            try {
              parsedError = JSON.parse(errorData);
            } catch {
              parsedError = { message: errorData };
            }

            const error = {
              response: {
                status: imageResponse.status,
                data: parsedError,
              },
            };
            throw error;
          }
        }
      }

      setSuccess(true);
      showAlert(t("addNewUpdateProduct.productUpdateSuccess"), "success");
      refreshProducts();
      handleClose();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };
  useEffect(() => {
    // Apply notranslate class immediately when component mounts
    document.documentElement.classList.add("notranslate");

    const lang = i18nInstance.language;
    if (lang === "ar") {
      setIsArabic(true);
    } else {
      setIsArabic(false);
    }
  }, [i18nInstance.language]);

  const fetchPaginatedCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
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

  return (
    <div className="  inset-0 overflow-y-auto bg-white z-50 px-4 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-3 sm:p-6 rounded-lg shadow-md"
      >
        <h3
          className="m-4 text-center font-medium text-gray-900"
          style={{
            fontSize: "calc(1em + 1vw)", // Responsive font size
          }}
        >
          {t("addNewUpdateProduct.addNewUpdateProduct")}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <input type="hidden" name="productID" value={formData.productID} />
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t("addNewUpdateProduct.productID")}
            </label>
            <input
              type="number"
              name="productID"
              value={formData.productID}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Product Name */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t("addNewUpdateProduct.productNameLabel")}
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          {/* Prices */}
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t("addNewUpdateProduct.initialPriceLabel")}
            </label>
            <div className="relative">
              <span
                className={`absolute inset-y-0 ${
                  isArabic ? "left-0" : "right-0"
                }   p-3 flex items-center text-gray-500  `}
              >
                {t("Currency")}
              </span>
              <input
                type="number"
                name="initialPrice"
                value={formData.initialPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                required
                min={1}
                step="0.01"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t("addNewUpdateProduct.sellingPriceLabel")}
            </label>
            <div className="relative">
              <span
                className={`absolute inset-y-0 ${
                  isArabic ? "left-0" : "right-0"
                }   p-3 flex items-center text-gray-500  `}
              >
                {t("Currency")}
              </span>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                required
                min={1}
                step="0.01"
              />
            </div>
          </div>

          {/* Description */}
          <div className="col-span-2 md:col-span-3">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t("addNewUpdateProduct.descriptionLabel")}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
              maxLength={1000}
              rows="3"
              required
              minLength={1}
            />
          </div>

          {/* Images */}
          <div className="col-span-2 md:col-span-3">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t("addNewUpdateProduct.imagesLabel")}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.imageURL}
                    alt={`Product image ${index + 1}`}
                    className="w-full aspect-square object-cover border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 
                    rounded-full text-[calc(0.2em+1vw)] sm:text-xs"
                  >
                    X
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    className={`absolute bottom-1 left-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 
                      rounded-full text-[calc(0.25em+1vw)] sm:text-xs ${
                        image.isPrimary ? "bg-green-500" : ""
                      }`}
                  >
                    {image.isPrimary
                      ? t("addNewUpdateProduct.primaryLabel")
                      : t("addNewUpdateProduct.setPrimaryLabel")}
                  </button>
                </div>
              ))}
              {/* Input to add more images */}
              <div className="flex items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg">
                <label
                  htmlFor="imageFiles"
                  className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    <p className="mt-1 text-sm text-gray-500">
                      {t("addNewUpdateProduct.addImagesLabel")}
                    </p>
                  </div>
                  <input
                    id="imageFiles"
                    type="file"
                    name="imageFiles"
                    onChange={handleChange}
                    className="hidden"
                    accept="image/*"
                    multiple
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Category and Stock */}
          <div className="col-span-2 md:col-span-1 gap-y-2">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("addNewUpdateProduct.CurrentCategory")}
              </label>
              <input
                type="text"
                name="CurrentCategory"
                value={category}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                readOnly
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("addNewUpdateProduct.NewCategory")}
              </label>
              <CategorySelector
                onCategorySelect={(categoryID) => {
                  setFormData({
                    ...formData,
                    categoryID: categoryID, // Update the categoryID in formData
                  });
                }}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("addNewUpdateProduct.stockQuantityLabel")}
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                required
                min={1}
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="col-span-2 md:col-span-1 gap-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="text-sm">
                {t("addNewUpdateProduct.productIsActiveLabel")}
              </span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm sm:text-base"
            disabled={loading}
          >
            {loading
              ? isUpdateProduct
                ? t("addNewUpdateProduct.updatingButton")
                : t("addNewUpdateProduct.addingButton")
              : isUpdateProduct
              ? t("addNewUpdateProduct.updateProductButton")
              : t("addNewUpdateProduct.addProductButton")}
          </button>

          <button
            type="button"
            className="w-full sm:w-auto bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm sm:text-base"
            onClick={handleClose}
          >
            {t("addNewUpdateProduct.closeButton")}
          </button>
        </div>

        {error && (
          <div className="text-red-600 mt-4 text-center text-sm">{error}</div>
        )}
        {success && (
          <div className="text-green-600 mt-4 text-center text-sm">
            {t("addNewUpdateProduct.productUpdateSuccess")}
          </div>
        )}
      </form>
    </div>
  );
}
