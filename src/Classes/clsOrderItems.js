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
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching order items:", error);
      throw error; // Re-throw the error so it can be handled by the caller
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
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching order item by OrderItemID:", error);
      throw error;
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
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching order items by OrderID:", error);
      throw error;
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
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data; // Return the newly added order item
    } catch (error) {
      console.error("Error adding order item:", error);
      throw error;
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
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data; // Return the updated order item
    } catch (error) {
      console.error("Error updating order item:", error);
      throw error;
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
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data; // Return the result of the deletion
    } catch (error) {
      console.error("Error deleting order item:", error);
      throw error;
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
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return !!data; // Return true if the order item exists, false otherwise
    } catch (error) {
      console.error("Error checking if order item exists:", error);
      throw error;
    }
  }
}
