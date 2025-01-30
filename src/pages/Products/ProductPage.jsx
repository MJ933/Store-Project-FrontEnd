import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import {
  FaCartPlus,
  FaChevronDown,
  FaChevronUp,
  FaArrowLeft,
  FaWhatsapp,
  FaExpand,
  FaXmark,
} from "react-icons/fa6";
import API from "../../Classes/clsAPI";
import Alert from "../../components/Alert";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { socialMediaLinks } from "/src/config";

const ProductPage = () => {
  const { productID } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageURL, setModalImageURL] = useState(null);
  const dispatch = useDispatch();
  const api = new API();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const sliderRef = useRef(null);
  const modalSliderRef = useRef(null);
  const openWhatsApp = () => {
    if (!productData?.product) return;
    const whatsappNumber = socialMediaLinks.whatsapp;
    const message = `Hello! I'm interested in the product: ${productData.product.productName} (Product ID: ${productData.product.productID}).`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `${whatsappNumber}?text=${encodedMessage}`;
    console.log(whatsappLink);
    window.open(whatsappLink, "_blank");
  };
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${api.baseURL()}/API/ProductsAPI/GetProductWithAllImagesByID/${productID}`,
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
        setProductData(data);
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
    if (!productData?.product) return;
    const primaryImage =
      productData.images && productData.images.length > 0
        ? productData.images[0].imageURL
        : "No Image URL";
    dispatch(
      addToCart({
        productID: productData.product.productID,
        quantity: quantity,
        price: productData.product.sellingPrice,
        imageUrl: primaryImage,
        productName: productData.product.productName,
      })
    );
  };
  const handleQuantityChange = (value) => {
    if (!productData?.product) return;
    if (value < 1 || value > productData.product.stockQuantity) return;
    setQuantity(value);
  };
  const handleGoBack = () => {
    navigate(-1);
  };
  const imageSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    afterChange: (current) => setCurrentSlideIndex(current),
  };
  const thumbnailSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    focusOnSelect: true,
    arrows: false,
  };
  const modalSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    swipeToSlide: true,
    adaptiveHeight: true,
    beforeChange: (current, next) => setCurrentSlideIndex(next),
  };
  const goToSlide = (index) => {
    setCurrentSlideIndex(index);
    sliderRef.current.slickGoTo(index);
  };
  const openModal = (imageURL, index) => {
    setModalImageURL(imageURL);
    setCurrentSlideIndex(index);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setModalImageURL(null);
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="bg-white">
      {error && <Alert message={error} type={"failure"} />}
      {!productData || !productData.product ? (
        <Alert message={t("productPage.productNotFound")} type={"failure"} />
      ) : (
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-12">
          <button
            onClick={handleGoBack}
            className="mb-8 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm inline-flex items-center transition-colors duration-200"
          >
            <FaArrowLeft className="m-2" /> {t("productPage.backButton")}
          </button>
          <div className="rounded-lg shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                {productData.images && productData.images.length > 0 ? (
                  <>
                    <div className="relative">
                      <Slider {...imageSliderSettings} ref={sliderRef}>
                        {productData.images.map((image, index) => (
                          <div key={index} className="relative aspect-square">
                            <img
                              src={image.imageURL}
                              alt={`${
                                productData.product.productName
                              } - Image ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src =
                                  "https://dummyimage.com/500x500/cccccc/000000&text=No+Image";
                                e.target.onerror = null;
                              }}
                            />
                          </div>
                        ))}
                      </Slider>
                      <button
                        onClick={() =>
                          openModal(
                            productData.images[currentSlideIndex]?.imageURL,
                            currentSlideIndex
                          )
                        }
                        className="absolute top-3 right-3 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-opacity duration-200"
                        aria-label={t("productPage.viewFullSize")}
                      >
                        <FaExpand size={16} />
                      </button>
                    </div>
                    {productData.images.length > 1 && (
                      <div className="mt-4">
                        <Slider {...thumbnailSliderSettings}>
                          {productData.images.map((image, index) => (
                            <div key={index} className="px-1">
                              <div
                                className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                                  currentSlideIndex === index
                                    ? "border-indigo-500"
                                    : "border-transparent hover:border-gray-300"
                                } transition-border duration-200`}
                                onClick={() => goToSlide(index)}
                              >
                                <img
                                  src={image.imageURL}
                                  alt={`Thumbnail ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          ))}
                        </Slider>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="relative aspect-square">
                    <img
                      src="https://dummyimage.com/500x500/cccccc/000000&text=No+Image"
                      alt="No Image Available"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
              <div className="md:w-1/2 p-8">
                <h1 className="text-gray-900 text-3xl font-semibold mb-4">
                  {productData.product.productName}
                </h1>
                <div className="flex items-center mb-6">
                  <span className="font-bold text-2xl text-indigo-600 m-3">
                    ${productData.product.sellingPrice}
                  </span>
                  {productData.product.sellingPrice && (
                    <span className="text-gray-500 line-through text-lg">
                      ${(productData.product.sellingPrice * 1.05).toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="mb-6">
                  <span
                    className={`inline-block bg-${
                      productData.product.isActive ? "green" : "red"
                    }-100 text-${
                      productData.product.isActive ? "green" : "red"
                    }-800 py-1 px-3 rounded-full text-sm font-semibold`}
                  >
                    {productData.product.isActive
                      ? t("productPage.inStock")
                      : t("productPage.outOfStock")}
                  </span>
                </div>
                <div className="mb-8">
                  <label
                    htmlFor="quantity"
                    className="block text-gray-700 text-sm font-bold mb-3"
                  >
                    {t("productPage.quantityLabel")}:
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l focus:outline-none"
                      aria-label="Decrease Quantity"
                    >
                      <FaChevronDown />
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={productData.product.stockQuantity}
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(parseInt(e.target.value))
                      }
                      className="shadow-inner appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center w-16"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= productData.product.stockQuantity}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r focus:outline-none"
                      aria-label="Increase Quantity"
                    >
                      <FaChevronUp />
                    </button>
                  </div>
                  {/* <p className="text-gray-500 text-sm mt-2">
                    {t("productPage.stockAvailable")}:{" "}
                    {productData.product.stockQuantity}
                  </p> */}
                </div>
                <button
                  className="w-full  bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline flex items-center justify-center mb-4 transition-colors duration-200"
                  onClick={handleAddToCart}
                  disabled={!productData.product.isActive}
                >
                  <FaCartPlus className="m-2" />
                  {t("productPage.addToCartButton")}
                </button>
                <button
                  className="w-full  bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline flex items-center justify-center transition-colors duration-200"
                  onClick={openWhatsApp}
                >
                  <FaWhatsapp className="m-2" size={20} />
                  {t("productPage.whatsappButton")}
                </button>
              </div>
            </div>
            <div className="p-8 border-t border-gray-200">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {t("productPage.descriptionHeader")}
                </h2>
                <FaChevronDown
                  className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                    isDescriptionOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              {isDescriptionOpen && (
                <div className="mt-4 text-gray-700 leading-relaxed">
                  {productData.product.description}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Image Modal */}
      {isModalOpen && (
        <div className=" p-4 fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className=" py-4 relative bg-white rounded-lg max-w-4xl max-h-full overflow-auto w-full">
            <Slider
              {...modalSliderSettings}
              ref={modalSliderRef}
              initialSlide={currentSlideIndex}
            >
              {productData.images.map((image, index) => (
                <div
                  key={index}
                  className="px-4 flex justify-center items-center"
                >
                  <img
                    src={image.imageURL}
                    alt={`${productData.product.productName} - Image ${
                      index + 1
                    }`}
                    className="w-full h-auto rounded-lg"
                    onError={(e) => {
                      e.target.src =
                        "https://dummyimage.com/500x500/cccccc/000000&text=No+Image";
                      e.target.onerror = null;
                    }}
                  />
                </div>
              ))}
            </Slider>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-900 transition-colors duration-200"
              aria-label={t("productPage.close")}
            >
              <FaXmark size={24} className="text-red-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
