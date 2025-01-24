// ManageProducts.js
import React, { useEffect, useState, useCallback } from "react";
import AddNewUpdateProduct from "./AddUpdateProduct";
import DeleteProduct from "./DeleteProduct";
import ProductPage from "./ProductPage";
import Product from "../../Classes/clsProduct";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showUpdateProduct, setShowUpdateProduct] = useState(false);
  const [showDeleteProduct, setShowDeleteProduct] = useState(false);
  const [showReadProduct, setShowReadProduct] = useState(false);
  const [product, setProduct] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "productID",
    direction: "desc",
  });

  const fetchProducts = useCallback(async () => {
    try {
      const productInstance = new Product();
      const data = await productInstance.fetchProducts(); // Use await here
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch products when the component mounts or when `refreshProducts` changes
  useEffect(() => {
    fetchProducts();
  }, [product]);

  const handleAdd = () => {
    setShowAddProduct(true);
    setShowUpdateProduct(false);
    setShowReadProduct(false);
    setShowDeleteProduct(false);
    setProduct(null);
    // Show the add product form
  };

  // Callback when a new product is added

  // Callback for the "Read" button
  const handleRead = (currentProduct) => {
    setShowReadProduct(true);
    setShowAddProduct(false);
    setShowUpdateProduct(false);
    setShowDeleteProduct(false);
    setProduct(currentProduct);
  };

  // Callback for the "Update" button
  const handleUpdate = (currentProduct) => {
    setShowAddProduct(false);
    setShowUpdateProduct(true);
    setShowReadProduct(false);
    setShowDeleteProduct(false);
    setProduct(currentProduct);
  };
  const handleDelete = (currentProduct) => {
    setShowReadProduct(false);
    setShowAddProduct(false);
    setShowUpdateProduct(false);
    setShowDeleteProduct(true);
    setProduct(currentProduct);
  };

  const handelCloseCRUDOperationProduct = () => {
    setShowReadProduct(false);
    setShowUpdateProduct(false);
    setShowAddProduct(false);
    setShowDeleteProduct(false);
    setProduct(null);
  };
  // Callback for the "Delete" button

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

  // Sort products based on sortConfig
  const sortedProducts = React.useMemo(() => {
    if (!sortConfig.key) return products;

    return [...products].sort((a, b) => {
      if (a.product[sortConfig.key] < b.product[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a.product[sortConfig.key] > b.product[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [products, sortConfig]);

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  if (products.length === 0) {
    return <div className="text-center text-gray-600">No products found.</div>;
  }

  return (
    <div>
      {showAddProduct && (
        <AddNewUpdateProduct
          product={{ product: null, image: null }}
          isShow={showAddProduct}
          onClose={handelCloseCRUDOperationProduct}
        />
      )}
      {showUpdateProduct && (
        <AddNewUpdateProduct
          product={product}
          isShow={showUpdateProduct}
          onClose={handelCloseCRUDOperationProduct}
        />
      )}
      {showDeleteProduct && (
        <DeleteProduct
          product={product}
          isShow={showDeleteProduct}
          onClose={handelCloseCRUDOperationProduct}
        />
      )}
      {showReadProduct && (
        <ProductPage
          product={product}
          isShow={showReadProduct}
          onClose={handelCloseCRUDOperationProduct}
        />
      )}
      {!showAddProduct &&
        !showUpdateProduct &&
        !showDeleteProduct &&
        !showReadProduct && (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
              Products List
            </h1>
            <div className="mb-6 text-center">
              <button
                onClick={handleAdd}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-sm sm:text-base"
              >
                Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-100">
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("productID")}
                    >
                      Product ID
                      {sortConfig.key === "productID" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("productName")}
                    >
                      Product Name
                      {sortConfig.key === "productName" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("initialPrice")}
                    >
                      Initial Price
                      {sortConfig.key === "initialPrice" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("sellingPrice")}
                    >
                      Selling Price
                      {sortConfig.key === "sellingPrice" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("categoryID")}
                    >
                      Category ID
                      {sortConfig.key === "categoryID" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th
                      className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base cursor-pointer"
                      onClick={() => handleSort("stockQuantity")}
                    >
                      Stock Quantity
                      {sortConfig.key === "stockQuantity" && (
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
                      Image
                    </th>
                    <th className="py-2 px-3 sm:py-3 sm:px-4 border-b text-left text-sm sm:text-base">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.map((item) => {
                    if (!item.product) {
                      return null; // Skip rendering if the product is undefined
                    }
                    return (
                      <tr
                        key={item.product.productID}
                        className="hover:bg-gray-50"
                      >
                        <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                          {item.product.productID}
                        </td>
                        <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                          {item.product.productName}
                        </td>
                        <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                          ${item.product.initialPrice.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                          ${item.product.sellingPrice.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                          {item.product.categoryID}
                        </td>
                        <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                          {item.product.stockQuantity}
                        </td>
                        <td className="py-2 px-3 sm:py-3 sm:px-4 border-b text-sm sm:text-base">
                          {item.product.isActive ? "Yes" : "No"}
                        </td>
                        <td className="py-2 px-3 sm:py-3 sm:px-4 border-b">
                          {item.image && item.image.isPrimary && (
                            <div className="w-12 h-12 overflow-hidden rounded-lg border border-gray-200">
                              <img
                                src={item.image.imageURL}
                                alt={item.product.productName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3 sm:py-3 sm:px-4 border-b">
                          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                            <button
                              onClick={() => handleRead(item)}
                              className="bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-blue-600 text-sm sm:text-base"
                            >
                              Read
                            </button>
                            <button
                              onClick={() => handleUpdate(item)}
                              className="bg-green-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-green-600 text-sm sm:text-base"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded hover:bg-red-600 text-sm sm:text-base"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
};

export default ManageProducts;
