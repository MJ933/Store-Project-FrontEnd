import React, { useEffect, useState, useRef } from "react";
import API from "../Classes/clsAPI";
const CategoriesCarousel = ({ selectedCategoryId, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const carouselRef = useRef(null);

  const api = new API();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${api.baseURL()}/API/CategoriesAPI/GetActiveCategoriesWithProductsAsync`
        );

        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json(); // Filter active parent categories // console.log(api.baseURL());

        const filtered = data.filter(
          (cat) => cat.isActive && cat.parentCategoryID === null
        );

        setCategories(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.offsetWidth;
      const scrollAmount = containerWidth * 0.8; // Scroll 80% of container width
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getGradient = (index) => {
    const gradients = [
      { gradient: "from-orange-400 to-orange-600", textColor: "text-white" },

      { gradient: "from-gray-100 to-gray-300", textColor: "text-black" },

      { gradient: "from-blue-400 to-blue-600", textColor: "text-white" },

      { gradient: "from-gray-100 to-gray-300", textColor: "text-black" },

      { gradient: "from-green-400 to-green-600", textColor: "text-white" },
    ];

    return gradients[index % 5];
  };
  // Modified getFontSize with responsive classes
  const getFontSize = (categoryName) => {
    const baseSize =
      categoryName.length > 8 ? "xs" : categoryName.length > 7 ? "sm" : "base";
    return `text-${baseSize} md:text-${baseSize === "xs" ? "sm" : baseSize}`;
  };

  return (
    <div className="relative flex items-center justify-center my-4 md:my-8">
      {/* Navigation Buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 z-10 p-1 md:p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 ml-1 md:ml-2"
      >
        <svg
          className="w-4 h-4 md:w-6 md:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Carousel Items */}
      <div
        ref={carouselRef}
        className="flex space-x-2 md:space-x-4 overflow-x-auto custom-scrollbar px-10 md:px-14 py-2 md:py-4"
        style={{ scrollBehavior: "smooth" }}
      >
        <button
          onClick={() => onCategorySelect(null)}
          className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg
            bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center
            font-semibold text-white text-xs md:text-sm
            ${
              selectedCategoryId === null
                ? "ring-2 md:ring-4 ring-blue-400"
                : ""
            }
            transition-all duration-200 hover:scale-105 p-10 md:px-2 md:py-1`}
        >
          All Products
        </button>

        {categories.map((category, index) => {
          const { gradient, textColor } = getGradient(index);
          const fontSize = getFontSize(category.categoryName);

          return (
            <button
              key={category.categoryID}
              onClick={() =>
                onCategorySelect(
                  selectedCategoryId === category.categoryID
                    ? null
                    : category.categoryID
                )
              }
              className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl
                bg-gradient-to-r ${gradient} flex items-center justify-center font-semibold
                ${textColor} ${fontSize} ${
                selectedCategoryId === category.categoryID
                  ? "ring-2 md:ring-4 ring-blue-400"
                  : ""
              }
                transition-all duration-200 hover:scale-105 whitespace-normal break-words
                p-10 md:px-4 md:py-2`}
            >
              {category.categoryName}
            </button>
          );
        })}
      </div>

      {/* Right Navigation Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 z-10 p-1 md:p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 mr-1 md:mr-2"
      >
        <svg
          className="w-4 h-4 md:w-6 md:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default CategoriesCarousel;
