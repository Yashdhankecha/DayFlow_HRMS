import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Filter, Plus, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const Leaves = () => {
    const { user } = useAuth();
    const isHR = user?.role === 'HR_OFFICER' || user?.role === 'SUPER_ADMIN';

    const [activeTab, setActiveTab] = useState('my-leaves'); // my-leaves, all-requests (HR only)
    const [leaves, setLeaves] = useState([]);
    const [allLeaves, setAllLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        leaveType: 'Sick Leave',
        startDate: '',
        endDate: '',
        reason: ''
    });

    useEffect(() => {
        fetchMyLeaves();
        if (isHR) {
            fetchAllLeaves();
        }
    }, [isHR]);

    const fetchMyLeaves = async () => {
        try {
            setLoading(true);
            const res = await api.get('/leaves/my-leaves');
            setLeaves(res.data.data);
        } catch (error) {
            toast.error('Failed to fetch leaves');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllLeaves = async () => {
        try {
            const res = await api.get('/leaves/all');
            setAllLeaves(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleApplyLeave = async (e) => {
        e.preventDefault();
        try {
            await api.post('/leaves/apply', formData);
            toast.success('Leave applied successfully');
            setIsApplyModalOpen(false);
            setFormData({ leaveType: 'Sick Leave', startDate: '', endDate: '', reason: '' });
            fetchMyLeaves();
        } catch (error) {
            toast.error('Failed to apply for leave');
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.patch(`/leaves/${id}/status`, { status });
            toast.success(`Leave ${status} successfully`);
            fetchAllLeaves();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Leave Management</h1>
                    <p className="text-slate-400 mt-1">View and manage leave requests.</p>
                </div>
                <div className="flex gap-2">
                    {isHR && (
                         <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl mr-4">
                            <button 
                                onClick={() => setActiveTab('my-leaves')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'my-leaves' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                My Leaves
                            </button>
                            <button 
                                onClick={() => setActiveTab('all-requests')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'all-requests' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                All Requests
                            </button>
                        </div>
                    )}
                    <button 
                        onClick={() => setIsApplyModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
                    >
                        <Plus size={20} />
                        <span>Apply Leave</span>
                    </button>
                </div>
            </div>

            {/* List Content */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6 min-h-[400px]">
                {loading ? <p className="text-slate-500">Loading...</p> : (
                    <div className="space-y-4">
                         {/* HR View: All Requests */}
                         {activeTab === 'all-requests' && isHR ? (
                            allLeaves.length === 0 ? <p className="text-slate-500">No leave requests found.</p> :
                            allLeaves.map(leave => (
                                <div key={leave._id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-slate-700 transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 border border-slate-700 shrink-0">
                                            {leave.employee?.firstName?.[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{leave.employee?.firstName} {leave.employee?.lastName}</h4>
                                            <div className="flex gap-2 text-sm text-slate-400 mt-1">
                                                <span className="bg-slate-900 px-2 py-0.5 rounded text-xs border border-slate-800">
                                                    {leave.leaveType}
                                                </span>
                                                <span>•</span>
                                                <span className="font-medium text-slate-300">
                                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800/50">
                                                "{leave.reason}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        {leave.status === 'Pending' ? (
                                            <>
                                                <button 
                                                    onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-all text-sm font-medium"
                                                >
                                                    <CheckCircle size={14} /> Approve
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all text-sm font-medium"
                                                >
                                                    <XCircle size={14} /> Reject
                                                </button>
                                            </>
                                        ) : (
                                            <span className={`text-sm font-medium px-3 py-1 rounded-full border ${
                                                leave.status === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                                {leave.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                         ) : (
                            // My Leaves View
                            leaves.length === 0 ? <p className="text-slate-500">You haven't applied for any leave yet.</p> :
                            leaves.map(leave => (
                                <div key={leave._id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
                                     <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-white">{leave.leaveType}</span>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                                                leave.status === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                leave.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            }`}>
                                                {leave.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-slate-400">
                                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                        </div>
                                     </div>
                                     <div className="text-right text-xs text-slate-500">
                                         Applied on {new Date(leave.createdAt).toLocaleDateString()}
                                     </div>
                                </div>
                            ))
                         )}
                    </div>
                )}
            </div>

            {/* Apply Modal */}
            <AnimatePresence>
                {isApplyModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl"
                        >
                            <h2 className="text-xl font-bold text-white mb-4">Apply for Leave</h2>
                            <form onSubmit={handleApplyLeave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Leave Type</label>
                                    <select 
                                        value={formData.leaveType}
                                        onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                                    >
                                        <option>Sick Leave</option>
                                        <option>Casual Leave</option>
                                        <option>Paid Leave</option>
                                        <option>Unpaid Leave</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Start Date</label>
                                        <input 
                                            type="date" 
                                            required
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-indigo-500" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">End Date</label>
                                        <input 
                                            type="date" 
                                            required
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-indigo-500" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Reason</label>
                                    <textarea 
                                        rows="3"
                                        required
                                        value={formData.reason}
                                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                                        placeholder="Brief reason for leave..."
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button 
                                        type="button"
                                        onClick={() => setIsApplyModalOpen(false)}
                                        className="px-4 py-2 text-slate-400 hover:text-white font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-indigo-600/20"
                                    >
                                        Submit Request
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Leaves;
