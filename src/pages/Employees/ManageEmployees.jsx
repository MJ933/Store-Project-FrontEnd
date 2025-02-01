import React, { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

import AddUpdateEmployee from "./AddUpdateEmployee";
import DeleteEmployee from "./DeleteEmployee";
import EmployeePage from "./EmployeePage";
import Pagination from "../../components/Pagination";
import { FiEye, FiEdit, FiTrash2, FiPlus, FiFilter, FiX } from "react-icons/fi";
import API from "../../Classes/clsAPI";
import Alert from "../../components/Alert";
import ModernLoader from "../../components/ModernLoader";
import { handleError } from "../../utils/handleError";

const ManageEmployees = () => {
  const { t } = useTranslation();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "employeeID",
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

  const [filterEmployeeID, setFilterEmployeeID] = useState("");
  const [filterUserName, setFilterUserName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterIsActive, setFilterIsActive] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    employeeID: "",
    userName: "",
    email: "",
    phone: "",
    role: "",
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

  const fetchPaginatedEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    scrollPositionRef.current = window.scrollY;
    try {
      const url = new URL(
        `${new API().baseURL()}/API/EmployeesAPI/GetEmployeesPaginatedWithFilters`
      );
      const params = new URLSearchParams();
      params.append("pageNumber", currentPage);
      params.append("pageSize", pageSize);
      if (appliedFilters.employeeID)
        params.append("employeeID", appliedFilters.employeeID);
      if (appliedFilters.userName)
        params.append("userName", appliedFilters.userName);
      if (appliedFilters.email) params.append("email", appliedFilters.email);
      if (appliedFilters.phone) params.append("phone", appliedFilters.phone);
      if (appliedFilters.role) params.append("role", appliedFilters.role);
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
          setEmployees([]);
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
      setEmployees(data.employees);
      setTotalCount(data.totalCount);
      setTotalPages(Math.ceil(data.totalCount / pageSize));
    } catch (err) {
      setError(err.message);
      setEmployees([]);
      setTotalCount(0);
      setTotalPages(0);
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, appliedFilters]);

  useEffect(() => {
    fetchPaginatedEmployees();
  }, [fetchPaginatedEmployees, appliedFilters]);

  useEffect(() => {
    if (!loading) {
      window.scrollTo({
        top: scrollPositionRef.current,
        behavior: "auto",
      });
    }
  }, [loading]);

  const handleView = (view, employee = null) => {
    setCurrentView(view);
    setSelectedEmployee(employee);
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
  }, [employees, sortConfig, filterChanged]);

  const handleFilterChange = (e, filterSetter) => {
    filterSetter(e.target.value);
  };

  const applyFilters = () => {
    setAppliedFilters({
      employeeID: filterEmployeeID,
      userName: filterUserName,
      email: filterEmail,
      phone: filterPhone,
      role: filterRole,
      isActive: filterIsActive,
    });
    setCurrentPage(1);
    setFilterChanged((prev) => !prev);
  };

  const clearFilters = () => {
    setFilterEmployeeID("");
    setFilterUserName("");
    setFilterEmail("");
    setFilterPhone("");
    setFilterRole("");
    setFilterIsActive("");
    setCurrentPage(1);
    setAppliedFilters({
      employeeID: "",
      userName: "",
      email: "",
      phone: "",
      role: "",
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
      {employees?.length === 0 && !loading && !error && isFiltersVisible && (
        <Alert
          message={t("manageEmployees.noEmployeesFound")}
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
              {t("manageEmployees.employeesTitle")}
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
                    ? t("manageEmployees.hideFiltersButton")
                    : t("manageEmployees.showFiltersButton")}
                </span>
              </button>
              <button
                onClick={() => handleView("add")}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                <FiPlus className="text-lg" />
                <span className="hidden sm:inline">
                  {t("manageEmployees.newEmployeeButton")}
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
                    htmlFor="filterEmployeeID"
                  >
                    {t("manageEmployees.employeeIDHeader")}:
                  </label>
                  <input
                    type="number"
                    id="filterEmployeeID"
                    placeholder={t("manageEmployees.employeeIDHeader")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterEmployeeID}
                    onChange={(e) => handleFilterChange(e, setFilterEmployeeID)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterUserName"
                  >
                    {t("manageEmployees.userNameHeader")}:
                  </label>
                  <input
                    type="text"
                    id="filterUserName"
                    placeholder={t("manageEmployees.userNameHeader")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterUserName}
                    onChange={(e) => handleFilterChange(e, setFilterUserName)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterEmail"
                  >
                    {t("manageEmployees.emailHeader")}:
                  </label>
                  <input
                    type="email"
                    id="filterEmail"
                    placeholder={t("manageEmployees.emailHeader")}
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
                    {t("manageEmployees.phoneHeader")}:
                  </label>
                  <input
                    type="text"
                    id="filterPhone"
                    placeholder={t("manageEmployees.phoneHeader")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterPhone}
                    onChange={(e) => handleFilterChange(e, setFilterPhone)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterRole"
                  >
                    {t("manageEmployees.roleHeader")}:
                  </label>
                  <input
                    type="text"
                    id="filterRole"
                    placeholder={t("manageEmployees.roleHeader")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterRole}
                    onChange={(e) => handleFilterChange(e, setFilterRole)}
                    onKeyDown={handleKeyDown}
                  />
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterIsActive"
                  >
                    {t("manageEmployees.isActiveHeader")}:
                  </label>
                  <select
                    id="filterIsActive"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterIsActive}
                    onChange={(e) => handleFilterChange(e, setFilterIsActive)}
                    onKeyDown={handleKeyDown}
                  >
                    <option value="">{t("manageEmployees.allStatus")}</option>
                    <option value="true">
                      {t("manageEmployees.activeStatus")}
                    </option>
                    <option value="false">
                      {t("manageEmployees.inactiveStatus")}
                    </option>
                  </select>
                </div>

                <div className="flex items-end justify-end gap-2">
                  <button
                    onClick={clearFilters}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    {t("manageEmployees.clearFiltersButton")}
                  </button>
                  <button
                    onClick={applyFilters}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    {t("manageEmployees.applyFiltersButton")}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <div className="px-4 py-2 flex justify-between items-center">
              <span className="text-sm text-gray-700">
                {t("manageEmployees.totalEmployeesText")}:{" "}
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
                    "employeeID",
                    "userName",
                    "email",
                    "phone",
                    "role",
                    "isActive",
                  ]?.map((key) => (
                    <th
                      key={key}
                      className="px-2 py-2 md:px-4 md:py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort(key)}
                    >
                      {t(`manageEmployees.${key}Header`)}{" "}
                      {sortConfig.key === key && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                  ))}
                  <th className="px-2 py-2 md:px-4 md:py-3 text-left text-sm font-medium text-gray-500">
                    {t("manageEmployees.actionsHeader")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedEmployees?.map((employee) => (
                  <tr key={employee.employeeID} className="hover:bg-gray-50">
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-700">
                      {employee.employeeID}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                      {employee.userName}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                      {employee.email}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                      {employee.phone}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-600">
                      {employee.role}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusStyles[employee.isActive] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {employee.isActive
                          ? t("manageEmployees.activeStatus")
                          : t("manageEmployees.inactiveStatus")}
                      </span>
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3">
                      <div className="flex items-center gap-2 md:gap-3">
                        <button
                          onClick={() => handleView("read", employee)}
                          className="text-gray-600 hover:text-blue-600"
                          title={t("manageEmployees.viewTitle")}
                        >
                          <FiEye className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => handleView("update", employee)}
                          className="text-gray-600 hover:text-green-600"
                          title={t("manageEmployees.editTitle")}
                        >
                          <FiEdit className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => handleView("delete", employee)}
                          className="text-gray-600 hover:text-red-600"
                          title={t("manageEmployees.deleteTitle")}
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
                {t("manageEmployees.totalEmployeesText")}:{" "}
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
            <AddUpdateEmployee
              employee={currentView === "update" ? selectedEmployee : null}
              isShow={true}
              onClose={() => handleView(null)}
              showAlert={showAlert}
              refreshEmployees={fetchPaginatedEmployees}
            />
          )}

          {currentView === "read" && (
            <EmployeePage
              employee={selectedEmployee}
              isShow={true}
              onClose={() => handleView(null)}
            />
          )}

          {currentView === "delete" && (
            <DeleteEmployee
              employee={selectedEmployee}
              isShow={true}
              onClose={() => handleView(null)}
              showAlert={showAlert}
              refreshEmployees={fetchPaginatedEmployees}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ManageEmployees;
