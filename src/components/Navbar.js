import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logout from './Logout';
import { useSelector } from 'react-redux';
import { ShoppingCart, Menu, X, Pizza } from 'lucide-react';
import { useState } from 'react';
function Navbar() {
  const { amount } = useSelector((store) => store.cart);
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Brand */}
          {/* This will serve as the home-page link, no need for separate link. */}
          <Link to="/" className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors">
            <Pizza size={32} className="text-red-600" />
            <span className="text-2xl font-bold tracking-tight">Nikki's Pizza</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/pizzas" 
              className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Pizzas
            </Link>
          </div>

          {/* Desktop Auth & Cart */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated && (
              <>
                <Link 
                  to="/login" 
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                >
                  Login
                </Link>
              </>
            )}
            
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <Logout />
              </div>
            )}

            {/* Cart Icon */}
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
            >
              <ShoppingCart size={24} />
              {amount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {amount > 99 ? '99+' : amount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Cart */}
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
            >
              <ShoppingCart size={24} />
              {amount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {amount > 99 ? '99+' : amount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-red-600 focus:outline-none focus:text-red-600 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-lg mt-2">
            <Link 
              to="/" 
              className="block px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/pizzas" 
              className="block px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pizzas
            </Link>
            
            {!isAuthenticated && (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
            
            {isAuthenticated && (
              <div className="px-3 py-2">
                <Logout />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;