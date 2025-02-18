import React, { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import AddNewUpdateProduct from "./AddUpdateProduct";
import DeleteProduct from "./DeleteProduct";
import ProductPage from "./ProductPage";
import Pagination from "../../components/Pagination";
import { FiEye, FiEdit, FiTrash2, FiPlus, FiFilter, FiX } from "react-icons/fi";
import Alert from "../../components/Alert";
import ModernLoader from "../../components/ModernLoader";
import API from "../../Classes/clsAPI";
import { Link } from "react-router-dom";
import { handleError } from "../../utils/handleError";
import DetailedProductPage from "./DetailedProductPage";

const ManageProducts = () => {
  const { t } = useTranslation();

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

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
    // scrollPositionRef.current = window.scrollY;

    try {
      const url = new URL(
        `${new API().baseURL()}/API/ProductsAPI/GetProductsPaginatedWithFiltersAllImages`
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
        }
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
      setProducts(
        data?.productList?.map((item) => ({
          product: item?.product,
          images: item?.images,
        }))
      );
      setTotalCount(data.totalCount);
      setTotalPages(Math.ceil(data.totalCount / pageSize));
    } catch (err) {
      setError(err.message);
      setProducts([]);
      setTotalCount(0);
      setTotalPages(0);
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, appliedFilters]);

  useEffect(() => {
    fetchPaginatedProducts();
  }, [fetchPaginatedProducts, appliedFilters]);

  // useEffect(() => {
  //   if (!loading) {
  //     window.scrollTo({
  //       top: scrollPositionRef.current,
  //       behavior: "auto",
  //     });
  //   }
  // }, [loading]);

  const handleView = (view, product = null) => {
    setCurrentView(view);
    setSelectedProduct(product);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
      {products?.length === 0 && !loading && !error && isFiltersVisible && (
        <Alert message={t("manageProducts.noProductsFound")} type={"failure"} />
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
              {t("manageProducts.productsTitle")}
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
                  {isFiltersVisible
                    ? t("manageProducts.hideFiltersButton")
                    : t("manageProducts.showFiltersButton")}
                </span>
              </button>
              <button
                onClick={() => handleView("add")}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                <FiPlus className="text-lg" />
                <span className="hidden sm:inline">
                  {t("manageProducts.newProductButton")}
                </span>
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
                    {t("manageProducts.productIDHeader")}:
                  </label>
                  <input
                    type="number"
                    id="filterProductID"
                    placeholder={t("manageProducts.productIDHeader")}
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
                    {t("manageProducts.productNameHeader")}:
                  </label>
                  <input
                    type="text"
                    id="filterProductName"
                    placeholder={t("manageProducts.productNameHeader")}
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
                    {t("manageProducts.initialPriceHeader")}:
                  </label>
                  <input
                    type="number"
                    id="filterInitialPrice"
                    placeholder={t("manageProducts.initialPriceHeader")}
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
                    {t("manageProducts.sellingPriceHeader")}:
                  </label>
                  <input
                    type="number"
                    id="filterSellingPrice"
                    placeholder={t("manageProducts.sellingPriceHeader")}
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
                    {t("manageProducts.categoryIdHeader")}:
                  </label>
                  <input
                    type="number"
                    id="filterCategoryId"
                    placeholder={t("manageProducts.categoryIdHeader")}
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
                    {t("manageProducts.stockQuantityHeader")}:
                  </label>
                  <input
                    type="number"
                    id="filterStockQuantity"
                    placeholder={t("manageProducts.stockQuantityHeader")}
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
                    {t("manageProducts.isActiveHeader")}:
                  </label>
                  <select
                    id="filterIsActive"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterIsActive}
                    onChange={(e) => handleFilterChange(e, setFilterIsActive)}
                    onKeyDown={handleKeyDown}
                  >
                    <option value="">{t("manageProducts.allStatus")}</option>
                    <option value="true">
                      {t("manageProducts.activeStatus")}
                    </option>
                    <option value="false">
                      {t("manageProducts.inactiveStatus")}
                    </option>
                  </select>
                </div>
                <div className="flex items-end justify-end gap-2">
                  <button
                    onClick={clearFilters}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    {t("manageProducts.clearFiltersButton")}
                  </button>
                  <button
                    onClick={applyFilters}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    {t("manageProducts.applyFiltersButton")}
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <div className="px-4 py-2 flex flex-col sm:flex-row justify-between items-center">
              <span className="text-sm text-gray-700">
                {t("manageProducts.totalProductsText")}:
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
                  ]?.map((key) => (
                    <th
                      key={key}
                      className={`px-2 py-2 md:px-4 md:py-3 text-left text-sm font-medium text-gray-500 cursor-pointer ${
                        ["productID", "stockQuantity"].includes(key)
                          ? "hidden md:table-cell"
                          : ""
                      }`}
                      onClick={() => handleSort(key)}
                    >
                      {t(`manageProducts.${key}Header`)}
                      {sortConfig.key === key && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                  ))}
                  <th className="px-2 py-2 md:px-4 md:py-3 text-left text-sm font-medium text-gray-500">
                    {t("manageProducts.actionsHeader")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedProducts?.map((item) => {
                  if (!item.product) return null;
                  const primaryImages = item.images.filter(
                    (img) => img.isPrimary
                  );
                  const lastPrimaryImage =
                    primaryImages.length > 0
                      ? primaryImages[primaryImages.length - 1]
                      : null;

                  return (
                    <tr
                      key={item.product.productID}
                      className="hover:bg-gray-50"
                    >
                      <td className="hidden md:table-cell px-2 py-2 md:px-4 md:py-3 text-sm text-gray-700">
                        {item.product.productID}
                      </td>
                      <td
                        className={`px-2 py-2 md:px-4 md:py-3 text-sm ${
                          item.product.stockQuantity > 0
                            ? "text-gray-600"
                            : "text-red-600"
                        } `}
                      >
                        {item.product.productName}
                      </td>
                      <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                        {item.product.sellingPrice.toFixed(2)} {""}
                        {t("Currency")}
                      </td>
                      <td className="hidden md:table-cell px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                        {item.product.stockQuantity}
                      </td>
                      <td className="px-2 py-2 md:px-4 md:py-3">
                        {lastPrimaryImage && (
                          <div className="w-12 h-12 overflow-hidden rounded-lg border border-gray-200">
                            <img
                              src={lastPrimaryImage.imageURL}
                              alt={item.product.productName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "/NoImage.png"; // Replace with your placeholder image path
                                e.target.alt = "Placeholder Image";
                                e.target.onerror = null;
                              }}
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-2 md:px-4 md:py-3">
                        <div className="flex flex-col gap-1 sm:gap-2  items-center  md:gap-3">
                          {/* <Link
                            to={`/products/${item.product.productID}`}
                            title={t("manageProducts.viewTitle")}
                          > */}
                          <button
                            onClick={() => handleView("read", item)}
                            className="text-gray-600 hover:text-blue-600"
                          >
                            <FiEye className="w-4 mt-2 h-4 md:w-5 md:h-5" />
                          </button>
                          {/* </Link> */}
                          <button
                            onClick={() => handleView("update", item)}
                            className="text-gray-600 hover:text-green-600"
                            title={t("manageProducts.editTitle")}
                          >
                            <FiEdit className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <button
                            onClick={() => handleView("delete", item)}
                            className="text-gray-600 hover:text-red-600"
                            title={t("manageProducts.deleteTitle")}
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
            <div className="px-4 py-2 flex flex-col sm:flex-row justify-between items-center gap-2">
              <span className="text-sm text-gray-700">
                {t("manageProducts.totalProductsText")}:
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
                  : { product: null, images: null }
              }
              isShow={true}
              onClose={() => handleView(null)}
              showAlert={showAlert}
              refreshProducts={fetchPaginatedProducts}
            />
          )}
          {/* {currentView === "read" && (
            <ProductPage
              product={selectedProduct.product.productID}
              isShow={true}
              onClose={() => handleView(null)}
            />
          )} */}
          {currentView === "read" && (
            <DetailedProductPage
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
