import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Bell, Lock, Globe, Building, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');

    const handleSave = () => {
        toast.success("Settings saved successfully!");
    };

    const tabs = [
        { id: 'general', label: 'General', icon: <Globe size={18} /> },
        { id: 'company', label: 'Company Info', icon: <Building size={18} /> },
        { id: 'roles', label: 'Roles & Permissions', icon: <Users size={18} /> },
        { id: 'security', label: 'Security', icon: <Lock size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
                <p className="text-slate-400 mt-1">Manage system configurations and preferences.</p>
            </div>

            {/* Mobile Tab Select */}
            <div className="md:hidden">
                <select 
                    value={activeTab} 
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none"
                >
                    {tabs.map(tab => <option key={tab.id} value={tab.id}>{tab.label}</option>)}
                </select>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Desktop Sidebar */}
                <div className="hidden md:block w-64 shrink-0 space-y-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                activeTab === tab.id 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                            }`}
                        >
                            {tab.icon}
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
                    {activeTab === 'general' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <h2 className="text-xl font-bold text-white mb-6">General Preferences</h2>
                            
                            <div className="flex items-center justify-between py-4 border-b border-slate-800">
                                <div>
                                    <h3 className="font-medium text-white">Dark Mode</h3>
                                    <p className="text-sm text-slate-500">Enable dark theme across the dashboard</p>
                                </div>
                                <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">System Language</label>
                                    <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-indigo-500">
                                        <option>English (US)</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Timeone</label>
                                    <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-indigo-500">
                                        <option>(GMT-08:00) Pacific Time</option>
                                        <option>(GMT+00:00) UTC</option>
                                        <option>(GMT+05:30) India Standard Time</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'company' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                             <h2 className="text-xl font-bold text-white mb-6">Company Information</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Company Name</label>
                                    <input type="text" defaultValue="DayFlow Inc." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Contact Email</label>
                                    <input type="email" defaultValue="admin@dayflow.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-indigo-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Headquarters Address</label>
                                    <textarea rows="3" defaultValue="123 Tech Park, Silicon Valley, CA" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-indigo-500" />
                                </div>
                             </div>
                        </motion.div>
                    )}

                    {/* Placeholder for other tabs */}
                    {['roles', 'security', 'notifications'].includes(activeTab) && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                            <Lock size={48} className="mb-4 opacity-50" />
                            <h3 className="text-lg font-medium text-white">Restricted Access</h3>
                            <p className="max-w-xs mx-auto mt-2">These settings are currently managed by the Super Admin.</p>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Save Bar */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 bg-slate-900 border border-slate-700 text-white px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl z-50">
                <span className="text-sm font-medium text-slate-300">Unsaved changes</span>
                <button 
                    onClick={handleSave}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-full text-sm font-bold transition-all"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Settings;
