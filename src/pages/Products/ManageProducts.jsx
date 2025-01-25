import React, { useEffect, useState, useCallback } from "react";
import AddNewUpdateProduct from "./AddUpdateProduct";
import DeleteProduct from "./DeleteProduct";
import ProductPage from "./ProductPage";
import Product from "../../Classes/clsProduct";
import { FiEye, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import Alert from "../../components/Alert";
import ModernLoader from "../../components/ModernLoader";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "productID",
    direction: "desc",
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");

  const statusStyles = {
    true: "bg-green-100 text-green-800",
    false: "bg-red-100 text-red-800",
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  const fetchProducts = useCallback(async () => {
    try {
      const productInstance = new Product();
      const data = await productInstance.fetchProducts();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedProduct]);

  const handleView = (view, product = null) => {
    setCurrentView(view);
    setSelectedProduct(product);
  };

  const handleSort = useCallback(
    (key) => {
      let direction = "asc";
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ key, direction });
    },
    [sortConfig]
  );

  const sortedProducts = React.useMemo(() => {
    if (!sortConfig.key) return products;

    return [...products].sort((a, b) => {
      const aValue = a.product[sortConfig.key];
      const bValue = b.product[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [products, sortConfig]);

  if (loading) return <ModernLoader />;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (products.length === 0)
    return <div className="p-4 text-gray-500">No products found</div>;

  return (
    <div>
      <Alert
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertMessage(null)}
      />

      {currentView === null ? (
        <div className="p-4 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-xl font-semibold text-gray-800 w-full md:w-auto">
              Products
            </h1>
            <button
              onClick={() => handleView("add")}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <FiPlus className="text-lg" />
              <span className="hidden sm:inline">New Product</span>
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Id",
                    "productName",
                    // "initialPrice",
                    "sellingPrice",
                    // "categoryId",
                    "stockQuantity",
                    // "isActive",
                    "image",
                  ].map((key) => (
                    <th
                      key={key}
                      className="px-2 py-2 md:px-4 md:py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort(key)}
                    >
                      {key.replace(/([A-Z])/g, " $1").trim()}
                      {sortConfig.key === key && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                  ))}
                  <th className="px-2 py-2 md:px-4 md:py-3 text-left text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedProducts.map((item) => {
                  if (!item.product) return null;

                  return (
                    <tr
                      key={item.product.productID}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-700">
                        {item.product.productID}
                      </td>
                      <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                        {item.product.productName}
                      </td>
                      {/* <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                        ${item.product.initialPrice.toFixed(2)}
                      </td> */}
                      <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                        ${item.product.sellingPrice.toFixed(2)}
                      </td>
                      {/* <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                        {item.product.categoryID}
                      </td> */}
                      <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                        {item.product.stockQuantity}
                      </td>
                      {/* <td className="px-2 py-2 md:px-4 md:py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusStyles[item.product.isActive] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td> */}
                      <td className="px-2 py-2 md:px-4 md:py-3">
                        {item.image && item.image.isPrimary && (
                          <div className="w-12 h-12 overflow-hidden rounded-lg border border-gray-200">
                            <img
                              src={item.image.imageURL}
                              alt={item.product.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-2 md:px-4 md:py-3">
                        <div className="flex items-center gap-2 md:gap-3">
                          <button
                            onClick={() => handleView("read", item)}
                            className="text-gray-600 hover:text-blue-600"
                            title="View"
                          >
                            <FiEye className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <button
                            onClick={() => handleView("update", item)}
                            className="text-gray-600 hover:text-green-600"
                            title="Edit"
                          >
                            <FiEdit className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <button
                            onClick={() => handleView("delete", item)}
                            className="text-gray-600 hover:text-red-600"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          {(currentView === "add" || currentView === "update") && (
            <AddNewUpdateProduct
              product={
                currentView === "update"
                  ? selectedProduct
                  : { product: null, image: null }
              }
              isShow={true}
              onClose={() => handleView(null)}
              showAlert={showAlert}
              refreshProducts={fetchProducts}
            />
          )}

          {currentView === "read" && (
            <ProductPage
              product={selectedProduct}
              isShow={true}
              onClose={() => handleView(null)}
            />
          )}

          {currentView === "delete" && (
            <DeleteProduct
              product={selectedProduct}
              isShow={true}
              onClose={() => handleView(null)}
              showAlert={showAlert}
              refreshProducts={fetchProducts}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
