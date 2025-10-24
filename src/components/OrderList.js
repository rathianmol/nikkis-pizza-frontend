import { useState, useEffect } from 'react';
import { Clock, AlertCircle, ChevronLeft, ChevronRight, X, Package, CheckCircle, XCircle, Truck, Store, CreditCard, Banknote, MapPin, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Modal Component
const OrderDetailModal = ({ isOpen, onClose, orderId, token }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (isOpen && orderId) {
            fetchOrderDetail();
        }
    }, [isOpen, orderId]);

    const fetchOrderDetail = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await fetch(`http://localhost:8000/api/admin/orders/${orderId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch order details');
            }

            const result = await response.json();
            const orderData = result.data || result.order || result;
            
            setOrder(orderData);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching order details:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const getStatusInfo = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return {
                    icon: <Clock className="w-5 h-5" />,
                    color: 'bg-yellow-500',
                    textColor: 'text-yellow-700',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    label: 'Order Pending'
                };
            case 'confirmed':
                return {
                    icon: <CheckCircle className="w-5 h-5" />,
                    color: 'bg-blue-500',
                    textColor: 'text-blue-700',
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    label: 'Order Confirmed'
                };
            case 'preparing':
                return {
                    icon: <Package className="w-5 h-5" />,
                    color: 'bg-orange-500',
                    textColor: 'text-orange-700',
                    bgColor: 'bg-orange-50',
                    borderColor: 'border-orange-200',
                    label: 'Preparing'
                };
            case 'ready':
                return {
                    icon: <CheckCircle className="w-5 h-5" />,
                    color: 'bg-green-500',
                    textColor: 'text-green-700',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    label: 'Ready'
                };
            case 'out for delivery':
                return {
                    icon: <Truck className="w-5 h-5" />,
                    color: 'bg-cyan-500',
                    textColor: 'text-cyan-700',
                    bgColor: 'bg-cyan-50',
                    borderColor: 'border-cyan-200',
                    label: 'Out for Delivery'
                };
            case 'completed':
                return {
                    icon: <CheckCircle className="w-5 h-5" />,
                    color: 'bg-green-600',
                    textColor: 'text-green-800',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-300',
                    label: 'Completed'
                };
            case 'cancelled':
                return {
                    icon: <XCircle className="w-5 h-5" />,
                    color: 'bg-red-500',
                    textColor: 'text-red-700',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    label: 'Cancelled'
                };
            default:
                return {
                    icon: <Package className="w-5 h-5" />,
                    color: 'bg-gray-500',
                    textColor: 'text-gray-700',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    label: 'Unknown'
                };
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                            {order && <p className="text-gray-600">Order #{order.id}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                            {order && (
                                <button
                                    onClick={() => fetchOrderDetail(true)}
                                    disabled={refreshing}
                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                    {refreshing ? 'Refreshing...' : 'Refresh'}
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
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
                                    <p className="mt-4 text-gray-600">Loading order details...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Order</h3>
                                <p className="text-red-700 mb-4">{error}</p>
                                <button
                                    onClick={() => fetchOrderDetail()}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : order ? (
                            <div className="space-y-6">
                                {/* Status Banner */}
                                {(() => {
                                    const statusInfo = getStatusInfo(order.status);
                                    return (
                                        <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2 rounded-lg p-4`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`${statusInfo.color} text-white p-2 rounded-full`}>
                                                    {statusInfo.icon}
                                                </div>
                                                <div>
                                                    <h3 className={`font-bold ${statusInfo.textColor}`}>
                                                        {statusInfo.label}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Customer Info */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Name:</span>
                                            <span className="font-medium text-gray-900">{order.user?.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-medium text-gray-900">{order.user?.email || 'N/A'}</span>
                                        </div>
                                        {order.user?.phone && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Phone:</span>
                                                <span className="font-medium text-gray-900">{order.user.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Order Type Card */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            {order.order_type === 'delivery' ? (
                                                <Truck className="w-5 h-5 text-blue-600" />
                                            ) : (
                                                <Store className="w-5 h-5 text-blue-600" />
                                            )}
                                            <h3 className="font-semibold text-gray-900">
                                                {order.order_type === 'delivery' ? 'Delivery Order' : 'Pickup Order'}
                                            </h3>
                                        </div>
                                        
                                        {order.delivery_address ? (
                                            <div className="space-y-1 text-sm">
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                                    <div className="text-gray-700">
                                                        <p className="font-medium">{order.delivery_address.address_line_1}</p>
                                                        {order.delivery_address.address_line_2 && (
                                                            <p>{order.delivery_address.address_line_2}</p>
                                                        )}
                                                        <p>
                                                            {order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.postal_code}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 text-sm">Pickup at Nikki's Pizza</p>
                                        )}
                                    </div>

                                    {/* Payment Card */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            {order.payment_method === 'cash' ? (
                                                <Banknote className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <CreditCard className="w-5 h-5 text-blue-600" />
                                            )}
                                            <h3 className="font-semibold text-gray-900">Payment</h3>
                                        </div>
                                        <div>
                                            <p className="text-gray-700 font-medium text-sm">
                                                {order.payment_method === 'cash' ? 'Cash Payment' : 'Card Payment'}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {order.payment_method === 'cash' 
                                                    ? `Pay on ${order.order_type === 'delivery' ? 'delivery' : 'pickup'}`
                                                    : 'Payment processed'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4">
                                        Order Items ({order.amount})
                                    </h3>
                                    <div className="space-y-3">
                                        {(order.cart_items || []).map((item, index) => (
                                            <div key={index} className="flex items-center gap-3 pb-3 border-b border-gray-200 last:border-b-0 last:pb-0">
                                                <img
                                                    src={`http://localhost:8000/storage/${item.image}`}
                                                    alt={item.title}
                                                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                                    onError={(e) => {
                                                        e.target.src = "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=64&h=64&fit=crop";
                                                    }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 truncate">{item.title}</p>
                                                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                                                </div>
                                                <p className="font-bold text-gray-900">${item.price}</p>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Total */}
                                    <div className="mt-4 pt-4 border-t-2 border-gray-300">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-900">Total</span>
                                            <span className="text-xl font-bold text-blue-600">
                                                ${parseFloat(order.total_price).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Info */}
                                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <span>Ordered: {formatDate(order.created_at)}</span>
                                        <span>Updated: {formatDate(order.updated_at)}</span>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main OrderList Component
const OrderList = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({});
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 15
    });
    const [filters, setFilters] = useState({
        status: 'all',
        type: 'all',
        timeframe: 'all'
    });

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
        preparing: 'bg-purple-100 text-purple-800 border-purple-300',
        ready: 'bg-green-100 text-green-800 border-green-300',
        'out for delivery': 'bg-cyan-100 text-cyan-800 border-cyan-300',
        completed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        cancelled: 'bg-red-100 text-red-800 border-red-300'
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [orders, filters]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/admin/orders/', {
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
                setOrders(result.data.data);
                setPagination({
                    currentPage: result.data.current_page,
                    lastPage: result.data.last_page,
                    total: result.data.total,
                    perPage: result.data.per_page
                });
            } else if (result.data) {
                setOrders(result.data);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...orders];

        if (filters.status !== 'all') {
            filtered = filtered.filter(o => o.status === filters.status);
        }

        if (filters.type !== 'all') {
            filtered = filtered.filter(o => o.order_type === filters.type);
        }

        if (filters.timeframe !== 'all') {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            filtered = filtered.filter(o => {
                const orderDate = new Date(o.created_at);
                if (filters.timeframe === 'today') {
                    return orderDate >= startOfDay;
                } else if (filters.timeframe === 'yesterday') {
                    const yesterday = new Date(startOfDay);
                    yesterday.setDate(yesterday.getDate() - 1);
                    return orderDate >= yesterday && orderDate < startOfDay;
                } else if (filters.timeframe === 'week') {
                    const weekAgo = new Date(startOfDay);
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return orderDate >= weekAgo;
                }
                return true;
            });
        }

        setFilteredOrders(filtered);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdating(prev => ({ ...prev, [orderId]: true }));
        
        try {
            const response = await fetch(
                `http://localhost:8000/api/admin/orders/${orderId}/status`,
                {
                    method: 'PATCH',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: newStatus })
                }
            );

            if (!response.ok) {
                throw new Error('Status update failed');
            }
            
            const result = await response.json();
            
            if (result.success && result.data) {
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === orderId ? result.data : order
                    )
                );
            } else {
                await fetchOrders();
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status. Please try again.');
        } finally {
            setUpdating(prev => ({ ...prev, [orderId]: false }));
        }
    };

    const handleViewDetails = (orderId) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrderId(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
                    <p className="text-gray-600 mt-1">
                        {pagination.total} total order{pagination.total !== 1 ? 's' : ''} • 
                        {filteredOrders.length} displayed
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="out for delivery">Out for Delivery</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Order Type
                        </label>
                        <select
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                            <option value="all">All Types</option>
                            <option value="delivery">Delivery</option>
                            <option value="pickup">Pickup</option>
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Timeframe
                        </label>
                        <select
                            value={filters.timeframe}
                            onChange={(e) => setFilters({ ...filters, timeframe: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="week">Last 7 Days</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Items
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Date/Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center">
                                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">No orders found</p>
                                        <p className="text-gray-400 text-sm mt-1">
                                            Try adjusting your filters
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm">
                                            <span className="font-semibold text-gray-900">
                                                #{order.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {order.user?.name || 'N/A'}
                                                </div>
                                                <div className="text-gray-500 text-xs">
                                                    {order.user?.email || ''}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {order.amount} item{order.amount !== 1 ? 's' : ''}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="capitalize px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-xs font-medium">
                                                {order.order_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            ${parseFloat(order.total_price).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                disabled={updating[order.id]}
                                                className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer border focus:ring-2 focus:ring-blue-500 transition ${
                                                    statusColors[order.status] || 'bg-gray-100 text-gray-800 border-gray-300'
                                                } ${updating[order.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="preparing">Preparing</option>
                                                <option value="ready">Ready</option>
                                                <option value="out for delivery">Out for Delivery</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                            {updating[order.id] && (
                                                <div className="mt-1 text-xs text-gray-500">
                                                    Updating...
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                <div>
                                                    <div className="font-medium">{formatDate(order.created_at)}</div>
                                                    <div className="text-xs text-gray-500">{formatTime(order.created_at)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => handleViewDetails(order.id)}
                                                className="text-blue-600 hover:text-blue-900 font-medium hover:underline transition"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Info */}
                {filteredOrders.length > 0 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{filteredOrders.length}</span> of{' '}
                                <span className="font-medium">{pagination.total}</span> orders
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            <OrderDetailModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                orderId={selectedOrderId}
                token={token}
            />
        </div>
    );
};

export default OrderList;