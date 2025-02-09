import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../redux/features/cart/cartSlice";
import { FaCartPlus } from "react-icons/fa6";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

const ProductCard = ({ product, image }) => {
  const { t } = useTranslation(); // Initialize the translation hook
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
    e.target.onerror = null;
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer border border-gray-100 overflow-hidden hover:-translate-y-1"
      onClick={handleProductClick}
    >
      <div className="relative w-full aspect-square overflow-hidden group">
        {image?.imageURL ? (
          <img
            src={image.imageURL}
            alt={product.productName}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
            {t("productCard.noImageAvailable")}
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span
            className={`text-xs px-3 py-1 rounded-full ${
              product.isActive
                ? "bg-green-500/20 text-green-700"
                : "bg-red-500/20 text-red-700"
            }`}
          >
            {product.isActive
              ? t("productCard.inStock")
              : t("productCard.outOfStock")}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow gap-2">
        <h3 className="text-gray-900 font-medium text-sm sm:text-base line-clamp-2">
          {product.productName}
        </h3>

        <p className="text-lg font-bold text-gray-900 mt-1">
          ${product.sellingPrice?.toFixed(2) || "0.00"}
        </p>

        <p className="text-gray-500 text-sm line-clamp-3 mb-3">
          {product.description || t("productCard.noDescriptionAvailable")}
        </p>

        <button
          className=" mt-auto w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-semibold py-3 rounded-lg transition-all duration-300   flex items-center justify-center gap-2 disabled:opacity-70 disabled:bg-gray-400 disabled:bg-none disabled:cursor-not-allowed"
          onClick={handleAddToCart}
          disabled={!product.isActive}
        >
          {product.isActive ? (
            <>
              <FaCartPlus className="text-base  min-[350px]:inline hidden " />
              <span className="min-[350px]:text-xs text-xs">
                {t("productCard.addToCart")}
              </span>
            </>
          ) : (
            <span className="min-[350px]:text-xs text-xs">
              {t("productCard.unavailable")}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
