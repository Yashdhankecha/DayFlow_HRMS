import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Filter, Plus, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const Leaves = () => {
    const { user } = useAuth();
    const isHR = user?.role === 'HR_OFFICER' || user?.role === 'SUPER_ADMIN';

    const [allLeaves, setAllLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState({ open: false, id: null, status: null });
    const [comment, setComment] = useState('');

    useEffect(() => {
        fetchAllLeaves();
    }, []);

    const fetchAllLeaves = async () => {
        try {
            setLoading(true);
            const res = await api.get('/leaves/all');
            setAllLeaves(res.data.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load leave requests');
        } finally {
            setLoading(false);
        }
    };

    const handleActionClick = (id, status) => {
        setConfirmModal({ open: true, id, status });
        setComment('');
    };

    const handleConfirmAction = async () => {
        try {
            await api.patch(`/leaves/${confirmModal.id}/status`, { 
                status: confirmModal.status,
                comments: comment 
            });
            toast.success(`Leave ${confirmModal.status} successfully`);
            setConfirmModal({ open: false, id: null, status: null });
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
                    <p className="text-slate-400 mt-1">Review and manage employee leave requests.</p>
                </div>
            </div>

            {/* List Content */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6 min-h-[400px]">
                {loading ? <p className="text-slate-500">Loading requests...</p> : (
                    <div className="space-y-4">
                         {allLeaves.length === 0 ? <p className="text-slate-500 text-center py-8">No leave requests found.</p> :
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
                                                    {leave.type || leave.leaveType}
                                                </span>
                                                <span>•</span>
                                                <span className="font-medium text-slate-300">
                                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800/50 italic">
                                                "{leave.reason}"
                                            </p>
                                            {leave.comments && (
                                                <p className="text-xs text-indigo-400 mt-2 pl-2 border-l-2 border-indigo-500/30">
                                                    <span className="font-semibold">HR Comment:</span> {leave.comments}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        {leave.status === 'PENDING' || leave.status === 'Pending' ? (
                                            <>
                                                <button 
                                                    onClick={() => handleActionClick(leave._id, 'APPROVED')}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-all text-sm font-medium"
                                                >
                                                    <CheckCircle size={14} /> Approve
                                                </button>
                                                <button 
                                                    onClick={() => handleActionClick(leave._id, 'REJECTED')}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all text-sm font-medium"
                                                >
                                                    <XCircle size={14} /> Reject
                                                </button>
                                            </>
                                        ) : (
                                            <span className={`text-sm font-medium px-3 py-1 rounded-full border ${
                                                leave.status === 'APPROVED' || leave.status === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                                {leave.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                         }
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirmModal.open && (
                     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setConfirmModal({ open: false, id: null, status: null })}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6"
                        >
                            <h3 className="text-xl font-bold text-white mb-2">
                                Confirm {confirmModal.status === 'APPROVED' ? 'Approval' : 'Rejection'}
                            </h3>
                            <p className="text-slate-400 text-sm mb-4">
                                Are you sure you want to {confirmModal.status?.toLowerCase()} this request? This action implies a decision has been made.
                            </p>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-400 mb-1">Add a Comment (Optional)</label>
                                <textarea 
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder=" e.g. 'Approved based on policy' or 'Insufficient leave balance'"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-24 resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button 
                                    onClick={() => setConfirmModal({ open: false, id: null, status: null })}
                                    className="px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleConfirmAction}
                                    className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${
                                        confirmModal.status === 'APPROVED' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'
                                    }`}
                                >
                                    Confirm {confirmModal.status === 'APPROVED' ? 'Approve' : 'Reject'}
                                </button>
                            </div>
                        </motion.div>
                     </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Leaves;
