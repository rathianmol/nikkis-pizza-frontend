import { Link } from 'react-router-dom';


function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/login">Login</Link>
       <Link to="/order">Order</Link>
       <Link to="/register">Register</Link>
    </nav>
  );
}

export default Navbar;