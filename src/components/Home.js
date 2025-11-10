import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Leaf, Heart, Users } from 'lucide-react';
import CapresePizza       from '../images/caprese-pizza.png';
import GrilledVeggiePizza from '../images/grilled-veggie-pizza.png';
import MexicanPizza       from '../images/mexican-pizza.png';
import NYStylePizza       from '../images/ny-style-pizza.png';
import ZuchinniCrustPizza from '../images/zucchini-crust-pizza.png';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      url: CapresePizza,
    },
    {
      url: GrilledVeggiePizza,
    },
    {
      url: MexicanPizza,
    },
    {
      url: NYStylePizza,
    },
    {
      url: ZuchinniCrustPizza,
    },
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToMenu = () => {
    // In a real app, this would use React Router or Next.js router
    // window.location.href = '/pizzas';
    navigate('/menu');
    return;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Image Slider */}
      <div className="relative h-screen overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.url}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        ))}
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white px-4">
            <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tight">
              Nikki's Pizza
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-light">
              Authentic. Fresh. Made with Love.
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-300"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-300"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          
          {/* Fresh Ingredients Section */}
          <div className="text-center group">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors duration-300">
              <Leaf className="text-green-600" size={36} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Real, Fresh Ingredients
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We source only the finest, locally-grown ingredients for our pizzas. 
              From hand-picked tomatoes to farm-fresh mozzarella, every bite delivers 
              authentic flavors that celebrate the art of traditional pizza making.
            </p>
          </div>

          {/* Vegetarian Options Section */}
          <div className="text-center group">
            <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors duration-300">
              <Heart className="text-orange-600" size={36} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Healthy Vegetarian Options
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Our extensive vegetarian menu features nutrient-rich vegetables, 
              wholesome grains, and plant-based proteins. Every vegetarian pizza 
              is crafted to be as satisfying as it is nourishing for your body.
            </p>
          </div>

          {/* Community Giving Section */}
          <div className="text-center group">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors duration-300">
              <Users className="text-blue-600" size={36} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Giving Back Together
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Every purchase helps feed families in need. A portion of your order 
              directly funds our community outreach program, providing hot meals 
              to local shelters and food banks. Your pizza makes a difference.
            </p>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="text-center mt-16">
          <button
            onClick={goToMenu}
            className="bg-red-600 text-white px-12 py-4 text-lg font-semibold rounded-full hover:bg-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Explore Our Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;