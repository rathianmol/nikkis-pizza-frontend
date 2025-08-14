import { useState, useEffect } from "react";
import PizzaCard from "./PizzaCard";
import { Link } from 'react-router-dom';

function Pizzas() {
    const [pizzas, setPizzas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPizzas = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8000/api/pizzas');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                if (result.success) {
                    setPizzas(result.data);
                } else {
                    throw new Error('Failed to fetch pizzas');
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching pizzas:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPizzas();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading delicious pizzas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p className="font-bold">Error loading pizzas</p>
                        <p>{error}</p>
                    </div>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Our Delicious Pizzas
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Discover our amazing selection of handcrafted pizzas made with the finest ingredients
                    </p>
                        <p className="text-gray-600 text-lg mt-4">
                            Please <Link to="/register" className="text-blue-600 hover:text-blue-800 underline">register</Link> with us to place order.
                        </p>
                </div>

                {/* Pizza Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {pizzas.map((pizza) => (
                        <PizzaCard key={pizza.id} pizza={pizza} />
                    ))}
                </div>

                {/* Empty State */}
                {pizzas.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No pizzas available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Pizzas;