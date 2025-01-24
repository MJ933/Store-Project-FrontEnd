import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { addToCart } from "../redux/features/cart/cartSlice";
import { FaCartPlus } from "react-icons/fa6";

const ProductCard = ({ product, image }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  if (!product) return null;

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent the click event from bubbling up to the card
    dispatch(
      addToCart({
        productID: product.productID,
        quantity: 1,
        price: product.sellingPrice,
        imageUrl: image?.imageURL || "No Image URL",
        productName: product.productName,
      })
    );
  };

  const handleProductClick = () => {
    // Navigate to the product details page with the product ID
    navigate(`/products/${product.productID}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full cursor-pointer"
      onClick={handleProductClick} // Add click handler to the card
    >
      <div className="relative w-full aspect-square overflow-hidden">
        {image?.imageURL ? (
          <img
            src={image.imageURL}
            alt={product.productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
            No Image Available
          </div>
        )}
        <div className="absolute top-0 right-0 p-2">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              product.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.isActive ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.productName}
        </h3>
        <p className="text-xs text-gray-600 mb-2">
          <span className="font-bold text-gray-900">
            ${product.sellingPrice.toFixed(2)}
          </span>
        </p>
        <p className="text-xs text-gray-600 mb-4 line-clamp-3">
          {product.description}
        </p>

        <button
          className="mt-auto w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300 text-sm flex items-center justify-center"
          onClick={handleAddToCart}
          disabled={!product.isActive}
        >
          {product.isActive ? <FaCartPlus className="mr-2" /> : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
