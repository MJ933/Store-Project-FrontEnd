// src/contexts/ErrorContext.jsx
import React, { createContext, useContext, useState } from "react";

const ErrorContext = createContext({});

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000); // Auto-hide after 5 seconds
  };

  return (
    <ErrorContext.Provider
      value={{ error, showError, isLoading, setIsLoading }}
    >
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);
