import React, { useEffect, useState } from "react";
import { use } from "react";
import API from "../../Classes/clsAPI";
import { useTranslation } from "react-i18next";

const DeleteProduct = ({
  product = { product: {}, image: {} },
  isShow,
  onClose,
  showAlert,
  refreshProducts,
}) => {
  const [productID, setProductID] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const api = new API();
  const { t } = useTranslation();

  useEffect(() => {
    if (product?.product?.productID) {
      setProductID(product.product.productID);
    }
  }, [product]); // Watch for changes in the product prop

  const handleDeleteProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!productID) {
      setError(t("deleteProduct.enterProductID"));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${api.baseURL()}/API/ProductsAPI/Delete/${productID}`,
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
          throw new Error(t("deleteProduct.productNotFound"));
        } else {
          throw new Error(t("deleteProduct.deleteFailed"));
        }
      }

      setSuccess(true);
      showAlert(t("deleteProduct.deleteSuccess"), "success");
      refreshProducts();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {t("deleteProduct.deleteProductTitle")}
        </h1>
        <form onSubmit={handleDeleteProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("deleteProduct.productIDLabel")}
            </label>
            <input
              type="number"
              value={productID}
              onChange={(e) => setProductID(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("deleteProduct.productIDPlaceholder")}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={loading}
          >
            {loading
              ? t("deleteProduct.deletingButton")
              : t("deleteProduct.deleteProductButton")}
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={onClose}
          >
            {t("deleteProduct.closeButton")}
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
              {t("deleteProduct.deleteSuccess")}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default DeleteProduct;
