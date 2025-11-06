import { useState, useEffect } from 'react';
import { Search, X, Plus, Edit2, Trash2, Eye, AlertCircle, RefreshCw, ChefHat, Package, DollarSign, Tag, Image, FileText, Star, Check, ChevronDown, ChevronUp } from 'lucide-react';

// Mock Auth Context - Replace with your actual auth context
const useAuth = () => {
    return { token: 'your-auth-token-here' };
};

// Category Modal Component
const CategoryModal = ({ isOpen, onClose, categoryId, token, onSuccess, mode = 'view' }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(mode === 'create');

    const [formData, setFormData] = useState({
        category_name: '',
        display_order: 0,
        is_active: true
    });

    useEffect(() => {
        if (isOpen && categoryId && mode !== 'create') {
            fetchCategoryDetail();
        } else if (mode === 'create') {
            setLoading(false);
            setIsEditing(true);
            setFormData({
                category_name: '',
                display_order: 0,
                is_active: true
            });
        }
    }, [isOpen, categoryId, mode]);

    const fetchCategoryDetail = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8000/api/menu/categories/${categoryId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch category');
            const data = await response.json();
            
            setFormData({
                category_name: data.category_name || '',
                display_order: data.display_order || 0,
                is_active: data.is_active ?? true
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const url = mode === 'create' 
                ? 'http://localhost:8000/api/menu/categories'
                : `http://localhost:8000/api/menu/categories/${categoryId}`;
            
            const response = await fetch(url, {
                method: mode === 'create' ? 'POST' : 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to save category');

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
                        <h2 className="text-xl font-bold text-gray-900">
                            {mode === 'create' ? 'Create Category' : isEditing ? 'Edit Category' : 'Category Details'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.category_name}
                                        onChange={(e) => setFormData({...formData, category_name: e.target.value})}
                                        required
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.display_order}
                                        onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                        disabled={!isEditing}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                                    />
                                    <label className="ml-2 text-sm font-medium text-gray-700">
                                        Active Category
                                    </label>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    {isEditing && (
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                                        >
                                            {saving ? 'Saving...' : mode === 'create' ? 'Create' : 'Save'}
                                        </button>
                                    )}
                                    {!isEditing && mode !== 'create' && (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Menu Item Modal Component
const MenuItemModal = ({ isOpen, onClose, itemId, categoryId, token, onSuccess, mode = 'view' }) => {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(mode === 'create');

    const [formData, setFormData] = useState({
        category_id: categoryId || '',
        title: '',
        description: '',
        image_url: '',
        has_sizes: false,
        has_addons: false,
        is_available: true,
        is_special: false,
        display_order: 0,
        prices: [{ size: 'default', price: 0 }],
        addons: []
    });

    useEffect(() => {
        if (isOpen && itemId && mode !== 'create') {
            fetchItemDetail();
        } else if (mode === 'create') {
            setLoading(false);
            setIsEditing(true);
            setFormData({
                category_id: categoryId || '',
                title: '',
                description: '',
                image_url: '',
                has_sizes: false,
                has_addons: false,
                is_available: true,
                is_special: false,
                display_order: 0,
                prices: [{ size: 'default', price: 0 }],
                addons: []
            });
        }
    }, [isOpen, itemId, mode]);

    const fetchItemDetail = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8000/api/menu/items/${itemId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch item');
            const data = await response.json();
            
            setItem(data);
            setFormData({
                category_id: data.category_id || '',
                title: data.title || '',
                description: data.description || '',
                image_url: data.image_url || '',
                has_sizes: data.has_sizes || false,
                has_addons: data.has_addons || false,
                is_available: data.is_available ?? true,
                is_special: data.is_special || false,
                display_order: data.display_order || 0,
                prices: data.prices?.length ? data.prices : [{ size: 'default', price: 0 }],
                addons: data.addons || []
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePriceChange = (index, field, value) => {
        const newPrices = [...formData.prices];
        newPrices[index][field] = value;
        setFormData({...formData, prices: newPrices});
    };

    const addPrice = () => {
        setFormData({
            ...formData,
            prices: [...formData.prices, { size: 'default', price: 0 }]
        });
    };

    const removePrice = (index) => {
        const newPrices = formData.prices.filter((_, i) => i !== index);
        setFormData({...formData, prices: newPrices});
    };

    const addAddon = () => {
        setFormData({
            ...formData,
            addons: [...formData.addons, { addon_name: '', has_sizes: false, prices: [{ size: 'default', price: 0 }] }]
        });
    };

    const removeAddon = (index) => {
        const newAddons = formData.addons.filter((_, i) => i !== index);
        setFormData({...formData, addons: newAddons});
    };

    const handleAddonChange = (addonIndex, field, value) => {
        const newAddons = [...formData.addons];
        newAddons[addonIndex][field] = value;
        setFormData({...formData, addons: newAddons});
    };

    const handleAddonPriceChange = (addonIndex, priceIndex, field, value) => {
        const newAddons = [...formData.addons];
        newAddons[addonIndex].prices[priceIndex][field] = value;
        setFormData({...formData, addons: newAddons});
    };

    const addAddonPrice = (addonIndex) => {
        const newAddons = [...formData.addons];
        newAddons[addonIndex].prices.push({ size: 'default', price: 0 });
        setFormData({...formData, addons: newAddons});
    };

    const removeAddonPrice = (addonIndex, priceIndex) => {
        const newAddons = [...formData.addons];
        newAddons[addonIndex].prices = newAddons[addonIndex].prices.filter((_, i) => i !== priceIndex);
        setFormData({...formData, addons: newAddons});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const url = mode === 'create' 
                ? 'http://localhost:8000/api/menu/items'
                : `http://localhost:8000/api/menu/items/${itemId}`;
            
            const response = await fetch(url, {
                method: mode === 'create' ? 'POST' : 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to save menu item');

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {mode === 'create' ? 'Add Menu Item' : isEditing ? 'Edit Menu Item' : 'Menu Item Details'}
                            </h2>
                            {item && <p className="text-gray-600">Item ID: #{item.id}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                            {mode !== 'create' && !isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                            )}
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                                        {error}
                                    </div>
                                )}

                                {/* Basic Information */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Package className="w-5 h-5 text-blue-600" />
                                        Basic Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                                required
                                                disabled={!isEditing}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                                disabled={!isEditing}
                                                rows="3"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                            <input
                                                type="text"
                                                value={formData.image_url}
                                                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                                                disabled={!isEditing}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                                            <input
                                                type="number"
                                                value={formData.display_order}
                                                onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
                                                disabled={!isEditing}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.has_sizes}
                                                    onChange={(e) => setFormData({...formData, has_sizes: e.target.checked})}
                                                    disabled={!isEditing}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label className="ml-2 text-sm font-medium text-gray-700">Has Sizes</label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.has_addons}
                                                    onChange={(e) => setFormData({...formData, has_addons: e.target.checked})}
                                                    disabled={!isEditing}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label className="ml-2 text-sm font-medium text-gray-700">Has Add-ons</label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.is_available}
                                                    onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                                                    disabled={!isEditing}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label className="ml-2 text-sm font-medium text-gray-700">Available</label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.is_special}
                                                    onChange={(e) => setFormData({...formData, is_special: e.target.checked})}
                                                    disabled={!isEditing}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label className="ml-2 text-sm font-medium text-gray-700 flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-500" />
                                                    Special Item
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Prices */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <DollarSign className="w-5 h-5 text-blue-600" />
                                            Prices
                                        </h3>
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={addPrice}
                                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Price
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        {formData.prices.map((price, index) => (
                                            <div key={index} className="flex gap-3 items-center">
                                                <select
                                                    value={price.size}
                                                    onChange={(e) => handlePriceChange(index, 'size', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                                >
                                                    <option value="default">Default</option>
                                                    <option value="regular">Regular</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="large">Large</option>
                                                </select>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={price.price}
                                                    onChange={(e) => handlePriceChange(index, 'price', parseFloat(e.target.value))}
                                                    disabled={!isEditing}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                                    placeholder="Price"
                                                />
                                                {isEditing && formData.prices.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removePrice(index)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Add-ons */}
                                {formData.has_addons && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                <Tag className="w-5 h-5 text-blue-600" />
                                                Add-ons
                                            </h3>
                                            {isEditing && (
                                                <button
                                                    type="button"
                                                    onClick={addAddon}
                                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Add Add-on
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            {formData.addons.map((addon, addonIndex) => (
                                                <div key={addonIndex} className="border border-gray-300 rounded-lg p-3 bg-white">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <input
                                                            type="text"
                                                            value={addon.addon_name}
                                                            onChange={(e) => handleAddonChange(addonIndex, 'addon_name', e.target.value)}
                                                            disabled={!isEditing}
                                                            placeholder="Add-on name"
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                                        />
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={addon.has_sizes}
                                                                onChange={(e) => handleAddonChange(addonIndex, 'has_sizes', e.target.checked)}
                                                                disabled={!isEditing}
                                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                                                            />
                                                            <label className="ml-2 text-sm text-gray-700">Has Sizes</label>
                                                        </div>
                                                        {isEditing && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeAddon(addonIndex)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2 pl-4">
                                                        {addon.prices?.map((price, priceIndex) => (
                                                            <div key={priceIndex} className="flex gap-2 items-center">
                                                                <select
                                                                    value={price.size}
                                                                    onChange={(e) => handleAddonPriceChange(addonIndex, priceIndex, 'size', e.target.value)}
                                                                    disabled={!isEditing}
                                                                    className="px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-50"
                                                                >
                                                                    <option value="default">Default</option>
                                                                    <option value="regular">Regular</option>
                                                                    <option value="medium">Medium</option>
                                                                    <option value="large">Large</option>
                                                                </select>
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={price.price}
                                                                    onChange={(e) => handleAddonPriceChange(addonIndex, priceIndex, 'price', parseFloat(e.target.value))}
                                                                    disabled={!isEditing}
                                                                    className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-50"
                                                                    placeholder="Price"
                                                                />
                                                                {isEditing && addon.prices.length > 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeAddonPrice(addonIndex, priceIndex)}
                                                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {isEditing && (
                                                            <button
                                                                type="button"
                                                                onClick={() => addAddonPrice(addonIndex)}
                                                                className="text-xs text-blue-600 hover:text-blue-700"
                                                            >
                                                                + Add Price Tier
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => mode === 'create' ? onClose() : setIsEditing(false)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    {isEditing && (
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                                        >
                                            {saving ? 'Saving...' : mode === 'create' ? 'Create Item' : 'Save Changes'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main AdminMenuManagement Component
const AdminMenuManagement = () => {
    const { token } = useAuth();
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal states
    const [categoryModal, setCategoryModal] = useState({ isOpen: false, categoryId: null, mode: 'view' });
    const [itemModal, setItemModal] = useState({ isOpen: false, itemId: null, categoryId: null, mode: 'view' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/menu/categories', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
            
            // Fetch items for each category
            data.forEach(category => {
                fetchCategoryItems(category.id);
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategoryItems = async (categoryId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/menu/items/category/${categoryId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch items');
            const data = await response.json();
            setMenuItems(prev => ({ ...prev, [categoryId]: data }));
        } catch (error) {
            console.error(`Error fetching items for category ${categoryId}:`, error);
        }
    };

    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const handleDeleteCategory = async (categoryId, categoryName) => {
        if (!window.confirm(`Delete "${categoryName}"? This will also delete all menu items in this category.`)) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/menu/categories/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) throw new Error('Failed to delete category');
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category');
        }
    };

    const handleDeleteItem = async (itemId, itemTitle) => {
        if (!window.confirm(`Delete "${itemTitle}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/menu/items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) throw new Error('Failed to delete item');
            fetchCategories();
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete menu item');
        }
    };

    const filteredCategories = categories.filter(cat => 
        cat.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getFilteredItems = (categoryId) => {
        const items = menuItems[categoryId] || [];
        if (!searchTerm) return items;
        return items.filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    if (loading && categories.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading menu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
                    <p className="text-gray-600 mt-1">
                        {categories.length} categories • {Object.values(menuItems).flat().length} total items
                    </p>
                </div>
                <button
                    onClick={() => setCategoryModal({ isOpen: true, categoryId: null, mode: 'create' })}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Add Category
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search categories and menu items..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Categories List */}
            <div className="space-y-4">
                {filteredCategories.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No categories found</p>
                        <p className="text-gray-400 text-sm mt-1">Create your first category to get started</p>
                    </div>
                ) : (
                    filteredCategories.map((category) => {
                        const items = getFilteredItems(category.id);
                        const isExpanded = expandedCategories[category.id];

                        return (
                            <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                                {/* Category Header */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <button
                                                onClick={() => toggleCategory(category.id)}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-600" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-600" />
                                                )}
                                            </button>
                                            <ChefHat className="w-6 h-6 text-blue-600" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {category.category_name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {items.length} item{items.length !== 1 ? 's' : ''} • Order: {category.display_order}
                                                </p>
                                            </div>
                                            <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                                                category.is_active 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {category.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setItemModal({ isOpen: true, itemId: null, categoryId: category.id, mode: 'create' })}
                                                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-50 text-green-700 hover:bg-green-100 rounded-lg"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Item
                                            </button>
                                            <button
                                                onClick={() => setCategoryModal({ isOpen: true, categoryId: category.id, mode: 'view' })}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setCategoryModal({ isOpen: true, categoryId: category.id, mode: 'edit' })}
                                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(category.id, category.category_name)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                {isExpanded && (
                                    <div className="p-4">
                                        {items.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                                <p className="text-sm">No items in this category</p>
                                                <button
                                                    onClick={() => setItemModal({ isOpen: true, itemId: null, categoryId: category.id, mode: 'create' })}
                                                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                                                >
                                                    Add your first item
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {items.map((item) => (
                                                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                                                    {item.is_special && (
                                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                                    )}
                                                                </div>
                                                                {item.description && (
                                                                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2 mb-3">
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <DollarSign className="w-4 h-4 text-gray-500" />
                                                                <span className="text-gray-700">
                                                                    {item.prices?.length === 1 
                                                                        ? `₹${item.prices[0].price}`
                                                                        : `₹${Math.min(...item.prices.map(p => p.price))} - ₹${Math.max(...item.prices.map(p => p.price))}`
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex gap-2 flex-wrap">
                                                                {item.has_sizes && (
                                                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                                                                        Sizes
                                                                    </span>
                                                                )}
                                                                {item.has_addons && (
                                                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                                                                        Add-ons
                                                                    </span>
                                                                )}
                                                                <span className={`px-2 py-1 text-xs rounded ${
                                                                    item.is_available 
                                                                        ? 'bg-green-100 text-green-700' 
                                                                        : 'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                    {item.is_available ? 'Available' : 'Unavailable'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                                            <button
                                                                onClick={() => setItemModal({ isOpen: true, itemId: item.id, categoryId: category.id, mode: 'view' })}
                                                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                View
                                                            </button>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => setItemModal({ isOpen: true, itemId: item.id, categoryId: category.id, mode: 'edit' })}
                                                                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteItem(item.id, item.title)}
                                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modals */}
            <CategoryModal 
                isOpen={categoryModal.isOpen}
                onClose={() => setCategoryModal({ isOpen: false, categoryId: null, mode: 'view' })}
                categoryId={categoryModal.categoryId}
                token={token}
                onSuccess={fetchCategories}
                mode={categoryModal.mode}
            />

            <MenuItemModal 
                isOpen={itemModal.isOpen}
                onClose={() => setItemModal({ isOpen: false, itemId: null, categoryId: null, mode: 'view' })}
                itemId={itemModal.itemId}
                categoryId={itemModal.categoryId}
                token={token}
                onSuccess={fetchCategories}
                mode={itemModal.mode}
            />
        </div>
    );
};

export default AdminMenuManagement;