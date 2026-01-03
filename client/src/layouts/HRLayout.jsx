import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, Users, Calendar, 
    Briefcase, FileText, Settings, LogOut, 
    Menu, Bell, ChevronRight, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HRLayout = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { label: 'Overview', icon: <LayoutDashboard size={20}/>, path: '/dashboard/hr' },
        { label: 'Employees', icon: <Users size={20}/>, path: '/dashboard/hr/employees' },
        { label: 'Recruitment', icon: <Briefcase size={20}/>, path: '/dashboard/hr/recruitment' },
        { label: 'Attendance', icon: <Calendar size={20}/>, path: '/dashboard/hr/attendance' },
        { label: 'Payroll', icon: <FileText size={20}/>, path: '/dashboard/hr/payroll' },
        { label: 'Settings', icon: <Settings size={20}/>, path: '/dashboard/hr/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex text-slate-200 font-sans selection:bg-indigo-500/30">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside 
                layout
                className={`
                    fixed md:sticky top-0 h-screen bg-slate-900/50 border-r border-slate-800 
                    flex flex-col z-40 backdrop-blur-xl
                `}
                animate={{ 
                    width: isSidebarOpen ? 280 : 80,
                    x: isMobileMenuOpen ? 0 : (window.innerWidth < 768 ? -280 : 0)
                }}
                transition={{ duration: 0.3, type: "spring", stiffness: 100, damping: 20 }}
            >
                {/* Brand */}
                <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                            <span className="font-bold text-white">HR</span>
                        </div>
                        {isSidebarOpen && (
                            <motion.span 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400"
                            >
                                DayFlow
                            </motion.span>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-8 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`
                                    flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                                    ${isActive 
                                        ? 'bg-indigo-500/10 text-indigo-400' 
                                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                                    }
                                `}
                            >
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full" 
                                    />
                                )}
                                <div className={`shrink-0 transition-colors ${isActive ? 'text-indigo-400' : 'group-hover:text-white'}`}>
                                    {item.icon}
                                </div>
                                {isSidebarOpen && (
                                    <motion.span 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="font-medium whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile / Logout */}
                <div className="p-4 border-t border-slate-800/50 bg-slate-900/30">
                    <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                            {user?.name?.[0] || 'U'}
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                                <p className="text-xs text-slate-500 truncate">HR Officer</p>
                            </div>
                        )}
                        {isSidebarOpen && (
                            <button 
                                onClick={logout}
                                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                            >
                                <LogOut size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-950 relative overflow-hidden">
                {/* Top Bar */}
                <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-4 md:px-8 bg-slate-950/50 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)} 
                            className="md:hidden p-2 text-slate-400 hover:text-white"
                        >
                            <Menu size={24}/>
                        </button>
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                            className="hidden md:flex p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <Menu size={20}/>
                        </button>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-900/50 border border-slate-800 rounded-full w-64 focus-within:border-indigo-500/50 focus-within:bg-slate-900 transition-all">
                             <Search size={16} className="text-slate-500" />
                             <input type="text" placeholder="Quick search..." className="bg-transparent border-none focus:outline-none text-sm text-slate-300 w-full placeholder-slate-600"/>
                        </div>
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950"></span>
                        </button>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-auto p-4 md:p-8 relative">
                    {/* Background Gradients */}
                    <div className="absolute top-0 left-0 w-full h-96 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />
                    
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default HRLayout;
