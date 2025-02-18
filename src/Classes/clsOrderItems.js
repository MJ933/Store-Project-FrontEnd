import { handleError } from "../utils/handleError";
import API from "./clsAPI";

const api = new API();

export default class clsOrderItems {
  // Fetch all order items
  async fetchOrderItems() {
    try {
      const response = await fetch(
        `${api.baseURL()}/API/OrderItemsAPI/GetAll`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.text();
        let parsedError;

        try {
          parsedError = JSON.parse(errorData);
        } catch {
          parsedError = { message: errorData };
        }

        const error = {
          response: {
            status: response.status,
            data: parsedError,
          },
        };
        throw error;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      handleError(error); // Pass the error and navigate function
    }
  }

  // Fetch a single order item by OrderItemID
  async fetchOrderItemByOrderItemID(orderItemID) {
    try {
      const response = await fetch(
        `${api.baseURL()}/API/OrderItemsAPI/GetOrderItemByOrderItemID/${orderItemID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.text(); // First get as text
        let parsedError;

        try {
          parsedError = JSON.parse(errorData);
        } catch {
          parsedError = { message: errorData };
        }

        const error = {
          response: {
            status: response.status,
            data: parsedError,
          },
        };
        throw error;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching order item by OrderItemID:", error);
      handleError(error); // Pass the error and navigate function
    }
  }

  // Fetch order items by OrderID
  async fetchOrderItemsByOrderID(orderID) {
    try {
      const response = await fetch(
        `${api.baseURL()}/API/OrderItemsAPI/GetOrderItemByOrderID/${orderID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.text(); // First get as text
        let parsedError;

        try {
          parsedError = JSON.parse(errorData);
        } catch {
          parsedError = { message: errorData };
        }

        const error = {
          response: {
            status: response.status,
            data: parsedError,
          },
        };
        throw error;
      }
      const data = await response.json();
      // console.log("this is the order items data : ", data);
      return data;
    } catch (error) {
      console.error("Error fetching order items by OrderID:", error);
      handleError(error); // Pass the error and navigate function
    }
  }

  // Add a new order item
  async addOrderItem(newOrderItem) {
    try {
      const response = await fetch(
        `${api.baseURL()}/API/OrderItemsAPI/Create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json", // Add this line
          },
          body: JSON.stringify(newOrderItem),
        }
      );
      if (!response.ok) {
        const errorData = await response.text(); // First get as text
        let parsedError;

        try {
          parsedError = JSON.parse(errorData);
        } catch {
          parsedError = { message: errorData };
        }

        const error = {
          response: {
            status: response.status,
            data: parsedError,
          },
        };
        throw error;
      }
      const data = await response.json();
      return data; // Return the newly added order item
    } catch (error) {
      console.error("Error adding order item:", error);
      handleError(error); // Pass the error and navigate function
    }
  }

  // Update an existing order item
  async updateOrderItem(orderItemID, updatedOrderItem) {
    try {
      const response = await fetch(
        `${api.baseURL()}/API/OrderItemsAPI/Update/${orderItemID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json", // Add this line
          },
          body: JSON.stringify(updatedOrderItem),
        }
      );
      if (!response.ok) {
        const errorData = await response.text(); // First get as text
        let parsedError;

        try {
          parsedError = JSON.parse(errorData);
        } catch {
          parsedError = { message: errorData };
        }

        const error = {
          response: {
            status: response.status,
            data: parsedError,
          },
        };
        throw error;
      }
      const data = await response.json();
      return data; // Return the updated order item
    } catch (error) {
      console.error("Error updating order item:", error);
      handleError(error); // Pass the error and navigate function
    }
  }

  // Delete an order item by OrderItemID
  async deleteOrderItem(orderItemID) {
    try {
      const response = await fetch(
        `${api.baseURL()}/API/OrderItemsAPI/Delete/${orderItemID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.text(); // First get as text
        let parsedError;

        try {
          parsedError = JSON.parse(errorData);
        } catch {
          parsedError = { message: errorData };
        }

        const error = {
          response: {
            status: response.status,
            data: parsedError,
          },
        };
        throw error;
      }
      const data = await response.json();
      return data; // Return the result of the deletion
    } catch (error) {
      console.error("Error deleting order item:", error);
      handleError(error); // Pass the error and navigate function
    }
  }

  // Check if an order item exists by OrderItemID
  async isOrderItemExists(orderItemID) {
    try {
      const response = await fetch(
        `${api.baseURL()}/API/OrderItemsAPI/GetOrderItemByOrderItemID/${orderItemID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.text(); // First get as text
        let parsedError;

        try {
          parsedError = JSON.parse(errorData);
        } catch {
          parsedError = { message: errorData };
        }

        const error = {
          response: {
            status: response.status,
            data: parsedError,
          },
        };
        throw error;
      }
      const data = await response.json();
      return !!data; // Return true if the order item exists, false otherwise
    } catch (error) {
      console.error("Error checking if order item exists:", error);
      handleError(error); // Pass the error and navigate function
    }
  }
}
