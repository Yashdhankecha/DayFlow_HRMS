import { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import {
    Clock, Calendar as CalendarIcon, MapPin,
    Coffee, CheckCircle2, AlertCircle, History,
    ChevronRight, ChevronLeft, TrendingUp, Timer
} from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeAttendance = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isPunchedIn, setIsPunchedIn] = useState(false);
    const [todayPunches, setTodayPunches] = useState([]);
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({
        avgHours: '0h 0m',
        onTime: '0%',
        late: 0,
        overtime: '0h 0m'
    });
    const [loading, setLoading] = useState(true);

    // Calendar Helper
    const generateCalendarDays = () => {
        const year = currentTime.getFullYear();
        const month = currentTime.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay(); // 0 = Sun

        const days = [];

        // Previous month filler
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push({ date: new Date(year, month, -startDayOfWeek + i + 1), isCurrentMonth: false });
        }

        // Current month
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const isToday = date.toDateString() === new Date().toDateString();

            // Find record
            const record = history.find(r => new Date(r.date).toDateString() === date.toDateString());

            days.push({
                date,
                isCurrentMonth: true,
                isToday,
                record
            });
        }

        // Next month filler (to complete 42 grid cells)
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
        }

        return days;
    };

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    const fetchAttendanceData = async () => {
        try {
            setLoading(true);
            const [statusRes, historyRes] = await Promise.all([
                api.get('/attendance/status'),
                api.get('/attendance/history')
            ]);

            // Status response
            const { isPunchedIn: punchedIn, todayPunches: punches } = statusRes.data.data;
            setIsPunchedIn(punchedIn);
            setTodayPunches(punches || []);

            // History response
            const records = historyRes.data.data || [];
            setHistory(records);

            // Calculate Dynamic Stats
            calculateStats(records);

        } catch (error) {
            console.error('Attendance fetch error:', error);
            toast.error('Failed to load attendance data');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (records) => {
        if (!records.length) return;

        let totalMinutes = 0;
        let onTimeCount = 0;
        let lateCount = 0;
        let overtimeMinutes = 0;
        let daysWithHours = 0;

        records.forEach(record => {
            // Calculate daily hours
            let dailyMinutes = 0;
            if (record.punches && record.punches.length > 0) {
                // Check On Time (assuming 9:30 AM is cutoff)
                const firstPunch = new Date(record.punches[0].punchIn);
                const cutoff = new Date(firstPunch);
                cutoff.setHours(9, 30, 0, 0);

                if (firstPunch <= cutoff) onTimeCount++;
                else lateCount++;

                // Sum durations
                record.punches.forEach(punch => {
                    if (punch.punchIn && punch.punchOut) {
                        const start = new Date(punch.punchIn);
                        const end = new Date(punch.punchOut);
                        dailyMinutes += (end - start) / (1000 * 60);
                    }
                });

                if (dailyMinutes > 0) {
                    totalMinutes += dailyMinutes;
                    daysWithHours++;
                }

                // Overtime (assuming > 9 hours is OT)
                if (dailyMinutes > 540) { // 9 * 60
                    overtimeMinutes += (dailyMinutes - 540);
                }
            }
        });

        // Averages
        const avgMins = daysWithHours > 0 ? totalMinutes / daysWithHours : 0;
        const avgH = Math.floor(avgMins / 60);
        const avgM = Math.floor(avgMins % 60);

        const otH = Math.floor(overtimeMinutes / 60);
        const otM = Math.floor(overtimeMinutes % 60);

        const onTimePct = records.length > 0 ? Math.round((onTimeCount / records.length) * 100) : 0;

        setStats({
            avgHours: `${avgH}h ${avgM}m`,
            onTime: `${onTimePct}%`,
            late: lateCount,
            overtime: `${otH}h ${otM}m`
        });
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

    const calculateDailyDuration = (punches) => {
        if (!punches || !punches.length) return '0h 0m';
        let minutes = 0;
        punches.forEach(p => {
            if (p.punchIn && p.punchOut) {
                minutes += (new Date(p.punchOut) - new Date(p.punchIn)) / (1000 * 60);
            }
        });
        const h = Math.floor(minutes / 60);
        const m = Math.floor(minutes % 60);
        return `${h}h ${m}m`;
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Attendance & Time</h1>
                <p className="text-slate-400 mt-1">Track your daily work hours and logs.</p>
            </div>

            {/* Split View: Calendar & Daily Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT: Compact Calendar */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <CalendarIcon size={18} className="text-primary-400" />
                                {currentTime.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                            </h2>
                            {/* Simple month nav could go here if implemented */}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                <div key={d} className="text-center text-xs font-bold text-slate-500 uppercase py-1">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {generateCalendarDays().map((day, idx) => {
                                const isSelected = selectedDate.toDateString() === day.date.toDateString();
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedDate(day.date)}
                                        disabled={!day.isCurrentMonth}
                                        className={`
                                            relative h-10 w-full rounded-lg flex items-center justify-center text-sm font-medium transition-all
                                            ${!day.isCurrentMonth ? 'opacity-20 cursor-default' : 'hover:bg-slate-800'}
                                            ${isSelected ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-slate-300'}
                                            ${day.isToday && !isSelected ? 'border border-primary-500/50 text-white' : ''}
                                        `}
                                    >
                                        {day.date.getDate()}

                                        {/* Status Dot */}
                                        {day.record && (
                                            <div className={`absolute bottom-1 w-1 h-1 rounded-full ${day.record.status === 'PRESENT' ? 'bg-green-500' :
                                                    day.record.status === 'ABSENT' ? 'bg-red-500' :
                                                        day.record.status === 'ON LEAVE' ? 'bg-yellow-500' : 'bg-slate-500'
                                                }`}></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex justify-center flex-wrap gap-4 mt-6 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>Present</div>
                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>Absent</div>
                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>Leave</div>
                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>Holiday</div>
                        </div>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                            <div className="text-xs text-slate-500 uppercase font-bold text-blue-400 mb-1">Avg Hours</div>
                            <div className="text-xl font-bold text-white">{stats.avgHours}</div>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                            <div className="text-xs text-slate-500 uppercase font-bold text-green-400 mb-1">On Time</div>
                            <div className="text-xl font-bold text-white">{stats.onTime}</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Daily Detail Panel */}
                <div className="lg:col-span-7">
                    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-3xl p-6 sm:p-8 h-full flex flex-col relative overflow-hidden">

                        {/* Detail Header */}
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {selectedDate.toLocaleDateString(undefined, { weekday: 'long' })}
                                </h2>
                                <p className="text-slate-400">
                                    {selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>

                            {/* Status Badge for Selected Date */}
                            {(() => {
                                const status = selectedDate.toDateString() === new Date().toDateString()
                                    ? 'TODAY'
                                    : (history.find(r => new Date(r.date).toDateString() === selectedDate.toDateString())?.status || 'NO DATA');

                                const getBadgeStyle = (s) => {
                                    switch (s) {
                                        case 'TODAY': return 'bg-primary-500/10 text-primary-400 border-primary-500/20';
                                        case 'PRESENT': return 'bg-green-500/10 text-green-400 border-green-500/20';
                                        case 'ABSENT': return 'bg-red-500/10 text-red-400 border-red-500/20';
                                        case 'ON LEAVE': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
                                        default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
                                    }
                                };

                                return (
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getBadgeStyle(status)} ${status === 'TODAY' ? 'animate-pulse' : ''}`}>
                                        {status}
                                    </span>
                                );
                            })()}
                        </div>

                        {/* CONTENT SWITCHER: IF TODAY -> Show Punch Card. IF HISTORY -> Show Summary */}
                        {selectedDate.toDateString() === new Date().toDateString() ? (
                            <div className="flex flex-col items-center flex-1 justify-center space-y-8 animate-fade-in relative z-10">

                                {/* PUNCH CLOCK */}
                                <div className="text-center">
                                    <div className="text-5xl font-mono font-bold text-white tracking-widest mb-2">
                                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Live Server Time</p>
                                </div>

                                <button
                                    onClick={handlePunch}
                                    className={`
                                        w-40 h-40 rounded-full border-[8px] transition-all duration-300 flex flex-col items-center justify-center group relative shadow-2xl
                                        ${isPunchedIn
                                            ? 'border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-900/10 hover:border-red-500/40 hover:scale-105'
                                            : 'border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-900/10 hover:border-green-500/40 hover:scale-105'
                                        }
                                    `}
                                >
                                    <div className={`p-3 rounded-full mb-2 transition-colors duration-300 ${isPunchedIn ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                                        <Timer size={24} />
                                    </div>
                                    <span className={`text-sm font-bold tracking-tight ${isPunchedIn ? 'text-red-400' : 'text-green-400'}`}>
                                        {isPunchedIn ? 'PUNCH OUT' : 'PUNCH IN'}
                                    </span>
                                </button>

                                {/* TODAY'S LOGS */}
                                <div className="w-full max-w-md bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 mt-auto">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                        <History size={14} /> Today's Activity
                                    </h4>
                                    <div className="space-y-3 max-h-[150px] overflow-y-auto pr-1">
                                        {todayPunches.length > 0 ? (
                                            [...todayPunches].reverse().map((punch, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-800/50 pb-2 last:border-0 last:pb-0">
                                                    <span className={`flex items-center gap-2 ${punch.punchOut ? 'text-slate-400' : 'text-green-400 font-medium'}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${punch.punchOut ? 'bg-slate-500' : 'bg-green-500'}`}></div>
                                                        {punch.punchOut ? 'Shift Completed' : 'Shift Active'}
                                                    </span>
                                                    <div className="flex gap-4 font-mono text-slate-300">
                                                        <span>{formatTime(punch.punchIn)}</span>
                                                        <span className="text-slate-600">-</span>
                                                        <span>{punch.punchOut ? formatTime(punch.punchOut) : '...'}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-slate-500 text-xs italic text-center py-2">No activity yet today</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col flex-1 animate-fade-in relative z-10">
                                {(() => {
                                    const record = history.find(r => new Date(r.date).toDateString() === selectedDate.toDateString());
                                    if (!record) {
                                        return (
                                            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-60">
                                                <CalendarIcon size={48} className="mb-4 text-slate-700" />
                                                <p>No records found for this date.</p>
                                            </div>
                                        );
                                    }

                                    const durationStr = calculateDailyDuration(record.punches);

                                    return (
                                        <div className="space-y-8">
                                            {/* Summary Cards */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-slate-800/40 p-4 rounded-xl border border-white/5">
                                                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Total Hours</div>
                                                    <div className="text-2xl font-bold text-white">{durationStr}</div>
                                                </div>
                                                <div className="bg-slate-800/40 p-4 rounded-xl border border-white/5">
                                                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Punch Count</div>
                                                    <div className="text-2xl font-bold text-white">{record.punches?.length || 0}</div>
                                                </div>
                                            </div>

                                            {/* Timeline */}
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                                    <History size={16} className="text-primary-400" /> Activity Timeline
                                                </h4>
                                                <div className="relative pl-4 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                                                    {record.punches?.map((punch, idx) => (
                                                        <div key={idx} className="relative z-10">
                                                            {/* Punch In */}
                                                            <div className="mb-4 relative">
                                                                <div className="absolute left-[-21px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-green-500"></div>
                                                                <div className="flex justify-between items-center group">
                                                                    <div>
                                                                        <p className="text-white font-medium text-sm group-hover:text-green-400 transition-colors">Punch In</p>
                                                                        <p className="text-slate-500 text-xs">Started work shift</p>
                                                                    </div>
                                                                    <span className="font-mono text-sm text-slate-300 bg-slate-800 px-2 py-1 rounded">{formatTime(punch.punchIn)}</span>
                                                                </div>
                                                            </div>

                                                            {/* Punch Out */}
                                                            {punch.punchOut && (
                                                                <div className="relative">
                                                                    <div className="absolute left-[-21px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-red-500"></div>
                                                                    <div className="flex justify-between items-center group">
                                                                        <div>
                                                                            <p className="text-white font-medium text-sm group-hover:text-red-400 transition-colors">Punch Out</p>
                                                                            <p className="text-slate-500 text-xs">Ended work shift</p>
                                                                        </div>
                                                                        <span className="font-mono text-sm text-slate-300 bg-slate-800 px-2 py-1 rounded">{formatTime(punch.punchOut)}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmployeeAttendance;
