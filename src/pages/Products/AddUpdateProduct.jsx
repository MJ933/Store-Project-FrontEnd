import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../Classes/clsAPI";

export default function AddNewUpdateProduct({
  product = { product: {}, image: {} },
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
  const isUpdateImage = Boolean(product?.image);
  const api = new API();

  const initialFormData = {
    productID: product?.product?.productID || 1,
    productName: product?.product?.productName || "1",
    initialPrice: product?.product?.initialPrice || 1,
    sellingPrice: product?.product?.sellingPrice || 1,
    description: product?.product?.description || "1",
    categoryID: product?.product?.categoryID || 1,
    stockQuantity: product?.product?.stockQuantity || 1,
    isActive: product?.product?.isActive || true,
    imageFile: product?.image?.imageFile || null,
    isPrimary: product?.image?.isPrimary || false,
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    setFormData({
      productID: product?.product?.productID || 1,
      productName: product?.product?.productName || "1",
      initialPrice: product?.product?.initialPrice || 1,
      sellingPrice: product?.product?.sellingPrice || 1,
      description: product?.product?.description || "1",
      categoryID: product?.product?.categoryID || 1,
      stockQuantity: product?.product?.stockQuantity || 1,
      isActive: product?.product?.isActive || true,
      imageFile: product?.image?.imageFile || null,
      isPrimary: product?.image?.isPrimary || false,
    });
  }, [product]);

  const apiConfig = {
    methodProduct: isUpdateProduct ? "Put" : "Post",
    routeProduct: isUpdateProduct ? "update" : "create",
    urlProduct: isUpdateProduct
      ? `${api.baseURL()}/API/ProductsAPI/update/${product.product.productID}`
      : `${api.baseURL()}/API/ProductsAPI/create`,
    methodImage: isUpdateImage ? "Put" : "Post",
    routeImage: isUpdateImage ? "update" : "create",
    urlImage: isUpdateImage
      ? `${api.baseURL()}/API/ImagesAPI/update/${product?.image?.imageID}/${
          formData.isPrimary
        }`
      : `${api.baseURL()}/API/ImagesAPI/create/${formData.productID}/${
          formData.isPrimary
        }`,
  };

  const handleChange = (e) => {
    const { name, value, files, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
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
        const errorData = await productResponse.json();
        throw new Error(
          errorData.message || "Failed to Add/update the product"
        );
      }

      const productResult = await productResponse.json();
      if (isUpdateImage)
        apiConfig.urlImage = `${api.baseURL()}/API/ImagesAPI/update/${
          product.image.imageID
        }/${formData.isPrimary}`;
      else
        apiConfig.urlImage = `${api.baseURL()}/API/ImagesAPI/create/${
          productResult.productID
        }/${formData.isPrimary}`;

      if (formData.imageFile) {
        const formDataImage = new FormData();
        formDataImage.append("imageFile", formData.imageFile);
        const imageResponse = await fetch(apiConfig.urlImage, {
          method: apiConfig.methodImage,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formDataImage,
        });

        if (!imageResponse.ok) {
          throw new Error("Failed to Add/update image");
        }

        const imageResult = await imageResponse.json();
        console.log("Image Added/updated successfully:", imageResult);
      }

      setSuccess(true);
      showAlert("Product Added/Updated Successfully", "success");
      refreshProducts();
      handleClose();
    } catch (error) {
      setError(error.message);
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

  return (
    <div className="fixed inset-0 overflow-y-auto bg-white z-50 px-4 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-3 sm:p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <input type="hidden" name="productID" value={formData.productID} />

          {/* Product Name */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Product Name
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
              Initial Price
            </label>
            <input
              type="number"
              name="initialPrice"
              value={formData.initialPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          <div className="col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Selling Price
            </label>
            <input
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          {/* Description */}
          <div className="col-span-2 md:col-span-3">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
              maxLength={1000}
              rows="3"
              required
            />
          </div>

          {/* Images */}
          {isUpdateProduct && (
            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Current Image
              </label>
              <div className="w-full aspect-square max-h-40 sm:max-h-none border border-gray-300 rounded-lg overflow-hidden">
                {product?.image?.imageURL ? (
                  <img
                    src={product.image.imageURL}
                    alt="Current Product"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>
            </div>
          )}

          <div className="col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              New Image Preview
            </label>
            <div className="w-full aspect-square max-h-40 sm:max-h-none border border-gray-300 rounded-lg overflow-hidden">
              {formData.imageFile ? (
                <img
                  src={URL.createObjectURL(formData.imageFile)}
                  alt="New Product"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">No Image</span>
              )}
            </div>
          </div>

          {/* Category and Stock */}
          <div className="col-span-2 md:col-span-1 space-y-2">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Category ID
              </label>
              <input
                type="number"
                name="categoryID"
                value={formData.categoryID}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Product Image
              </label>
              <input
                type="file"
                name="imageFile"
                onChange={handleChange}
                className="w-full text-sm"
                accept="image/*"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="text-sm">Product is active</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPrimary"
                checked={formData.isPrimary}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="text-sm">Primary image</span>
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
                ? "Updating..."
                : "Adding..."
              : isUpdateProduct
              ? "Update Product"
              : "Add Product"}
          </button>

          <button
            type="button"
            className="w-full sm:w-auto bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm sm:text-base"
            onClick={handleClose}
          >
            Close
          </button>
        </div>

        {error && (
          <div className="text-red-600 mt-4 text-center text-sm">{error}</div>
        )}
        {success && (
          <div className="text-green-600 mt-4 text-center text-sm">
            Product {isUpdateProduct ? "Updated" : "Added"} successfully!
          </div>
        )}
      </form>
    </div>
  );
}
