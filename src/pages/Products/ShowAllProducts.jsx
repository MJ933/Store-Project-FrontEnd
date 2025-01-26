import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../../components/ProductCard";
import ModernLoader from "../../components/ModernLoader";
import API from "../../Classes/clsAPI";
import Pagination from "../../components/Pagination";

const ShowAllProducts = ({ selectedCategoryId = null }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const searchQuery = useSelector((state) => state.search.searchQuery);
  const api = new API();

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      let url = `${api.baseURL()}/API/ProductsAPI/GetAllProductsWithItsImagePagedWithSearch?pageNumber=${currentPage}&pageSize=${pageSize}`;
      if (selectedCategoryId) url += `&categoryId=${selectedCategoryId}`;
      if (searchQuery) url += `&searchTerm=${searchQuery}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle specific HTTP status codes
      if (response.status === 404) {
        setError("No products found for the selected category.");
        setProducts([]); // Clear existing products
        setTotalCount(0); // Reset total count
        return;
      }

      if (response.status === 401) {
        setError("Unauthorized. Please log in.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.items);
      setTotalCount(data.totalCount);
      setError(null); // Clear any previous errors
    } catch (error) {
      setError(error.message);
      setProducts([]); // Clear products in case of error
      setTotalCount(0); // Reset total count
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
    // window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, selectedCategoryId, searchQuery]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <ModernLoader />
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500">No products found.</div>
        ) : (
          <>
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((item, index) => (
                <ProductCard
                  key={`${item.product?.productID}-${item.image?.imageID}-${index}`}
                  product={item.product}
                  image={item.image}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShowAllProducts;
