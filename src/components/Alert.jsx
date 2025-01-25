import React from "react";

const Alert = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${
        type === "success" ? "bg-green-50" : "bg-red-50"
      } border ${
        type === "success" ? "border-green-200" : "border-red-200"
      } text-${
        type === "success" ? "green-800" : "red-800"
      } p-4 rounded-lg shadow-lg flex items-center justify-between space-x-4 animate-slide-down`}
    >
      <div className="flex items-center space-x-3">
        {type === "success" ? (
          <svg
            className={`w-6 h-6 ${
              type === "success" ? "text-green-500" : "text-red-500"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className={`w-6 h-6 ${
              type === "success" ? "text-green-500" : "text-red-500"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={onClose}
        className={`p-1 hover:bg-${
          type === "success" ? "green-100" : "red-100"
        } rounded-full transition-colors duration-200`}
      >
        <svg
          className={`w-5 h-5 ${
            type === "success" ? "text-green-500" : "text-red-500"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default Alert;
