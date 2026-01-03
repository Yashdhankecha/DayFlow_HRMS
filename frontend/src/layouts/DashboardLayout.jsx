import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Settings, LogOut, Menu, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const navItems = [
        { label: 'Overview', icon: <LayoutDashboard size={20}/>, path: '/dashboard' },
        ...(user?.role === 'ADMIN' ? [{ label: 'Users', icon: <Users size={20}/>, path: '/dashboard/users' }] : []),
        { label: 'Settings', icon: <Settings size={20}/>, path: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className="bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col shadow-2xl z-20 transition-all duration-300"
            >
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    {isSidebarOpen ? (
                        <span className="text-xl font-bold text-white tracking-wider">HackStack</span>
                    ) : (
                        <span className="text-xl font-bold text-white">HS</span>
                    )}
                </div>

                <nav className="flex-1 py-6 space-y-2 px-3">
                    {navItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'hover:bg-slate-800 hover:text-white'}`}
                        >
                            <div className="min-w-[24px]">{item.icon}</div>
                            {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button 
                        onClick={logout}
                        className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
                   <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                        {isSidebarOpen ? <Menu size={20}/> : <Menu size={20}/>} {/* Actually Menu icon is fine for both states usually */}
                   </button>
                   
                   <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-slate-800">{user?.name}</div>
                                <div className="text-xs text-slate-500 capitalize">{user?.role}</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                   </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-6">
                    <Outlet /> 
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
