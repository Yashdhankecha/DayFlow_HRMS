import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, Calendar, Plus, Bell, Search, 
  ChevronRight, ArrowUpRight, CheckCircle,
  Clock, FileText, Briefcase, TrendingUp,
  AlertCircle, MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';

const HRDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
         const fetchStats = async () => {
            try {
               const { data } = await api.get('/hr/dashboard-stats');
               setStats(data.data.stats);
               setPendingRequests(data.data.pendingRequests);
            } catch (error) {
               console.error("Error fetching dashboard stats", error);
            } finally {
               setLoading(false);
            }
         };
         fetchStats();

         // Timer for live date/time if needed, or just static today
         const timer = setInterval(() => setCurrentDate(new Date()), 60000);
         return () => clearInterval(timer);
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const statConfig = {
        'Total Employees': { 
            icon: Users, 
            bg: 'bg-blue-500/10', 
            text: 'text-blue-500',
            border: 'border-blue-500/20'
        },
        'Attendance': { 
            icon: CheckCircle, 
            bg: 'bg-emerald-500/10', 
            text: 'text-emerald-500',
            border: 'border-emerald-500/20'
        },
        'On Leave': { 
            icon: Calendar, 
            bg: 'bg-purple-500/10', 
            text: 'text-purple-500',
            border: 'border-purple-500/20'
        }
    };

    const quickActions = [
        { label: 'Add Employee', icon: Plus, path: '/dashboard/hr/employees', color: 'bg-indigo-600' },
        { label: 'Run Payroll', icon: FileText, path: '/dashboard/hr/payroll', color: 'bg-slate-800' },
        { label: 'Approve Leaves', icon: CheckCircle, path: '/dashboard/hr/leaves', color: 'bg-slate-800' },
        { label: 'Report Issue', icon: AlertCircle, path: '/dashboard/hr/settings', color: 'bg-slate-800' },
    ];

    return (
        <motion.div 
            variants={container} 
            initial="hidden" 
            animate="show" 
            className="max-w-7xl mx-auto space-y-8"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800/50">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                        Dashboard
                    </h1>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={18} />
                        <span className="text-lg">{format(currentDate, 'EEEE, d MMMM yyyy')}</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block mr-4">
                        <p className="text-sm text-slate-400">Welcome back,</p>
                        <p className="text-white font-medium">{user?.name}</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!loading && stats.map((stat, idx) => {
                    const config = statConfig[stat.title] || { 
                        icon: Users, 
                        bg: 'bg-slate-800', 
                        text: 'text-slate-400',
                        border: 'border-slate-800'
                    };
                    const Icon = config.icon;

                    return (
                        <motion.div 
                            key={idx}
                            variants={itemVariant}
                            className={`
                                relative p-6 rounded-2xl border ${config.border} bg-slate-900/50 backdrop-blur-sm
                                group hover:bg-slate-900 transition-all duration-300
                            `}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${config.bg} ${config.text}`}>
                                    <Icon size={24} />
                                </div>
                                <div className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                    <span>{stat.trend}</span>
                                    <ArrowUpRight size={12} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white tracking-tight mb-1">{stat.value}</h3>
                                <p className="text-slate-400 font-medium">{stat.title}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Quick Actions */}
                    <motion.div variants={itemVariant}>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-indigo-500" />
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {quickActions.map((action, i) => (
                                <Link 
                                    key={i} 
                                    to={action.path}
                                    className={`
                                        flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-slate-800 
                                        bg-slate-900/50 hover:bg-slate-800 transition-all group
                                    `}
                                >
                                    <div className={`p-3 rounded-full ${action.color === 'bg-indigo-600' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-800 text-slate-400 group-hover:text-white'}`}>
                                        <action.icon size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-300 group-hover:text-white">{action.label}</span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Pending Requests */}
                    <motion.div 
                        variants={itemVariant}
                        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <div>
                                <h3 className="text-lg font-bold text-white">Pending Requests</h3>
                                <p className="text-sm text-slate-500">Approvals awaiting your action</p>
                            </div>
                            <Link to="/dashboard/hr/leaves" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">View All</Link>
                        </div>
                        
                        <div className="divide-y divide-slate-800/50">
                            {pendingRequests.length === 0 ? (
                                <div className="p-12 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                                        <CheckCircle size={32} className="text-slate-600" />
                                    </div>
                                    <h4 className="text-slate-200 font-medium mb-1">All Caught Up!</h4>
                                    <p className="text-slate-500 text-sm">No pending requests at the moment.</p>
                                </div>
                            ) : (
                                pendingRequests.map((req, i) => (
                                    <div key={i} className="p-4 hover:bg-slate-800/30 transition-colors flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
                                            {req.name[0]}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className="font-medium text-slate-200">{req.name}</h4>
                                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                    Pending
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                                <p className="flex items-center gap-1">
                                                    <Briefcase size={12} />
                                                    {req.type}
                                                </p>
                                                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                <p className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {req.date}
                                                </p>
                                            </div>
                                        </div>
                                        <Link 
                                            to="/dashboard/hr/leaves"
                                            className="p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                        >
                                            <ChevronRight size={18} />
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Right Sidebar - Activity / Notifications */}
                <div className="space-y-6">
                    <motion.div 
                        variants={itemVariant}
                        className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-2">Announcement</h3>
                            <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
                                System maintenance scheduled for this weekend. Ensure all critical payroll updates are completed by Friday.
                            </p>
                            <button className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                                View Details
                            </button>
                        </div>
                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
                    </motion.div>

                    <motion.div 
                        variants={itemVariant}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                    >
                         <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                         <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-slate-800">
                            {[
                                { title: 'New Employee Added', time: '2 hours ago', desc: 'Sarah Johnson joined Marketing' },
                                { title: 'Payroll Run', time: 'Yesterday', desc: 'Monthly payroll for Oct completed' },
                                { title: 'Policy Update', time: '3 days ago', desc: 'Updated Remote Work guidelines' },
                            ].map((activity, i) => (
                                <div key={i} className="relative pl-8">
                                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-slate-900 bg-slate-700"></div>
                                    <h4 className="text-sm font-medium text-slate-200">{activity.title}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">{activity.desc}</p>
                                    <span className="text-[10px] text-slate-600 mt-1 block">{activity.time}</span>
                                </div>
                            ))}
                         </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default HRDashboard;
