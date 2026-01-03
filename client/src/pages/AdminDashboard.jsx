import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Users, UserCheck, CalendarDays, Banknote, ClipboardList, ShieldAlert, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back, {user?.name?.split(' ')[0]}.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard/employees" className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 border border-slate-700">
            <Users size={18} /> Manage Staff
          </Link>
          <Link to="/dashboard/payroll" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors flex items-center gap-2 shadow-lg shadow-primary-600/20">
            <Banknote size={18} /> Run Payroll
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[{ label: 'Total Employees', value: '142', icon: <Users size={24} />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'On Leave Today', value: '8', icon: <CalendarDays size={24} />, color: 'text-orange-400', bg: 'bg-orange-400/10' },
          { label: 'Present Today', value: '124', icon: <UserCheck size={24} />, color: 'text-green-400', bg: 'bg-green-400/10' },
          { label: 'Payroll Pending', value: '$12.4k', icon: <Banknote size={24} />, color: 'text-purple-400', bg: 'bg-purple-400/10' }].map((stat, idx) => (
          <motion.div key={idx} variants={item} className="bg-slate-900/50 backdrop-blur border border-white/5 p-6 rounded-2xl hover:bg-slate-900 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>{stat.icon}</div>
              <button className="text-slate-600 hover:text-white transition-colors"><MoreHorizontal size={20} /></button>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-slate-500 font-medium text-sm mb-4">{stat.label}</p>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-black/20 py-2 px-3 rounded-lg w-fit">
              <ArrowUpRight size={14} className="text-green-500" />
              {stat.trend || 'Today'}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Admin Shortcuts */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={container} initial="hidden" animate="show">
        {[{ label: 'Audit Logs', icon: <ClipboardList size={24} />, path: '/dashboard/audit' },
          { label: 'Leave Approvals', icon: <ShieldAlert size={24} />, path: '/dashboard/leaves' }].map((item, i) => (
          <motion.div key={i} variants={item} className="bg-slate-900/50 border border-white/5 p-6 rounded-xl hover:bg-slate-900 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-600/10 rounded-xl text-primary-400">{item.icon}</div>
              <Link to={item.path} className="text-white font-medium hover:underline">{item.label}</Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
