import { useState } from "react";

export default function PizzaCard({ pizza }) {
  const [selectedSize, setSelectedSize] = useState("");

  // Safety check to prevent errors if pizza prop is undefined
  if (!pizza) {
    return null;
  }

  const sizes = [
    { name: "Small", price: pizza.price_small },
    { name: "Medium", price: pizza.price_medium },
    { name: "Large", price: pizza.price_large },
    { name: "X-Large", price: pizza.price_x_large }
  ];

  const selectedSizeData = sizes.find(size => size.name === selectedSize);

  const handleAddToCart = () => {
    if (selectedSize && selectedSizeData) {
      alert(`Added ${selectedSize} ${pizza.title} ($${selectedSizeData.price}) to cart!`);
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Pizza Image */}
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <img
          src={`http://localhost:8000/storage/${pizza.image}`}
          alt={pizza.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop";
          }}
        />
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Pizza Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {pizza.title}
        </h3>

        {/* Pizza Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {pizza.description}
        </p>

        {/* Size Options */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Size</h4>
          <div className="grid grid-cols-2 gap-2">
            {sizes.map((size) => (
              <button
                key={size.name}
                onClick={() => setSelectedSize(size.name)}
                className={`px-3 py-2 text-sm rounded-md border transition-colors flex flex-col items-center ${
                  selectedSize === size.name
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="font-medium">{size.name}</span>
                <span className="text-xs opacity-75">${size.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Display */}
        {selectedSizeData && (
          <div className="mb-4 text-center">
            <span className="text-lg font-bold text-green-600">
              ${selectedSizeData.price}
            </span>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            selectedSize
              ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}