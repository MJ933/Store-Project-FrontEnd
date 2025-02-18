import React from "react";

const TrackOrderPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Track Your Order</h1>
      <p>Enter your order number below to check the status of your order.</p>
      <form className="mt-6 max-w-lg">
        <div className="mb-4">
          <label htmlFor="orderNumber" className="block mb-2">
            Order Number
          </label>
          <input
            type="text"
            id="orderNumber"
            className="w-full p-2 border rounded"
            placeholder="Enter your order number"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Track Order
        </button>
      </form>
    </div>
  );
};

export default TrackOrderPage;
