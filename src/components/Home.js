// import { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight, Leaf, Heart, Users } from 'lucide-react';
// import CapresePizza       from '../images/caprese-pizza.png';
// import GrilledVeggiePizza from '../images/grilled-veggie-pizza.png';
// import MexicanPizza       from '../images/mexican-pizza.png';
// import NYStylePizza       from '../images/ny-style-pizza.png';
// import ZuchinniCrustPizza from '../images/zucchini-crust-pizza.png';
// import { useNavigate } from 'react-router-dom';

// const Home = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const navigate = useNavigate();

//   const slides = [
//     {
//       url: CapresePizza,
//     },
//     {
//       url: GrilledVeggiePizza,
//     },
//     {
//       url: MexicanPizza,
//     },
//     {
//       url: NYStylePizza,
//     },
//     {
//       url: ZuchinniCrustPizza,
//     },
//   ];

//   // Auto-advance slides
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, [slides.length]);

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//   };

//   const goToMenu = () => {
//     // In a real app, this would use React Router or Next.js router
//     // window.location.href = '/pizzas';
//     navigate('/menu');
//     return;
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Image Slider */}
//       <div className="relative h-screen overflow-hidden">
//         {slides.map((slide, index) => (
//           <div
//             key={index}
//             className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//               index === currentSlide ? 'opacity-100' : 'opacity-0'
//             }`}
//           >
//             <img
//               src={slide.url}
//               alt={slide.alt}
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-black bg-opacity-40"></div>
//           </div>
//         ))}
        
//         {/* Overlay Content */}
//         <div className="absolute inset-0 flex items-center justify-center z-10">
//           <div className="text-center text-white px-4">
//             <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tight">
//               Nikki's Pizza
//             </h1>
//             <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-light">
//               Authentic. Fresh. Made with Love.
//             </p>
//           </div>
//         </div>

//         {/* Navigation Arrows */}
//         <button
//           onClick={prevSlide}
//           className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-300"
//         >
//           <ChevronLeft size={24} />
//         </button>
//         <button
//           onClick={nextSlide}
//           className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-300"
//         >
//           <ChevronRight size={24} />
//         </button>

//         {/* Slide Indicators */}
//         <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
//           {slides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentSlide(index)}
//               className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                 index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
//               }`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Content Sections */}
//       <div className="py-20 px-4 max-w-7xl mx-auto">
//         <div className="grid md:grid-cols-3 gap-12">
          
//           {/* Fresh Ingredients Section */}
//           <div className="text-center group">
//             <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors duration-300">
//               <Leaf className="text-green-600" size={36} />
//             </div>
//             <h3 className="text-2xl font-bold mb-4 text-gray-800">
//               Real, Fresh Ingredients
//             </h3>
//             <p className="text-gray-600 leading-relaxed">
//               We source only the finest, locally-grown ingredients for our pizzas. 
//               From hand-picked tomatoes to farm-fresh mozzarella, every bite delivers 
//               authentic flavors that celebrate the art of traditional pizza making.
//             </p>
//           </div>

//           {/* Vegetarian Options Section */}
//           <div className="text-center group">
//             <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors duration-300">
//               <Heart className="text-orange-600" size={36} />
//             </div>
//             <h3 className="text-2xl font-bold mb-4 text-gray-800">
//               Healthy Vegetarian Options
//             </h3>
//             <p className="text-gray-600 leading-relaxed">
//               Our extensive vegetarian menu features nutrient-rich vegetables, 
//               wholesome grains, and plant-based proteins. Every vegetarian pizza 
//               is crafted to be as satisfying as it is nourishing for your body.
//             </p>
//           </div>

//           {/* Community Giving Section */}
//           <div className="text-center group">
//             <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors duration-300">
//               <Users className="text-blue-600" size={36} />
//             </div>
//             <h3 className="text-2xl font-bold mb-4 text-gray-800">
//               Giving Back Together
//             </h3>
//             <p className="text-gray-600 leading-relaxed">
//               Every purchase helps feed families in need. A portion of your order 
//               directly funds our community outreach program, providing hot meals 
//               to local shelters and food banks. Your pizza makes a difference.
//             </p>
//           </div>
//         </div>

//         {/* Call to Action Button */}
//         <div className="text-center mt-16">
//           <button
//             onClick={goToMenu}
//             className="bg-red-600 text-white px-12 py-4 text-lg font-semibold rounded-full hover:bg-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
//           >
//             Explore Our Menu
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;


