import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Building, Upload, ArrowRight, CheckCircle, Mail, User, Phone, Lock, Briefcase, FileText } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Success State
    const [successData, setSuccessData] = useState(null);

    const [formData, setFormData] = useState({
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords don't match");
        }

        if (formData.password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/signup', {
                companyName: formData.companyName,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });

            // On success, show the generated ID
            setSuccessData(res.data.data.user);
            toast.success('Account created successfully!');
            
            // Optional: Auto login logic if you prefer
            // login(res.data.data.user, res.data.accessToken); 

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    // If successfully signed up, show the ID card
    if (successData) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black"></div>
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full text-center relative z-10 shadow-2xl"
                >
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-400" size={40} />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Aboard!</h2>
                    <p className="text-slate-400 mb-8">Your HR Admin account has been created.</p>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 mb-8 text-left">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-4 tracking-wider">Your System Credentials</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400">Login ID (System Generated)</label>
                                <div className="text-xl font-mono text-white font-bold tracking-wide bg-slate-900 p-2 rounded border border-slate-800 mt-1">
                                    {successData.loginId}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">Password</label>
                                <div className="text-sm text-slate-300 mt-1">
                                    •••••••• (Set by you)
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/login')}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                    >
                        Proceed to Login <ArrowRight size={20} />
                    </button>
                    
                    <p className="text-xs text-slate-500 mt-4">Safe keep your Login ID. You will need it to sign in.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-auto custom-scrollbar">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-black pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-10 relative z-10 shadow-2xl"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Building className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Create HR Account</h1>
                    <p className="text-slate-400">Set up your workspace and start managing.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Company Section */}
                    <div className="space-y-4 pt-2">
                         <div className="grid grid-cols-[1fr,auto] gap-3 items-end">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Company Name</label>
                                <div className="relative">
                                    <input 
                                        name="companyName"
                                        required
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 pl-11 py-3.5 text-slate-200 outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                                        placeholder="e.g. DayFlow Corp"
                                    />
                                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                </div>
                            </div>
                            <div>
                                <button type="button" className="w-[50px] h-[50px] bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-indigo-500 hover:bg-slate-800 hover:text-indigo-400 transition-colors" title="Upload Logo (Coming Soon)">
                                    <Upload size={20} />
                                </button>
                            </div>
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">First Name</label>
                            <input 
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Last Name</label>
                            <input 
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative">
                            <input 
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 pl-11 py-3.5 text-slate-200 outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                                placeholder="name@company.com"
                            />
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Phone</label>
                        <div className="relative">
                            <input 
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 pl-11 py-3.5 text-slate-200 outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                                placeholder="+91 98765 43210"
                            />
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative">
                                <input 
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                         <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Confirm</label>
                            <div className="relative">
                                <input 
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all transform active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                    
                    <p className="text-center text-slate-500 text-sm mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                            Sign In
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Signup;
