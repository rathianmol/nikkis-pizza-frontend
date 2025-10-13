
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
import OrderTracking from './components/OrderTracking';
import OrderHistory from './components/OrderHistory';
import { AuthProvider } from './contexts/AuthContext';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './utils/ProtectedRoutes';
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
              <Route path="/order-tracking" element={<OrderTracking />} />
              <Route path="/order-history" element={<OrderHistory />} />
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
