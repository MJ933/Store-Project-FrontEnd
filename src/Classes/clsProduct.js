import API from "./clsAPI";
const api = new API();

export default class Product {
  async fetchProducts() {
    try {
      const response = await fetch(
        `${api.baseURL()}/API/ProductsAPI/GetALLWithImg`,
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
      console.error("Error fetching products:", error);
      throw error; // Re-throw the error so it can be handled by the caller
    }
  }
}
