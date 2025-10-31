 import { useState, useEffect } from 'react';
import { Search, X, MapPin, Phone, Mail, Clock, Plus, Edit2, Trash2, Eye, AlertCircle, RefreshCw, Store, Star, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Store Location Modal Component
const StoreLocationModal = ({ isOpen, onClose, locationId, token, onSuccess, mode = 'view' }) => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(mode === 'create');

    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    const [formData, setFormData] = useState({
        name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'USA',
        phone_number: '',
        email: '',
        monday_hours: '',
        tuesday_hours: '',
        wednesday_hours: '',
        thursday_hours: '',
        friday_hours: '',
        saturday_hours: '',
        sunday_hours: '',
        is_active: true,
        is_primary: false,
        special_instructions: ''
    });

    useEffect(() => {
        if (isOpen && locationId && mode !== 'create') {
            fetchLocationDetail();
        } else if (mode === 'create') {
            setLoading(false);
            setIsEditing(true);
        }
    }, [isOpen, locationId, mode]);

    const fetchLocationDetail = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8000/api/admin/store-locations/${locationId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch location details');

            const result = await response.json();
            const locationData = result.data || result.location || result;
            
            setLocation(locationData);
            setFormData({
                name: locationData.name || '',
                address_line_1: locationData.address_line_1 || '',
                address_line_2: locationData.address_line_2 || '',
                city: locationData.city || '',
                state: locationData.state || '',
                postal_code: locationData.postal_code || '',
                country: locationData.country || 'USA',
                phone_number: locationData.phone_number || '',
                email: locationData.email || '',
                monday_hours: locationData.monday_hours || '',
                tuesday_hours: locationData.tuesday_hours || '',
                wednesday_hours: locationData.wednesday_hours || '',
                thursday_hours: locationData.thursday_hours || '',
                friday_hours: locationData.friday_hours || '',
                saturday_hours: locationData.saturday_hours || '',
                sunday_hours: locationData.sunday_hours || '',
                is_active: locationData.is_active ?? true,
                is_primary: locationData.is_primary ?? false,
                special_instructions: locationData.special_instructions || ''
            });
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching location details:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const url = mode === 'create' 
                ? 'http://localhost:8000/api/admin/store-locations'
                : `http://localhost:8000/api/admin/store-locations/${locationId}`;
            
            const method = mode === 'create' ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to save store location');
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
            console.error('Error saving location:', err);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
            
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {mode === 'create' ? 'Add New Store Location' : isEditing ? 'Edit Store Location' : 'Store Location Details'}
                            </h2>
                            {location && <p className="text-gray-600">Location ID: #{location.id}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                            {mode !== 'create' && !isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                            )}
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-4 text-gray-600">Loading location details...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
                                <p className="text-red-700 mb-4">{error}</p>
                                <button
                                    onClick={() => mode !== 'create' && fetchLocationDetail()}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Store className="w-5 h-5 text-blue-600" />
                                        Basic Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Location Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g., Main Store, Downtown Branch"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="is_active"
                                                    checked={formData.is_active}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label className="ml-2 text-sm font-medium text-gray-700">
                                                    Active Location
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="is_primary"
                                                    checked={formData.is_primary}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label className="ml-2 text-sm font-medium text-gray-700 flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-500" />
                                                    Primary Location
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-blue-600" />
                                        Address Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address Line 1 *
                                            </label>
                                            <input
                                                type="text"
                                                name="address_line_1"
                                                value={formData.address_line_1}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address Line 2
                                            </label>
                                            <input
                                                type="text"
                                                name="address_line_2"
                                                value={formData.address_line_2}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    State *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Postal Code *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="postal_code"
                                                    value={formData.postal_code}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Country
                                                </label>
                                                <input
                                                    type="text"
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Phone className="w-5 h-5 text-blue-600" />
                                        Contact Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone_number"
                                                value={formData.phone_number}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="(555) 123-4567"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="location@nikkispizza.com"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Operating Hours */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                        Operating Hours
                                    </h3>
                                    <div className="space-y-3">
                                        {daysOfWeek.map(day => (
                                            <div key={day} className="grid grid-cols-3 gap-4 items-center">
                                                <label className="text-sm font-medium text-gray-700 capitalize">
                                                    {day}
                                                </label>
                                                <input
                                                    type="text"
                                                    name={`${day}_hours`}
                                                    value={formData[`${day}_hours`]}
                                                    onChange={handleInputChange}
                                                    placeholder="9:00 AM - 9:00 PM or Closed"
                                                    className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Special Instructions */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Info className="w-5 h-5 text-blue-600" />
                                        Special Instructions
                                    </h3>
                                    <textarea
                                        name="special_instructions"
                                        value={formData.special_instructions}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Parking information, entrance details, accessibility info, etc."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    ></textarea>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => mode === 'create' ? onClose() : setIsEditing(false)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : mode === 'create' ? 'Create Location' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                {/* View Mode - Basic Info */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Store className="w-5 h-5 text-blue-600" />
                                        Basic Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-600">Location Name</p>
                                            <p className="font-medium text-gray-900 text-lg">{location?.name || 'N/A'}</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    location?.is_active 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {location?.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            {location?.is_primary && (
                                                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                                    <Star className="w-3 h-3" />
                                                    Primary Location
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* View Mode - Address */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-blue-600" />
                                        Address
                                    </h3>
                                    <div className="text-gray-700">
                                        <p className="font-medium">{location?.address_line_1}</p>
                                        {location?.address_line_2 && <p>{location.address_line_2}</p>}
                                        <p>{location?.city}, {location?.state} {location?.postal_code}</p>
                                        <p className="text-sm text-gray-600 mt-1">{location?.country}</p>
                                    </div>
                                </div>

                                {/* View Mode - Contact */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-600">Phone</p>
                                                <p className="font-medium text-gray-900">{location?.phone_number || 'N/A'}</p>
                                            </div>
                                        </div>
                                        {location?.email && (
                                            <div className="flex items-start gap-3">
                                                <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Email</p>
                                                    <p className="font-medium text-gray-900">{location.email}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* View Mode - Hours */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                        Operating Hours
                                    </h3>
                                    <div className="space-y-2">
                                        {daysOfWeek.map(day => (
                                            <div key={day} className="flex justify-between items-center py-1">
                                                <span className="text-sm font-medium text-gray-700 capitalize">{day}</span>
                                                <span className="text-sm text-gray-600">
                                                    {location?.[`${day}_hours`] || 'Closed'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* View Mode - Special Instructions */}
                                {location?.special_instructions && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-blue-600" />
                                            Special Instructions
                                        </h3>
                                        <p className="text-gray-700 text-sm whitespace-pre-line">
                                            {location.special_instructions}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main AdminStoreLocation Component
const AdminStoreLocation = () => {
    const { token } = useAuth();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('view');
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 15
    });
    const [filters, setFilters] = useState({
        status: 'all',
        is_primary: 'all'
    });

    useEffect(() => {
        fetchLocations();
    }, [searchTerm, filters]);

    const fetchLocations = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            
            if (searchTerm) params.append('search', searchTerm);
            if (filters.status !== 'all') params.append('status', filters.status);
            if (filters.is_primary !== 'all') params.append('is_primary', filters.is_primary);

            const url = `http://localhost:8000/api/admin/store-locations${params.toString() ? '?' + params.toString() : ''}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.data && result.data.data) {
                setLocations(result.data.data);
                setPagination({
                    currentPage: result.data.current_page,
                    lastPage: result.data.last_page,
                    total: result.data.total,
                    perPage: result.data.per_page
                });
            } else if (result.data) {
                setLocations(result.data);
            } else {
                setLocations([]);
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
            setLocations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (locationId) => {
        setSelectedLocationId(locationId);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleCreateLocation = () => {
        setSelectedLocationId(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedLocationId(null);
        setModalMode('view');
    };

    const handleSuccess = () => {
        fetchLocations();
    };

    const handleDeleteLocation = async (locationId, locationName) => {
        if (!window.confirm(`Are you sure you want to delete "${locationName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/admin/store-locations/${locationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to delete location');
            }

            fetchLocations();
        } catch (error) {
            console.error('Error deleting location:', error);
            alert(error.message || 'Failed to delete location. Please try again.');
        }
    };

    if (loading && locations.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading store locations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Store Locations Management</h1>
                    <p className="text-gray-600 mt-1">
                        {pagination.total} total location{pagination.total !== 1 ? 's' : ''} • 
                        {locations.length} displayed
                    </p>
                </div>
                <button
                    onClick={handleCreateLocation}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Add New Location
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-wrap gap-4">
                    {/* Search Bar */}
                    <div className="flex-1 min-w-[300px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search Locations
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, city, state, or phone..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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

                    {/* Status Filter */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                            <option value="all">All Locations</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Primary Filter */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <select
                            value={filters.is_primary}
                            onChange={(e) => setFilters({ ...filters, is_primary: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                            <option value="all">All Types</option>
                            <option value="yes">Primary</option>
                            <option value="no">Branch</option>
                        </select>
                    </div>

                    {/* Refresh Button */}
                    <div className="flex items-end">
                        <button
                            onClick={fetchLocations}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Locations Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.length === 0 ? (
                    <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No store locations found</p>
                        <p className="text-gray-400 text-sm mt-1">
                            {searchTerm ? 'Try adjusting your search' : 'Create your first location to get started'}
                        </p>
                    </div>
                ) : (
                    locations.map((location) => (
                        <div key={location.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                            <div className="p-6">
                                {/* Location Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Store className="w-5 h-5 text-blue-600" />
                                            <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                location.is_active 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {location.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                            {location.is_primary && (
                                                <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                                    <Star className="w-3 h-3" />
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Location Details */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-start gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                        <div className="text-gray-700">
                                            <p>{location.address_line_1}</p>
                                            {location.address_line_2 && <p>{location.address_line_2}</p>}
                                            <p>{location.city}, {location.state} {location.postal_code}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span>{location.phone_number}</span>
                                    </div>

                                    {location.email && (
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <Mail className="w-4 h-4 text-gray-500" />
                                            <span>{location.email}</span>
                                        </div>
                                    )}

                                    {/* Sample Hours Display */}
                                    {location.monday_hours && (
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <Clock className="w-4 h-4 text-gray-500" />
                                            <span>Mon: {location.monday_hours}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => handleViewDetails(location.id)}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => handleDeleteLocation(location.id, location.name)}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Info */}
            {locations.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{locations.length}</span> of{' '}
                            <span className="font-medium">{pagination.total}</span> locations
                        </p>
                    </div>
                </div>
            )}

            {/* Store Location Modal */}
            <StoreLocationModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                locationId={selectedLocationId}
                token={token}
                onSuccess={handleSuccess}
                mode={modalMode}
            />
        </div>
    );
};

export default AdminStoreLocation;