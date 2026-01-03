import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { 
    LayoutDashboard, Users, UserCheck, CalendarDays, 
    Banknote, ShieldAlert, LogOut, Menu, Bell, ClipboardList 
} from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const role = user?.role;

    const navItems = [
        { label: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/dashboard', roles: [] },
        { label: 'Employees', icon: <Users size={20}/>, path: '/dashboard/employees', roles: ['SUPER_ADMIN', 'HR_OFFICER'] },
        { label: 'Attendance', icon: <UserCheck size={20}/>, path: '/dashboard/attendance', roles: [] },
        { label: 'Leaves', icon: <CalendarDays size={20}/>, path: '/dashboard/leaves', roles: [] },
        { label: 'Payroll', icon: <Banknote size={20}/>, path: '/dashboard/payroll', roles: [] },
        { label: 'Audit Logs', icon: <ClipboardList size={20}/>, path: '/dashboard/audit', roles: ['SUPER_ADMIN', 'HR_OFFICER'] },
    ];

    const filteredNavItems = navItems.filter(item => 
        item.roles.length === 0 || item.roles.includes(role)
    );

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu when route changes
    const handleNavClick = () => setIsMobileMenuOpen(false);

    return (
        <div className="min-h-screen bg-black flex text-slate-200">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ 
                    x: isMobileMenuOpen ? 0 : -280, // Mobile slide-in
                    width: isSidebarOpen ? 260 : 80 // Desktop collapse
                }}
                className={`
                    fixed md:sticky top-0 h-screen bg-slate-950 border-r border-slate-900 
                    flex flex-col z-40 transition-all duration-300
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                <div className="h-16 flex items-center justify-center border-b border-slate-900">
                    <span className={`text-xl font-bold ${!isSidebarOpen && 'md:hidden'} bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-indigo-400 tracking-wider`}>
                        Dayflow
                    </span>
                    {!isSidebarOpen && <span className="hidden md:block text-xl font-bold text-primary-500">DF</span>}
                    
                    {/* Mobile Close Button */}
                    <button onClick={() => setIsMobileMenuOpen(false)} className="absolute right-4 md:hidden text-slate-500">
                        <Menu size={20} />
                    </button>
                </div>

                <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto">
                    {filteredNavItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            onClick={handleNavClick}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium ${
                                location.pathname === item.path 
                                ? 'bg-primary-600/10 text-primary-400 border border-primary-600/20' 
                                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                            }`}
                        >
                            <div className="min-w-[24px]">{item.icon}</div>
                            <span className={`${!isSidebarOpen && 'md:hidden'}`}>{item.label}</span>
                        </Link>
                    ))}
                </nav>


                <div className="p-4 border-t border-slate-900">
                    <button 
                        onClick={logout}
                        className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors ${!isSidebarOpen && 'md:justify-center'}`}
                    >
                        <LogOut size={20} />
                        <span className={`${!isSidebarOpen && 'md:hidden'} font-medium`}>Logout</span>

                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-black">
                {/* Top Header */}
                <header className="h-16 bg-slate-950 border-b border-slate-900 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
                   <div className="flex items-center gap-4">
                       {/* Mobile Menu Toggle */}
                       <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 md:hidden text-slate-400 hover:text-white">
                            <Menu size={24}/>
                       </button>
                       {/* Desktop Sidebar Toggle */}
                       <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:block p-2 hover:bg-slate-900 rounded-lg text-slate-400">
                            <Menu size={20}/>
                       </button>
                   </div>
                   
                   <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-slate-900 rounded-full text-slate-400 relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-slate-950"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-slate-200">{user?.name || 'User'}</div>
                                <div className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-bold border border-slate-700">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                   </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-4 md:p-6 text-slate-300">
                    <Outlet /> 
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
