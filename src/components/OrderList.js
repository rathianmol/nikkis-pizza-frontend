import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, Download } from 'lucide-react';
// import axios from 'axios';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: 'all',
        type: 'all',
        timeframe: 'today'
    });
    const navigate = useNavigate();

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        preparing: 'bg-purple-100 text-purple-800',
        ready: 'bg-green-100 text-green-800',
        'out for delivery': 'bg-cyan-100 text-cyan-800',
        completed: 'bg-emerald-100 text-emerald-800',
        cancelled: 'bg-red-100 text-red-800'
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [orders, filters]);

    const fetchOrders = async () => {
        // try {
        //     setLoading(true);
        //     const response = await axios.get('/api/orders', {
        //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        //     });
        //     setOrders(response.data.data || response.data);
        // } catch (error) {
        //     console.error('Error fetching orders:', error);
        // } finally {
        //     setLoading(false);
        // }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/orders', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' // Good practice for fetch
                }
            });
            
            // fetch does not throw on 4xx/5xx errors, so we check the status ourselves
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // fetch response body must be explicitly parsed (e.g., as JSON)
            const data = await response.json(); 
            setOrders(data.data || data); 
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = orders;

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
                }
                return true;
            });
        }

        setFilteredOrders(filtered);
    };

    const handleExport = async () => {
        // try {
        //     const response = await axios.get('/api/orders/export/sheets', {
        //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        //     });
        //     // Handle file download or redirect to Google Sheets
        //     window.open(response.data.url, '_blank');
        // } catch (error) {
        //     console.error('Export failed:', error);
        // }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        // try {
        //     await axios.patch(
        //         `/api/orders/${orderId}/status`,
        //         { status: newStatus },
        //         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        //     );
        //     fetchOrders();
        //     // Reverb will broadcast this update to the customer
        // } catch (error) {
        //     console.error('Error updating order status:', error);
        // }
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `/api/orders/${orderId}/status`,
                {
                    method: 'PATCH', // Specify the method
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' // MUST be set for JSON body
                    },
                    body: JSON.stringify({ status: newStatus }) // MUST stringify the body
                }
            );

            if (!response.ok) throw new Error('Status update failed');
            
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading orders...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-600 mt-1">Manage all customer orders</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    <Download className="w-4 h-4" />
                    Export to Sheets
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 flex gap-4">
                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
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

                <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                    <option value="all">All Types</option>
                    <option value="delivery">Delivery</option>
                    <option value="pickup">Pickup</option>
                </select>

                <select
                    value={filters.timeframe}
                    onChange={(e) => setFilters({ ...filters, timeframe: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                </select>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{order.user?.name}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="capitalize px-3 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                                            {order.order_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${order.total}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`px-3 py-1 rounded text-sm font-medium cursor-pointer ${statusColors[order.status] || 'bg-gray-100'}`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="preparing">Preparing</option>
                                            <option value="ready">Ready</option>
                                            <option value="out for delivery">Out for Delivery</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(order.created_at).toLocaleTimeString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                                            className="text-blue-600 hover:text-blue-900 font-medium"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList;