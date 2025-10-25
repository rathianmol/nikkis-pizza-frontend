// This is a admin-protected view for customer management.
import { useState, useEffect } from 'react';
import { Search, X, UserPlus, Edit2, Trash2, Mail, Phone, MapPin, User, Eye, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Customer Detail/Edit Modal Component
const CustomerModal = ({ isOpen, onClose, customerId, token, onSuccess, mode = 'view' }) => {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(mode === 'create');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: ''
    });

    useEffect(() => {
        if (isOpen && customerId && mode !== 'create') {
            fetchCustomerDetail();
        } else if (mode === 'create') {
            setLoading(false);
            setIsEditing(true);
        }
    }, [isOpen, customerId, mode]);

    const fetchCustomerDetail = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8000/api/admin/customers/${customerId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch customer details');

            const result = await response.json();
            const customerData = result.data || result.customer || result;
            
            setCustomer(customerData);
            setFormData({
                name: customerData.name || '',
                email: customerData.email || '',
                phone: customerData.phone || '',
                password: '',
                address_line_1: customerData.address?.address_line_1 || '',
                address_line_2: customerData.address?.address_line_2 || '',
                city: customerData.address?.city || '',
                state: customerData.address?.state || '',
                postal_code: customerData.address?.postal_code || ''
            });
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching customer details:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const url = mode === 'create' 
                ? 'http://localhost:8000/api/admin/customers'
                : `http://localhost:8000/api/admin/customers/${customerId}`;
            
            const method = mode === 'create' ? 'POST' : 'PUT';

            // Don't send password if it's empty (for updates)
            const submitData = { ...formData };
            if (!submitData.password && mode !== 'create') {
                delete submitData.password;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(submitData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to save customer');
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
            console.error('Error saving customer:', err);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
            
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {mode === 'create' ? 'Create Customer' : isEditing ? 'Edit Customer' : 'Customer Details'}
                            </h2>
                            {customer && <p className="text-gray-600">Customer ID: #{customer.id}</p>}
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
                                    <p className="mt-4 text-gray-600">Loading customer details...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
                                <p className="text-red-700 mb-4">{error}</p>
                                <button
                                    onClick={() => mode !== 'create' && fetchCustomerDetail()}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Password {mode === 'create' ? '*' : '(leave blank to keep current)'}
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required={mode === 'create'}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4">Address Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address Line 1
                                            </label>
                                            <input
                                                type="text"
                                                name="address_line_1"
                                                value={formData.address_line_1}
                                                onChange={handleInputChange}
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
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    State
                                                </label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Postal Code
                                            </label>
                                            <input
                                                type="text"
                                                name="postal_code"
                                                value={formData.postal_code}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
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
                                        {saving ? 'Saving...' : mode === 'create' ? 'Create Customer' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                {/* View Mode - Personal Info */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <User className="w-5 h-5 text-gray-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-600">Name</p>
                                                <p className="font-medium text-gray-900">{customer?.name || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-600">Email</p>
                                                <p className="font-medium text-gray-900">{customer?.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                        {customer?.phone && (
                                            <div className="flex items-start gap-3">
                                                <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Phone</p>
                                                    <p className="font-medium text-gray-900">{customer.phone}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* View Mode - Address Info */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4">Address Information</h3>
                                    {customer?.address ? (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <div className="text-gray-700">
                                                <p className="font-medium">{customer.address.address_line_1}</p>
                                                {customer.address.address_line_2 && (
                                                    <p>{customer.address.address_line_2}</p>
                                                )}
                                                <p>
                                                    {customer.address.city}, {customer.address.state} {customer.address.postal_code}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-600 text-sm">No address on file</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main CustomerList Component
const CustomerList = () => {
    const { token } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
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
        has_address: 'all'
    });

    useEffect(() => {
        fetchCustomers();
    }, [searchTerm, filters]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            
            if (searchTerm) params.append('search', searchTerm);
            if (filters.status !== 'all') params.append('status', filters.status);
            if (filters.has_address !== 'all') params.append('has_address', filters.has_address);

            const url = `http://localhost:8000/api/admin/customers${params.toString() ? '?' + params.toString() : ''}`;
            
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
                setCustomers(result.data.data);
                setPagination({
                    currentPage: result.data.current_page,
                    lastPage: result.data.last_page,
                    total: result.data.total,
                    perPage: result.data.per_page
                });
            } else if (result.data) {
                setCustomers(result.data);
            } else {
                setCustomers([]);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (customerId) => {
        setSelectedCustomerId(customerId);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleCreateCustomer = () => {
        setSelectedCustomerId(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCustomerId(null);
        setModalMode('view');
    };

    const handleSuccess = () => {
        fetchCustomers();
    };

    const handleDeleteCustomer = async (customerId, customerName) => {
        if (!window.confirm(`Are you sure you want to delete customer "${customerName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/admin/customers/${customerId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete customer');
            }

            fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
            alert('Failed to delete customer. Please try again.');
        }
    };

    if (loading && customers.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading customers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
                    <p className="text-gray-600 mt-1">
                        {pagination.total} total customer{pagination.total !== 1 ? 's' : ''} • 
                        {customers.length} displayed
                    </p>
                </div>
                <button
                    onClick={handleCreateCustomer}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-sm"
                >
                    <UserPlus className="w-5 h-5" />
                    Create Customer
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-wrap gap-4">
                    {/* Search Bar */}
                    <div className="flex-1 min-w-[300px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search Customers
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, email, or phone..."
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
                            <option value="all">All Customers</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Address Filter */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                        </label>
                        <select
                            value={filters.has_address}
                            onChange={(e) => setFilters({ ...filters, has_address: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                            <option value="all">All</option>
                            <option value="yes">Has Address</option>
                            <option value="no">No Address</option>
                        </select>
                    </div>

                    {/* Refresh Button */}
                    <div className="flex items-end">
                        <button
                            onClick={fetchCustomers}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Customer ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Phone
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Address
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">No customers found</p>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {searchTerm ? 'Try adjusting your search' : 'Create your first customer to get started'}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm">
                                            <span className="font-semibold text-gray-900">
                                                #{customer.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {customer.name || 'N/A'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Role: {customer.role || 'customer'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                {customer.email || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                {customer.phone || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {customer.address ? (
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                    <div className="text-gray-700 text-xs">
                                                        <p>{customer.address.city}, {customer.address.state}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">No address</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(customer.id)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete Customer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Info */}
                {customers.length > 0 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{customers.length}</span> of{' '}
                                <span className="font-medium">{pagination.total}</span> customers
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Customer Modal */}
            <CustomerModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                customerId={selectedCustomerId}
                token={token}
                onSuccess={handleSuccess}
                mode={modalMode}
            />
        </div>
    );
};

export default CustomerList