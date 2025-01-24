import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { FaCartPlus, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import API from "../../Classes/clsAPI";

const ProductPage = () => {
  const { productID } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const dispatch = useDispatch();
  const api = new API();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `${api.baseURL()}API/ProductsAPI/GetProductAndImageByID/${productID}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        console.log("API Response:", data);

        // Check if the response is an array and take the first item
        if (Array.isArray(data) && data.length > 0) {
          setProduct(data[0]);
        } else if (data && data.product) {
          setProduct(data);
        } else {
          throw new Error("Invalid product data structure");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productID]);

  const handleAddToCart = () => {
    if (!product || !product.product) return;

    dispatch(
      addToCart({
        productID: product.product.productID,
        quantity: quantity,
        price: product.product.sellingPrice,
        imageUrl: product.image?.imageURL || "No Image URL",
        productName: product.product.productName,
      })
    );
  };

  const handleQuantityChange = (value) => {
    if (value < 1 || value > product.product.stockQuantity) return;
    setQuantity(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h3 className="text-2xl font-bold text-red-600 mb-4">Error</h3>
          <p className="text-gray-600">{`Error: ${error}`}</p>
        </div>
      </div>
    );
  }

  if (!product || !product.product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            No Product Found
          </h3>
          <p className="text-gray-600">
            Please check the product ID and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Product Hero Section */}
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2 p-8">
            <div className="relative w-full aspect-square overflow-hidden rounded-lg">
              <img
                src={
                  product.image?.imageURL ||
                  "https://dummyimage.com/500x500/cccccc/000000&text=No+Image"
                }
                alt={product.product.productName}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src =
                    "https://dummyimage.com/500x500/cccccc/000000&text=No+Image";
                  e.target.onerror = null; // Prevent infinite loop
                }}
              />
              <a
                href={product.image?.imageURL}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                View Full Size
              </a>
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.product.productName}
            </h1>
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-2xl font-semibold text-green-600">
                ${product.product.sellingPrice}
              </span>
              {product.product.sellingPrice && (
                <span className="text-lg text-gray-500 line-through">
                  $
                  {product.product.sellingPrice +
                    product.product.sellingPrice / 20}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  product.product.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {product.product.isActive ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-gray-600 mb-2">Quantity:</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <FaChevronDown className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.product.stockQuantity}
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value))
                  }
                  className="w-16 p-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.product.stockQuantity}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <FaChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300 flex items-center justify-center"
              onClick={handleAddToCart}
              disabled={!product.product.isActive}
            >
              <FaCartPlus className="mr-2" /> Add to Cart
            </button>
          </div>
        </div>

        {/* Product Description */}
        <div className="border-t border-gray-200 p-8">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          >
            <h2 className="text-xl font-bold text-gray-900">Description</h2>
            <FaChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                isDescriptionOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          {isDescriptionOpen && (
            <p className="mt-4 text-gray-600">{product.product.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