import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Leaf, Heart, Users, MapPin, Clock, Phone, Mail } from 'lucide-react';
import CapresePizza       from '../images/caprese-pizza.png';
import GrilledVeggiePizza from '../images/grilled-veggie-pizza.png';
import MexicanPizza       from '../images/mexican-pizza.png';
import NYStylePizza       from '../images/ny-style-pizza.png';
import ZuchinniCrustPizza from '../images/zucchini-crust-pizza.png';
import { useNavigate } from 'react-router-dom';
import { useStoreLocation } from '../contexts/StoreLocationsContext';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  // Get store locations from context
  const { 
    storeLocations, 
    loading: locationsLoading, 
    selectedLocation, 
    setSelectedLocation,
    getPrimaryLocation 
  } = useStoreLocation();

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

  // Set primary location as default on mount
  useEffect(() => {
    if (!selectedLocation && storeLocations.length > 0) {
      const primary = getPrimaryLocation();
      if (primary) {
        setSelectedLocation(primary.id);
      }
    }
  }, [storeLocations, selectedLocation, getPrimaryLocation, setSelectedLocation]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToMenu = () => {
    navigate('/menu');
  };

  const handleLocationSelect = (locationId) => {
    setSelectedLocation(locationId);
  };

  // Get the currently selected location object
  const currentLocation = storeLocations.find(loc => loc.id === selectedLocation);

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

      {/* Store Locations Section */}
      <div className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Our Locations
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Visit us at any of our locations. Choose your preferred store for pickup or delivery.
          </p>

          {locationsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <p className="mt-4 text-gray-600">Loading locations...</p>
            </div>
          ) : storeLocations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No locations available at the moment.</p>
            </div>
          ) : (
            <>
              {/* Location Toggle Selector - Only show if multiple locations */}
              {storeLocations.length > 1 && (
                <div className="mb-12">
                  <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">
                    Choose Your Location
                  </h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    {storeLocations.filter(loc => loc.is_active).map((location) => (
                      <button
                        key={location.id}
                        onClick={() => handleLocationSelect(location.id)}
                        className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                          selectedLocation === location.id
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-600'
                        }`}
                      >
                        {location.name}
                        {location.is_primary && (
                          <span className="ml-2 text-xs">⭐</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Location Details */}
              {currentLocation && (
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto mb-12 border-2 border-red-600">
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-3xl font-bold text-gray-800">
                      {currentLocation.name}
                      {currentLocation.is_primary && (
                        <span className="ml-3 text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                          Primary Location
                        </span>
                      )}
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-700 mb-4">Contact Info</h4>
                      
                      <div className="flex items-start space-x-3">
                        <MapPin className="text-red-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <p className="text-gray-700">{currentLocation.address_line_1}</p>
                          {currentLocation.address_line_2 && (
                            <p className="text-gray-700">{currentLocation.address_line_2}</p>
                          )}
                          <p className="text-gray-700">
                            {currentLocation.city}, {currentLocation.state} {currentLocation.postal_code}
                          </p>
                          {currentLocation.country && (
                            <p className="text-gray-600 text-sm">{currentLocation.country}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Phone className="text-red-600 flex-shrink-0" size={20} />
                        <a 
                          href={`tel:${currentLocation.phone_number}`}
                          className="text-gray-700 hover:text-red-600 transition-colors"
                        >
                          {currentLocation.phone_number}
                        </a>
                      </div>

                      {currentLocation.email && (
                        <div className="flex items-center space-x-3">
                          <Mail className="text-red-600 flex-shrink-0" size={20} />
                          <a 
                            href={`mailto:${currentLocation.email}`}
                            className="text-gray-700 hover:text-red-600 transition-colors"
                          >
                            {currentLocation.email}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Hours of Operation */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <Clock className="mr-2 text-red-600" size={20} />
                        Hours of Operation
                      </h4>
                      
                      <div className="space-y-2">
                        {currentLocation.monday_hours && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Monday:</span>
                            <span className="text-gray-700">{currentLocation.monday_hours}</span>
                          </div>
                        )}
                        {currentLocation.tuesday_hours && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Tuesday:</span>
                            <span className="text-gray-700">{currentLocation.tuesday_hours}</span>
                          </div>
                        )}
                        {currentLocation.wednesday_hours && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Wednesday:</span>
                            <span className="text-gray-700">{currentLocation.wednesday_hours}</span>
                          </div>
                        )}
                        {currentLocation.thursday_hours && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Thursday:</span>
                            <span className="text-gray-700">{currentLocation.thursday_hours}</span>
                          </div>
                        )}
                        {currentLocation.friday_hours && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Friday:</span>
                            <span className="text-gray-700">{currentLocation.friday_hours}</span>
                          </div>
                        )}
                        {currentLocation.saturday_hours && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Saturday:</span>
                            <span className="text-gray-700">{currentLocation.saturday_hours}</span>
                          </div>
                        )}
                        {currentLocation.sunday_hours && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Sunday:</span>
                            <span className="text-gray-700">{currentLocation.sunday_hours}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {currentLocation.special_instructions && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">Special Instructions</h4>
                      <p className="text-gray-600">{currentLocation.special_instructions}</p>
                    </div>
                  )}
                </div>
              )}

              {/* All Locations Grid - Show all locations */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {storeLocations.filter(loc => loc.is_active).map((location) => (
                  <div
                    key={location.id}
                    onClick={() => handleLocationSelect(location.id)}
                    className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer transform hover:scale-105 ${
                      selectedLocation === location.id
                        ? 'ring-2 ring-red-600'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800">
                        {location.name}
                      </h3>
                      {location.is_primary && (
                        <span className="text-yellow-500 text-xl">⭐</span>
                      )}
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-start space-x-2">
                        <MapPin className="text-red-600 mt-0.5 flex-shrink-0" size={16} />
                        <div className="text-gray-600">
                          <p>{location.address_line_1}</p>
                          <p>{location.city}, {location.state} {location.postal_code}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Phone className="text-red-600 flex-shrink-0" size={16} />
                        <span className="text-gray-600">{location.phone_number}</span>
                      </div>

                      {location.monday_hours && (
                        <div className="flex items-center space-x-2">
                          <Clock className="text-red-600 flex-shrink-0" size={16} />
                          <span className="text-gray-600">{location.monday_hours}</span>
                        </div>
                      )}
                    </div>

                    {selectedLocation === location.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="text-red-600 font-semibold text-sm">
                          ✓ Selected Location
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;