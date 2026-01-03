import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion } from 'framer-motion';
import { Download, FileText, DollarSign, Calendar, ChevronDown, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const Payroll = () => {
    const [selectedMonth, setSelectedMonth] = useState('October 2024'); // Should be dynamic
    const [stats, setStats] = useState({ totalDisbursed: 0, pendingAmount: 0, pendingCount: 0 });
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
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
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load payroll data');
            setLoading(false);
        }
    };

    const handleRunPayroll = async () => {
        // This would typically open a modal to select employee/month
        // For demo, we just toast
        toast("Payroll generation feature is ready on backend!", { icon: '🚀' });
    };

    return (
        <div className="space-y-6">
             {/* Header */}
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Payroll</h1>
                    <p className="text-slate-400 mt-1">Manage salaries and payslips.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-slate-900 border border-slate-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-slate-800 transition-all">
                        <Calendar size={18} className="text-slate-400" />
                        <span>{selectedMonth}</span>
                        <ChevronDown size={16} className="text-slate-500" />
                    </button>
                    <button 
                        onClick={handleRunPayroll}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
                    >
                        <DollarSign size={20} />
                        <span>Run Payroll</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-900/50 to-indigo-950/50 border border-indigo-500/20 p-6 rounded-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-indigo-300 font-medium text-sm mb-1">Total Disbursed</p>
                        <h3 className="text-3xl font-bold text-white">${stats.totalDisbursed.toLocaleString()}</h3>
                        <p className="text-indigo-400/60 text-xs mt-2">Paid salaries this month</p>
                    </div>
                    <DollarSign className="absolute -bottom-4 -right-4 text-indigo-500/10 w-32 h-32" />
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <p className="text-slate-400 font-medium text-sm mb-1">Pending Processing</p>
                    <h3 className="text-3xl font-bold text-white">${stats.pendingAmount.toLocaleString()}</h3>
                    <p className="text-slate-600 text-xs mt-2">{stats.pendingCount} Employees pending</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <p className="text-slate-400 font-medium text-sm mb-1">Tax Deducted</p>
                    <h3 className="text-3xl font-bold text-white">$0.00</h3>
                    <p className="text-slate-600 text-xs mt-2">Not calculated yet</p>
                </div>
            </div>

            {/* Payroll Table/Cards */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-lg">Employee Payslips</h3>
                    <button className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg">
                        <Filter size={18} />
                    </button>
                </div>

                {loading ? <p className="text-slate-500">Loading payroll data...</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {payrolls.length === 0 ? <p className="text-slate-500 col-span-3 text-center py-8">No payroll records found.</p> : payrolls.map((payroll) => (
                            <div key={payroll._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 border border-slate-700">
                                            {payroll.employee?.firstName?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{payroll.employee?.firstName} {payroll.employee?.lastName}</h4>
                                            <p className="text-xs text-slate-500">{payroll.employee?.designation}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full border ${
                                        payroll.status === 'Paid' 
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                    }`}>
                                        {payroll.status}
                                    </span>
                                </div>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Basic Salary</span>
                                        <span className="text-slate-300">${payroll.baseSalary}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Bonus/Incentives</span>
                                        <span className="text-slate-300">${payroll.bonus}</span>
                                    </div>
                                    <div className="h-px bg-slate-800 my-2"></div>
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-slate-400">Net Payable</span>
                                        <span className="text-white text-lg">${payroll.netSalary}</span>
                                    </div>
                                </div>

                                <button className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                    <Download size={16} />
                                    <span className="text-sm font-medium">Download Slip</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payroll;
