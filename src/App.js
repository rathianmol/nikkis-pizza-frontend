
import Home from './components/Home';
import Login from './components/Login';
import Menu from './components/Menu';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Cart from './components/Cart';
import Pizzas from './components/Pizzas';
import { Provider } from 'react-redux';
import store from './redux/store';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
            <Route path="/menu" element={<Menu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
          <Footer />
        </AuthProvider>
      {/* </Router> */}
    </Provider>
  );
}

export default App;
