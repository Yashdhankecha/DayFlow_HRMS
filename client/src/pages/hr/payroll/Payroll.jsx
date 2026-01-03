import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion } from 'framer-motion';
import { Download, FileText, DollarSign, Calendar, ChevronDown, Filter, Plus, Users, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Payroll = () => {
    const [stats, setStats] = useState({ totalDisbursed: 0, pendingAmount: 0, pendingCount: 0 });
    const [payrolls, setPayrolls] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    // Generation State
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchData();
        fetchEmployees();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, listRes] = await Promise.all([
                api.get('/payroll/stats'),
                api.get('/payroll')
            ]);
            setStats(statsRes.data.data);
            setPayrolls(listRes.data.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load payroll data');
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/employees');
            setEmployees(res.data.data);
        } catch (error) {
            console.error('Failed to fetch employees');
        }
    };

    const handleGenerate = async () => {
        if (!selectedEmployee) return toast.error('Please select an employee');
        
        setGenerating(true);
        try {
            await api.post('/payroll/generate', {
                employeeId: selectedEmployee,
                month: selectedMonth,
                year: selectedYear
            });
            toast.success('Payroll generated successfully!');
            fetchData(); // Refresh list and stats
            setSelectedEmployee(''); // Reset selection
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to generate payroll');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="space-y-6 pb-20">
             {/* Header */}
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Payroll Management</h1>
                    <p className="text-slate-400 mt-1">Generate and manage monthly employee salaries.</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-900/50 to-indigo-950/50 border border-indigo-500/20 p-6 rounded-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-indigo-300 font-medium text-sm mb-1">Total Disbursed</p>
                        <h3 className="text-3xl font-bold text-white">₹{stats.totalDisbursed.toLocaleString()}</h3>
                        <p className="text-indigo-400/60 text-xs mt-2">Lifetime or Current Year</p>
                    </div>
                    <DollarSign className="absolute -bottom-4 -right-4 text-indigo-500/10 w-32 h-32" />
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <p className="text-slate-400 font-medium text-sm mb-1">Pending for {selectedMonth}</p>
                    <h3 className="text-3xl font-bold text-white">{stats.pendingCount}</h3>
                    <p className="text-slate-600 text-xs mt-2">Employees not yet paid this month</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <p className="text-slate-400 font-medium text-sm mb-1">Tax Deducted</p>
                    <h3 className="text-3xl font-bold text-white">₹0.00</h3>
                    <p className="text-slate-600 text-xs mt-2">Not calculated yet</p>
                </div>
            </div>

            {/* Generator Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="text-indigo-500" size={20}/>
                    Generate Payroll
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Select Employee</label>
                        <select 
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                        >
                            <option value="">-- Choose Employee --</option>
                            {employees.map(emp => (
                                <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName} ({emp.employeeCode || 'No Code'})</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Month & Year</label>
                        <div className="flex gap-2">
                            <select 
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-3 text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
                            >
                                {months.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <input 
                                type="number"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="w-24 bg-slate-950 border border-slate-700 rounded-xl px-2 py-3 text-slate-200 outline-none focus:border-indigo-500 text-center"
                            />
                        </div>
                    </div>
                    <button 
                        onClick={handleGenerate}
                        disabled={generating}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {generating ? 'Processing...' : (
                            <>
                                <CheckCircle size={18} />
                                Generate
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Payroll List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-lg">Generated Payslips</h3>
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                         <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {payrolls.length === 0 ? (
                            <div className="col-span-3 py-12 text-center text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                                <FileText className="mx-auto mb-3 opacity-50" size={32} />
                                <p>No payroll records found. Generate one above!</p>
                            </div>
                        ) : payrolls.map((payroll) => (
                            <motion.div 
                                key={payroll._id} 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <DollarSign size={64} />
                                </div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-400 border border-indigo-500/20">
                                            {payroll.employee?.firstName?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{payroll.employee?.firstName} {payroll.employee?.lastName}</h4>
                                            <p className="text-xs text-slate-500">{payroll.month} {payroll.year}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                        Generated
                                    </span>
                                </div>
                                
                                <div className="space-y-2 mb-6 relative z-10">
                                    <div className="flex justify-between text-sm py-1 border-b border-slate-800/50">
                                        <span className="text-slate-500">Gross Earnings</span>
                                        <span className="text-slate-300">₹{payroll.salarySnapshot?.grossSalary?.toLocaleString() || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm py-1 border-b border-slate-800/50">
                                        <span className="text-slate-500">Attendance</span>
                                        <span className="text-slate-300">{payroll.attendanceSummary?.presentDays} / {payroll.attendanceSummary?.workingDays} Days</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold pt-2">
                                        <span className="text-indigo-300">Net Payable</span>
                                        <span className="text-white text-xl">₹{payroll.finalPay?.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 relative z-10">
                                    <Download size={16} />
                                    <span className="text-sm font-medium">Download Slip</span>
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payroll;
