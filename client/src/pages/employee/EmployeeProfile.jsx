import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Calendar, Briefcase,
    Building2, CreditCard, Shield, FileText, Lock,
    Pencil, Save, X, Loader
} from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('private');

    // Form state stores the editable values
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await api.get('/employees/profile');
            setProfile(res.data.data);

            // Initialize form data with fetched values
            const data = res.data.data;
            setFormData({
                phone: data.phone || '',
                address: data.address || '',
                location: data.location || '',
                personalEmail: data.personalEmail || '',
                gender: data.gender || '',
                maritalStatus: data.maritalStatus || '',
                nationality: data.nationality || 'Indian',

                // Bank Details
                bankAccountNumber: data.bankAccountNumber || '',
                bankName: data.bankName || '',
                ifscCode: data.ifscCode || '',
                panNumber: data.panNumber || '',
                uanNumber: data.uanNumber || '',
                employeeCode: data.employeeCode || '',

                // Dates (format for input type=date)
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
                dateOfJoining: data.dateOfJoining ? new Date(data.dateOfJoining).toISOString().split('T')[0] : ''
            });
        } catch (error) {
            toast.error('Failed to load profile');
            console.error('Profile fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const loadingToast = toast.loading('Saving profile...');

            // Call API to update profile
            const res = await api.patch('/employees/profile', formData);

            setProfile(res.data.data);
            setIsEditing(false);
            toast.success('Profile updated successfully', { id: loadingToast });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form data to current profile values
        if (profile) {
            setFormData({
                phone: profile.phone || '',
                address: profile.address || '',
                location: profile.location || '',
                personalEmail: profile.personalEmail || '',
                gender: profile.gender || '',
                maritalStatus: profile.maritalStatus || '',
                nationality: profile.nationality || 'Indian',
                bankAccountNumber: profile.bankAccountNumber || '',
                bankName: profile.bankName || '',
                ifscCode: profile.ifscCode || '',
                panNumber: profile.panNumber || '',
                uanNumber: profile.uanNumber || '',
                employeeCode: profile.employeeCode || '',
                dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
                dateOfJoining: profile.dateOfJoining ? new Date(profile.dateOfJoining).toISOString().split('T')[0] : ''
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader className="animate-spin text-primary-500" size={40} />
            </div>
        );
    }

    const tabs = [
        { id: 'resume', label: 'Resume', icon: FileText },
        { id: 'private', label: 'Private Info', icon: User },
        { id: 'salary', label: 'Salary Info', icon: CreditCard },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Page Title & Actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">My Profile</h1>
                    <p className="text-slate-400 mt-1">Manage your personal information</p>
                </div>

                {activeTab === 'private' && (
                    <div>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700 shadow-lg"
                            >
                                <Pencil size={18} />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors shadow-lg shadow-primary-500/20"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Top Profile Section */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-3xl p-8 shadow-xl">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Left: Avatar */}
                    <div className="flex-shrink-0 flex justify-center lg:justify-start">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-slate-700 flex items-center justify-center text-5xl font-bold text-slate-400 shadow-2xl relative overflow-hidden">
                                {profile?.firstName ? (
                                    <span className="bg-clip-text text-transparent bg-gradient-to-br from-primary-400 to-indigo-400">
                                        {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                                    </span>
                                ) : (
                                    <User size={60} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Middle: Basic Info */}
                    <div className="flex-1 space-y-6">
                        <div>
                            <h2 className="text-4xl font-bold text-white tracking-tight">
                                {profile?.firstName} {profile?.lastName}
                            </h2>
                            <p className="text-xl text-primary-400 font-medium mt-1">
                                {profile?.designation || 'Employee'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            <ProfileField
                                label="Email"
                                value={profile?.email}
                                icon={Mail}
                                readOnly={true}
                            />
                            <ProfileField
                                label="Mobile"
                                name="phone"
                                value={isEditing ? formData.phone : profile?.phone}
                                icon={Phone}
                                isEditing={isEditing}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Right: Work Details Grid */}
                    <div className="flex-1 border-l border-slate-800 pl-0 lg:pl-10">
                        <div className="grid grid-cols-1 gap-6">
                            <ProfileField label="Company" value="DayFlow Tech" readOnly={true} />
                            <ProfileField label="Department" value={profile?.department?.name} readOnly={true} />

                            <ProfileField
                                label="Location"
                                name="location"
                                value={isEditing ? formData.location : profile?.location}
                                isEditing={isEditing}
                                onChange={handleChange}
                            />

                            <ProfileField label="Manager" value={profile?.manager ? `${profile.manager.firstName} ${profile.manager.lastName}` : 'Not Assigned'} readOnly={true} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-slate-800 flex gap-8">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            pb-4 px-2 text-sm font-medium transition-all relative flex items-center gap-2
                            ${activeTab === tab.id ? 'text-primary-400' : 'text-slate-400 hover:text-slate-200'}
                        `}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'private' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Personal Details Method */}
                            <SectionCard title="Personal Details">
                                <FieldRow
                                    label="Date of Birth"
                                    name="dateOfBirth"
                                    value={isEditing ? formData.dateOfBirth : formatDate(profile?.dateOfBirth)}
                                    type="date"
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                />
                                <FieldRow
                                    label="Residing Address"
                                    name="address"
                                    value={isEditing ? formData.address : profile?.address}
                                    textarea
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                />
                                <FieldRow
                                    label="Nationality"
                                    name="nationality"
                                    value={isEditing ? formData.nationality : profile?.nationality}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                />
                                <FieldRow
                                    label="Personal Email"
                                    name="personalEmail"
                                    value={isEditing ? formData.personalEmail : profile?.personalEmail}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                />

                                <SelectRow
                                    label="Gender"
                                    name="gender"
                                    value={isEditing ? formData.gender : profile?.gender}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                    options={['Male', 'Female', 'Other', 'Prefer not to say']}
                                />

                                <SelectRow
                                    label="Marital Status"
                                    name="maritalStatus"
                                    value={isEditing ? formData.maritalStatus : profile?.maritalStatus}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                    options={['Single', 'Married', 'Divorced', 'Widowed']}
                                />

                                <FieldRow
                                    label="Date of Joining"
                                    name="dateOfJoining"
                                    value={formatDate(profile?.dateOfJoining)}
                                    readOnly={true} // Usually can't edit DOJ
                                />
                            </SectionCard>

                            {/* Bank Details */}
                            <SectionCard title="Bank Details">
                                <FieldRow
                                    label="Account Number"
                                    name="bankAccountNumber"
                                    value={isEditing ? formData.bankAccountNumber : profile?.bankAccountNumber}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                />
                                <FieldRow
                                    label="Bank Name"
                                    name="bankName"
                                    value={isEditing ? formData.bankName : profile?.bankName}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                />
                                <FieldRow
                                    label="IFSC Code"
                                    name="ifscCode"
                                    value={isEditing ? formData.ifscCode : profile?.ifscCode}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                />
                                <FieldRow
                                    label="PAN No"
                                    name="panNumber"
                                    value={isEditing ? formData.panNumber : profile?.panNumber}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                />
                                <FieldRow
                                    label="UAN No"
                                    name="uanNumber"
                                    value={isEditing ? formData.uanNumber : profile?.uanNumber}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                />
                                <FieldRow
                                    label="Emp Code"
                                    name="employeeCode"
                                    value={isEditing ? formData.employeeCode : profile?.employeeCode}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                />
                            </SectionCard>
                        </div>
                    )}

                    {activeTab === 'resume' && (
                        <EmptyState
                            icon={FileText}
                            title="Resume"
                            description="Resume details and documents will appear here."
                        />
                    )}

                    {activeTab === 'salary' && (
                        <EmptyState
                            icon={CreditCard}
                            title="Salary Information"
                            description="Salary structure, payslips and tax documents."
                        />
                    )}

                    {activeTab === 'security' && (
                        <EmptyState
                            icon={Shield}
                            title="Security Settings"
                            description="Password, 2FA and login activity logs."
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// Helper Components

const ProfileField = ({ label, value, icon: Icon, isEditing, onChange, name, readOnly }) => (
    <div className="relative group">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
            {label}
        </label>
        {isEditing && !readOnly ? (
            <input
                type="text"
                name={name}
                value={value || ''}
                onChange={onChange}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all font-medium"
            />
        ) : (
            <div className="text-slate-300 font-medium text-lg flex items-center gap-2 pb-2 border-b-2 border-slate-800 group-hover:border-slate-700 transition-colors">
                {Icon && <Icon size={16} className="text-primary-500" />}
                {value || <span className="text-slate-600 italic">Not set</span>}
            </div>
        )}
    </div>
);

const SectionCard = ({ title, children }) => (
    <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-400 border-b border-slate-800 pb-2 uppercase tracking-wide">{title}</h3>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

const FieldRow = ({ label, value, textarea, isEditing, onChange, name, type = "text", readOnly }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <label className="text-slate-400 font-medium text-sm md:text-right">
            {label}
        </label>
        <div className="md:col-span-2">
            {isEditing && !readOnly ? (
                textarea ? (
                    <textarea
                        name={name}
                        value={value || ''}
                        onChange={onChange}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all min-h-[60px]"
                    />
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={value || ''}
                        onChange={onChange}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all"
                    />
                )
            ) : (
                <div className={`w-full bg-transparent border-b border-slate-700 text-white py-2 flex items-center ${textarea ? 'min-h-[60px] whitespace-pre-wrap' : ''}`}>
                    {value || <span className="text-slate-600">-</span>}
                </div>
            )}
        </div>
    </div>
);

const SelectRow = ({ label, value, isEditing, onChange, name, options }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <label className="text-slate-400 font-medium text-sm md:text-right">
            {label}
        </label>
        <div className="md:col-span-2">
            {isEditing ? (
                <select
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all appearance-none"
                >
                    <option value="">Select {label}</option>
                    {options.map(opt => (
                        <option key={opt} value={opt} className="bg-slate-800">{opt}</option>
                    ))}
                </select>
            ) : (
                <div className="w-full bg-transparent border-b border-slate-700 text-white py-2 flex items-center">
                    {value || <span className="text-slate-600">-</span>}
                </div>
            )}
        </div>
    </div>
);

const EmptyState = ({ icon: Icon, title, description }) => (
    <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800/50 border-dashed">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Icon size={32} className="text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400">{description}</p>
    </div>
);

const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export default EmployeeProfile;
