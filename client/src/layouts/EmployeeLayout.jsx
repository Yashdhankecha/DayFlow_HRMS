import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, User, Calendar, FileText,
    LogOut, Menu, Bell, X, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EmployeeLayout = () => {
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const userMenuRef = useRef(null);

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/employee' },
        { label: 'Attendance', icon: Calendar, path: '/dashboard/employee/attendance' },
        { label: 'Leave', icon: FileText, path: '/dashboard/employee/leave' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleNavClick = () => {
        setIsMobileMenuOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Top Navigation Bar */}
            <nav className="bg-slate-950/90 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo & Brand */}
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/50">
                                    <span className="text-white font-bold text-lg">DF</span>
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-indigo-400 tracking-wide hidden sm:block">
                                    DayFlow
                                </span>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center space-x-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${isActive
                                                ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-600/30'
                                                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                                                }`}
                                        >
                                            <Icon size={18} />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-3">
                            {/* User Dropdown - Desktop */}
                            <div className="hidden sm:block relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors border-l border-slate-800 pl-4"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-bold border-2 border-slate-700 shadow-lg">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-slate-200">{user?.name || 'User'}</div>
                                        <div className="text-xs text-slate-500">Employee</div>
                                    </div>
                                    <ChevronDown className={`text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} size={16} />
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden"
                                        >
                                            <button
                                                onClick={() => {
                                                    navigate('/dashboard/employee/profile');
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                            >
                                                <User size={18} />
                                                <span>My Profile</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors border-t border-slate-800"
                                            >
                                                <LogOut size={18} />
                                                <span>Logout</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden border-t border-slate-800 bg-slate-950/95 overflow-hidden"
                        >
                            <div className="px-4 py-3 space-y-2">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={handleNavClick}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive
                                                ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-600/30'
                                                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                                                }`}
                                        >
                                            <Icon size={20} />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}

                                {/* Mobile Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-medium border border-red-500/20"
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Page Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default EmployeeLayout;
