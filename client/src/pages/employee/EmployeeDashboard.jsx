import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { motion } from 'framer-motion';
import {
    Calendar, Clock, FileText, TrendingUp,
    CheckCircle, XCircle, AlertCircle, Bell,
    ArrowRight, Users, Briefcase
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
                api.get('/attendance/my-attendance').catch(() => ({ data: { data: { stats: { total: 0, present: 0, absent: 0, rate: 0 }, records: [] } } })),
                api.get('/leaves/my-leaves').catch(() => ({ data: { data: { stats: { pending: 0, approved: 0, available: 15 }, leaves: [] } } }))
            ]);

            const attendanceStats = attendanceRes.data.data.stats || { total: 0, present: 0, absent: 0, rate: 0 };
            const attendanceRecords = attendanceRes.data.data.records || [];
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

            setDashboardData({
                attendance: attendanceStats,
                leaves: leaveStats,
                weeklyStats: {
                    daysWorked: `${daysWorked}/${totalWorkDays}`,
                    hoursLogged,
                    avgCheckIn
                },
                upcomingEvents: upcomingLeaves,
                recentActivity: [
                    { type: 'attendance', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', title: 'Checked In', description: 'You checked in today', time: '2 hours ago' },
                    { type: 'leave', icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10', title: 'Leave Request Pending', description: 'Waiting for approval', time: '1 day ago' },
                    { type: 'notification', icon: Bell, color: 'text-blue-400', bg: 'bg-blue-500/10', title: 'System Update', description: 'Monthly payroll processed', time: '3 days ago' }
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

    const stats = [
        {
            label: 'Attendance Rate',
            value: `${dashboardData.attendance.rate?.toFixed(1) || 0}%`,
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
        <div className="space-y-8">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-slate-400 mt-1">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
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
                            className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 hover:bg-slate-900 transition-all cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`${stat.iconBg} p-3 rounded-xl ${stat.iconColor} group-hover:scale-110 transition-transform`}>
                                    <Icon size={24} />
                                </div>
                                <ArrowRight className="text-slate-600 group-hover:text-primary-400 transition-colors" size={20} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                                <p className="text-slate-500 font-medium text-sm">{stat.label}</p>
                                <p className="text-slate-600 text-xs">{stat.subtext}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Bell className="text-primary-400" size={20} />
                            Recent Activity
                        </h2>
                        <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors font-medium">
                            View All
                        </button>
                    </div>

                    <div className="space-y-4">
                        {dashboardData.recentActivity.map((activity, index) => {
                            const ActivityIcon = activity.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
                                >
                                    <div className={`${activity.bg} p-3 rounded-lg ${activity.color}`}>
                                        <ActivityIcon size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-semibold">{activity.title}</h3>
                                        <p className="text-slate-400 text-sm mt-1">{activity.description}</p>
                                        <p className="text-slate-500 text-xs mt-2 flex items-center gap-1">
                                            <Clock size={12} />
                                            {activity.time}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Info */}
                <div className="space-y-6">

                    {/* This Week Summary */}
                    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Briefcase size={18} className="text-primary-400" />
                            This Week
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">Days Worked</span>
                                <span className="text-white font-bold">{dashboardData.weeklyStats.daysWorked}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">Hours Logged</span>
                                <span className="text-white font-bold">{dashboardData.weeklyStats.hoursLogged}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">Avg. Check-in</span>
                                <span className="text-white font-bold">{dashboardData.weeklyStats.avgCheckIn}</span>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming */}
                    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Calendar size={18} className="text-primary-400" />
                            Upcoming
                        </h3>
                        <div className="space-y-3">
                            {dashboardData.upcomingEvents.length > 0 ? (
                                dashboardData.upcomingEvents.map((event, index) => (
                                    <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
                                        <p className="text-white text-sm font-medium">{event.title}</p>
                                        <p className="text-slate-500 text-xs mt-1">{event.time}</p>
                                        <p className="text-slate-600 text-xs">{event.description}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                                    <p className="text-slate-500 text-sm">No upcoming events</p>
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
