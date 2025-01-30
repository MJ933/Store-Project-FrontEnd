import React from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation

const ModernLoader = () => {
  const { t } = useTranslation(); // Initialize useTranslation hook

  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center gap-y-4">
        {/* Main spinner container */}
        <div className="relative">
          {/* Outer ring with gradient */}
          <div className="w-16 h-16 rounded-full absolute border-4 border-gray-200"></div>

          {/* Animated inner ring */}
          <div
            className="w-16 h-16 rounded-full animate-spin
              border-4 border-transparent border-t-indigo-500
              border-r-indigo-500 shadow-lg"
          ></div>

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-3 h-3 bg-indigo-500 rounded-full
                animate-ping shadow-md"
            ></div>
          </div>
        </div>

        {/* Loading text with subtle animation */}
        <p className="text-gray-600 font-medium animate-pulse">
          {t("loader.loadingText")} {/* Translation key for "Loading..." */}
          {/* <span
            className={`inline-block ${isAr ? "mr-1.5" : "ml-1.5"}`} // Conditional margin class
          >
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-100">.</span>
            <span className="animate-bounce delay-200">.</span>
          </span> */}
        </p>
      </div>
    </div>
  );
};

export default ModernLoader;
