import { handleError } from "../utils/handleError";
import API from "./clsAPI";

const api = new API();

export default class clsOrders {
  async fetchOrders() {
    try {
      const response = await fetch(`${api.baseURL()}/API/OrdersAPI/GetAll`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
      console.error("Error fetching orders:", error);
      handleError(error);
    }
  }

  async fetchOrderById(id) {
    try {
      const response = await fetch(
        `${api.baseURL()}/API/OrdersAPI/GetOrderByID/${id}`,
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
      console.error(`Error fetching order with ID ${id}:`, error);
      handleError(error);
    }
  }

  async createOrder(newOrderDTO) {
    try {
      const response = await fetch(`${api.baseURL()}/API/OrdersAPI/Create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrderDTO),
      });
      console.log("Response:", newOrderDTO);
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
      console.error("Error creating order:", error);
      handleError(error);
    }
  }

  async updateOrder(id, updatedOrderDTO) {
    try {
      const response = await fetch(
        `${api.baseURL()}/API/OrdersAPI/Update/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedOrderDTO),
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
      console.error(`Error updating order with ID ${id}:`, error);
      handleError(error);
    }
  }

  async deleteOrder(id) {
    try {
      const response = await fetch(
        `${api.baseURL()}/API/OrdersAPI/Delete/${id}`,
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
      return data;
    } catch (error) {
      console.error(`Error deleting order with ID ${id}:`, error);
      handleError(error);
    }
  }

  async updateOrderStatus(id, status) {
    try {
      const response = await fetch(
        `${api.baseURL()}/API/OrdersAPI/UpdateStatus/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(status),
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
      console.error(`Error updating order status for ID ${id}:`, error);
      handleError(error);
    }
  }
}
