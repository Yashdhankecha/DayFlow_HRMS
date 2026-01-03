import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { motion } from 'framer-motion';
import {
    Calendar, Clock, FileText, TrendingUp,
    CheckCircle, XCircle, AlertCircle, Bell,
    ArrowRight, Users, Briefcase, History
} from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        attendance: { rate: 0, present: 0, absent: 0, total: 0 },
        leaves: { pending: 0, approved: 0, available: 15 },
        weeklyStats: { daysWorked: '0/0', hoursLogged: '0h', avgCheckIn: '--:--' },
        upcomingEvents: [],
        recentActivity: []
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [attendanceRes, leavesRes] = await Promise.all([
                api.get('/attendance/history').catch(() => ({ data: { data: [] } })),
                api.get('/leaves/my-leaves').catch(() => ({ data: { data: { stats: { pending: 0, approved: 0, available: 15 }, leaves: [] } } }))
            ]);

            const attendanceRecords = attendanceRes.data.data || [];

            // Calculate stats from records (Last 30 days)
            const total = attendanceRecords.length;
            const present = attendanceRecords.filter(r => r.status === 'PRESENT').length;
            const absent = attendanceRecords.filter(r => r.status === 'ABSENT').length; // Or total - present if we assume strict daily records
            // For rate, let's use populated days count as denominator or 30? valid records count is safer.
            const rate = total > 0 ? Math.round((present / total) * 100) : 0;

            const attendanceStats = { total, present, absent, rate };
            const leaveStats = leavesRes.data.data.stats || { pending: 0, approved: 0, available: 15 };
            const leaves = leavesRes.data.data.leaves || [];

            // Calculate this week's stats
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay()); // Go to Sunday
            startOfWeek.setHours(0, 0, 0, 0);

            const thisWeekRecords = attendanceRecords.filter(record => {
                const recordDate = new Date(record.date);
                return recordDate >= startOfWeek && recordDate <= today;
            });

            const daysWorked = thisWeekRecords.filter(r => r.status === 'PRESENT').length;
            const totalWorkDays = Math.min(today.getDay() || 7, 5); // Max 5 weekdays

            // Calculate total hours and average check-in
            let totalMinutes = 0;
            let checkInTimes = [];

            thisWeekRecords.forEach(record => {
                if (record.punches && record.punches.length > 0) {
                    record.punches.forEach(punch => {
                        if (punch.punchIn) {
                            checkInTimes.push(new Date(punch.punchIn));

                            if (punch.punchOut) {
                                const inTime = new Date(punch.punchIn);
                                const outTime = new Date(punch.punchOut);
                                totalMinutes += (outTime - inTime) / (1000 * 60);
                            }
                        }
                    });
                }
            });

            const totalHours = Math.floor(totalMinutes / 60);
            const hoursLogged = totalHours > 0 ? `${totalHours}h` : '0h';

            // Calculate average check-in time
            let avgCheckIn = '--:--';
            if (checkInTimes.length > 0) {
                const avgMinutes = checkInTimes.reduce((sum, time) => {
                    return sum + time.getHours() * 60 + time.getMinutes();
                }, 0) / checkInTimes.length;

                const hours = Math.floor(avgMinutes / 60);
                const mins = Math.floor(avgMinutes % 60);
                avgCheckIn = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
            }

            // Get upcoming events (approved leaves in the future)
            const upcomingLeaves = leaves
                .filter(leave => {
                    return leave.status === 'APPROVED' && new Date(leave.startDate) > today;
                })
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                .slice(0, 3)
                .map(leave => ({
                    title: `${leave.type} Leave`,
                    description: `${new Date(leave.startDate).toLocaleDateString()} - ${new Date(leave.endDate).toLocaleDateString()}`,
                    time: formatUpcomingDate(new Date(leave.startDate))
                }));

            // Generate dynamic recent activity
            const activities = [];

            // Add attendance activities
            attendanceRecords.forEach(record => {
                if (record.status === 'PRESENT') {
                    activities.push({
                        type: 'attendance',
                        date: new Date(record.date),
                        icon: CheckCircle,
                        title: 'Work Day',
                        description: `Marked present (${record.punches?.length || 0} punches)`,
                        time: formatTimeAgo(new Date(record.date))
                    });
                } else if (record.status === 'ABSENT' || record.status === 'LATE') {
                    activities.push({
                        type: 'alert',
                        date: new Date(record.date),
                        icon: AlertCircle,
                        title: record.status,
                        description: `Marked ${record.status.toLowerCase()}`,
                        time: formatTimeAgo(new Date(record.date))
                    });
                }
            });

            // Add leave activities
            leaves.forEach(leave => {
                activities.push({
                    type: 'leave',
                    date: new Date(leave.appliedOn),
                    icon: Clock,
                    title: 'Leave Request',
                    description: `${leave.type} - ${leave.status}`,
                    time: formatTimeAgo(new Date(leave.appliedOn))
                });
            });

            // Sort by date desc and take top 5
            const recentActivity = activities
                .sort((a, b) => b.date - a.date)
                .slice(0, 5);

            setDashboardData({
                attendance: attendanceStats,
                leaves: leaveStats,
                weeklyStats: {
                    daysWorked: `${daysWorked}/${totalWorkDays}`,
                    hoursLogged,
                    avgCheckIn
                },
                upcomingEvents: upcomingLeaves,
                recentActivity: recentActivity.length > 0 ? recentActivity : [
                    { type: 'info', icon: Bell, title: 'Welcome', description: 'No recent activity yet', time: 'Just now' }
                ]
            });
        } catch (error) {
            console.error('Dashboard fetch error:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const formatUpcomingDate = (date) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else {
            const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
            if (diffDays <= 7) {
                return `In ${diffDays} days`;
            }
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    };

    const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";

        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";

        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";

        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";

        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";

        return "Just now";
    };

    const stats = [
        {
            label: 'Attendance Rate',
            value: `${dashboardData.attendance.rate?.toFixed(1) || 0} % `,
            icon: TrendingUp,
            color: 'from-blue-500 to-blue-600',
            iconBg: 'bg-blue-500/20',
            iconColor: 'text-blue-400',
            subtext: `${dashboardData.attendance.present} of ${dashboardData.attendance.total} days`,
            action: () => navigate('/dashboard/employee/attendance')
        },
        {
            label: 'Pending Leaves',
            value: dashboardData.leaves.pending,
            icon: Clock,
            color: 'from-orange-500 to-orange-600',
            iconBg: 'bg-orange-500/20',
            iconColor: 'text-orange-400',
            subtext: `${dashboardData.leaves.available} days available`,
            action: () => navigate('/dashboard/employee/leave')
        },
        {
            label: 'Approved Leaves',
            value: dashboardData.leaves.approved,
            icon: CheckCircle,
            color: 'from-green-500 to-green-600',
            iconBg: 'bg-green-500/20',
            iconColor: 'text-green-400',
            subtext: 'This month',
            action: () => navigate('/dashboard/employee/leave')
        },
        {
            label: 'Days Present',
            value: dashboardData.attendance.present,
            icon: Calendar,
            color: 'from-purple-500 to-purple-600',
            iconBg: 'bg-purple-500/20',
            iconColor: 'text-purple-400',
            subtext: 'Current month',
            action: () => navigate('/dashboard/employee/attendance')
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Welcome back, <span className="text-white font-medium">{user?.name}</span>. Here's what's happening today.
                    </p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-3xl font-light text-slate-200">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm text-primary-400 font-medium">
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={idx}
                            variants={item}
                            onClick={stat.action}
                            className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-slate-800/60 transition-all cursor-pointer group hover:border-primary-500/20 hover:shadow-lg hover:shadow-primary-500/5"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`${stat.iconBg} p-3 rounded-xl ${stat.iconColor} group-hover:scale-110 transition-transform`}>
                                    <Icon size={24} />
                                </div>
                                <ArrowRight className="text-slate-600 group-hover:text-primary-400 transition-colors" size={20} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
                                <p className="text-slate-400 font-medium text-sm border-b border-dashed border-slate-700/50 pb-2 mb-2 w-fit">{stat.label}</p>
                                <p className="text-slate-500 text-xs flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                    {stat.subtext}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <History className="text-primary-400" size={20} />
                            Recent Activity
                        </h2>
                        <button onClick={() => navigate('/dashboard/employee/attendance')} className="text-xs text-slate-400 hover:text-white transition-colors border border-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-800">
                            View Log
                        </button>
                    </div>

                    <div className="relative pl-4 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-4 before:w-[2px] before:bg-slate-800/50">
                        {dashboardData.recentActivity.map((activity, index) => {
                            const ActivityIcon = activity.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative pl-6"
                                >
                                    <div className={`absolute left-[-21px] top-1 w-6 h-6 rounded-full border-4 border-slate-950 ${activity.type === 'attendance' ? 'bg-emerald-500' : activity.type === 'leave' ? 'bg-amber-500' : 'bg-blue-500'} shadow-[0_0_0_1px_rgba(255,255,255,0.05)]`}></div>

                                    <div className="bg-slate-800/30 rounded-xl p-4 hover:bg-slate-800/50 transition-colors border border-white/5 flex items-start justify-between group">
                                        <div>
                                            <h3 className="text-white font-semibold flex items-center gap-2 text-sm group-hover:text-primary-200 transition-colors">
                                                {activity.title}
                                            </h3>
                                            <p className="text-slate-400 text-xs mt-1 leading-relaxed max-w-md">{activity.description}</p>
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap bg-slate-900/50 px-2.5 py-1 rounded-md border border-white/5">
                                            {activity.time}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Info & Upcoming */}
                <div className="space-y-6">

                    {/* This Week Summary */}
                    <div className="bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                            <Briefcase size={18} className="text-emerald-400" />
                            This Week
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-white/5">
                                <span className="text-slate-400 text-sm font-medium">Days Worked</span>
                                <span className="text-white font-bold font-mono">{dashboardData.weeklyStats.daysWorked}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-white/5">
                                <span className="text-slate-400 text-sm font-medium">Hours Logged</span>
                                <span className="text-white font-bold font-mono">{dashboardData.weeklyStats.hoursLogged}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-white/5">
                                <span className="text-slate-400 text-sm font-medium">Avg. Check-in</span>
                                <span className="text-white font-bold font-mono">{dashboardData.weeklyStats.avgCheckIn}</span>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming */}
                    <div className="bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                            <Calendar size={18} className="text-amber-400" />
                            Upcoming Events
                        </h3>
                        <div className="space-y-3">
                            {dashboardData.upcomingEvents.length > 0 ? (
                                dashboardData.upcomingEvents.map((event, index) => (
                                    <div key={index} className="p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors border border-white/5 group">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-white font-semibold text-sm group-hover:text-primary-300 transition-colors">{event.title}</p>
                                            <span className="text-primary-400 text-[10px] font-bold bg-primary-500/10 px-2 py-1 rounded-md border border-primary-500/20">
                                                {event.time}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-xs font-medium flex items-center gap-1">
                                            <Calendar size={12} />
                                            {event.description}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 bg-slate-800/20 rounded-xl text-center border border-dashed border-slate-800">
                                    <p className="text-slate-500 text-sm italic">No upcoming leaves</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
