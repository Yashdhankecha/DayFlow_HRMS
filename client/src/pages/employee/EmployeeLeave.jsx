import { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import {
    FileText, Calendar, Clock, CheckCircle, XCircle,
    AlertCircle, Plus, Loader, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeLeave = () => {
    const [leaves, setLeaves] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState('all');
    const [formData, setFormData] = useState({
        type: 'CASUAL',
        startDate: '',
        endDate: '',
        reason: ''
    });

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            setLoading(true);
            const res = await api.get('/leaves/my-leaves');
            setLeaves(res.data.data.requests || []);
            setStats(res.data.data.stats || { total: 0, approved: 0, pending: 0, rejected: 0 });
        } catch (error) {
            toast.error('Failed to load leave requests');
            console.error('Leave fetch error:', error);
            // Mock data for demo
            setLeaves([
                {
                    type: 'CASUAL',
                    startDate: new Date().toISOString(),
                    endDate: new Date(Date.now() + 86400000).toISOString(),
                    status: 'PENDING',
                    reason: 'Personal work',
                    appliedOn: new Date().toISOString()
                },
                {
                    type: 'SICK',
                    startDate: new Date(Date.now() - 604800000).toISOString(),
                    endDate: new Date(Date.now() - 518400000).toISOString(),
                    status: 'APPROVED',
                    reason: 'Medical appointment',
                    appliedOn: new Date(Date.now() - 604800000).toISOString()
                }
            ]);
            setStats({ total: 15, approved: 8, pending: 2, rejected: 1, available: 4 });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/leaves/apply', formData);
            toast.success('Leave request submitted successfully');
            setShowModal(false);
            setFormData({ type: 'CASUAL', startDate: '', endDate: '', reason: '' });
            fetchLeaves();
        } catch (error) {
            toast.error('Failed to submit leave request');
            console.error('Leave apply error:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'PENDING':
                return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'REJECTED':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED':
                return <CheckCircle size={20} />;
            case 'PENDING':
                return <Clock size={20} />;
            case 'REJECTED':
                return <XCircle size={20} />;
            default:
                return <AlertCircle size={20} />;
        }
    };

    const filteredLeaves = leaves.filter(leave => {
        if (filter === 'all') return true;
        return leave.status.toLowerCase() === filter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader className="animate-spin text-primary-500" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Leave Management</h1>
                    <p className="text-slate-400 mt-1">Apply for leaves and track your requests</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus size={18} />
                    Apply Leave
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Total Leaves</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats?.total || 0}</p>
                        </div>
                        <FileText className="text-blue-400" size={24} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Approved</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats?.approved || 0}</p>
                        </div>
                        <CheckCircle className="text-green-400" size={24} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Pending</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats?.pending || 0}</p>
                        </div>
                        <Clock className="text-orange-400" size={24} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Rejected</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats?.rejected || 0}</p>
                        </div>
                        <XCircle className="text-red-400" size={24} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Available</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats?.available || 0}</p>
                        </div>
                        <Calendar className="text-purple-400" size={24} />
                    </div>
                </motion.div>
            </div>

            {/* Leave Requests */}
            <div className="bg-slate-900/50 backdrop-blur border border-white/5 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Leave History</h2>
                    <div className="flex gap-2">
                        {['all', 'pending', 'approved', 'rejected'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredLeaves.length > 0 ? (
                        filteredLeaves.map((leave, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors border border-slate-700"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className={`p-3 rounded-lg ${leave.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' : leave.status === 'PENDING' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {getStatusIcon(leave.status)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-white font-semibold">{leave.type} Leave</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(leave.status)}`}>
                                                    {leave.status}
                                                </span>
                                            </div>
                                            <p className="text-slate-400 text-sm mb-2">{leave.reason}</p>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    Applied on {new Date(leave.appliedOn).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <FileText className="mx-auto text-slate-600 mb-4" size={48} />
                            <p className="text-slate-400">No leave requests found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Apply Leave Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
                    >
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/50">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Plus className="text-primary-400" size={24} />
                                New Leave Request
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">Fill in the details below to request a leave.</p>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">

                            {/* Leave Type */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                    <FileText size={16} className="text-primary-400" />
                                    Leave Type
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {['CASUAL', 'SICK', 'ANNUAL', 'TIME_OFF'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type })}
                                            className={`py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${formData.type === type
                                                    ? 'bg-primary-600 text-white border-primary-500 shadow-lg shadow-primary-500/20'
                                                    : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                                                }`}
                                        >
                                            {type.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-800 space-y-6">
                                {formData.type === 'TIME_OFF' ? (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                                <Calendar size={16} className="text-blue-400" /> Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value, endDate: e.target.value })}
                                                className="w-full p-3 bg-slate-900/50 rounded-lg text-white border border-slate-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                                    <Clock size={16} className="text-orange-400" /> Start Time
                                                </label>
                                                <input
                                                    type="time"
                                                    value={formData.startTime || ''}
                                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                                    className="w-full p-3 bg-slate-900/50 rounded-lg text-white border border-slate-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                                    <Clock size={16} className="text-orange-400" /> End Time
                                                </label>
                                                <input
                                                    type="time"
                                                    value={formData.endTime || ''}
                                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                                    className="w-full p-3 bg-slate-900/50 rounded-lg text-white border border-slate-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                                <Calendar size={16} className="text-blue-400" /> From Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                className="w-full p-3 bg-slate-900/50 rounded-lg text-white border border-slate-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                                <Calendar size={16} className="text-blue-400" /> To Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.endDate}
                                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                className="w-full p-3 bg-slate-900/50 rounded-lg text-white border border-slate-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Reason */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                    <FileText size={16} className="text-slate-400" /> Reason
                                </label>
                                <textarea
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    className="w-full p-4 bg-slate-900/50 rounded-xl text-white border border-slate-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none resize-none transition-colors h-32"
                                    required
                                    placeholder="Please provide a valid reason for your leave request..."
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 px-4 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors font-bold text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-3 px-4 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-colors font-bold text-sm shadow-lg shadow-primary-500/20"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default EmployeeLeave;
