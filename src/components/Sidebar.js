import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingCart,
    UtensilsCrossed,
    Users,
    BarChart3,
    Settings,
    ChevronRight
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
    const location = useLocation();

    const menuItems = [
        // {
        //     title: 'Dashboard',
        //     icon: LayoutDashboard,
        //     path: '/admin',
        //     end: true
        // },
        {
            title: 'Orders',
            icon: ShoppingCart,
            path: '/admin/orders',
            // submenu: [
            //     { title: 'All Orders', path: '/admin/orders' },
            //     { title: 'Pending', path: '/admin/orders?status=pending' }
            // ]
        },
        // {
        //     title: 'Menu',
        //     icon: UtensilsCrossed,
        //     path: '/admin/menu',
        //     submenu: [
        //         { title: 'Products', path: '/admin/menu/products' },
        //         { title: 'Categories', path: '/admin/menu/categories' },
        //         { title: 'Variants', path: '/admin/menu/variants' }
        //     ]
        // },
        {
            title: 'Customers',
            icon: Users,
            path: '/admin/customers',
            // submenu: [
            //     { title: 'New Customer', path: '/admin/customer/create' },
            // ],
        },
        // {
        //     title: 'Reports',
        //     icon: BarChart3,
        //     path: '/admin/reports',
        //     submenu: [
        //         { title: 'Sales', path: '/admin/reports/sales' },
        //         { title: 'Best Sellers', path: '/admin/reports/best-sellers' },
        //         { title: 'Coupons', path: '/admin/reports/coupons' }
        //     ]
        // },
        // {
        //     title: 'Settings',
        //     icon: Settings,
        //     path: '/admin/settings',
        //     submenu: [
        //         { title: 'Business Hours', path: '/admin/settings/hours' },
        //         { title: 'Delivery Zones', path: '/admin/settings/delivery' },
        //         { title: 'Tax & Fees', path: '/admin/settings/tax' },
        //         { title: 'Notifications', path: '/admin/settings/notifications' }
        //     ]
        // }
    ];

    const isActive = (path, end = false) => {
        if (end) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div
            className={`${
                isOpen ? 'w-64' : 'w-20'
            } bg-gray-900 text-white transition-all duration-300 overflow-y-auto flex flex-col`}
        >
            {/* Logo */}
            <div className={`p-4 border-b border-gray-800 ${isOpen ? '' : 'flex justify-center'}`}>
                <div className={`text-2xl font-bold ${isOpen ? '' : 'text-center'}`}>
                    {isOpen ? '🍕 Admin' : '🍕'}
                </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path, item.end);

                    return (
                        <div key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                                    active
                                        ? 'bg-orange-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {isOpen && <span className="text-sm font-medium">{item.title}</span>}
                                {isOpen && item.submenu && (
                                    <ChevronRight className="w-4 h-4 ml-auto" />
                                )}
                            </Link>

                            {/* Submenu */}
                            {isOpen && item.submenu && active && (
                                <div className="mt-2 ml-4 space-y-1 border-l border-gray-700 pl-4">
                                    {item.submenu.map((sub) => (
                                        <Link
                                            key={sub.path}
                                            to={sub.path}
                                            className="block text-xs text-gray-400 hover:text-white py-2 transition"
                                        >
                                            {sub.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;