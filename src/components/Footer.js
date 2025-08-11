import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, Pizza } from 'lucide-react';

const Footer = () => {
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

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-red-500 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Pizza Street<br />
                  Miami, FL 33101
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-red-500 flex-shrink-0" />
                <a 
                  href="tel:+1234567890" 
                  className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                >
                  (123) 456-7890
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-red-500 flex-shrink-0" />
                <a 
                  href="mailto:info@nikkispizza.com" 
                  className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                >
                  info@nikkispizza.com
                </a>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hours</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex justify-between">
                <span>Monday - Thursday</span>
                <span>11am - 10pm</span>
              </div>
              <div className="flex justify-between">
                <span>Friday - Saturday</span>
                <span>11am - 11pm</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>12pm - 9pm</span>
              </div>
            </div>
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