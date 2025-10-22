import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { emptyCart } from '../redux/cartSlice';


function Logout() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        // 1. Clear auth state (from context)
        logout();
        
        // 2. Clear cart state (from Redux)
        dispatch(emptyCart('logout'));
        
        // 3. Navigate to home page
        navigate('/');
    };
    return (
        <>
        <button
            // onClick={logout}
            onClick={handleLogout}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
            Logout
        </button>
        </>
    )
}
export default Logout; 