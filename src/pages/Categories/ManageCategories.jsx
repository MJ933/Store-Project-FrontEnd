import React, { useEffect, useState, useCallback, useRef } from "react";
import AddUpdateCategory from "./AddUpdateCategory";
import DeleteCategory from "./DeleteCategory";
import { FiEye, FiEdit, FiTrash2, FiPlus, FiFilter, FiX } from "react-icons/fi";
import API from "../../Classes/clsAPI";
import Alert from "../../components/Alert";
import ModernLoader from "../../components/ModernLoader";
import { useTranslation } from "react-i18next";
import Pagination from "../../components/Pagination";
import { handleError } from "../../utils/handleError";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");
  const { t } = useTranslation();
  const scrollPositionRef = useRef(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [filterCategoryID, setFilterCategoryID] = useState("");
  const [filterCategoryName, setFilterCategoryName] = useState("");
  const [filterParentCategoryID, setFilterParentCategoryID] = useState("");
  const [filterIsActive, setFilterIsActive] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    categoryID: "",
    categoryName: "",
    parentCategoryID: "",
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

  const fetchPaginatedCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    // scrollPositionRef.current = window.scrollY;
    try {
      const url = new URL(
        `${new API().baseURL()}/API/CategoriesAPI/GetCategoriesPaginatedWithFilters`
      );
      const params = new URLSearchParams();
      params.append("pageNumber", currentPage);
      params.append("pageSize", pageSize);
      if (appliedFilters.categoryID)
        params.append("categoryID", appliedFilters.categoryID);
      if (appliedFilters.categoryName)
        params.append("categoryName", appliedFilters.categoryName);
      if (appliedFilters.parentCategoryID)
        params.append("parentCategoryID", appliedFilters.parentCategoryID);
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
        const errorData = await response.text(); // First get as text
        let parsedError;
        if (response.status === 404) {
          setCategories([]);
          setTotalCount(0);
          setTotalPages(0);
          return;
        }
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
      setCategories(data.categoriesList);
      setTotalCount(data.totalCount);
      setTotalPages(Math.ceil(data.totalCount / pageSize));
    } catch (err) {
      setError(err.message);
      setCategories([]);
      setTotalCount(0);
      setTotalPages(0);
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, appliedFilters]);

  useEffect(() => {
    fetchPaginatedCategories();
  }, [fetchPaginatedCategories, appliedFilters]);

  // useEffect(() => {
  //   if (!loading) {
  //     window.scrollTo({
  //       top: scrollPositionRef.current,
  //       behavior: "auto",
  //     });
  //   }
  // }, [loading]);

  const handleView = (view, category = null) => {
    setCurrentView(view);
    setSelectedCategory(category);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleFilterChange = (e, filterSetter) => {
    filterSetter(e.target.value);
  };

  const applyFilters = () => {
    setAppliedFilters({
      categoryID: filterCategoryID,
      categoryName: filterCategoryName,
      parentCategoryID: filterParentCategoryID,
      isActive: filterIsActive,
    });
    setCurrentPage(1);
    setFilterChanged((prev) => !prev);
  };

  const clearFilters = () => {
    setFilterCategoryID("");
    setFilterCategoryName("");
    setFilterParentCategoryID("");
    setFilterIsActive("");
    setCurrentPage(1);
    setAppliedFilters({
      categoryID: "",
      categoryName: "",
      parentCategoryID: "",
      isActive: "",
    });
  };

  const toggleFiltersVisibility = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  if (loading) return <ModernLoader />;
  // if (error)
  //   return (
  //     <div className="p-4 text-red-500">
  //       {t("manageCategories.error")} {error}
  //     </div>
  //   );
  // if (categories?.length === 0 && !loading && !error && !isFiltersVisible)
  //   return (
  //     <div className="p-4 text-gray-500">
  //       {t("manageCategories.noCategoriesFound")}
  //     </div>
  //   );
  // if (categories?.length === 0 && !loading && !error && isFiltersVisible)
  //   return (
  //     <Alert
  //       message={t("manageCategories.noCategoriesFound")}
  //       type={"failure"}
  //     />
  //   );
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
      {categories?.length === 0 && !loading && !error && !isFiltersVisible && (
        <div className="p-4 text-gray-500">
          {t("manageCategories.noCategoriesFound")}
        </div>
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
              {t("manageCategories.categoriesTitle")}
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
                    ? t("manageCategories.hideFiltersButton")
                    : t("manageCategories.showFiltersButton")}
                </span>
              </button>
              <button
                onClick={() => handleView("add")}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center justify-center gap-2 w-full md:w-auto"
              >
                <FiPlus className="text-lg" />
                <span className="hidden sm:inline">
                  {t("manageCategories.newCategoryButton")}
                </span>
              </button>
            </div>
          </div>

          {isFiltersVisible && (
            <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterCategoryID"
                  >
                    {t("manageCategories.categoryIDHeader")}:
                  </label>
                  <input
                    type="number"
                    id="filterCategoryID"
                    placeholder={t("manageCategories.categoryIDHeader")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterCategoryID}
                    onChange={(e) => handleFilterChange(e, setFilterCategoryID)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterCategoryName"
                  >
                    {t("manageCategories.categoryNameHeader")}:
                  </label>
                  <input
                    type="text"
                    id="filterCategoryName"
                    placeholder={t("manageCategories.categoryNameHeader")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterCategoryName}
                    onChange={(e) =>
                      handleFilterChange(e, setFilterCategoryName)
                    }
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterParentCategoryID"
                  >
                    {t("manageCategories.parentCategoryIDHeader")}:
                  </label>
                  <input
                    type="number"
                    id="filterParentCategoryID"
                    placeholder={t("manageCategories.parentCategoryIDHeader")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterParentCategoryID}
                    onChange={(e) =>
                      handleFilterChange(e, setFilterParentCategoryID)
                    }
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="filterIsActive"
                  >
                    {t("manageCategories.isActiveHeader")}:
                  </label>
                  <select
                    id="filterIsActive"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={filterIsActive}
                    onChange={(e) => handleFilterChange(e, setFilterIsActive)}
                    onKeyDown={handleKeyDown}
                  >
                    <option value="">{t("manageCategories.allStatus")}</option>
                    <option value="true">
                      {t("manageCategories.activeStatus")}
                    </option>
                    <option value="false">
                      {t("manageCategories.inactiveStatus")}
                    </option>
                  </select>
                </div>
                <div className="flex items-end justify-end gap-2">
                  <button
                    onClick={clearFilters}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    {t("manageCategories.clearFiltersButton")}
                  </button>
                  <button
                    onClick={applyFilters}
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    {t("manageCategories.applyFiltersButton")}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <div className="px-4 py-2 flex flex-col sm:flex-row justify-between items-center">
              <span className="text-sm text-gray-700">
                {t("manageCategories.totalCategoriesText")}:{" "}
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
                    "categoryID",
                    "categoryName",
                    "parentCategoryID",
                    "isActive",
                  ].map((key) => (
                    <th
                      key={key}
                      className={`px-2 py-2 md:px-4 md:py-3 text-left text-sm font-medium text-gray-500 cursor-pointer ${
                        ["isActive"].includes(key) ? "hidden sm:table-cell" : ""
                      }`}
                    >
                      {t(`manageCategories.${key}Header`, {
                        defaultValue: key.replace(/([A-Z])/g, " $1").trim(),
                      })}
                    </th>
                  ))}
                  <th className="px-2 py-2 md:px-4 md:py-3 text-left text-sm font-medium text-gray-500">
                    {t("manageCategories.actionsHeader")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories?.map((category) => (
                  <tr key={category.categoryID} className="hover:bg-gray-50">
                    <td className="  px-2 py-2 md:px-4 md:py-3 text-sm text-gray-700">
                      {category.categoryID}
                    </td>
                    <td
                      className={`px-2 py-2 md:px-4 md:py-3 text-sm ${
                        category.isActive ? "text-gray-600" : "text-red-600"
                      } `}
                    >
                      {category.categoryName.length > 0
                        ? category.categoryName.substring(0, 7) + "..."
                        : category.categoryName}
                    </td>
                    <td className="text-[calc(0.5rem+1vw)]   px-2 py-2 md:px-4 md:py-3 sm:text-sm text-gray-600">
                      {category.parentCategoryID || t("manageCategories.na")}
                    </td>
                    <td className="hidden sm:table-cell px-2 py-2 md:px-4 md:py-3">
                      <span
                        className={`text-[calc(0.4rem+1vw)] px-2 py-1 rounded-full sm:text-xs font-medium whitespace-nowrap ${
                          statusStyles[category.isActive] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {category.isActive
                          ? t("manageCategories.activeStatus")
                          : t("manageCategories.inactiveStatus")}
                      </span>
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3">
                      <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-3">
                        <button
                          onClick={() => handleView("update", category)}
                          className="text-gray-600 hover:text-green-600"
                          title={t("manageCategories.editTitle")}
                        >
                          <FiEdit className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => handleView("delete", category)}
                          className="text-gray-600 hover:text-red-600"
                          title={t("manageCategories.deleteTitle")}
                        >
                          <FiTrash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-2 flex flex-col sm:flex-row justify-between items-center gap-2">
              <span className="text-sm text-gray-700">
                {t("manageCategories.totalCategoriesText")}:{" "}
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
            <AddUpdateCategory
              category={currentView === "update" ? selectedCategory : null}
              isShow={true}
              onClose={() => handleView(null)}
              showAlert={showAlert}
              refreshCategories={fetchPaginatedCategories}
            />
          )}

          {currentView === "delete" && (
            <DeleteCategory
              category={selectedCategory}
              isShow={true}
              onClose={() => handleView(null)}
              showAlert={showAlert}
              refreshCategories={fetchPaginatedCategories}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
