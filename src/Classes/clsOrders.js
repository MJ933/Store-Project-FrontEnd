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
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error; // Re-throw the error so it can be handled by the caller
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
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching order with ID ${id}:`, error);
      throw error; // Re-throw the error so it can be handled by the caller
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
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error; // Re-throw the error so it can be handled by the caller
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
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating order with ID ${id}:`, error);
      throw error; // Re-throw the error so it can be handled by the caller
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
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error deleting order with ID ${id}:`, error);
      throw error; // Re-throw the error so it can be handled by the caller
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
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating order status for ID ${id}:`, error);
      throw error; // Re-throw the error so it can be handled by the caller
    }
  }
}
