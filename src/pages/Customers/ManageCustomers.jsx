import React, { useEffect, useState, useCallback, useRef } from "react";

import AddNewUpdateCustomer from "./AddUpdateCustomer";
import DeleteCustomer from "./DeleteCustomer";
import CustomerPage from "./CustomerPage";
import CustomerOrders from "./CustomerOrders";
import Pagination from "../../components/Pagination"; // Assuming Pagination component is in this path
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiList,
  FiPlus,
  FiFilter,
  FiX,
} from "react-icons/fi"; // Import new icons
import API from "../../Classes/clsAPI";
import Alert from "../../components/Alert";
import ModernLoader from "../../components/ModernLoader";

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "registeredAt",
    direction: "desc",
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");
  const initialLoad = useRef(true); // Add this line
  const scrollPositionRef = useRef(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter state - Storing filter values in state
  const [filterCustomerID, setFilterCustomerID] = useState("");
  const [filterFirstName, setFilterFirstName] = useState("");
  const [filterLastName, setFilterLastName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [filterRegisteredAt, setFilterRegisteredAt] = useState("");
  const [filterIsActive, setFilterIsActive] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    customerID: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    registeredAt: "",
    isActive: "",
  });
  // Filter visibility state
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [filterChanged, setFilterChanged] = useState(false);
  const statusStyles = {
    true: "bg-green-100 text-green-800",
    false: "bg-red-100 text-red-800",
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const fetchPaginatedCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    scrollPositionRef.current = window.scrollY;
    try {
      const url = new URL(
        `${new API().baseURL()}/API/CustomersAPI/GetCustomersPaginatedWithFilters`
      );
      const params = new URLSearchParams();
      params.append("pageNumber", currentPage);
      params.append("pageSize", pageSize);
      if (appliedFilters.customerID)
        params.append("customerID", appliedFilters.customerID);
      if (appliedFilters.firstName)
        params.append("firstName", appliedFilters.firstName);
      if (appliedFilters.lastName)
        params.append("lastName", appliedFilters.lastName);
      if (appliedFilters.email) params.append("email", appliedFilters.email);
      if (appliedFilters.phone) params.append("phone", appliedFilters.phone);
      if (appliedFilters.registeredAt) {
        const isoDate = new Date(appliedFilters.registeredAt).toISOString();
        params.append("registeredAt", isoDate);
      }
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
          setCustomers([]);
          setTotalCount(0);
          setTotalPages(0);
          return;
        }
        throw new Error(
          `Failed to fetch customers: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      setCustomers(data.customers);
      setTotalCount(data.totalCount);
      setTotalPages(Math.ceil(data.totalCount / pageSize));
    } catch (err) {
      setError(err.message);
      setCustomers([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, appliedFilters]);

  useEffect(() => {
    fetchPaginatedCustomers();
  }, [fetchPaginatedCustomers, appliedFilters]);

  useEffect(() => {
    if (!loading) {
      window.scrollTo({
        top: scrollPositionRef.current,
        behavior: "auto",
      });
    }
  }, [loading]);

  const handleView = (view, customer = null) => {
    setCurrentView(view);
    setSelectedCustomer(customer);
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

  const sortedCustomers = React.useMemo(() => {
    if (!sortConfig.key) return customers;
    return [...customers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [customers, sortConfig, filterChanged]);

  const handleFilterChange = (e, filterSetter) => {
    filterSetter(e.target.value);
  };

  const applyFilters = () => {
    setAppliedFilters({
      customerID: filterCustomerID,
      firstName: filterFirstName,
      lastName: filterLastName,
      email: filterEmail,
      phone: filterPhone,
      registeredAt: filterRegisteredAt,
      isActive: filterIsActive,
    });
    setCurrentPage(1);
    setFilterChanged((prev) => !prev);
  };

  const clearFilters = () => {
    setFilterCustomerID("");
    setFilterFirstName("");
    setFilterLastName("");
    setFilterEmail("");
    setFilterPhone("");
    setFilterRegisteredAt("");
    setFilterIsActive("");
    setCurrentPage(1); // Reset pagination to first page
    setAppliedFilters({
      customerID: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      registeredAt: "",
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
      e.preventDefault(); // Prevent form submission if inside a form
      applyFilters();
    }
  };
  return (
    <div>
      {customers.length === 0 && !loading && !error && isFiltersVisible && (
        <Alert
          message={
            "No customers found with current filters. Please adjust filters or clear them."
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
              Customers
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
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <FiPlus className="text-lg" />
                <span className="hidden sm:inline">New Customer</span>
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
                    htmlFor="filterCustomerID"
                  >
                    Customer ID:
                  </label>
                  <input
                    type="number"
                    id="filterCustomerID"
                    placeholder="Customer ID"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterCustomerID}
                    onChange={(e) => handleFilterChange(e, setFilterCustomerID)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterFirstName"
                  >
                    First Name:
                  </label>
                  <input
                    type="text"
                    id="filterFirstName"
                    placeholder="First Name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterFirstName}
                    onChange={(e) => handleFilterChange(e, setFilterFirstName)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterLastName"
                  >
                    Last Name:
                  </label>
                  <input
                    type="text"
                    id="filterLastName"
                    placeholder="Last Name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterLastName}
                    onChange={(e) => handleFilterChange(e, setFilterLastName)}
                    onKeyDown={handleKeyDown} // Added onKeyDown handler
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterEmail"
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    id="filterEmail"
                    placeholder="Email"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterEmail}
                    onChange={(e) => handleFilterChange(e, setFilterEmail)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterPhone"
                  >
                    Phone:
                  </label>
                  <input
                    type="text"
                    id="filterPhone"
                    placeholder="Phone"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterPhone}
                    onChange={(e) => handleFilterChange(e, setFilterPhone)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterRegisteredAt"
                  >
                    Registered At:
                  </label>
                  <input
                    type="date"
                    id="filterRegisteredAt"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterRegisteredAt}
                    onChange={(e) =>
                      handleFilterChange(e, setFilterRegisteredAt)
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
                Total Customers:{" "}
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
                    "customerID",
                    "firstName",
                    "lastName",
                    "email",
                    "phone",
                    "registeredAt",
                    "isActive",
                  ].map((key) => (
                    <th
                      key={key}
                      className={`px-2 py-2 md:px-4 md:py-3 text-left text-sm font-medium text-gray-500 cursor-pointer ${
                        ["email", "phone", "registeredAt"].includes(key)
                          ? "hidden md:table-cell"
                          : ""
                      }`}
                      onClick={() => handleSort(key)}
                    >
                      {key === "customerID"
                        ? "Customer ID"
                        : key.replace(/([A-Z])/g, " $1").trim()}{" "}
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
                {sortedCustomers.map((customer) => (
                  <tr key={customer.customerID} className="hover:bg-gray-50">
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-700">
                      {customer.customerID}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                      {customer.firstName}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                      {customer.lastName}
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-600">
                      {customer.email}
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-600">
                      {customer.phone}
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-600">
                      {new Date(customer.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusStyles[customer.isActive]
                        }`}
                      >
                        {customer.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3">
                      <div className="flex items-center gap-1 md:gap-3">
                        <button
                          onClick={() => handleView("read", customer)}
                          className="text-gray-600 hover:text-blue-600"
                          title="View"
                        >
                          <FiEye className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => handleView("update", customer)}
                          className="text-gray-600 hover:text-green-600"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => handleView("delete", customer)}
                          className="text-gray-600 hover:text-red-600"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => handleView("orders", customer)}
                          className="text-gray-600 hover:text-yellow-600"
                          title="Orders"
                        >
                          <FiList className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-2 flex justify-between items-center gap-2">
              <span className="text-sm text-gray-700">
                Total Customers:{" "}
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
            <AddNewUpdateCustomer
              customer={currentView === "update" ? selectedCustomer : null}
              isShow={true}
              onClose={() => handleView(null)}
              refresh={fetchPaginatedCustomers}
              showAlert={showAlert}
            />
          )}

          {currentView === "read" && (
            <CustomerPage
              customer={selectedCustomer}
              isShow={true}
              onClose={() => handleView(null)}
            />
          )}

          {currentView === "orders" && (
            <CustomerOrders
              customer={selectedCustomer}
              isShow={true}
              onClose={() => handleView(null)}
            />
          )}
          {currentView === "delete" && (
            <DeleteCustomer
              customer={selectedCustomer}
              refresh={fetchPaginatedCustomers}
              showAlert={showAlert}
              isShow={true}
              onClose={() => handleView(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ManageCustomers;
