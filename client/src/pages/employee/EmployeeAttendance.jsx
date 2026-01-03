import { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import {
    Clock, Calendar as CalendarIcon, MapPin,
    AlertCircle, CheckCircle2, History, TrendingUp,
    ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeAttendance = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isPunchedIn, setIsPunchedIn] = useState(false);
    const [todayPunches, setTodayPunches] = useState([]);
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({ avgHours: '0h 0m', onTime: '0%', late: 0, overtime: '0h 0m' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    const fetchAttendanceData = async () => {
        try {
            setIsLoading(true);
            const [statusRes, historyRes] = await Promise.all([
                api.get('/attendance/status'),
                api.get('/attendance/my-attendance')
            ]);

            // Status response
            const { isPunchedIn: punchedIn, todayPunches: punches } = statusRes.data.data;
            setIsPunchedIn(punchedIn);
            setTodayPunches(punches || []);

            // History response
            const attendanceRecords = historyRes.data.data.records || [];
            setHistory(attendanceRecords);

            // Calculate stats
            const onTimeCount = attendanceRecords.filter(r => r.status === 'PRESENT').length;
            const lateCount = attendanceRecords.filter(r => r.status === 'LATE').length;
            const onTimePercent = attendanceRecords.length > 0
                ? Math.round((onTimeCount / attendanceRecords.length) * 100)
                : 0;

            setStats({
                avgHours: '8h 12m',
                onTime: `${onTimePercent}%`,
                late: lateCount,
                overtime: '4h 30m'
            });

        } catch (error) {
            console.error('Attendance fetch error:', error);
            toast.error('Failed to load attendance data');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePunch = async () => {
        try {
            const res = await api.post('/attendance/punch');
            toast.success(res.data.message);
            fetchAttendanceData(); // Refresh data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Punch failed');
        }
    };

    const formatTime = (isoString) => {
        if (!isoString) return '--:--';
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Attendance & Time</h1>
                <p className="text-slate-400 mt-1">Track your daily work hours and logs.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Punch Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden text-center shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                        <div className="mb-6">
                            <div className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-2">Current Time</div>
                            <div className="text-5xl font-mono font-bold text-white tracking-wider">
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="text-slate-500 mt-2 font-medium">
                                {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                            </div>
                        </div>

                        <button
                            onClick={handlePunch}
                            className={`
                                w-48 h-48 rounded-full border-8 transition-all duration-500 flex flex-col items-center justify-center group
                                ${isPunchedIn
                                    ? 'border-red-500/20 bg-red-500/10 hover:bg-red-500/20 hover:scale-105'
                                    : 'border-green-500/20 bg-green-500/10 hover:bg-green-500/20 hover:scale-105'
                                }
                            `}
                        >
                            <div className={`p-4 rounded-full mb-2 transition-colors ${isPunchedIn ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                                <Clock size={32} />
                            </div>
                            <span className={`text-xl font-bold ${isPunchedIn ? 'text-red-400' : 'text-green-400'}`}>
                                {isPunchedIn ? 'PUNCH OUT' : 'PUNCH IN'}
                            </span>
                        </button>
                    </div>

                    {/* Today's Punches */}
                    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <CalendarIcon size={18} className="text-primary-400" />
                            Today's Punches
                        </h3>
                        <div className="space-y-3">
                            {todayPunches.length > 0 ? (
                                todayPunches.map((punch, index) => (
                                    <div key={index} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-slate-500 font-medium">Punch #{index + 1}</span>
                                            {punch.punchIn && !punch.punchOut && (
                                                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <div className="text-xs text-slate-500 mb-1">In Time</div>
                                                <div className="text-sm font-bold text-white flex items-center gap-1">
                                                    <ArrowRight className="text-green-400" size={14} />
                                                    {formatTime(punch.punchIn)}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 mb-1">Out Time</div>
                                                <div className="text-sm font-bold text-white flex items-center gap-1">
                                                    <ArrowRight className="text-red-400" size={14} />
                                                    {formatTime(punch.punchOut)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-slate-500 text-sm">
                                    No punches recorded today
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats & History */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Weekly Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: 'Avg Hrs', val: stats.avgHours, icon: <History />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                            { label: 'On Time', val: stats.onTime, icon: <CheckCircle2 />, color: 'text-green-400', bg: 'bg-green-500/10' },
                            { label: 'Late', val: stats.late, icon: <AlertCircle />, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                            { label: 'Overtime', val: stats.overtime, icon: <TrendingUp />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`${stat.bg} border border-slate-800 p-4 rounded-2xl`}
                            >
                                <div className={`${stat.color} mb-3`}>{stat.icon}</div>
                                <div className="text-2xl font-bold text-white">{stat.val}</div>
                                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Logs Table */}
                    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl overflow-hidden flex-1">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-white">Recent Activity</h3>
                            <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors">View All</button>
                        </div>
                        <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto">
                            {isLoading ? (
                                <p className="p-4 text-slate-500 text-center text-sm">Loading...</p>
                            ) : history.length === 0 ? (
                                <p className="p-4 text-slate-500 text-center text-sm">No recent activity</p>
                            ) : history.map((row, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="p-4 hover:bg-slate-800/50 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-950 flex flex-col items-center justify-center border border-slate-800">
                                                <span className="text-[10px] text-slate-500 uppercase">
                                                    {new Date(row.date).toLocaleDateString(undefined, { weekday: 'short' })}
                                                </span>
                                                <span className="text-sm font-bold text-white">
                                                    {new Date(row.date).getDate()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-sm text-white font-medium flex items-center gap-2">
                                                    {new Date(row.date).toLocaleDateString()}
                                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${row.status === 'PRESENT'
                                                            ? 'text-green-400 bg-green-500/10 border border-green-500/30'
                                                            : 'text-slate-400 bg-slate-500/10 border border-slate-500/30'
                                                        }`}>
                                                        {row.status}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                    <MapPin size={10} /> Office
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Show all punches for the day */}
                                    {row.punches && row.punches.length > 0 && (
                                        <div className="ml-16 space-y-2">
                                            {row.punches.map((punch, pIndex) => (
                                                <div key={pIndex} className="flex items-center gap-4 text-xs">
                                                    <span className="text-slate-600">#{pIndex + 1}</span>
                                                    <div className="flex items-center gap-2 text-green-400">
                                                        <ArrowRight size={12} />
                                                        <span>{formatTime(punch.punchIn)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-red-400">
                                                        <ArrowRight size={12} />
                                                        <span>{formatTime(punch.punchOut)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeAttendance;
