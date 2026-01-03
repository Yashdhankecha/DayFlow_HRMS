import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(loginId, password);
      toast.success('Successfully logged in!');
      
      if (user.isFirstLogin) {
        navigate('/change-password');
      } else {
        // role‑based redirection
        const role = user.role;
        if (role === 'SUPER_ADMIN') {
          navigate('/dashboard/admin');
        } else if (role === 'HR_OFFICER') {
          navigate('/dashboard/hr');
        } else if (role === 'MANAGER') {
          navigate('/dashboard/manager');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to login');
    } finally {
        setIsLoading(false);
    }
  };

  return (

    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-900">
      {/* Left side - Form */}
      <div className="flex items-center justify-center p-8 bg-slate-800 relative">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium text-sm">Back to Home</span>
        </Link>
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-white tracking-tight">Dayflow</h2>
                <p className="mt-2 text-slate-400">Enterprise HR Management System</p>
            </div>


            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                <div>
                    <label className="block text-sm font-medium text-slate-300">Login ID</label>
                    <input 
                        type="text" 
                        required 
                        className="mt-1 block w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        placeholder="e.g. OIJO20240001"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300">Password</label>
                    <input 
                        type="password" 
                        required 
                        className="mt-1 block w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >

                    {isLoading ? 'Authenticating...' : 'Sign in'}
                </button>
            </form>
            
            <div className="text-center text-xs text-slate-500 mt-4">
                Forgot credentials? Contact your System Administrator.
            </div>

        </div>
      </div>

      {/* Right side - Decoration */}
      <div className="hidden md:block relative bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-slate-900 opacity-90"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12 text-white">
            <div className="max-w-lg">
                <blockquote className="text-3xl font-medium leading-relaxed mb-8 text-slate-200">
                    "Streamline your workforce, check attendance, and manage payroll — all in one flow."
                </blockquote>
                <div className="font-bold text-xl text-primary-400">Dayflow HRMS</div>
                <div className="text-slate-500">v1.0.0 Enterprise Edition</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
