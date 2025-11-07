import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

// Main Menu Component
const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Replace with your actual API endpoint
    //   const response = await fetch('/api/categories');
      // http://localhost:8000/api/menu/categories
      const response = await fetch('http://localhost:8000/api/menu/categories');
      const data = await response.json();
      setCategories(data);
      if (data.length > 0) {
        setActiveCategory(data[0].id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const scrollToCategory = (categoryId) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Navigation */}
      <CategoryNavigation
        categories={categories}
        activeCategory={activeCategory}
        onCategoryClick={scrollToCategory}
      />

      {/* Menu Content */}
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        {categories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            isActive={activeCategory === category.id}
          />
        ))}
      </div>
    </div>
  );
};

// Category Navigation Component
const CategoryNavigation = ({ categories, activeCategory, onCategoryClick }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2 px-4 py-4 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.category_name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Category Section Component
const CategorySection = ({ category, isActive }) => {
  return (
    <div
      id={`category-${category.id}`}
      className="mb-12 scroll-mt-32"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        {category.category_name}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.active_menu_items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

// Menu Item Card Component
const MenuItemCard = ({ item }) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [showAddons, setShowAddons] = useState(false);

  useEffect(() => {
    // Auto-select size if only one option or no sizes
    if (item.prices.length === 1) {
      setSelectedSize(item.prices[0]);
    }
  }, [item]);

  const getPrice = () => {
    if (!selectedSize) return null;
    let total = parseFloat(selectedSize.price);
    
    selectedAddons.forEach(addon => {
      total += parseFloat(addon.price);
    });
    
    return total.toFixed(2);
  };

  const toggleAddon = (addon, addonPrice) => {
    const addonKey = `${addon.id}-${addonPrice.size}`;
    const existingIndex = selectedAddons.findIndex(
      a => `${a.addonId}-${a.size}` === addonKey
    );

    if (existingIndex > -1) {
      setSelectedAddons(selectedAddons.filter((_, i) => i !== existingIndex));
    } else {
      setSelectedAddons([
        ...selectedAddons,
        {
          addonId: addon.id,
          addonName: addon.addon_name,
          size: addonPrice.size,
          price: addonPrice.price
        }
      ]);
    }
  };

  const isAddonSelected = (addonId, size) => {
    return selectedAddons.some(
      a => a.addonId === addonId && a.size === size
    );
  };

  const canAddToCart = () => {
    if (item.has_sizes && !selectedSize) return false;
    return true;
  };

  const handleAddToCart = () => {
    if (!canAddToCart()) return;

    const cartItem = {
      id: `${item.id}-${selectedSize?.size || 'default'}-${Date.now()}`,
      menuItemId: item.id,
      categoryId: item.category_id,
      title: item.title,
      slug: item.slug,
      description: item.description,
      image: item.image_url,
      size: selectedSize?.size || 'default',
      price: getPrice(),
      basePrice: selectedSize?.price || item.prices[0].price,
      addons: selectedAddons
    };

    dispatch(addToCart(cartItem));
    
    // Reset selections after adding
    if (item.has_sizes) {
      setSelectedSize(item.prices.length === 1 ? item.prices[0] : null);
    }
    setSelectedAddons([]);
    setShowAddons(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Item Header */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
          {item.is_special && (
            <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
              Special
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-gray-600 text-sm mb-3">{item.description}</p>
        )}

        {/* Size Selection */}
        {item.has_sizes && item.prices.length > 1 && (
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Select Size *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {item.prices.map((priceOption) => (
                <button
                  key={priceOption.id}
                  onClick={() => setSelectedSize(priceOption)}
                  className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    selectedSize?.id === priceOption.id
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="capitalize">{priceOption.size}</div>
                  <div className="text-xs">₹{priceOption.price}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Addons Section */}
        {item.has_addons && item.addons.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowAddons(!showAddons)}
              className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center"
            >
              {showAddons ? 'Hide' : 'Show'} Add-ons ({item.addons.length})
              <span className="ml-1">{showAddons ? '▲' : '▼'}</span>
            </button>

            {showAddons && (
              <div className="mt-3 space-y-2">
                {item.addons.map((addon) => (
                  <div key={addon.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="font-medium text-sm mb-2">{addon.addon_name}</div>
                    <div className="space-y-1">
                      {addon.prices.map((addonPrice) => (
                        <label
                          key={addonPrice.id}
                          className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-1 rounded"
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={isAddonSelected(addon.id, addonPrice.size)}
                              onChange={() => toggleAddon(addon, addonPrice)}
                              className="mr-2"
                            />
                            <span className="text-sm capitalize">
                              {addonPrice.size !== 'default' && `${addonPrice.size} - `}
                              ₹{addonPrice.price}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="text-2xl font-bold text-orange-600">
            ₹{getPrice() || (item.prices[0]?.price || '0.00')}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart()}
            className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${
              canAddToCart()
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={18} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;