import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminProtectedRoutes = () => {
    // debugger;
    const { isAuthenticated, user } = useAuth();
    
    // Check if user is authenticated AND has admin role
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    if (user.role == 'admin' || user.role == 'super-admin') {
        return <Outlet />;
    }

    return <Navigate to="/" />;
}

export default AdminProtectedRoutes;