import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import {
  FaCartPlus,
  FaChevronDown,
  FaChevronUp,
  FaArrowLeft,
  FaWhatsapp,
} from "react-icons/fa6";
import API from "../../Classes/clsAPI";
import Alert from "../../components/Alert";
// Import your translation function here, assuming you have i18n setup
import { useTranslation } from "react-i18next"; // assuming you are using react-i18next, if not adjust accordingly

const ProductPage = () => {
  const { productID } = useParams();
  console.log("ProductPage - productID:", productID);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const dispatch = useDispatch();
  const api = new API();
  const navigate = useNavigate();
  const { t } = useTranslation(); // initialize translation hook

  // **WhatsApp Button Functionality Start**
  const openWhatsApp = () => {
    if (!product?.product) return;

    // Replace with your actual WhatsApp number and customize the message
    const whatsappNumber = "+1234567890"; // Replace with your business WhatsApp number
    const message = `Hello! I'm interested in the product: ${product.product.productName} (Product ID: ${product.product.productID}).`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappLink, "_blank"); // Open in a new tab
  };
  // **WhatsApp Button Functionality End**

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${api.baseURL()}/API/ProductsAPI/GetProductAndImageByID/${productID}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          const message = `Network response was not ok: ${response.status} ${response.statusText}`;
          console.error("API Error:", message);
          throw new Error(message);
        }
        const data = await response.json();
        console.log("API Response:", data);

        if (Array.isArray(data) && data.length > 0) {
          setProduct(data[0]);
        } else if (data && data.product) {
          setProduct(data);
        } else {
          throw new Error("Invalid product data structure received from API");
        }
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    if (productID) {
      fetchProductDetails();
    } else {
      setLoading(false);
      setError("Product ID is missing.");
    }
  }, [productID]);

  const handleAddToCart = () => {
    if (!product?.product) return;

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
    if (!product?.product) return;
    if (value < 1 || value > product.product.stockQuantity) return;
    setQuantity(value);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      {" "}
      {/* Adjusted py to py-6 for mobile, kept sm and lg px */}
      {error && <Alert message={error} type={"failure"} />}
      {!product || !product.product ? (
        <Alert
          message={
            t("productPage.productNotFound") // Use translation key
          }
          type={"failure"}
        />
      ) : (
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Product Hero Section */}
          <div className="block md:flex">
            {" "}
            {/* Changed to block on mobile, flex on md and above */}
            {/* Product Image */}
            <div className="md:w-1/3 p-4 md:p-8 relative">
              {" "}
              {/* Adjusted md:w-1/3 and padding for mobile and desktop */}{" "}
              {/* Make image container relative */}
              <button
                onClick={handleGoBack}
                className="absolute top-2 left-2 md:top-4 md:left-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-3 rounded-full focus:outline-none focus:shadow-outline shadow-md text-sm md:text-base" // Adjusted padding and text size for mobile
                style={{ zIndex: 10 }} // Ensure it's above image if needed
              >
                <FaArrowLeft className="mr-2" /> {t("productPage.backButton")}{" "}
                {/* Use translation key */}
              </button>
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
                    e.target.onerror = null;
                  }}
                />
                <a
                  href={product.image?.imageURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-white px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200" // Adjusted padding and text size for mobile
                >
                  {t("productPage.viewFullSize")} {/* Use translation key */}
                </a>
              </div>
            </div>
            {/* Product Details */}
            <div className="md:w-2/3 p-4 md:p-8">
              {" "}
              {/* Adjusted md:w-2/3 and padding for mobile and desktop */}
              {/* No Back button here anymore, it's moved to image section */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">
                {" "}
                {product.product.productName}
              </h1>
              <div className="flex items-center space-x-2 mb-4 md:mb-6">
                {" "}
                {/* Reduced margin for mobile */}
                <span className="text-xl md:text-2xl font-semibold text-green-600">
                  {" "}
                  ${product.product.sellingPrice}
                </span>
                {product.product.sellingPrice && (
                  <span className="text-base md:text-lg text-gray-500 line-through">
                    {" "}
                    $
                    {product.product.sellingPrice +
                      product.product.sellingPrice / 20}
                  </span>
                )}
              </div>
              {/* Stock Status */}
              <div className="mb-4 md:mb-6">
                {" "}
                {/* Reduced margin for mobile */}
                <span
                  className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold ${
                    // Adjusted padding and text size for mobile
                    product.product.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.product.isActive
                    ? t("productPage.inStock")
                    : t("productPage.outOfStock")}{" "}
                  {/* Use translation key */}
                </span>
              </div>
              {/* Quantity Selector */}
              <div className="mb-4 md:mb-6">
                {" "}
                {/* Reduced margin for mobile */}
                <label className="block text-gray-600 mb-1 md:mb-2 text-sm md:text-base">
                  {t("productPage.quantityLabel")}: {/* Use translation key */}
                </label>{" "}
                {/* Reduced margin and text size for mobile */}
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
                    className="w-16 p-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" // Reduced text size for mobile
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
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 md:py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300 flex items-center justify-center text-base md:text-base mb-2" // Adjusted padding and text size for mobile and added mb-2
                onClick={handleAddToCart}
                disabled={!product.product.isActive}
              >
                <FaCartPlus className="mx-2" />{" "}
                {t("productPage.addToCartButton")} {/* Use translation key */}{" "}
              </button>
              {/* **WhatsApp Button Added Here** */}
              <button
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 md:py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300 flex items-center justify-center text-base md:text-base" // Styling similar to Add to Cart
                onClick={openWhatsApp}
              >
                <FaWhatsapp className="mx-2" size={20} />{" "}
                {/* Add WhatsApp Icon */} {t("productPage.whatsappButton")}{" "}
                {/* Translation key for WhatsApp button text - you'll need to add this to your translation files */}
              </button>
            </div>
          </div>

          {/* Product Description */}
          <div className="border-t border-gray-200 p-4 md:p-8">
            {" "}
            {/* Adjusted padding for mobile and desktop */}
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
            >
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                {t("productPage.descriptionHeader")} {/* Use translation key */}
              </h2>{" "}
              {/* Reduced text size for mobile */}
              <FaChevronDown
                className={`w-4 h-4 md:w-5 md:h-5 text-gray-600 transition-transform duration-200 ${
                  // Reduced icon size for mobile
                  isDescriptionOpen ? "rotate-180" : ""
                }`}
              />
            </div>
            {isDescriptionOpen && (
              <p className="mt-2 md:mt-4 text-gray-600 text-sm md:text-base">
                {" "}
                {product.product.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
