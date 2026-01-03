import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            return toast.error("New passwords don't match");
        }

        if (newPassword.length < 8) {
             return toast.error("Password must be at least 8 characters");
        }
        
        setIsLoading(true);
        try {
            await api.patch('/auth/change-password', {
                currentPassword,
                newPassword
            });
            toast.success('Password changed successfully');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
            <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Change Password</h2>
                    <p className="mt-2 text-slate-400">First login requires a password change.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300">Current Password (Temp)</label>
                        <input
                            type="password"
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-300">New Password</label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300">Confirm New Password</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all"
                    >
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
