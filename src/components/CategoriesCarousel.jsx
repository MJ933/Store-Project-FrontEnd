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
        const data = await response.json();
        // Filter active parent categories
        // console.log(api.baseURL());
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
      const scrollAmount = direction === "left" ? -200 : 200;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
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

  const getFontSize = (categoryName) => {
    if (categoryName.length > 15) return "text-xs";
    if (categoryName.length > 10) return "text-sm";
    return "text-base";
  };

  if (loading)
    return <div className="text-center py-4">Loading categories...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;

  return (
    <div className="relative flex items-center justify-center my-8">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 ml-2"
      >
        <svg
          className="w-6 h-6"
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

      <div
        ref={carouselRef}
        className="flex space-x-4 overflow-x-auto custom-scrollbar px-14 py-4"
        style={{ scrollBehavior: "smooth" }}
      >
        <button
          onClick={() => onCategorySelect(null)}
          className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 
            flex items-center justify-center text-sm font-semibold text-white
            ${selectedCategoryId === null ? "ring-4 ring-blue-400" : ""}
            transition-all duration-200 hover:scale-105 px-2 py-1`}
        >
          All Products
        </button>

        {categories.map((category, index) => {
          const { gradient, textColor } = getGradient(index);
          const fontSize = getFontSize(category.categoryName);

          return (
            <button
              key={category.categoryID}
              onClick={() => {
                if (selectedCategoryId === category.categoryID) {
                  onCategorySelect(null);
                } else {
                  onCategorySelect(category.categoryID);
                }
              }}
              className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gradient-to-r ${gradient} 
                flex items-center justify-center font-semibold ${textColor} ${fontSize}
                ${
                  selectedCategoryId === category.categoryID
                    ? "ring-4 ring-blue-400"
                    : ""
                }
                transition-all duration-200 hover:scale-105 whitespace-normal break-words px-14`}
            >
              {category.categoryName}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 mr-2"
      >
        <svg
          className="w-6 h-6"
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
