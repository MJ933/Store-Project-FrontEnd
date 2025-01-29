import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import Alert from "./Alert";

function StatusDisplay({
  errorStatus,
  message: propMessage,
  type: propType,
  error,
}) {
  // Accept error prop
  // const error = useRouteError(); // No longer using useRouteError here directly

  console.log("Error object in StatusDisplay:", error);

  let message = "Oops! Something went wrong.";
  let type = "error";

  if (errorStatus) {
    // Prioritize errorStatus prop if provided (still works as before for Route Errors if you use it that way)
    switch (errorStatus) {
      case 400:
        message =
          "400: Bad Request - The server could not understand the request.";
        break;
      case 401:
        message = "401: Unauthorized - Please login to view this page.";
        type = "warning";
        break;
      case 403:
        message =
          "403: Forbidden - You don't have permission to access this resource.";
        type = "warning";
        break;
      case 404:
        message =
          "404: Page Not Found - The requested resource could not be found.";
        break;
      case 500:
        message =
          "500: Internal Server Error - Something went wrong on the server.";
        break;
      default:
        message = `An unexpected error occurred: ${
          errorStatus || "Unknown Status"
        }`;
        type = "error";
    }
  } else if (error) {
    // Handle the error object passed as prop
    if (error.status) {
      // Check if the error object has a status property (like fetch errors)
      switch (error.status) {
        case 400:
          message =
            "400: Bad Request - The server could not understand the request.";
          break;
        case 401:
          message = "401: Unauthorized - Please login to view this page.";
          type = "warning";
          break;
        case 403:
          message =
            "403: Forbidden - You don't have permission to access this resource.";
          type = "warning";
          break;
        case 404:
          message =
            "404: Page Not Found - The requested resource could not be found.";
          break;
        case 500:
          message =
            "500: Internal Server Error - Something went wrong on the server.";
          break;
        default:
          message = `An unexpected error occurred: ${
            error.status || "Unknown Status"
          }`;
          type = "error";
      }
    } else if (error.message) {
      // If error doesn't have status, but has a message, use it
      message = error.message;
    }
  }

  if (propMessage) {
    message = propMessage;
  }
  if (propType) {
    type = propType;
  }

  console.error(error);

  return <Alert message={message} type={type} />;
}

export default StatusDisplay;
