import { useState } from "react";

export default function PizzaCard() {
  const [selectedSize, setSelectedSize] = useState("");

  const sizes = ["Small", "Medium", "Large", "X-Large"];

  const handleAddToCart = () => {
    if (selectedSize) {
      alert(`Added ${selectedSize} Margherita Pizza to cart!`);
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Pizza Image */}
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"
          alt="Margherita Pizza"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Pizza Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Margherita Pizza
        </h3>

        {/* Pizza Description */}
        <p className="text-gray-600 text-sm mb-4">
          Fresh mozzarella, tomato sauce, and basil leaves on our signature hand-tossed dough. A classic Italian favorite that never goes out of style.
        </p>

        {/* Size Options */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Size</h4>
          <div className="grid grid-cols-2 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                  selectedSize === size
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

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