import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, Store, CreditCard, Banknote, MapPin, RefreshCw, ArrowLeft } from 'lucide-react';

export default function OrderDetail() {
  const { orderId } = useParams(); // Get order ID from URL
  const navigate = useNavigate();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to view this order');
        }
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();
      
      // Handle both response formats and validate data
      const orderData = data.order || data;
      
      // Validate that we have an order object
      if (!orderData || typeof orderData !== 'object') {
        throw new Error('Invalid order data received');
      }
      
      setOrder(orderData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchOrder(true);
  };

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          icon: <Clock className="w-6 h-6" />,
          color: 'bg-yellow-500',
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          label: 'Order Pending',
          description: 'Your order has been received and is waiting to be confirmed.'
        };
      case 'confirmed':
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          color: 'bg-blue-500',
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          label: 'Order Confirmed',
          description: 'Your order has been confirmed and will be prepared soon.'
        };
      case 'preparing':
        return {
          icon: <Package className="w-6 h-6" />,
          color: 'bg-orange-500',
          textColor: 'text-orange-700',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          label: 'Preparing',
          description: 'Your delicious pizza is being prepared right now!'
        };
      case 'ready':
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          color: 'bg-green-500',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          label: 'Ready',
          description: 'Your order is ready for pickup or out for delivery!'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          color: 'bg-green-600',
          textColor: 'text-green-800',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-300',
          label: 'Completed',
          description: 'Your order has been completed. Enjoy your meal!'
        };
      case 'cancelled':
        return {
          icon: <XCircle className="w-6 h-6" />,
          color: 'bg-red-500',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          label: 'Cancelled',
          description: 'This order has been cancelled.'
        };
      default:
        return {
          icon: <Package className="w-6 h-6" />,
          color: 'bg-gray-500',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          label: 'Unknown',
          description: 'Order status unknown.'
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

  const getEstimatedTime = (orderType, status) => {
    if (status === 'completed' || status === 'cancelled') return null;
    
    const times = {
      pickup: { pending: '15-20', confirmed: '10-15', preparing: '5-10', ready: 'Ready now!' },
      delivery: { pending: '30-40', confirmed: '25-35', preparing: '15-25', ready: 'On the way!' }
    };
    
    const time = times[orderType]?.[status];
    return time ? `Est. ${time} min` : null;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <XCircle className="w-8 h-8 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-red-900">Error Loading Order</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/orders/history')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Orders
            </button>
            <button
              onClick={() => fetchOrder()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-50 rounded-lg shadow-md p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or you don't have access to it.</p>
          <Link
            to="/orders/history"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  // Safely handle cart items and delivery address - check if order and properties exist
  if (!order.cart_items) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <XCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-900">Invalid Order Data</h3>
          <p className="text-yellow-700 mb-4">This order has incomplete data.</p>
          <Link
            to="/orders/history"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-block transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const cartItems = Array.isArray(order.cart_items) ? order.cart_items : [];
  const deliveryAddress = order.delivery_address || null;
  const statusInfo = getStatusInfo(order.status);
  const estimatedTime = getEstimatedTime(order.order_type, order.status);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button & Header */}
      <div className="mb-6">
        {/* <button
          onClick={() => navigate('/order-history')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Order History</span>
        </button> */}
        <Link
            to={'/order-history'}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> <span>Back to Order History</span>
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600">Order #{order.id}</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2 rounded-lg p-6 mb-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`${statusInfo.color} text-white p-3 rounded-full`}>
              {statusInfo.icon}
            </div>
            <div>
              <h2 className={`text-xl font-bold ${statusInfo.textColor}`}>
                {statusInfo.label}
              </h2>
              <p className="text-gray-700 mt-1">{statusInfo.description}</p>
              {estimatedTime && (
                <p className="text-sm font-semibold text-gray-800 mt-2">
                  ⏱️ {estimatedTime}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Order Type Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            {order.order_type === 'delivery' ? (
              <Truck className="w-6 h-6 text-blue-600" />
            ) : (
              <Store className="w-6 h-6 text-blue-600" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">
              {order.order_type === 'delivery' ? 'Delivery Order' : 'Pickup Order'}
            </h3>
          </div>
          
          {deliveryAddress ? (
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                <div className="text-gray-700">
                  <p className="font-medium">{deliveryAddress.address_line_1}</p>
                  {deliveryAddress.address_line_2 && <p>{deliveryAddress.address_line_2}</p>}
                  <p>{deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.postal_code}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Pickup at Nikki's Pizza</p>
          )}
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            {order.payment_method === 'cash' ? (
              <Banknote className="w-6 h-6 text-green-600" />
            ) : (
              <CreditCard className="w-6 h-6 text-blue-600" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">Payment</h3>
          </div>
          <div>
            <p className="text-gray-700 font-medium">
              {order.payment_method === 'cash' ? 'Cash Payment' : 'Card Payment'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {order.payment_method === 'cash' 
                ? `Pay on ${order.order_type === 'delivery' ? 'delivery' : 'pickup'}`
                : 'Payment processed'}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Items ({order.amount})
        </h3>
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
              <img
                src={`http://localhost:8000/storage/${item.image}`}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=80&h=80&fit=crop";
                }}
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600">Size: {item.size}</p>
              </div>
              <p className="font-bold text-gray-900">${item.price}</p>
            </div>
          ))}
        </div>
        
        {/* Total */}
        <div className="mt-6 pt-4 border-t-2 border-gray-300">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-blue-600">${order.total_price}</span>
          </div>
        </div>
      </div>

      {/* Order Info */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>Ordered on {formatDate(order.created_at)}</span>
          <span className="text-gray-500">Last updated: {formatDate(order.updated_at)}</span>
        </div>
      </div>
    </div>
  );
}