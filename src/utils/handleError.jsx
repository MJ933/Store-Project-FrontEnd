import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const handleError = (error) => {
  console.error("Error:", error);

  let errorMessage = "An unexpected error occurred. Please try again.";
  let errorDetails = null;

  // Check if the error is a JavaScript runtime error
  if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
    errorMessage =
      "We were unable to connect to the server. Please check your internet connection or try again later.";
    errorDetails =
      "This may be due to a network issue or the server being unavailable.";
  }
  // Check if the error has a response object (from axios or fetch)
  else if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        errorMessage = data.message || "Bad request. Please check your input.";
        break;
      case 401:
        errorMessage =
          data.message || "You are not authorized. Please login to continue.";
        break;
      case 403:
        errorMessage =
          data.message || "You do not have permission to access this resource.";
        break;
      case 404:
        errorMessage =
          data.message || "The requested resource could not be found.";
        break;
      case 500:
        errorMessage =
          data.message ||
          "An internal server error occurred. Please try again later.";
        break;
      default:
        errorMessage =
          data.message || data.title || "An unexpected error occurred.";
    }
  } else if (!error.response) {
    // Generic network error
    errorMessage =
      "We were unable to connect to the server. Please check your internet connection or try again later.";
    errorDetails =
      "This may be due to a network issue or the server being unavailable.";
  } else {
    // Other errors
    errorMessage = error.message || "An unexpected error occurred.";
  }

  // Display the error to the user
  displayErrorToUser(errorMessage, errorDetails);
};

export const displayErrorToUser = (message, details = null, options = {}) => {
  const MAX_ERROR_LENGTH = 100;
  const sanitizedMessage =
    typeof message === "string"
      ? message.substring(0, MAX_ERROR_LENGTH)
      : "An unexpected error occurred.";
  let sanitizedDetails = null;
  if (details) {
    sanitizedDetails =
      typeof details === "string"
        ? details.substring(0, MAX_ERROR_LENGTH)
        : JSON.stringify(details).substring(0, MAX_ERROR_LENGTH);
  }
  const toastContent = (
    <div className="p-4 rounded-lg shadow-md bg-white">
      <p className="text-lg font-semibold text-red-600">{sanitizedMessage}</p>
      {sanitizedDetails && (
        <p className="text-sm mt-2 text-gray-600">
          Details: {sanitizedDetails}
        </p>
      )}
    </div>
  );
  toast.error(toastContent, {
    position: "top-center",
    autoClose: 2000,
    className: "shadow-xl",
    ...options,
  });
};
