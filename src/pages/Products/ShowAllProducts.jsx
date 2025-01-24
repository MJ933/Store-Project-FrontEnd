import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../../components/ProductCard";
import API from "../../Classes/clsAPI";

const ShowAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchQuery = useSelector((state) => state.search.searchQuery); // Access searchQuery from Redux store
  const api = new API();

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${api.baseURL()}API/ProductsAPI/GetALLWithImg`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on searchQuery
  const filteredProducts = searchQuery
    ? products.filter((item) =>
        item.product?.productName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-4 animate-pulse"
              >
                <div className="aspect-w-1 aspect-h-1 bg-gray-300 rounded-lg"></div>
                <div className="mt-4 space-y-2">
                  <div className="bg-gray-300 h-4 rounded"></div>
                  <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{`Error: ${error}`}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredProducts.map((item, index) => (
              <ProductCard
                key={`${item.product?.productID}-${item.image?.imageID}-${index}`} // Ensure unique key
                product={item.product}
                image={item.image}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowAllProducts;
