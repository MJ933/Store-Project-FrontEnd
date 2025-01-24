import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../redux/features/cart/cartSlice";
import { FaCartPlus } from "react-icons/fa6";

const ProductCard = ({ product, image }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!product) return null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
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
    navigate(`/products/${product.productID}`);
  };

  const handleImageError = (e) => {
    e.target.src = "https://dummyimage.com/300x300/cccccc/000000&text=No+Image";
    e.target.onerror = null; // Prevent infinite loop
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full cursor-pointer"
      onClick={handleProductClick}
    >
      <div className="relative w-full aspect-square overflow-hidden">
        {image?.imageURL ? (
          <img
            src={image.imageURL}
            alt={product.productName}
            className="w-full h-full object-cover"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
            No Image Available
          </div>
        )}
        <div className="absolute top-0 right-0 p-2">
          <span
            className={`text-[clamp(0.7rem,1.5vw,0.75rem)] leading-tight px-[clamp(0.25rem,1.5vw,0.5rem)] py-[clamp(0.1rem,1vw,0.25rem)] font-semibold rounded-full ${
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
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-bold text-gray-900">
            ${product.sellingPrice?.toFixed(2) || "0.00"}
          </span>
        </p>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {product.description || "No description available"}
        </p>

        <button
          className="mt-auto w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300 text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAddToCart}
          disabled={!product.isActive}
        >
          {product.isActive ? (
            <>
              <FaCartPlus className="mr-2" />
              Add to Cart
            </>
          ) : (
            "Out of Stock"
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
