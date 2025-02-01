import React, { useState } from "react";
import ProductPage from "./ProductPage"; // Import the ProductPage component
import AddNewUpdateProduct from "./AddUpdateProduct";
import API from "../../Classes/clsAPI";
import { handleError } from "../../utils/handleError";

export default function FindProduct() {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState({ product: null, image: null });
  const [error, setError] = useState("");
  const [showProductPage, setShowProductPage] = useState(false); // Initially false to hide ProductPage
  const [showUpdatePage, setShowUpdatePage] = useState(false);
  const api = new API();

  const handleFindProduct = async (e) => {
    e.preventDefault();

    if (!productId) {
      setError("Please enter a product ID.");
      return;
    }

    try {
      const response = await fetch(
        `${api.baseURL()}/API/ProductsAPI/FindAndImageByProductID/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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

      const data = await response.json();
      if (!data || !data.product) {
        throw new Error("Enter a correct Product ID.");
      }
      console.log("Product Data:", data);
      setProduct(data); // Set the product data
      setError(""); // Clear any previous errors
      setShowProductPage(true); // Show the ProductPage
      setShowUpdatePage(false); // Ensure UpdateProduct is hidden
    } catch (err) {
      handleError(err);
      setProduct({ product: null, image: null }); // Reset product state on error
      setShowProductPage(false); // Hide ProductPage on error
    }
  };

  const handleUpdate = () => {
    setShowUpdatePage((prev) => !prev); // Toggle UpdateProduct visibility
  };
  const handleCloseProductPage = () => {
    setShowProductPage(false); // Toggle ProductPage visibility
  };
  const handleCloseUpdate = () => {
    setShowUpdatePage(false); // Toggle UpdateProduct visibility
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleFindProduct} className="gap-y-4">
        <div>
          <label
            htmlFor="productId"
            className="block text-sm font-medium text-gray-700"
          >
            Product ID:
          </label>
          <input
            type="number"
            id="productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            min="1"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Find Product
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {product && product.product && showProductPage && !showUpdatePage && (
        <div>
          <ProductPage
            product={product}
            isShow={showProductPage}
            onClose={handleCloseProductPage}
          />
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-sm sm:text-base mt-4"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      )}

      {product && product.product && showUpdatePage && (
        <div>
          <AddNewUpdateProduct
            product={product}
            isShow={showUpdatePage}
            onClose={handleCloseUpdate}
          />
        </div>
      )}
    </div>
  );
}
