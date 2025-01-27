import React, { useEffect, useState, useCallback, useRef } from "react";

import AddNewUpdateProduct from "./AddUpdateProduct";
import DeleteProduct from "./DeleteProduct";
import ProductPage from "./ProductPage";
import Pagination from "../../components/Pagination"; // Assuming Pagination component is in this path

import { FiEye, FiEdit, FiTrash2, FiPlus, FiFilter, FiX } from "react-icons/fi"; // Import new icons
import Alert from "../../components/Alert";
import ModernLoader from "../../components/ModernLoader";
import API from "../../Classes/clsAPI";

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
  const initialLoad = useRef(true);
  const scrollPositionRef = useRef(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter state
  const [filterProductID, setFilterProductID] = useState("");
  const [filterProductName, setFilterProductName] = useState("");
  const [filterInitialPrice, setFilterInitialPrice] = useState("");
  const [filterSellingPrice, setFilterSellingPrice] = useState("");
  const [filterDescription, setFilterDescription] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [filterStockQuantity, setFilterStockQuantity] = useState("");
  const [filterIsActive, setFilterIsActive] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    productID: "",
    productName: "",
    initialPrice: "",
    sellingPrice: "",
    description: "",
    categoryId: "",
    quantity: "",
    isActive: "",
  });
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [filterChanged, setFilterChanged] = useState(false);

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

  const fetchPaginatedProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    scrollPositionRef.current = window.scrollY;
    try {
      const url = new URL(
        `${new API().baseURL()}/API/ProductsAPI/GetProductsPaginatedWithFilters`
      );
      const params = new URLSearchParams();
      params.append("pageNumber", currentPage);
      params.append("pageSize", pageSize);
      if (appliedFilters.productID)
        params.append("productID", appliedFilters.productID);
      if (appliedFilters.productName)
        params.append("productName", appliedFilters.productName);
      if (appliedFilters.initialPrice)
        params.append("initialPrice", appliedFilters.initialPrice);
      if (appliedFilters.sellingPrice)
        params.append("sellingPrice", appliedFilters.sellingPrice);
      if (appliedFilters.description)
        params.append("description", appliedFilters.description);
      if (appliedFilters.categoryId)
        params.append("categoryId", appliedFilters.categoryId);
      if (appliedFilters.quantity)
        params.append("quantity", appliedFilters.quantity);
      if (appliedFilters.isActive !== "") {
        params.append("isActive", appliedFilters.isActive === "true");
      }
      url.search = params.toString();

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setProducts([]);
          setTotalCount(0);
          setTotalPages(0);
          return;
        }
        throw new Error(
          `Failed to fetch products: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      setProducts(data.productList);
      setTotalCount(data.totalCount);
      setTotalPages(Math.ceil(data.totalCount / pageSize));
    } catch (err) {
      setError(err.message);
      setProducts([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, appliedFilters]);

  useEffect(() => {
    fetchPaginatedProducts();
  }, [fetchPaginatedProducts, appliedFilters]);

  useEffect(() => {
    if (!loading) {
      window.scrollTo({
        top: scrollPositionRef.current,
        behavior: "auto",
      });
    }
  }, [loading]);

  const handleView = (view, product = null) => {
    setCurrentView(view);
    setSelectedProduct(product);
  };

  const handleSort = useCallback(
    (key) => {
      const direction =
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc";
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
  }, [products, sortConfig, filterChanged]);

  const handleFilterChange = (e, filterSetter) => {
    filterSetter(e.target.value);
  };

  const applyFilters = () => {
    setAppliedFilters({
      productID: filterProductID,
      productName: filterProductName,
      initialPrice: filterInitialPrice,
      sellingPrice: filterSellingPrice,
      description: filterDescription,
      categoryId: filterCategoryId,
      quantity: filterStockQuantity,
      isActive: filterIsActive,
    });
    setCurrentPage(1);
    setFilterChanged((prev) => !prev);
  };

  const clearFilters = () => {
    setFilterProductID("");
    setFilterProductName("");
    setFilterInitialPrice("");
    setFilterSellingPrice("");
    setFilterDescription("");
    setFilterCategoryId("");
    setFilterStockQuantity("");
    setFilterIsActive("");

    setCurrentPage(1);
    setAppliedFilters({
      productID: "",
      productName: "",
      initialPrice: "",
      sellingPrice: "",
      description: "",
      categoryId: "",
      quantity: "",
      isActive: "",
    });
  };

  const toggleFiltersVisibility = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  if (loading) return <ModernLoader />;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyFilters();
    }
  };

  return (
    <div>
      {products.length === 0 && !loading && !error && isFiltersVisible && (
        <Alert
          message={
            "No products found with current filters. Please adjust filters or clear them."
          }
          type={"failure"}
        />
      )}
      <Alert
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertMessage(null)}
      />

      {currentView === null ? (
        <div className="p-4 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-2 gap-4">
            <h1 className="text-xl font-semibold text-gray-800 w-full md:w-auto">
              Products
            </h1>
            <div className="w-full md:w-auto flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={toggleFiltersVisibility}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center justify-center gap-2"
              >
                {isFiltersVisible ? (
                  <FiX className="text-lg" />
                ) : (
                  <FiFilter className="text-lg" />
                )}
                <span className="hidden sm:inline">
                  {isFiltersVisible ? "Hide Filters" : "Show Filters"}
                </span>
              </button>
              <button
                onClick={() => handleView("add")}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                <FiPlus className="text-lg" />
                <span className="hidden sm:inline">New Product</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          {isFiltersVisible && (
            <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterProductID"
                  >
                    Product ID:
                  </label>
                  <input
                    type="number"
                    id="filterProductID"
                    placeholder="Product ID"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterProductID}
                    onChange={(e) => handleFilterChange(e, setFilterProductID)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterProductName"
                  >
                    Product Name:
                  </label>
                  <input
                    type="text"
                    id="filterProductName"
                    placeholder="Product Name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterProductName}
                    onChange={(e) =>
                      handleFilterChange(e, setFilterProductName)
                    }
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterInitialPrice"
                  >
                    Initial Price:
                  </label>
                  <input
                    type="number"
                    id="filterInitialPrice"
                    placeholder="Initial Price"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterInitialPrice}
                    onChange={(e) =>
                      handleFilterChange(e, setFilterInitialPrice)
                    }
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterSellingPrice"
                  >
                    Selling Price:
                  </label>
                  <input
                    type="number"
                    id="filterSellingPrice"
                    placeholder="Selling Price"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterSellingPrice}
                    onChange={(e) =>
                      handleFilterChange(e, setFilterSellingPrice)
                    }
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterCategoryId"
                  >
                    Category ID:
                  </label>
                  <input
                    type="number"
                    id="filterCategoryId"
                    placeholder="Category ID"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterCategoryId}
                    onChange={(e) => handleFilterChange(e, setFilterCategoryId)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterStockQuantity"
                  >
                    Stock Quantity:
                  </label>
                  <input
                    type="number"
                    id="filterStockQuantity"
                    placeholder="Stock Quantity"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterStockQuantity}
                    onChange={(e) =>
                      handleFilterChange(e, setFilterStockQuantity)
                    }
                    onKeyDown={handleKeyDown}
                  />
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterIsActive"
                  >
                    Is Active:
                  </label>
                  <select
                    id="filterIsActive"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterIsActive}
                    onChange={(e) => handleFilterChange(e, setFilterIsActive)}
                    onKeyDown={handleKeyDown}
                  >
                    <option value="">All</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                <div className="flex items-end justify-end gap-2">
                  <button
                    onClick={clearFilters}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={applyFilters}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <div className="px-4 py-2 flex justify-between items-center">
              <span className="text-sm text-gray-700">
                Total Products:{" "}
                <span className="font-semibold">{totalCount}</span>
              </span>
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "productID",
                    "productName",
                    "sellingPrice",
                    "stockQuantity",
                    "image",
                  ].map((key) => (
                    <th
                      key={key}
                      className="px-2 py-2 md:px-4 md:py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort(key)}
                    >
                      {key === "productID"
                        ? "Product ID"
                        : key.replace(/([A-Z])/g, " $1").trim()}
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
                      <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                        ${item.product.sellingPrice.toFixed(2)}
                      </td>
                      <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                        {item.product.stockQuantity}
                      </td>
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
            <div className="px-4 py-2 flex justify-between items-center gap-2">
              <span className="text-sm text-gray-700">
                Total Products:{" "}
                <span className="font-semibold">{totalCount}</span>
              </span>
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
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
              refreshProducts={fetchPaginatedProducts}
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
              refreshProducts={fetchPaginatedProducts}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
