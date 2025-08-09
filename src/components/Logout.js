import { useAuth } from '../contexts/AuthContext';

function Logout() {
    const { logout } = useAuth();
    return (
        <>
        <button
            onClick={logout}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
            Logout
        </button>
        </>
    )
}
export default Logout; 