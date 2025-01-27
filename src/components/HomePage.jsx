import React, { useState } from "react";
import CategoriesCarousel from "./CategoriesCarousel";
import ShowAllProducts from "../pages/Products/ShowAllProducts";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Hero from "./Hero";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const navigate = useNavigate("/products/ShowAllProducts");
  return (
    <div className="min-h-screen bg-white">
      <Hero />

      {/* Trust Badges */}
      <div className="bg-gray-50 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-center">
            {[
              "Secure Payments",
              "Fast delivery",
              "High Quality",
              "24/7 Support",
            ].map((text) => (
              <div
                key={text}
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
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Shop by Category
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Featured Products
          </h2>
          <button
            onClick={() => navigate("/products/ShowAllProducts")}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center whitespace-nowrap"
          >
            View all products
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </button>
        </div>
        <ShowAllProducts selectedCategoryId={selectedCategoryId} />
      </div>
    </div>
  );
};

export default HomePage;
