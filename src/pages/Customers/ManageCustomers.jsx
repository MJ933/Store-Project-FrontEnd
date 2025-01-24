import React, { useEffect, useState, useCallback } from "react";
import AddNewUpdateCustomer from "./AddUpdateCustomer";
import DeleteCustomer from "./DeleteCustomer";
import CustomerPage from "./CustomerPage";
import CustomerOrders from "./CustomerOrders";
import API from "../../Classes/clsAPI";

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showUpdateCustomer, setShowUpdateCustomer] = useState(false);
  const [showDeleteCustomer, setShowDeleteCustomer] = useState(false);
  const [showReadCustomer, setShowReadCustomer] = useState(false);
  const [showCustomerOrders, setShowCustomerOrders] = useState(false); // New state for showing orders
  const [customer, setCustomer] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "customerID",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const api = new API();

  const fetchCustomers = useCallback(async () => {
    try {
      const response = await fetch(`${api.baseURL()}API/CustomersAPI/GetALL`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
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

  const handleAdd = () => {
    setShowAddCustomer(true);
    setShowUpdateCustomer(false);
    setShowReadCustomer(false);
    setShowDeleteCustomer(false);
    setShowCustomerOrders(false); // Hide orders when adding a customer
    setCustomer(null);
  };

  const handleRead = (currentCustomer) => {
    setShowReadCustomer(true);
    setShowAddCustomer(false);
    setShowUpdateCustomer(false);
    setShowDeleteCustomer(false);
    setShowCustomerOrders(false); // Hide orders when reading customer details
    setCustomer(currentCustomer);
  };

  const handleUpdate = (currentCustomer) => {
    setShowAddCustomer(false);
    setShowUpdateCustomer(true);
    setShowReadCustomer(false);
    setShowDeleteCustomer(false);
    setShowCustomerOrders(false); // Hide orders when updating a customer
    setCustomer(currentCustomer);
  };

  const handleDelete = (currentCustomer) => {
    setShowReadCustomer(false);
    setShowAddCustomer(false);
    setShowUpdateCustomer(false);
    setShowDeleteCustomer(true);
    setShowCustomerOrders(false); // Hide orders when deleting a customer
    setCustomer(currentCustomer);
  };

  const handleViewOrders = (currentCustomer) => {
    setShowReadCustomer(false);
    setShowAddCustomer(false);
    setShowUpdateCustomer(false);
    setShowDeleteCustomer(false);
    setShowCustomerOrders(true); // Show orders when viewing orders
    setCustomer(currentCustomer);
  };

  const handleCloseCRUDOperationCustomer = () => {
    setShowReadCustomer(false);
    setShowUpdateCustomer(false);
    setShowAddCustomer(false);
    setShowDeleteCustomer(false);
    setShowCustomerOrders(false); // Hide orders when closing CRUD operations
    setCustomer(null);
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

  const sortedCustomers = React.useMemo(() => {
    if (!sortConfig.key) return customers;

    return [...customers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [customers, sortConfig]);

  const filteredCustomers = React.useMemo(() => {
    if (!searchTerm) return sortedCustomers;

    return sortedCustomers.filter((customer) => {
      return Object.values(customer).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [sortedCustomers, searchTerm]);

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  if (customers.length === 0) {
    return <div className="text-center text-gray-600">No customers found.</div>;
  }

  return (
    <div>
      {showAddCustomer && (
        <AddNewUpdateCustomer
          customer={null}
          isShow={showAddCustomer}
          onClose={handleCloseCRUDOperationCustomer}
        />
      )}
      {showUpdateCustomer && (
        <AddNewUpdateCustomer
          customer={customer}
          isShow={showUpdateCustomer}
          onClose={handleCloseCRUDOperationCustomer}
        />
      )}
      {showDeleteCustomer && (
        <DeleteCustomer
          customer={customer}
          isShow={showDeleteCustomer}
          onClose={handleCloseCRUDOperationCustomer}
        />
      )}
      {showReadCustomer && (
        <CustomerPage
          customer={customer}
          isShow={showReadCustomer}
          onClose={handleCloseCRUDOperationCustomer}
        />
      )}
      {showCustomerOrders && (
        <CustomerOrders
          customer={customer}
          isShow={showCustomerOrders}
          onClose={handleCloseCRUDOperationCustomer}
        />
      )}
      {!showAddCustomer &&
        !showUpdateCustomer &&
        !showDeleteCustomer &&
        !showReadCustomer &&
        !showCustomerOrders && (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
              Customers List
            </h1>
            <div className="mb-6 text-center">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-6 text-center">
              <button
                onClick={handleAdd}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-sm sm:text-base"
              >
                Add Customer
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-100">
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("customerID")}
                    >
                      Customer ID
                      {sortConfig.key === "customerID" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("firstName")}
                    >
                      First Name
                      {sortConfig.key === "firstName" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("lastName")}
                    >
                      Last Name
                      {sortConfig.key === "lastName" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("email")}
                    >
                      Email
                      {sortConfig.key === "email" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("phone")}
                    >
                      Phone
                      {sortConfig.key === "phone" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("registeredAt")}
                    >
                      Registered At
                      {sortConfig.key === "registeredAt" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("isActive")}
                    >
                      Is Active
                      {sortConfig.key === "isActive" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.customerID} className="hover:bg-gray-50">
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {customer.customerID}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {customer.firstName}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {customer.lastName}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {customer.email}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {customer.phone}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {new Date(customer.registeredAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {customer.isActive ? "Yes" : "No"}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b">
                        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                          <button
                            onClick={() => handleRead(customer)}
                            className="bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-blue-600 text-sm sm:text-base"
                          >
                            Read
                          </button>
                          <button
                            onClick={() => handleUpdate(customer)}
                            className="bg-green-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-green-600 text-sm sm:text-base"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(customer)}
                            className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-red-600 text-sm sm:text-base"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleViewOrders(customer)}
                            className="bg-yellow-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-yellow-600 text-sm sm:text-base"
                          >
                            Orders
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
};

export default ManageCustomers;
