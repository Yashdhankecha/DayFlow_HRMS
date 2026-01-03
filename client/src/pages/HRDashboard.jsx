import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Users, CalendarDays, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const HRDashboard = () => {
  const { user } = useAuth();
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">HR Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back, {user?.name?.split(' ')[0]}.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard/employees" className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 border border-slate-700">
            <Users size={18} /> Manage Staff
          </Link>
        </div>
      </div>
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[{ label: 'Pending Leaves', value: '12', icon: <CalendarDays size={24} />, color: 'text-orange-400', bg: 'bg-orange-400/10' },
          { label: 'Attendance Today', value: '124', icon: <Clock size={24} />, color: 'text-green-400', bg: 'bg-green-400/10' },
          { label: 'Payroll Pending', value: '$8.2k', icon: <DollarSign size={24} />, color: 'text-purple-400', bg: 'bg-purple-400/10' }].map((stat, idx) => (
            <motion.div key={idx} variants={item} className="bg-slate-900/50 backdrop-blur border border-white/5 p-6 rounded-2xl hover:bg-slate-900 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>{stat.icon}</div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-slate-500 font-medium text-sm mb-4">{stat.label}</p>
            </motion.div>
          ))}
      </motion.div>
    </motion.div>
  );
};

export default HRDashboard;
