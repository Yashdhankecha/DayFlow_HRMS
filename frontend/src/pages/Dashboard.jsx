import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
         <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500">Welcome back, here's what's happening.</p>
         </div>
         <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all">
            New Project
         </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
            { label: 'Total Projects', value: '12', color: 'from-blue-500 to-cyan-500' },
            { label: 'Active Users', value: '2,300', color: 'from-purple-500 to-pink-500' },
            { label: 'Revenue', value: '$45.2k', color: 'from-orange-500 to-red-500' }
        ].map((stat, idx) => (
             <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group"
             >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150`}></div>
                <p className="text-slate-500 text-sm font-medium relative z-10">{stat.label}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2 relative z-10">{stat.value}</h3>
             </motion.div>
        ))}
      </div>

        {/* Role Based Content */}
        {user?.role === 'ADMIN' ? (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Admin Controls</h3>
                <div className="h-64 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400">
                    Admin Analytics Placeholder
                </div>
            </div>
        ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                 <h3 className="text-lg font-bold text-slate-900 mb-4">My Projects</h3>
                 <div className="h-64 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400">
                    User Projects Placeholder
                 </div>
            </div>
        )}
    </div>
  );
};

export default Dashboard;
