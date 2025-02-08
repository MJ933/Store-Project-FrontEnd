import React, { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import AddNewUpdateOrder from "./AddUpdateOrder";
import OrderPage from "./OrderPage";
import clsOrders from "../../Classes/clsOrders";
import { FiEye, FiEdit, FiTrash2, FiPlus, FiFilter, FiX } from "react-icons/fi";
import API from "../../Classes/clsAPI";
import Alert from "../../components/Alert";
import ModernLoader from "../../components/ModernLoader";
import Pagination from "../../components/Pagination";
import { handleError } from "../../utils/handleError";

const ManageOrders = () => {
  const { t, i18n } = useTranslation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "orderDate",
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

  const [filterOrderID, setFilterOrderID] = useState("");
  const [filterCustomerID, setFilterCustomerID] = useState("");
  const [filterOrderDate, setFilterOrderDate] = useState("");
  const [filterTotal, setFilterTotal] = useState("");
  const [filterOrderStatus, setFilterOrderStatus] = useState("");
  const [filterShippingAddress, setFilterShippingAddress] = useState("");
  const [filterNotes, setFilterNotes] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    orderID: "",
    customerID: "",
    orderDate: "",
    total: "",
    orderStatus: "",
    shippingAddress: "",
    notes: "",
  });

  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [filterChanged, setFilterChanged] = useState(false);

  const statusStyles = {
    Pending: {
      base: "bg-yellow-100 text-yellow-800",
      ar: "px-2 py-1",
      en: "px-3 py-1",
    },
    Shipped: {
      base: "bg-blue-100 text-blue-800",
      ar: "px-2 py-1",
      en: "px-3 py-1",
    },
    Delivered: {
      base: "bg-green-100 text-green-800",
      ar: "px-2 py-1",
      en: "px-3 py-1",
    },
    Canceled: {
      base: "bg-red-100 text-red-800",
      ar: "px-2 py-1",
      en: "px-3 py-1",
    },
  };

  const getStatusPaddingClass = (status) => {
    const isAr = i18n.language === "ar";
    return isAr ? statusStyles[status]?.ar : statusStyles[status]?.en;
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  const fetchPaginatedOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    scrollPositionRef.current = window.scrollY;
    try {
      const url = new URL(
        `${new API().baseURL()}/API/OrdersAPI/GetOrdersPaginatedWithFilters`
      );
      const params = new URLSearchParams();
      params.append("pageNumber", currentPage);
      params.append("pageSize", pageSize);
      if (appliedFilters.orderID)
        params.append("orderID", appliedFilters.orderID);
      if (appliedFilters.customerID)
        params.append("customerID", appliedFilters.customerID);
      if (appliedFilters.orderDate) {
        const isoDate = new Date(appliedFilters.orderDate).toISOString();
        params.append("orderDate", isoDate);
      }
      if (appliedFilters.total) params.append("total", appliedFilters.total);
      if (appliedFilters.orderStatus)
        params.append("orderStatus", appliedFilters.orderStatus);
      if (appliedFilters.shippingAddress)
        params.append("shippingAddress", appliedFilters.shippingAddress);
      if (appliedFilters.notes) params.append("notes", appliedFilters.notes);

      url.search = params.toString();

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.text(); // First get as text
        let parsedError;
        try {
          parsedError = JSON.parse(errorData);
        } catch {
          parsedError = { message: errorData };
        }
        if (response.status === 404) {
          setOrders([]);
          setTotalCount(0);
          setTotalPages(0);
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
      setOrders(data.orderList);
      setTotalCount(data.totalCount);
      setTotalPages(Math.ceil(data.totalCount / pageSize));
    } catch (err) {
      setError(err.message);
      setOrders([]);
      setTotalCount(0);
      setTotalPages(0);
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, appliedFilters]);

  useEffect(() => {
    fetchPaginatedOrders();
  }, [fetchPaginatedOrders, appliedFilters]);

  useEffect(() => {
    if (!loading) {
      window.scrollTo({
        top: scrollPositionRef.current,
        behavior: "auto",
      });
    }
  }, [loading]);

  const handleView = (view, order = null) => {
    setCurrentView(view);
    setSelectedOrder(order);
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

  const sortedOrders = React.useMemo(() => {
    if (!sortConfig.key) return orders;

    return [...orders].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [orders, sortConfig, filterChanged]);

  const api = new API();
  const handleCancelOrder = async (orderID) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${api.baseURL()}/API/OrdersAPI/UpdateStatus/${orderID}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
            accept: "*/*",
          },
          body: JSON.stringify("Canceled"),
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
      const updatedOrders = orders?.map((order) =>
        order.orderID === orderID
          ? { ...order, orderStatus: "Canceled" }
          : order
      );
      setOrders(updatedOrders);

      showAlert(t("manageOrders.cancelSuccessAlert"), "success");
    } catch (err) {
      // setError(err.message);
      // showAlert(t("manageOrders.cancelErrorAlert"), "error");
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e, filterSetter) => {
    filterSetter(e.target.value);
  };

  const applyFilters = () => {
    setAppliedFilters({
      orderID: filterOrderID,
      customerID: filterCustomerID,
      orderDate: filterOrderDate,
      total: filterTotal,
      orderStatus: filterOrderStatus,
      shippingAddress: filterShippingAddress,
      notes: filterNotes,
    });
    setCurrentPage(1);
    setFilterChanged((prev) => !prev);
  };

  const clearFilters = () => {
    setFilterOrderID("");
    setFilterCustomerID("");
    setFilterOrderDate("");
    setFilterTotal("");
    setFilterOrderStatus("");
    setFilterShippingAddress("");
    setFilterNotes("");
    setAppliedFilters({
      orderID: "",
      customerID: "",
      orderDate: "",
      total: "",
      orderStatus: "",
      shippingAddress: "",
      notes: "",
    });
    setCurrentPage(1);
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
      {orders?.length === 0 && !loading && !error && isFiltersVisible && (
        <Alert message={t("manageOrders.noOrdersFound")} type={"failure"} />
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
              {t("manageOrders.ordersTitle")}
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
                    ? t("manageOrders.hideFiltersButton")
                    : t("manageOrders.showFiltersButton")}
                </span>
              </button>
              <button
                onClick={() => handleView("add")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 w-full md:w-auto"
              >
                <FiPlus className="text-lg" />
                <span className="hidden sm:inline">
                  {t("manageOrders.newOrderButton")}
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
                    htmlFor="filterOrderID"
                  >
                    {t("manageOrders.orderIDHeader")}:
                  </label>
                  <input
                    type="number"
                    id="filterOrderID"
                    placeholder={t("manageOrders.orderIDHeader")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterOrderID}
                    onChange={(e) => handleFilterChange(e, setFilterOrderID)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterCustomerID"
                  >
                    {t("manageOrders.customerIDHeader")}:
                  </label>
                  <input
                    type="number"
                    id="filterCustomerID"
                    placeholder={t("manageOrders.customerIDHeader")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterCustomerID}
                    onChange={(e) => handleFilterChange(e, setFilterCustomerID)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterOrderDate"
                  >
                    {t("manageOrders.orderDateHeader")}:
                  </label>
                  <input
                    type="date"
                    id="filterOrderDate"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterOrderDate}
                    onChange={(e) => handleFilterChange(e, setFilterOrderDate)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterTotal"
                  >
                    {t("manageOrders.totalHeader")}:
                  </label>
                  <input
                    type="number"
                    id="filterTotal"
                    placeholder={t("manageOrders.totalHeader")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterTotal}
                    onChange={(e) => handleFilterChange(e, setFilterTotal)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterOrderStatus"
                  >
                    {t("manageOrders.orderStatusHeader")}:
                  </label>
                  <select
                    id="filterOrderStatus"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterOrderStatus}
                    onChange={(e) =>
                      handleFilterChange(e, setFilterOrderStatus)
                    }
                    onKeyDown={handleKeyDown}
                  >
                    <option value="">{t("manageOrders.allStatus")}</option>
                    <option value="Pending">
                      {t("manageOrders.orderStatus.pending")}
                    </option>
                    <option value="Shipped">
                      {t("manageOrders.orderStatus.shipped")}
                    </option>
                    <option value="Delivered">
                      {t("manageOrders.orderStatus.delivered")}
                    </option>
                    <option value="Canceled">
                      {t("manageOrders.orderStatus.canceled")}
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterShippingAddress"
                  >
                    {t("manageOrders.shippingAddressHeader")}:
                  </label>
                  <input
                    type="text"
                    id="filterShippingAddress"
                    placeholder={t("manageOrders.shippingAddressHeader")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterShippingAddress}
                    onChange={(e) =>
                      handleFilterChange(e, setFilterShippingAddress)
                    }
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterNotes"
                  >
                    {t("manageOrders.notesHeader")}:
                  </label>
                  <input
                    type="text"
                    id="filterNotes"
                    placeholder={t("manageOrders.notesHeader")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterNotes}
                    onChange={(e) => handleFilterChange(e, setFilterNotes)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="flex items-end justify-end gap-2">
                  <button
                    onClick={clearFilters}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    {t("manageOrders.clearFiltersButton")}
                  </button>
                  <button
                    onClick={applyFilters}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    {t("manageOrders.applyFiltersButton")}
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <div className="px-4 py-2 flex justify-between items-center">
              <span className="text-sm text-gray-700">
                {t("manageOrders.totalOrdersText")}:
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
                    "orderID",
                    "customerID",
                    "orderDate",
                    "total",
                    "orderStatus",
                    "shippingAddress",
                    "notes",
                  ].map((key) => (
                    <th
                      key={key}
                      className={`px-2 py-2 md:px-4 md:py-3 text-left text-sm font-medium text-gray-500 cursor-pointer ${
                        ["shippingAddress", "notes"].includes(key)
                          ? "hidden md:table-cell"
                          : ""
                      }`}
                      onClick={() => handleSort(key)}
                    >
                      {t(`manageOrders.${key}Header`)}
                      {sortConfig.key === key && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                  ))}
                  <th className="px-2 py-2 md:px-4 md:py-3 text-left text-sm font-medium text-gray-500">
                    {t("manageOrders.actionsHeader")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedOrders.map((order) => (
                  <tr key={order.orderID} className="hover:bg-gray-50">
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-700">
                      {order.orderID}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-700">
                      {order.customerID}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3">
                      <span
                        className={`rounded-full text-xs font-medium inline-block ${
                          statusStyles[order.orderStatus]?.base ||
                          "bg-gray-100 text-gray-800"
                        } ${getStatusPaddingClass(order.orderStatus)}`}
                      >
                        {t(
                          `manageOrders.orderStatus.${order.orderStatus.toLowerCase()}`
                        )}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-600">
                      {order.shippingAddress}
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-600">
                      {order.notes}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3">
                      <div className="flex items-center gap-2 md:gap-3">
                        <button
                          onClick={() => handleView("read", order)}
                          className="text-gray-600 hover:text-blue-600"
                          title={t("manageOrders.viewTitle")}
                        >
                          <FiEye className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => handleView("update", order)}
                          className="text-gray-600 hover:text-green-600"
                          title={t("manageOrders.editTitle")}
                        >
                          <FiEdit className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => handleCancelOrder(order.orderID)}
                          className="text-gray-600 hover:text-red-600"
                          title={t("manageOrders.deleteTitle")}
                        >
                          <FiTrash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-2 flex justify-between items-center gap-2">
              <span className="text-sm text-gray-700">
                {t("manageOrders.totalOrdersText")}:
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
            <AddNewUpdateOrder
              order={currentView === "update" ? selectedOrder : null}
              isShow={true}
              onClose={() => handleView(null)}
              showAlert={showAlert}
              refreshOrders={fetchPaginatedOrders}
            />
          )}
          {currentView === "read" && (
            <OrderPage
              order={selectedOrder}
              isShow={true}
              onClose={() => handleView(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
