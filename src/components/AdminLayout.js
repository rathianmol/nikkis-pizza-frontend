import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
// import Sidebar from './components/Sidebar';
import Sidebar from './Sidebar';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        {sidebarOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto">
                    <div className="p-6">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;