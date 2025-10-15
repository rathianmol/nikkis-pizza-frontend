import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminProtectedRoutes = () => {
    const { isAuthenticated, user } = useAuth();
    
    // Check if user is authenticated AND has admin role
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    if (user?.role !== 'admin' || user?.role !== 'super-admin') {
        // Redirect non-admin users to home
        return <Navigate to="/" />;
    }
    
    return <Outlet />;
}

export default AdminProtectedRoutes;