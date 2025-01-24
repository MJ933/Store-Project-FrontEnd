import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../Classes/clsAPI";

export default function AddNewUpdateProduct({
  product = { product: {}, image: {} },
  isShow,
  onClose,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  // Determine if this is an update or a new product
  const isUpdateProduct = Boolean(product?.product);
  const isUpdateImage = Boolean(product?.image);
  const api = new API();

  // Initialize form data based on the `product` prop
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
  // API configuration based on whether it's an update or a new product
  const apiConfig = {
    methodProduct: isUpdateProduct ? "Put" : "Post",
    routeProduct: isUpdateProduct ? "update" : "create",
    urlProduct: isUpdateProduct
      ? `${api.baseURL()}API/ProductsAPI/update/${product.product.productID}`
      : `${api.baseURL()}API/ProductsAPI/create`,
    methodImage: isUpdateImage ? "Put" : "Post",
    routeImage: isUpdateImage ? "update" : "create",
    urlImage: isUpdateImage
      ? `${api.baseURL()}API/ImagesAPI/update/${product?.image?.imageID}/${
          formData.isPrimary
        }`
      : `${api.baseURL()}API/ImagesAPI/create/${formData.productID}/${
          formData.isPrimary
        }`,
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Submit product data
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
        apiConfig.urlImage = `${api.baseURL()}API/ImagesAPI/update/${
          product.image.imageID
        }/${formData.isPrimary}`;
      else
        apiConfig.urlImage = `${api.baseURL()}API/ImagesAPI/create/${
          productResult.productID
        }/${formData.isPrimary}`;
      // Submit image data if an image file is provided
      if (formData.imageFile) {
        const formDataImage = new FormData();
        formDataImage.append("imageFile", formData.imageFile);
        const imageResponse = await fetch(apiConfig.urlImage, {
          method: apiConfig.methodImage,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add Authorization header
          },
          body: formDataImage,
        });

        if (!imageResponse.ok) {
          throw new Error("Failed to Add/update image");
        }

        const imageResult = await imageResponse.json();
        console.log("Image Added/updated successfully:", imageResult);
      }

      // Show success message and trigger callback
      setSuccess(true);
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
    <div className="mb-8">
      {
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md"
        >
          <div className="grid grid-cols-3 gap-4">
            <input type="hidden" name="productID" value={formData.productID} />

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Initial Price
              </label>
              <input
                type="number"
                name="initialPrice"
                value={formData.initialPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                maxLength={1000}
                required
              />
            </div>

            {isUpdateProduct && (
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Current Image
                </label>
                <div className="w-32 h-32 border border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  {product?.image?.imageURL ? (
                    <img
                      src={product.image.imageURL}
                      alt="Current Product"
                      className="max-w-full max-h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
              </div>
            )}

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Category ID
              </label>
              <input
                type="number"
                name="categoryID"
                value={formData.categoryID}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                New Product Image
              </label>
              <input
                type="file"
                name="imageFile"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                accept="image/*"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Is Active
              </label>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-2 leading-tight"
              />
              <span className="text-sm">Product is active</span>
            </div>

            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Set as Primary Image
              </label>
              <input
                type="checkbox"
                name="isPrimary"
                checked={formData.isPrimary}
                onChange={handleChange}
                className="mr-2 leading-tight"
              />
              <span className="text-sm">Mark this image as primary</span>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                New Image
              </label>
              <div className="w-32 h-32 border border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                {formData.imageFile ? (
                  <img
                    src={URL.createObjectURL(formData.imageFile)}
                    alt="New Product"
                    className="max-w-full max-h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
          </div>

          {error && <div className="text-red-600 mt-4">{error}</div>}
          {success && (
            <div className="text-green-600 mt-4">
              Product {isUpdateProduct ? "Updated" : "Added"} successfully!
            </div>
          )}
        </form>
      }
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
