import React from "react";

const ManageOrderItems = ({ orderItems, handleOrderItemChange }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-4">Order Items</h3>
      {orderItems.length === 0 ? (
        <div className="text-gray-600 text-center">No order items found.</div>
      ) : (
        orderItems.map((item, index) => (
          <div key={item.orderItemID} className="grid grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Product ID
              </label>
              <input
                type="number"
                value={item.productID}
                onChange={(e) =>
                  handleOrderItemChange(index, "productID", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={item.productName}
                onChange={(e) =>
                  handleOrderItemChange(index, "productName", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleOrderItemChange(index, "quantity", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Price
              </label>
              <input
                type="number"
                value={item.price}
                onChange={(e) =>
                  handleOrderItemChange(index, "price", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-16 h-16 object-cover rounded-lg"
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageOrderItems;
