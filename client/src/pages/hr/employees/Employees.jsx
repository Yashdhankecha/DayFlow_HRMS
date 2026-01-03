import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Plus, Search, Filter, MoreVertical, 
    Mail, Phone, Calendar, MapPin, TabletSmartphone,
    CheckCircle, XCircle, RefreshCw, User
} from 'lucide-react';
import toast from 'react-hot-toast';

const Employees = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null); // For View Profile Modal
    const [searchQuery, setSearchQuery] = useState('');

    const handleToggleStatus = async (id, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this employee?`)) return;
        try {
            await api.patch(`/employees/${id}/toggle-status`);
            toast.success('Status updated successfully');
            fetchEmployees();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDeleteEmployee = async (id) => {
        if (!window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) return;
        try {
            await api.delete(`/employees/${id}`);
            toast.success('Employee deleted successfully');
            fetchEmployees();
        } catch (error) {
            toast.error('Failed to delete employee');
        }
    };
    
    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        dateOfJoining: '',
        designation: '',
        role: 'EMPLOYEE',
        departmentId: '' 
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const { data } = await api.get('/employees');
            setEmployees(data.data);
            setIsLoading(false);
        } catch (error) {
            toast.error('Failed to load employees');
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/employees', formData);
            // Show new credentials
            toast.success('Employee created successfully');
            if(res.data?.data?.tempPassword) {
                 toast((t) => (
                    <div className="flex flex-col gap-3 min-w-[250px]">
                        <div className="font-medium text-slate-900">New Employee Credentials</div>
                        <div className="bg-slate-100 p-3 rounded-lg text-sm text-slate-800 font-mono">
                             <p>ID: <b>{res.data.data.loginId}</b></p>
                             <p>Pwd: <b>{res.data.data.tempPassword}</b></p>
                        </div>
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    `Login ID: ${res.data.data.loginId}\nPassword: ${res.data.data.tempPassword}`
                                );
                                toast.success('Copied to clipboard!');
                                toast.dismiss(t.id);
                            }}
                            className="w-full bg-indigo-600 text-white px-3 py-2 text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                        >
                            Copy Credentials
                        </button>
                    </div>
                 ), { duration: Infinity });
            }
            setIsAddModalOpen(false);
            fetchEmployees();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create employee');
        }
    };

    const filteredEmployees = employees.filter(emp => 
        emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Employee Directory</h1>
                    <p className="text-slate-400 mt-1">Manage access and profiles for your workforce.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
                >
                    <Plus size={20} />
                    <span>Add Employee</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            {/* Grid View (Mobile First) */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1,2,3].map(i => (
                        <div key={i} className="h-64 bg-slate-900/50 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredEmployees.map((employee) => (
                            <motion.div 
                                key={employee._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all group"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-indigo-900/20">
                                            {employee.firstName[0]}{employee.lastName[0]}
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                            employee.user?.isActive 
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                            {employee.user?.isActive ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-white mb-1">{employee.firstName} {employee.lastName}</h3>
                                    <p className="text-indigo-400 text-sm font-medium mb-4">{employee.designation}</p>
                                    
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-3 text-sm text-slate-400">
                                            <Mail size={16} className="text-slate-600" />
                                            {employee.email}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-400">
                                            <TabletSmartphone size={16} className="text-slate-600" />
                                            {employee.user?.loginId || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="px-6 py-4 bg-slate-950/50 border-t border-slate-800 flex justify-between items-center">
                                    <button 
                                        onClick={() => setSelectedEmployee(employee)}
                                        className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                    >
                                        View Profile
                                    </button>
                                    <div className="flex gap-2">
                                        <button 
                                            title="Toggle Status" 
                                            onClick={() => handleToggleStatus(employee._id, employee.user?.isActive)}
                                            className={`p-2 transition-colors ${employee.user?.isActive ? 'text-green-500 hover:text-green-400' : 'text-red-500 hover:text-red-400'}`}
                                        >
                                            <RefreshCw size={18} />
                                        </button>
                                        <button 
                                            title="Delete Employee" 
                                            onClick={() => handleDeleteEmployee(employee._id)}
                                            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                                        >
                                            <XCircle size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* View Profile Modal */}
            <AnimatePresence>
                {selectedEmployee && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setSelectedEmployee(null)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                        >
                            <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-violet-600">
                                <button 
                                    onClick={() => setSelectedEmployee(null)}
                                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                                >
                                    <XCircle size={20} />
                                </button>
                                <div className="absolute -bottom-12 left-6">
                                    <div className="w-24 h-24 rounded-full bg-slate-900 p-1">
                                        <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-200 border border-slate-700">
                                            {selectedEmployee.firstName[0]}{selectedEmployee.lastName[0]}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-16 pb-8 px-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                                </h2>
                                <p className="text-indigo-400 font-medium">{selectedEmployee.designation}</p>

                                <div className="mt-8 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Login ID</p>
                                            <p className="font-mono text-white">{selectedEmployee.user?.loginId}</p>
                                        </div>
                                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Role</p>
                                            <p className="font-medium text-white">{selectedEmployee.user?.role}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                                            <Mail className="text-slate-500" size={18} />
                                            <div>
                                                <p className="text-xs text-slate-500">Email Address</p>
                                                <p className="text-slate-200">{selectedEmployee.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                                            <Phone className="text-slate-500" size={18} />
                                            <div>
                                                <p className="text-xs text-slate-500">Phone Number</p>
                                                <p className="text-slate-200">{selectedEmployee.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                                            <MapPin className="text-slate-500" size={18} />
                                            <div>
                                                <p className="text-xs text-slate-500">Address</p>
                                                <p className="text-slate-200">{selectedEmployee.address}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                                            <Calendar className="text-slate-500" size={18} />
                                            <div>
                                                <p className="text-xs text-slate-500">Date of Joining</p>
                                                <p className="text-slate-200">{new Date(selectedEmployee.dateOfJoining).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
                                    <button 
                                        onClick={() => setSelectedEmployee(null)}
                                        className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Employee Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsAddModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Add New Employee</h2>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-white">
                                    <XCircle size={24} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">First Name</label>
                                        <input 
                                            name="firstName"
                                            required 
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Last Name</label>
                                        <input 
                                            name="lastName"
                                            required 
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                                        <input 
                                            name="email"
                                            type="email"
                                            required 
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                                        <input 
                                            name="phone"
                                            required 
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Address</label>
                                    <textarea 
                                        name="address"
                                        rows="2"
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Date of Joining</label>
                                        <input 
                                            name="dateOfJoining"
                                            type="date"
                                            required 
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Designation</label>
                                        <input 
                                            name="designation"
                                            required 
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all"
                                    >
                                        Create Employee
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Employees;
