import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Building, User, Mail, Phone, CreditCard, Pencil, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('private');
    const [loading, setLoading] = useState(false);
    
    // Data States
    const [profileData, setProfileData] = useState({});
    const [companyData, setCompanyData] = useState({});
    
    useEffect(() => {
        fetchProfile();
        fetchCompany();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await api.get('/employees/profile');
            setProfileData(res.data.data || {});
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompany = async () => {
        try {
            const res = await api.get('/company');
            setCompanyData(res.data.data || {});
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            if (activeTab === 'company') {
                await api.patch('/company', companyData);
                toast.success('Company settings updated');
            } else {
                await api.patch('/employees/profile', profileData);
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to save changes');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCompanyChange = (e) => {
        const { name, value } = e.target;
        setCompanyData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const TabButton = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`
                relative px-6 py-4 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap
                ${activeTab === id ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'}
            `}
        >
            {icon}
            {label}
            {activeTab === id && (
                <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"
                />
            )}
        </button>
    );

    const Field = ({ label, name, value, onChange, type = "text", placeholder, disabled = false, fullWidth = false }) => (
        <div className={`space-y-1.5 ${fullWidth ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">{label}</label>
            <input 
                type={type}
                name={name}
                value={value || ''}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className="w-full bg-slate-950 border-b border-slate-700 rounded-t-lg px-4 py-3 text-slate-200 focus:border-indigo-500 focus:bg-slate-900/50 outline-none transition-all placeholder:text-slate-600 disabled:opacity-60 disabled:cursor-not-allowed"
            />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-24">
            {/* Header Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Avatar */}
                    <div className="relative group shrink-0 mx-auto md:mx-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-4xl font-bold text-slate-400 overflow-hidden shadow-2xl">
                            {profileData.firstName?.[0] || user?.name?.[0]}
                        </div>
                        <button className="absolute bottom-2 right-2 p-2 bg-indigo-600 rounded-full text-white shadow-lg hover:bg-indigo-500 transition-colors">
                            <span className="sr-only">Edit Picture</span>
                            <Pencil size={16} /> 
                        </button>
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Middle: Name & Basic Contact */}
                        <div className="md:col-span-5 space-y-6 text-center md:text-left">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{profileData.firstName || 'User'} {profileData.lastName || 'Name'}</h1>
                                <p className="text-lg text-indigo-400 font-medium">{profileData.designation || 'Human Resources'}</p>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center justify-center md:justify-start gap-3 text-slate-400">
                                    <div className="p-2 bg-slate-800 rounded-lg"><Mail size={16}/></div>
                                    <span className="text-sm">{profileData.email || 'email@example.com'}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-3 text-slate-400">
                                    <div className="p-2 bg-slate-800 rounded-lg"><Phone size={16}/></div>
                                    <span className="text-sm">{profileData.phone || 'Not Set'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Work Details */}
                        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-2 md:border-l md:border-slate-800 md:pl-8">
                            <div className="space-y-1">
                                <span className="text-xs text-slate-500 uppercase font-semibold">Company</span>
                                <p className="text-slate-200 font-medium truncate">{companyData.name || 'DayFlow Systems'}</p>
                                <div className="h-px bg-slate-800 mt-2"/>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-slate-500 uppercase font-semibold">Department</span>
                                <p className="text-slate-200 font-medium truncate">{profileData.department?.name || 'HR Department'}</p>
                                <div className="h-px bg-slate-800 mt-2"/>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-slate-500 uppercase font-semibold">Manager</span>
                                <p className="text-slate-200 font-medium truncate">{profileData.manager?.firstName || 'Direct Report'}</p>
                                <div className="h-px bg-slate-800 mt-2"/>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-slate-500 uppercase font-semibold">Location</span>
                                <p className="text-slate-200 font-medium truncate">{profileData.location || 'Head Office'}</p>
                                <div className="h-px bg-slate-800 mt-2"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-30 flex overflow-x-auto custom-scrollbar rounded-xl">
                 <TabButton id="private" label="Private Info" icon={<User size={16}/>} />
                 <TabButton id="salary" label="Salary Info" icon={<DollarSign size={16}/>} />
                 <TabButton id="company" label="Organization" icon={<Building size={16}/>} />
            </div>

            {/* Main Content Area */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-lg min-h-[500px]"
            >
                {activeTab === 'private' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Personal Info Column */}
                        <div className="space-y-8">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                                <User className="text-indigo-500" size={20}/>
                                Personal Details
                            </h3>
                            <div className="grid grid-cols-1 gap-6">
                                <Field label="Date of Birth" name="dateOfBirth" type="date" value={profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : ''} onChange={handleChange} />
                                <Field label="Residing Address" name="address" fullWidth value={profileData.address} onChange={handleChange} />
                                <Field label="Nationality" name="nationality" value={profileData.nationality} placeholder="e.g. Indian" onChange={handleChange} />
                                <Field label="Personal Email" name="personalEmail" type="email" value={profileData.personalEmail} onChange={handleChange} />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Gender</label>
                                        <select 
                                            name="gender" 
                                            value={profileData.gender || ''}
                                            onChange={handleChange}
                                            className="w-full bg-slate-950 border-b border-slate-700 rounded-t-lg px-4 py-3 text-slate-200 focus:border-indigo-500 outline-none cursor-pointer"
                                        >
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Marital Status</label>
                                        <select 
                                            name="maritalStatus" 
                                            value={profileData.maritalStatus || ''}
                                            onChange={handleChange}
                                            className="w-full bg-slate-950 border-b border-slate-700 rounded-t-lg px-4 py-3 text-slate-200 focus:border-indigo-500 outline-none cursor-pointer"
                                        >
                                            <option value="">Select</option>
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                            <option value="Divorced">Divorced</option>
                                        </select>
                                    </div>
                                </div>
                                <Field label="Date of Joining" name="dateOfJoining" type="date" value={profileData.dateOfJoining ? new Date(profileData.dateOfJoining).toISOString().split('T')[0] : ''} disabled />
                            </div>
                        </div>

                        {/* Bank Details Column */}
                        <div className="space-y-8">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                                <CreditCard className="text-indigo-500" size={20}/>
                                Bank & Work Details
                            </h3>
                            <div className="grid grid-cols-1 gap-6">
                                <Field label="Account Number" name="bankAccountNumber" value={profileData.bankAccountNumber} onChange={handleChange} />
                                <Field label="Bank Name" name="bankName" value={profileData.bankName} onChange={handleChange} />
                                <Field label="IFSC Code" name="ifscCode" value={profileData.ifscCode} onChange={handleChange} />
                                <Field label="PAN Number" name="panNumber" value={profileData.panNumber} onChange={handleChange} />
                                <Field label="UAN Number" name="uanNumber" value={profileData.uanNumber} onChange={handleChange} />
                                <Field label="Employee Code" name="employeeCode" value={profileData.employeeCode} placeholder="Auto-generated if empty" onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'company' && (
                    <div className="space-y-8">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                            <Building className="text-indigo-500" size={20}/>
                            Organization Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Company Name" name="name" value={companyData.name} onChange={handleCompanyChange} />
                            <Field label="Contact Email" name="email" value={companyData.email} onChange={handleCompanyChange} />
                            <Field label="Phone" name="phone" value={companyData.phone} onChange={handleCompanyChange} />
                            <Field label="Website" name="website" value={companyData.website} onChange={handleCompanyChange} />
                            <Field label="Headquarters Address" name="address" fullWidth value={companyData.address} onChange={handleCompanyChange} />
                            <Field label="Tax ID / CIN" name="taxId" value={companyData.taxId} onChange={handleCompanyChange} />
                            <Field label="Founded Year" name="foundedYear" value={companyData.foundedYear} onChange={handleCompanyChange} />
                        </div>
                    </div>
                )}

                {activeTab === 'salary' && (
                    <div className="space-y-8">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                            <DollarSign className="text-indigo-500" size={20}/>
                            Compensation Structure
                        </h3>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Summary Card */}
                            <div className="lg:col-span-1 bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-2xl p-6 border border-indigo-500/30 text-center relative overflow-hidden flex flex-col justify-center min-h-[200px]">
                                <div className="relative z-10">
                                    <p className="text-indigo-200 text-sm font-medium mb-1">Gross Annual Salary</p>
                                    <h2 className="text-3xl font-bold text-white">
                                        ₹ {((
                                            (Number(profileData.salaryStructure?.basicSalary) || 0) +
                                            (Number(profileData.salaryStructure?.hra) || 0) + 
                                            (Number(profileData.salaryStructure?.specialAllowance) || 0) + 
                                            (Number(profileData.salaryStructure?.otherAllowances) || 0)
                                        ) * 12).toLocaleString()}
                                    </h2>
                                    <p className="text-xs text-indigo-400 mt-2">Estimated based on monthly earnings</p>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -ml-16 -mb-16"></div>
                            </div>

                            {/* Detailed Breakdown */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="bg-slate-950 rounded-xl p-6 border border-slate-800">
                                    <h4 className="text-white font-medium mb-4 flex justify-between items-center">
                                        <span>Monthly Earnings</span>
                                        <span className="text-slate-500 text-xs uppercase font-semibold">Amount (INR)</span>
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm group">
                                            <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Basic Salary</span>
                                            <span className="text-slate-200 font-mono">₹ {Number(profileData.salaryStructure?.basicSalary || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm group">
                                            <span className="text-slate-400 group-hover:text-slate-300 transition-colors">House Rent Allowance (HRA)</span>
                                            <span className="text-slate-200 font-mono">₹ {Number(profileData.salaryStructure?.hra || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm group">
                                            <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Special Allowance</span>
                                            <span className="text-slate-200 font-mono">₹ {Number(profileData.salaryStructure?.specialAllowance || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm group">
                                            <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Other Allowances</span>
                                            <span className="text-slate-200 font-mono">₹ {Number(profileData.salaryStructure?.otherAllowances || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="h-px bg-slate-800 my-2"></div>
                                        <div className="flex justify-between font-bold text-white text-lg">
                                            <span>Gross Monthly Salary</span>
                                            <span>₹ {(
                                                (Number(profileData.salaryStructure?.basicSalary) || 0) +
                                                (Number(profileData.salaryStructure?.hra) || 0) + 
                                                (Number(profileData.salaryStructure?.specialAllowance) || 0) + 
                                                (Number(profileData.salaryStructure?.otherAllowances) || 0)
                                            ).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex gap-4 items-center">
                                    <div className="p-3 bg-indigo-500/10 rounded-lg shrink-0">
                                        <CreditCard className="text-indigo-400" size={24} />
                                    </div>
                                    <div>
                                        <h5 className="text-white font-medium text-sm">Disbursement Account</h5>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Funds credited to 
                                            <span className="text-slate-200 font-medium mx-1">{profileData.bankName || 'Bank'}</span> 
                                            • {profileData.bankAccountNumber ? `•••• ${profileData.bankAccountNumber.slice(-4)}` : 'Not Linked'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Save Button */}
            <div className="fixed bottom-6 right-6 z-40">
                <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save size={20} />
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};

export default Settings;
