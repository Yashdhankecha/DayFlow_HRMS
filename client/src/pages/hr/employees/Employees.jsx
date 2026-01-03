import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Plus, Search, Filter, MoreVertical, 
    Mail, Phone, Calendar, MapPin, TabletSmartphone,
    CheckCircle, XCircle, RefreshCw, User, Briefcase, DollarSign, FolderOpen, FileText, Plane
} from 'lucide-react';
import toast from 'react-hot-toast';

const Employees = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null); // For View Profile Modal
    const [viewTab, setViewTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    // Reset edit state when modal closes or employee changes
    useEffect(() => {
        if (selectedEmployee) {
            setEditFormData(JSON.parse(JSON.stringify(selectedEmployee))); // Deep copy
        } else {
            setIsEditing(false);
            setEditFormData({});
        }
    }, [selectedEmployee]);

    const handleUpdateEmployee = async () => {
        try {
            const res = await api.patch(`/employees/${selectedEmployee._id}`, editFormData);
            
            // Update local state
            setSelectedEmployee(res.data.data);
            setEmployees(prev => prev.map(emp => emp._id === res.data.data._id ? res.data.data : emp));
            setIsEditing(false);
            toast.success('Employee profile updated successfully');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleSalaryChange = (field, value) => {
        setEditFormData(prev => ({
            ...prev,
            salaryStructure: {
                ...prev.salaryStructure,
                [field]: value
            }
        }));
    };

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
        dateOfJoining: new Date().toISOString().split('T')[0],
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
                                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all group relative"
                            >
                                {/* Attendance Status Indicator - Top Right */}
                                <div className="absolute top-4 right-4 z-20 p-1.5 bg-slate-950/80 backdrop-blur-md rounded-full border border-slate-800 shadow-lg" title={`Status: ${employee.todayStatus || 'Absent'}`}>
                                    {['Present', 'Late', 'Half-Day'].includes(employee.todayStatus) && (
                                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></div>
                                    )}
                                    {employee.todayStatus === 'On Leave' && (
                                        <Plane className="text-blue-400 -rotate-45" size={14} />
                                    )}
                                    {(!employee.todayStatus || employee.todayStatus === 'Absent') && (
                                        <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.8)]"></div>
                                    )}
                                </div>

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
                            onClick={() => { setSelectedEmployee(null); setViewTab('overview'); }}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Left Sidebar */}
                            <div className="w-full md:w-64 bg-slate-950/50 border-r border-slate-800 flex flex-col">
                                <div className="p-6 border-b border-slate-800 flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg shadow-indigo-500/20">
                                        {selectedEmployee.firstName[0]}{selectedEmployee.lastName[0]}
                                    </div>
                                    <h2 className="font-bold text-white truncate max-w-full">
                                        {selectedEmployee.firstName} {selectedEmployee.lastName}
                                    </h2>
                                    <p className="text-xs text-indigo-400 mt-1 truncate">{selectedEmployee.designation}</p>
                                    <div className={`mt-3 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                        selectedEmployee.user?.isActive 
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>
                                        {selectedEmployee.user?.isActive ? 'ACTIVE EMPLOYEE' : 'INACTIVE'}
                                    </div>
                                </div>
                                <div className="p-4 space-y-1 flex-1 overflow-y-auto">
                                    {[
                                        { id: 'overview', icon: User, label: 'Personal Details' },
                                        { id: 'job', icon: Briefcase, label: 'Job Details' },
                                        { id: 'salary', icon: DollarSign, label: 'Salary Structure' },
                                        { id: 'documents', icon: FolderOpen, label: 'Documents' }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setViewTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                                viewTab === tab.id 
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                            }`}
                                        >
                                            <tab.icon size={18} />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right Content */}
                            <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
                                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-white capitalize">
                                        {viewTab.replace('-', ' ')}
                                    </h3>
                                    <button 
                                        onClick={() => { setSelectedEmployee(null); setViewTab('overview'); }}
                                        className="text-slate-500 hover:text-white transition-colors"
                                    >
                                        <XCircle size={24} />
                                    </button>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto p-6">
                                    {viewTab === 'overview' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">First Name</label>
                                                    {isEditing ? (
                                                        <input 
                                                            value={editFormData.firstName || ''}
                                                            onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                                                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                                                        />
                                                    ) : (
                                                        <p className="text-slate-200">{selectedEmployee.firstName}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Last Name</label>
                                                    {isEditing ? (
                                                        <input 
                                                            value={editFormData.lastName || ''}
                                                            onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                                                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                                                        />
                                                    ) : (
                                                        <p className="text-slate-200">{selectedEmployee.lastName}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
                                                    {isEditing ? (
                                                        <input 
                                                            value={editFormData.email || ''}
                                                            onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                                                        />
                                                    ) : (
                                                        <p className="text-slate-200 break-all">{selectedEmployee.email}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Phone Number</label>
                                                    {isEditing ? (
                                                        <input 
                                                            value={editFormData.phone || ''}
                                                            onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                                                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                                                        />
                                                    ) : (
                                                        <p className="text-slate-200">{selectedEmployee.phone}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Address</label>
                                                    {isEditing ? (
                                                        <input 
                                                            value={editFormData.address || ''}
                                                            onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                                                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                                                        />
                                                    ) : (
                                                        <p className="text-slate-200">{selectedEmployee.address}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Nationality</label>
                                                    <p className="text-slate-200">Indian</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {viewTab === 'job' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Employee ID (Login ID)</label>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                                                            {selectedEmployee.user?.loginId}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Designation</label>
                                                    {isEditing ? (
                                                        <input 
                                                            value={editFormData.designation || ''}
                                                            onChange={(e) => setEditFormData({...editFormData, designation: e.target.value})}
                                                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                                                        />
                                                    ) : (
                                                        <p className="text-slate-200">{selectedEmployee.designation}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Department</label>
                                                    <p className="text-slate-200">{selectedEmployee.department?.name || 'Unassigned'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Date of Joining</label>
                                                    {isEditing ? (
                                                        <input 
                                                            type="date"
                                                            value={editFormData.dateOfJoining ? new Date(editFormData.dateOfJoining).toISOString().split('T')[0] : ''}
                                                            onChange={(e) => setEditFormData({...editFormData, dateOfJoining: e.target.value})}
                                                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                                                        />
                                                    ) : (
                                                        <p className="text-slate-200">{new Date(selectedEmployee.dateOfJoining).toLocaleDateString()}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Employment Type</label>
                                                    <p className="text-slate-200">Full Time</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase">Shift Timing</label>
                                                    <p className="text-slate-200">9:00 AM - 6:00 PM</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {viewTab === 'salary' && (
                                        <div className="space-y-6">
                                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="text-sm font-bold text-white">Current Salary Structure</h4>
                                                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">Effective: {new Date().getFullYear()}</span>
                                                </div>
                                                
                                                {(() => {
                                                    const structure = isEditing ? (editFormData.salaryStructure || {}) : (selectedEmployee.salaryStructure || {});
                                                    const gross = (Number(structure.basicSalary) || 0) + 
                                                                  (Number(structure.hra) || 0) + 
                                                                  (Number(structure.specialAllowance) || 0) + 
                                                                  (Number(structure.otherAllowances) || 0);
                                                    
                                                    return (
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center text-sm">
                                                                <span className="text-slate-400">Basic Salary</span>
                                                                {isEditing ? (
                                                                    <input 
                                                                        type="number"
                                                                        value={structure.basicSalary || 0}
                                                                        onChange={(e) => handleSalaryChange('basicSalary', Number(e.target.value))}
                                                                        className="w-32 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-right font-mono text-sm"
                                                                    />
                                                                ) : (
                                                                    <span className="text-slate-200 font-mono">₹ {structure.basicSalary || 0}</span>
                                                                )}
                                                            </div>
                                                            <div className="flex justify-between items-center text-sm">
                                                                <span className="text-slate-400">HRA</span>
                                                                {isEditing ? (
                                                                    <input 
                                                                        type="number"
                                                                        value={structure.hra || 0}
                                                                        onChange={(e) => handleSalaryChange('hra', Number(e.target.value))}
                                                                        className="w-32 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-right font-mono text-sm"
                                                                    />
                                                                ) : (
                                                                    <span className="text-slate-200 font-mono">₹ {structure.hra || 0}</span>
                                                                )}
                                                            </div>
                                                            <div className="flex justify-between items-center text-sm">
                                                                <span className="text-slate-400">Special Allowance</span>
                                                                {isEditing ? (
                                                                    <input 
                                                                        type="number"
                                                                        value={structure.specialAllowance || 0}
                                                                        onChange={(e) => handleSalaryChange('specialAllowance', Number(e.target.value))}
                                                                        className="w-32 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-right font-mono text-sm"
                                                                    />
                                                                ) : (
                                                                    <span className="text-slate-200 font-mono">₹ {structure.specialAllowance || 0}</span>
                                                                )}
                                                            </div>
                                                            <div className="flex justify-between items-center text-sm">
                                                                <span className="text-slate-400">Other Allowances</span>
                                                                {isEditing ? (
                                                                    <input 
                                                                        type="number"
                                                                        value={structure.otherAllowances || 0}
                                                                        onChange={(e) => handleSalaryChange('otherAllowances', Number(e.target.value))}
                                                                        className="w-32 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-right font-mono text-sm"
                                                                    />
                                                                ) : (
                                                                    <span className="text-slate-200 font-mono">₹ {structure.otherAllowances || 0}</span>
                                                                )}
                                                            </div>

                                                            <div className="h-px bg-slate-800 my-2"></div>
                                                            
                                                            <div className="flex justify-between text-sm font-bold">
                                                                <span className="text-white">Gross Salary</span>
                                                                <span className="text-green-400 font-mono">₹ {gross} / month</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    )}

                                    {viewTab === 'documents' && (
                                        <div className="space-y-4">
                                            {['Resume/CV', 'Offer Letter', 'ID Proof (Aadhar)', 'PAN Card', 'Education Certificates'].map((doc, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-slate-900 rounded-lg text-slate-500">
                                                            <FileText size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-200">{doc}</p>
                                                            <p className="text-xs text-slate-500">Not uploaded</p>
                                                        </div>
                                                    </div>
                                                    <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-500/10 transition-colors">
                                                        Upload
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-auto p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900">
                                    {isEditing ? (
                                        <>
                                            <button 
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={handleUpdateEmployee}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors flex items-center gap-2"
                                            >
                                                <CheckCircle size={18} />
                                                Save Changes
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={() => setIsEditing(true)}
                                                className="px-4 py-2 text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/10 transition-colors"
                                            >
                                                Edit Profile
                                            </button>
                                            <button 
                                                onClick={() => setSelectedEmployee(null)}
                                                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                                            >
                                                Close
                                            </button>
                                        </>
                                    )}
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
