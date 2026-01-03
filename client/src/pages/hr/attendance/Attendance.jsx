import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { 
    Clock, Calendar as CalendarIcon, MapPin, 
    AlertCircle, CheckCircle2, History, Users 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Attendance = () => {
    const { user } = useAuth();
    const isHR = user?.role === 'HR_OFFICER' || user?.role === 'SUPER_ADMIN';

    const [currentTime, setCurrentTime] = useState(new Date());
    const [isPunchedIn, setIsPunchedIn] = useState(false);
    const [todayLog, setTodayLog] = useState({ in: null, out: null });
    const [history, setHistory] = useState([]);
    
    // HR Specific State
    const [allAttendance, setAllAttendance] = useState([]);
    const [viewMode, setViewMode] = useState('my'); // 'my' or 'all'

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (viewMode === 'my') {
            fetchMyAttendance();
        } else if (isHR && viewMode === 'all') {
            fetchAllAttendance();
        }
    }, [viewMode]);

    const fetchMyAttendance = async () => {
        try {
            const [statusRes, historyRes] = await Promise.all([
                api.get('/attendance/status'),
                api.get('/attendance/history')
            ]);

            const { isPunchedIn, punchInTime, punchOutTime } = statusRes.data.data;
            setIsPunchedIn(isPunchedIn);
            setTodayLog({
                in: punchInTime ? new Date(punchInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
                out: punchOutTime ? new Date(punchOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
            });

            setHistory(historyRes.data.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load attendance data');
        }
    };

    const fetchAllAttendance = async () => {
        try {
            const res = await api.get('/attendance/all');
            setAllAttendance(res.data.data);
        } catch (error) {
            toast.error('Failed to load all employees attendance');
        }
    };

    const handlePunch = async () => {
        try {
            const res = await api.post('/attendance/punch');
            toast.success(res.data.message);
            fetchMyAttendance(); 
        } catch (error) {
            toast.error(error.response?.data?.message || 'Punch failed');
        }
    };

    const formatTime = (isoString) => {
        if (!isoString) return '--:--';
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Attendance & Time</h1>
                    <p className="text-slate-400 mt-1">Track your daily work hours and logs.</p>
                </div>
                {isHR && (
                    <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                        <button 
                            onClick={() => setViewMode('my')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'my' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            My Attendance
                        </button>
                        <button 
                            onClick={() => setViewMode('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            All Employees
                        </button>
                    </div>
                )}
            </div>

            {viewMode === 'my' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Punch Card - Same as before */}
                    <div className="md:col-span-1 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden text-center shadow-2xl">
                         <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
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

                        <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                <span className="text-xs text-slate-500 block mb-1">Clock In</span>
                                <span className="text-lg font-bold text-white">{todayLog.in || '--:--'}</span>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                <span className="text-xs text-slate-500 block mb-1">Clock Out</span>
                                <span className="text-lg font-bold text-white">{todayLog.out || '--:--'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats & History */}
                    <div className="md:col-span-2 space-y-6">
                         {/* Weekly Stats */}
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: 'Avg Hrs', val: '8h 12m', icon: <History />, color: 'text-blue-400' },
                                { label: 'On Time', val: '95%', icon: <CheckCircle2 />, color: 'text-green-400' },
                                { label: 'Late', val: '2', icon: <AlertCircle />, color: 'text-orange-400' },
                                { label: 'Overtime', val: '4h 30m', icon: <Clock />, color: 'text-purple-400' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                                    <div className={`${stat.color} mb-3`}>{stat.icon}</div>
                                    <div className="text-2xl font-bold text-white">{stat.val}</div>
                                    <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Logs Table */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex-1">
                            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                                <h3 className="font-bold text-white">Recent Activity</h3>
                            </div>
                            <div className="divide-y divide-slate-800">
                                {history.length === 0 ? (
                                    <p className="p-4 text-slate-500 text-center text-sm">No recent activity</p>
                                ) : history.map((row, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl bg-slate-950 flex flex-col items-center justify-center border border-slate-800`}>
                                                <span className="text-[10px] text-slate-500 uppercase">
                                                    {new Date(row.date).toLocaleDateString(undefined, { weekday: 'short' })}
                                                </span>
                                                <span className="text-sm font-bold text-white">
                                                    {new Date(row.date).getDate()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-sm text-white font-medium">
                                                    {formatTime(row.checkInTime)} - {formatTime(row.checkOutTime)}
                                                </div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                                    <MapPin size={10} /> Office, Bangalore
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full bg-slate-950 border border-slate-800 ${
                                            row.status === 'Present' ? 'text-green-400' : 'text-slate-400'
                                        }`}>
                                            {row.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // ALL EMPLOYEES ATTENDANCE TABLE
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-950/50">
                                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Employee</th>
                                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Check In</th>
                                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Check Out</th>
                                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {allAttendance.map((record) => (
                                    <tr key={record._id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/30">
                                                    {record.employee?.firstName?.[0]}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-white">
                                                        {record.employee?.firstName} {record.employee?.lastName}
                                                    </div>
                                                    <div className="text-xs text-slate-500">{record.employee?.designation}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-400">{new Date(record.date).toLocaleDateString()}</td>
                                        <td className="p-4 text-sm text-white font-mono">{formatTime(record.checkInTime)}</td>
                                        <td className="p-4 text-sm text-white font-mono">{formatTime(record.checkOutTime)}</td>
                                        <td className="p-4">
                                            <span className={`text-xs px-2 py-1 rounded-full border ${
                                                record.status === 'Present' 
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                                : record.status === 'Absent' 
                                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;
