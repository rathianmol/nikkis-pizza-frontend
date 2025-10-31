
import Home from './components/Home';
import Login from './components/Login';
// import Menu from './components/Menu';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Cart from './components/Cart';
import Pizzas from './components/Pizzas';
import UserAddress from './components/UserAddress';
import { Provider } from 'react-redux';
import store from './redux/store';
import Footer from './components/Footer';
import OrderHistory from './components/OrderHistory';
import OrderDetails from './components/OrderDetails';
import { AuthProvider } from './contexts/AuthContext';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './utils/ProtectedRoutes';
import AdminProtectedRoutes from './utils/AdminProtectedRoutes';
import OrderList from './components/OrderList';
import AdminStoreLocation from './components/AdminStoreLocation';
import CustomerList from './components/CustomerList';
import AdminLayout from './components/AdminLayout';
import { Routes, Route } from 'react-router-dom';
function App() {
  return (
    <Provider store={store}>
      {/* <Router> */}
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pizzas" element={<Pizzas />} />
            {/* <Route path="/menu" element={<Menu />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/create-address" element={<UserAddress />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/orders/:orderId" element={<OrderDetails />} />
            </Route>
            {/* Admin-only routes */}
            <Route element={<AdminProtectedRoutes />}>
                {/* Dummy admin routes: */}
                {/* <Route path="/admin" element={<AdminDashboard />} /> */}
                {/* <Route path="/admin/users" element={<AdminUsers />} /> */}
                {/* <Route path="/admin/settings" element={<AdminSettings />} /> */}

                 <Route element={<AdminLayout />}>
                    {/* Dashboard */}
                    {/* <Route path="/admin" element={<AdminDashboard />} /> */}

                    {/* Orders */}
                    <Route path="/admin/orders" element={<OrderList />} />
                    {/* <Route path="/admin/orders/:id" element={<OrderDetails />} /> */}

                    {/* Customer Management */}
                    <Route path="/admin/customers" element={<CustomerList />} />
                    {/* <Route path="/admin/customers/:id" element={<CustomerDetails />} /> */}


                    {/* Store Location Management */}
                    <Route path="/admin/store-locations" element={<AdminStoreLocation />} />


                    {/* <Route path="/admin/customers/:id" element={<CustomerDetails />} /> */}
                    {/* Menu Management */}
                    {/* <Route path="/admin/menu/products" element={<MenuProducts />} />
                    <Route path="/admin/menu/categories" element={<MenuCategories />} />
                    <Route path="/admin/menu/variants" element={<MenuVariants />} /> */}



                    {/* Reports */}
                    {/* <Route path="/admin/reports/sales" element={<SalesReports />} />
                    <Route path="/admin/reports/best-sellers" element={<BestSellers />} />
                    <Route path="/admin/reports/coupons" element={<CouponTracking />} /> */}

                    {/* Settings */}
                    {/* <Route path="/admin/settings/hours" element={<BusinessHours />} />
                    <Route path="/admin/settings/delivery" element={<DeliveryZones />} />
                    <Route path="/admin/settings/tax" element={<TaxRates />} />
                    <Route path="/admin/settings/notifications" element={<Notifications />} /> */}
                </Route>
            </Route>
            {/* <Route path="/create-address" element={<UserAddress />} /> */}
          </Routes>
          <Footer />
        </AuthProvider>
      {/* </Router> */}
    </Provider>
  );
}

export default App;