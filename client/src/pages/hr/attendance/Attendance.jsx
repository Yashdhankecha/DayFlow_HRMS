import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { 
    Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
    Search, Clock, User, Download, Filter 
} from 'lucide-react';
import { 
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
    eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, 
    isToday
} from 'date-fns';
import toast from 'react-hot-toast';

const Attendance = () => {
    const { user } = useAuth();
    
    // Calendar State
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    // Data State
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAttendance(selectedDate);
    }, [selectedDate]);

    const fetchAttendance = async (date) => {
        try {
            setLoading(true);
            const formattedDate = format(date, 'yyyy-MM-dd');
            const res = await api.get(`/attendance/all?date=${formattedDate}`);
            setAttendanceData(res.data.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load attendance records');
        } finally {
            setLoading(false);
        }
    };

    // Calendar Handlers
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const onDateClick = (day) => setSelectedDate(day);

    // Generate Calendar Grid
    const renderCalendar = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = "d";
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                const cloneDay = day;
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isDayToday = isToday(day);

                days.push(
                    <div
                        key={day}
                        className={`
                            relative h-10 w-10 flex items-center justify-center rounded-xl text-sm font-medium cursor-pointer transition-all duration-200
                            ${!isCurrentMonth ? "text-slate-600" : "text-slate-300 hover:bg-slate-800 hover:text-white"}
                            ${isSelected ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-110 z-10" : ""}
                            ${isDayToday && !isSelected ? "border border-indigo-500/50 text-indigo-400" : ""}
                        `}
                        onClick={() => onDateClick(cloneDay)}
                    >
                        {formattedDate}
                        {/* Dot indicator for today if needed */}
                        {isDayToday && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-current opacity-50"></div>}
                    </div>
                );
                day = new Date(day.getTime() + 86400000); // add 1 day
            }
            rows.push(
                <div key={day} className="flex justify-between items-center mb-2">
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="mt-4">{rows}</div>;
    };

    // Helper: Calculate Working Hours
    const calculateWorkingHours = (punches) => {
        if (!punches || punches.length === 0) return '0h 0m';

        let totalMs = 0;
        punches.forEach(punch => {
            if (punch.punchIn && punch.punchOut) {
                totalMs += new Date(punch.punchOut) - new Date(punch.punchIn);
            }
        });

        const hours = Math.floor(totalMs / (1000 * 60 * 60));
        const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m`;
    };

    const formatTime = (isoString) => {
        if (!isoString) return '--:--';
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Daily Attendance</h1>
                    <p className="text-slate-400 mt-1">Select a date to view employee logs and working hours.</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-white max-w-xs">{format(selectedDate, 'MMMM d, yyyy')}</div>
                    <div className="text-sm text-slate-500">{format(selectedDate, 'EEEE')}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Sidebar: Calendar */}
                <div className="lg:col-span-4 xl:col-span-3">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sticky top-6 shadow-xl">
                        {/* Calendar Header */}
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-lg font-bold text-white">
                                {format(currentMonth, 'MMMM yyyy')}
                            </span>
                            <div className="flex gap-1">
                                <button onClick={prevMonth} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                                    <ChevronLeft size={20} />
                                </button>
                                <button onClick={nextMonth} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Days Header */}
                        <div className="flex justify-between mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                <div key={i} className="w-10 text-center text-xs font-bold text-slate-500">{day}</div>
                            ))}
                        </div>

                        {/* Calendar Body */}
                        {renderCalendar()}

                        {/* Summary for Selected Day */}
                        <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Day Summary</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                                    <div className="text-xs text-slate-500 mb-1">Present</div>
                                    <div className="text-xl font-bold text-green-400">
                                        {attendanceData.filter(r => r.status === 'PRESENT').length}
                                    </div>
                                </div>
                                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                                    <div className="text-xs text-slate-500 mb-1">Absent</div>
                                    <div className="text-xl font-bold text-red-400">
                                        {attendanceData.filter(r => r.status === 'ABSENT').length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Table */}
                <div className="lg:col-span-8 xl:col-span-9">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden min-h-[600px] flex flex-col shadow-xl">
                        {/* Table Header / Toolbar */}
                        <div className="p-6 border-b border-slate-800 flex flex-wrap gap-4 justify-between items-center bg-slate-950/30">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search employee..." 
                                    className="bg-slate-950 border border-slate-800 text-white pl-10 pr-4 py-2 rounded-xl text-sm outline-none focus:border-indigo-500 w-64"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors">
                                    <Filter size={16} /> Filter
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors">
                                    <Download size={16} /> Export
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-800 bg-slate-950/50">
                                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</th>
                                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Login ID</th>
                                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Punch In</th>
                                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Punch Out</th>
                                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Working Hrs</th>
                                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-slate-500">
                                                <div className="animate-pulse">Loading data...</div>
                                            </td>
                                        </tr>
                                    ) : attendanceData.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-12 text-center text-slate-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <CalendarIcon size={48} className="mb-4 text-slate-700" strokeWidth={1} />
                                                    <p>No attendance records found for this date.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        attendanceData.map((record) => {
                                            const firstPunch = record.punches?.[0];
                                            const lastPunch = record.punches?.[record.punches.length - 1];
                                            const isPresent = record.status === 'PRESENT';

                                            return (
                                                <tr key={record._id} className="hover:bg-slate-800/30 transition-colors group">
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold border border-slate-700 group-hover:border-slate-600 group-hover:bg-slate-700 transition-colors">
                                                                {record.employee?.firstName?.[0]}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-semibold text-white">
                                                                    {record.employee?.firstName} {record.employee?.lastName}
                                                                </div>
                                                                <div className="text-xs text-slate-500">{record.employee?.designation}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <span className="font-mono text-xs text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                                            {record.employee?.loginId || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                                            {firstPunch?.punchIn ? (
                                                                <>
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                                    {formatTime(firstPunch.punchIn)}
                                                                </>
                                                            ) : '--:--'}
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <div className="text-sm text-slate-300">
                                                            {lastPunch?.punchOut ? formatTime(lastPunch.punchOut) : '--:--'}
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-2 text-sm font-medium text-indigo-300">
                                                            <Clock size={14} className="text-indigo-500" />
                                                            {calculateWorkingHours(record.punches)}
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                                                            isPresent
                                                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                                            : record.status === 'ABSENT' 
                                                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                        }`}>
                                                            {record.status || 'PRESENT'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
