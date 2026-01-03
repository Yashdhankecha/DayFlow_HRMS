import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // Default role
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(name, email, password, role);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">Create Account</h2>
            <p className="mt-2 text-sm text-slate-600">Start building your project today</p>
        </div>
        


        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Full Name</label>
                    <input 
                        type="text" 
                        required 
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outlined-none transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Email address</label>
                    <input 
                        type="email" 
                        required 
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outlined-none transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    <input 
                        type="password" 
                        required 
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outlined-none transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
                <div>
                     <label className="block text-sm font-medium text-slate-700">Role (Demo Purpose)</label>
                     <select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outlined-none bg-white"
                     >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                     </select>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all font-bold shadow-lg shadow-primary-500/30"
            >
                {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
        </form>
        <div className="text-center">
             <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                Already have an account? Sign in
             </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
