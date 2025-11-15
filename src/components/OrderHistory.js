import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Calendar, Hash } from 'lucide-react';

export default function OrderHistory() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/orders/history', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order history');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching order history:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get status styles (reused from OrderTracking)
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { icon: <Clock className="w-5 h-5" />, textColor: 'text-yellow-700', label: 'Pending' };
      case 'confirmed':
        return { icon: <CheckCircle className="w-5 h-5" />, textColor: 'text-blue-700', label: 'Confirmed' };
      case 'preparing':
        return { icon: <Package className="w-5 h-5" />, textColor: 'text-orange-700', label: 'Preparing' };
      case 'ready':
        return { icon: <CheckCircle className="w-5 h-5" />, textColor: 'text-green-700', label: 'Ready' };
      case 'completed':
        return { icon: <CheckCircle className="w-5 h-5" />, textColor: 'text-green-800', label: 'Completed' };
      case 'cancelled':
        return { icon: <XCircle className="w-5 h-5" />, textColor: 'text-red-700', label: 'Cancelled' };
      default:
        return { icon: <Package className="w-5 h-5" />, textColor: 'text-gray-700', label: 'Unknown' };
    }
  };

  // Helper function to format date (reused from OrderTracking)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your order history...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900">Error Loading Orders</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchOrderHistory}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No Orders State
  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-50 rounded-lg shadow-md p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Order History</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet. Let's change that!</p>
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Start Your First Order
          </Link>
        </div>
      </div>
    );
  }

  // Main Content: Orders List
  return (
    <div className="min-h-screen max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <p className="text-gray-600">Here are all the orders you've placed with us.</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          return (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Order ID */}
                <div className="flex items-center space-x-3">
                  <Hash className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold text-gray-800">#{order.id}</p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-gray-800">{formatDate(order.created_at)}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center space-x-2">
                  <span className={statusInfo.textColor}>{statusInfo.icon}</span>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-semibold ${statusInfo.textColor}`}>{statusInfo.label}</p>
                  </div>
                </div>
                
                {/* Total & Link */}
                <div className="flex md:flex-col md:items-end items-center justify-between">
                  <p className="text-lg font-bold text-gray-900">${order.total_price}</p>
                  {/* Note: This link assumes you have a route like /orders/:orderId */}
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}