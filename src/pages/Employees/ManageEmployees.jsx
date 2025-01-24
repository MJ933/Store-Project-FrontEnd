import React, { useEffect, useState, useCallback } from "react";
import AddUpdateEmployee from "./AddUpdateEmployee";
import DeleteEmployee from "./DeleteEmployee";
import EmployeePage from "./EmployeePage";
import API from "../../Classes/clsAPI";

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showUpdateEmployee, setShowUpdateEmployee] = useState(false);
  const [showDeleteEmployee, setShowDeleteEmployee] = useState(false);
  const [showReadEmployee, setShowReadEmployee] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "employeeID",
    direction: "desc",
  });
  const api = new API();

  // Fetch employees from the API
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await fetch(`${api.baseURL()}API/EmployeesAPI/GetAll`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch employees when the component mounts
  useEffect(() => {
    fetchEmployees();
  }, [employee, employees]);

  const handleAdd = () => {
    setShowAddEmployee(true);
    setShowUpdateEmployee(false);
    setShowReadEmployee(false);
    setShowDeleteEmployee(false);
    setEmployee(null);
  };

  const handleRead = (currentEmployee) => {
    setShowReadEmployee(true);
    setShowAddEmployee(false);
    setShowUpdateEmployee(false);
    setShowDeleteEmployee(false);
    setEmployee(currentEmployee);
  };

  const handleUpdate = (currentEmployee) => {
    setShowAddEmployee(false);
    setShowUpdateEmployee(true);
    setShowReadEmployee(false);
    setShowDeleteEmployee(false);
    setEmployee(currentEmployee);
  };

  const handleDelete = (currentEmployee) => {
    setShowReadEmployee(false);
    setShowAddEmployee(false);
    setShowUpdateEmployee(false);
    setShowDeleteEmployee(true);
    setEmployee(currentEmployee);
  };

  const handleCloseCRUDOperationEmployee = () => {
    setShowReadEmployee(false);
    setShowUpdateEmployee(false);
    setShowAddEmployee(false);
    setShowDeleteEmployee(false);
    setEmployee(null);
  };

  // Sorting function
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

  // Sort employees based on sortConfig
  const sortedEmployees = React.useMemo(() => {
    if (!sortConfig.key) return employees;

    return [...employees].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [employees, sortConfig]);

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  if (employees.length === 0) {
    return <div className="text-center text-gray-600">No employees found.</div>;
  }

  return (
    <div>
      {showAddEmployee && (
        <AddUpdateEmployee
          employee={null}
          isShow={showAddEmployee}
          onClose={handleCloseCRUDOperationEmployee}
        />
      )}
      {showUpdateEmployee && (
        <AddUpdateEmployee
          employee={employee}
          isShow={showUpdateEmployee}
          onClose={handleCloseCRUDOperationEmployee}
        />
      )}
      {showDeleteEmployee && (
        <DeleteEmployee
          employee={employee}
          isShow={showDeleteEmployee}
          onClose={handleCloseCRUDOperationEmployee}
        />
      )}
      {showReadEmployee && (
        <EmployeePage
          employee={employee}
          isShow={showReadEmployee}
          onClose={handleCloseCRUDOperationEmployee}
        />
      )}
      {!showAddEmployee &&
        !showUpdateEmployee &&
        !showDeleteEmployee &&
        !showReadEmployee && (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
              Employees List
            </h1>
            <div className="mb-6 text-center">
              <button
                onClick={handleAdd}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-sm sm:text-base"
              >
                Add Employee
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-100">
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("employeeID")}
                    >
                      Employee ID
                      {sortConfig.key === "employeeID" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("userName")}
                    >
                      Username
                      {sortConfig.key === "userName" && (
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
                      onClick={() => handleSort("role")}
                    >
                      Role
                      {sortConfig.key === "role" && (
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
                  {sortedEmployees.map((employee) => (
                    <tr key={employee.employeeID} className="hover:bg-gray-50">
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {employee.employeeID}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {employee.userName}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {employee.email}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {employee.phone}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {employee.role}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                        {employee.isActive ? "Yes" : "No"}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 border-b">
                        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                          <button
                            onClick={() => handleRead(employee)}
                            className="bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-blue-600 text-sm sm:text-base"
                          >
                            Read
                          </button>
                          <button
                            onClick={() => handleUpdate(employee)}
                            className="bg-green-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-green-600 text-sm sm:text-base"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(employee)}
                            className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-red-600 text-sm sm:text-base"
                          >
                            Delete
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

export default ManageEmployees;
