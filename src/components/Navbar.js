import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logout from './Logout';
import { useSelector } from 'react-redux';
function Navbar() {
  const { amount } = useSelector((store) => store.cart);
  const { isAuthenticated } = useAuth();
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/pizzas">Pizzas</Link>
      {!isAuthenticated && <Link to="/login">Login</Link>}
      {!isAuthenticated && <Link to="/register">Register</Link>}
      {isAuthenticated && <Logout />}
      <Link to="/cart">Cart - {amount}</Link>
    </nav>
  );
}

export default Navbar;