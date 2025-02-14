import React, { useState } from "react";
import CategoriesCarousel from "./CategoriesCarousel";
import ShowAllProducts from "../pages/Products/ShowAllProducts";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Hero from "./Hero";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation

const HomePage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const navigate = useNavigate("/products/ShowAllProducts");
  const { t } = useTranslation(); // Initialize useTranslation hook

  const trustBadgesText = [
    // Array for trust badge texts
    t("homepage.securePayments"), // Translation key for "Secure Payments"
    t("homepage.fastDelivery"), // Translation key for "Fast delivery"
    t("homepage.highQuality"), // Translation key for "High Quality"
    t("homepage.support247"), // Translation key for "24/7 Support"
  ];

  return (
    <div className="min-h-screen bg-white">
      <Hero />

      {/* Trust Badges */}
      <div className="bg-gray-50 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-center">
            {trustBadgesText.map(
              (
                text,
                index // Use the translated texts from the array
              ) => (
                <div
                  key={`trust-badge-${index}`} // Use index for key as text might be repeated (though unlikely here)
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2"
                >
                  <div className="h-5 w-5 sm:h-6 sm:w-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {text} {/* Display the translated text from the array */}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Categories Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {t("homepage.shopByCategory")}{" "}
            {/* Translation key for "Shop by Category" */}
          </h2>
        </div>
        <CategoriesCarousel
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={(categoryId) => {
            setSelectedCategoryId(categoryId);
          }}
        />
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-2    sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <h2 className="text-xs  sm:text-xl font-semibold text-gray-900">
            {t("homepage.featuredProducts")}{" "}
            {/* Translation key for "Featured Products" */}
          </h2>
          <button
            onClick={() => navigate("/products/ShowAllProducts")}
            className="text-xs text-blue-600 hover:text-blue-800 sm:text-sm  font-medium flex items-center whitespace-nowrap"
          >
            {t("homepage.viewAllProducts")}{" "}
            {/* Translation key for "View all products" */}
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </button>
        </div>
        <ShowAllProducts selectedCategoryId={selectedCategoryId} />
      </div>
    </div>
  );
};

export default HomePage;
