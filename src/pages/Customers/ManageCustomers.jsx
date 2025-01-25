import React, { useEffect, useState, useCallback } from "react";
import AddNewUpdateCustomer from "./AddUpdateCustomer";
import DeleteCustomer from "./DeleteCustomer";
import CustomerPage from "./CustomerPage";
import CustomerOrders from "./CustomerOrders";
import { FiEye, FiEdit, FiTrash2, FiList, FiPlus } from "react-icons/fi";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");

  const statusStyles = {
    true: "bg-green-100 text-green-800",
    false: "bg-red-100 text-red-800",
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const fetchCustomers = useCallback(async () => {
    try {
      const response = await fetch(
        `${new API().baseURL()}/API/CustomersAPI/GetALL`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch customers");
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

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
  }, [customers, sortConfig]);

  const filteredCustomers = React.useMemo(() => {
    if (!searchTerm) return sortedCustomers;
    return sortedCustomers.filter((customer) =>
      Object.values(customer).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedCustomers, searchTerm]);

  if (loading) return <ModernLoader />;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (customers.length === 0)
    return <div className="p-4 text-gray-500">No customers found</div>;

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
              Customers
            </h1>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleView("add")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <FiPlus className="text-lg" />
                <span className="hidden sm:inline">New Customer</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "customerId",
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
                {filteredCustomers.map((customer) => (
                  <tr key={customer.customerID} className="hover:bg-gray-50">
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-700">
                      {/* <span className="md:hidden font-medium">ID: </span> */}
                      {customer.customerID}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                      {/* <span className="md:hidden font-medium">First: </span> */}
                      {customer.firstName}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                      {/* <span className="md:hidden font-medium">Last: </span> */}
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
          </div>
        </div>
      ) : (
        <div>
          {(currentView === "add" || currentView === "update") && (
            <AddNewUpdateCustomer
              customer={currentView === "update" ? selectedCustomer : null}
              isShow={true}
              onClose={() => handleView(null)}
              refresh={fetchCustomers}
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
              refresh={fetchCustomers}
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
