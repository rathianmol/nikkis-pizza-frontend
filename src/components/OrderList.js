import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const OrderList = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({});
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
    const navigate = useNavigate();

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
            
            // Handle paginated response structure
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

        // Status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(o => o.status === filters.status);
        }

        // Type filter
        if (filters.type !== 'all') {
            filtered = filtered.filter(o => o.order_type === filters.type);
        }

        // Timeframe filter
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
            
            // Update the local state with the updated order
            if (result.success && result.data) {
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === orderId ? result.data : order
                    )
                );
            } else {
                // Fallback: refetch all orders if update response doesn't include data
                await fetchOrders();
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status. Please try again.');
        } finally {
            setUpdating(prev => ({ ...prev, [orderId]: false }));
        }
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
                                                onClick={() => navigate(`/admin/orders/${order.id}`)}
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
        </div>
    );
};

export default OrderList;