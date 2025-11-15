import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, Pizza } from 'lucide-react';
import { useStoreLocation } from '../contexts/StoreLocationsContext';

const Footer = () => {
  const { getSelectedLocationObject, getPrimaryLocation } = useStoreLocation();
  
  // Get the selected location, fallback to primary if none selected
  const location = getSelectedLocationObject() || getPrimaryLocation();

  // Helper function to format hours display
  const formatHours = (hours) => {
    if (!hours || hours.toLowerCase() === 'closed') return 'Closed';
    return hours;
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Pizza size={32} className="text-red-500" />
              <span className="text-2xl font-bold">Nikki's Pizza</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Authentic pizza made with love, fresh ingredients, and a commitment to our community.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/nikkispizza" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://instagram.com/nikkispizza" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://twitter.com/nikkispizza" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-blue-400 transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="/pizzas" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                  Our Pizzas
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info - Dynamic from Store Location */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Contact Info
              {location?.name && (
                <span className="block text-sm text-gray-400 font-normal mt-1">
                  {location.name}
                </span>
              )}
            </h3>
            {location ? (
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin size={18} className="text-red-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-400">
                    {location.address_line_1}
                    {location.address_line_2 && (
                      <>
                        <br />
                        {location.address_line_2}
                      </>
                    )}
                    <br />
                    {location.city}, {location.state} {location.postal_code}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={18} className="text-red-500 flex-shrink-0" />
                  <a 
                    href={`tel:${location.phone_number}`}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                  >
                    {location.phone_number}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail size={18} className="text-red-500 flex-shrink-0" />
                  <a 
                    href={`mailto:${location.email}`}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                  >
                    {location.email}
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Loading location information...</p>
            )}
          </div>

          {/* Hours - Dynamic from Store Location */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hours</h3>
            {location ? (
              <div className="space-y-2 text-gray-400 text-sm">
                <div className="flex justify-between gap-4">
                  <span>Monday</span>
                  <span className="text-right">{formatHours(location.monday_hours)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Tuesday</span>
                  <span className="text-right">{formatHours(location.tuesday_hours)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Wednesday</span>
                  <span className="text-right">{formatHours(location.wednesday_hours)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Thursday</span>
                  <span className="text-right">{formatHours(location.thursday_hours)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Friday</span>
                  <span className="text-right">{formatHours(location.friday_hours)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Saturday</span>
                  <span className="text-right">{formatHours(location.saturday_hours)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Sunday</span>
                  <span className="text-right">{formatHours(location.sunday_hours)}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Loading hours...</p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Nikki's Pizza. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;