import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logout from './Logout';
function Navbar() {
  const { isAuthenticated } = useAuth();
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      {!isAuthenticated && <Link to="/login">Login</Link>}
      <Link to="/order">Order</Link>
      {!isAuthenticated && <Link to="/register">Register</Link>}
      {isAuthenticated && <Logout />}
    </nav>
  );
}

export default Navbar;