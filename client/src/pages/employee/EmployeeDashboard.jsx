import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
    Users, Calendar, Clock, DollarSign, 
    ArrowUpRight, ArrowDownRight, MoreHorizontal,
    UserPlus, FileText, Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const isAdmin = ['SUPER_ADMIN', 'HR_OFFICER'].includes(user?.role);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-slate-400 mt-1">Welcome back, {user?.name?.split(' ')[0]}. Here is what's happening today.</p>
         </div>
         {isAdmin && (
             <div className="flex gap-3">
                 <Link to="/dashboard/employees" className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 border border-slate-700">
                    <Users size={18} /> Manage Staff
                 </Link>
                 <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors flex items-center gap-2 shadow-lg shadow-primary-600/20">
                    <UserPlus size={18} /> Add Employee
                 </button>
             </div>
         )}
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
            { label: 'Total Employees', value: '142', icon: <Users size={24} />, color: 'text-blue-400', bg: 'bg-blue-400/10', trend: '+12% from last month' },
            { label: 'On Leave Today', value: '8', icon: <Calendar size={24} />, color: 'text-orange-400', bg: 'bg-orange-400/10', trend: '4 Sick, 4 Casual' },
            { label: 'Present Today', value: '124', icon: <Clock size={24} />, color: 'text-green-400', bg: 'bg-green-400/10', trend: '96% Attendance Rate' },
            { label: 'Payroll Pending', value: '$12.4k', icon: <DollarSign size={24} />, color: 'text-purple-400', bg: 'bg-purple-400/10', trend: 'Due in 5 days' }
        ].map((stat, idx) => (
             <motion.div 
                key={idx}
                variants={item}
                className="bg-slate-900/50 backdrop-blur border border-white/5 p-6 rounded-2xl hover:bg-slate-900 transition-colors group"
             >
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                        {stat.icon}
                    </div>
                     <button className="text-slate-600 hover:text-white transition-colors">
                        <MoreHorizontal size={20} />
                     </button>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-slate-500 font-medium text-sm mb-4">{stat.label}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-black/20 py-2 px-3 rounded-lg w-fit">
                    <ArrowUpRight size={14} className="text-green-500" />
                    {stat.trend}
                </div>
             </motion.div>
        ))}
      </motion.div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Activity & Charts */}
          <div className="lg:col-span-2 space-y-8">
              {/* Activity Feed */}
              <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                      <button className="text-sm text-primary-400 hover:text-primary-300">View All</button>
                  </div>
                  <div className="space-y-6">
                      {[
                          { action: 'New Employee Created', user: 'Sarah Admin', time: '2 hours ago', icon: <UserPlus size={16}/>, color: 'bg-blue-500' },
                          { action: 'Leave Approved', user: 'John Doe', time: '4 hours ago', icon: <Calendar size={16}/>, color: 'bg-green-500' },
                          { action: 'Payroll Generated', user: 'System', time: 'Yesterday', icon: <DollarSign size={16}/>, color: 'bg-purple-500' },
                          { action: 'Policy Updated', user: 'HR Dept', time: '2 days ago', icon: <FileText size={16}/>, color: 'bg-orange-500' },
                      ].map((log, i) => (
                          <div key={i} className="flex items-start gap-4 group">
                               <div className="relative">
                                    <div className={`w-10 h-10 rounded-full ${log.color}/10 flex items-center justify-center ${log.color.replace('bg-', 'text-')} border border-${log.color.replace('bg-', '')}-500/20`}>
                                        {log.icon}
                                    </div>
                                    {i !== 3 && <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1px] h-6 bg-slate-800"></div>}
                               </div>
                               <div>
                                    <p className="text-slate-200 font-medium group-hover:text-primary-400 transition-colors cursor-pointer">{log.action}</p>
                                    <p className="text-slate-500 text-sm">by {log.user} • {log.time}</p>
                               </div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Chart Placeholder */}
               <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white">Attendance Overview</h3>
                      <select className="bg-black/30 border border-white/10 text-slate-400 text-sm rounded-lg px-3 py-1 outline-none">
                          <option>This Week</option>
                          <option>This Month</option>
                      </select>
                  </div>
                  <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-slate-800 pb-2">
                       {[60, 80, 45, 90, 75, 85, 65].map((h, i) => (
                           <div key={i} className="w-full bg-slate-800 hover:bg-primary-600/50 transition-colors rounded-t-lg relative group" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h}%
                                </div>
                           </div>
                       ))}
                  </div>
                  <div className="flex justify-between mt-4 text-xs text-slate-500 px-2 uppercase font-medium tracking-wider">
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
              </div>
          </div>

          {/* Right Column: Quick Actions & Notifications */}
          <div className="space-y-8">
              {/* Quick Actions */}
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                      <button className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-center group">
                          <div className="w-10 h-10 mx-auto rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                              <UserPlus size={20} />
                          </div>
                          <span className="text-sm font-medium text-slate-300">Add Staff</span>
                      </button>
                      <button className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-center group">
                          <div className="w-10 h-10 mx-auto rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                              <DollarSign size={20} />
                          </div>
                          <span className="text-sm font-medium text-slate-300">Run Payroll</span>
                      </button>
                      <button className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-center group">
                          <div className="w-10 h-10 mx-auto rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                              <Calendar size={20} />
                          </div>
                          <span className="text-sm font-medium text-slate-300">Approve Leave</span>
                      </button>
                      <button className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-center group">
                          <div className="w-10 h-10 mx-auto rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                              <Settings size={20} />
                          </div>
                          <span className="text-sm font-medium text-slate-300">Settings</span>
                      </button>
                  </div>
              </div>

               {/* Department Stats */}
               <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                   <h3 className="text-lg font-bold text-white mb-6">Department Headcount</h3>
                   <div className="space-y-5">
                       {[
                           { name: 'Engineering', count: 45, total: 100, color: 'bg-blue-500' },
                           { name: 'Sales & Marketing', count: 24, total: 100, color: 'bg-green-500' },
                           { name: 'Human Resources', count: 12, total: 100, color: 'bg-orange-500' },
                           { name: 'Design', count: 8, total: 100, color: 'bg-pink-500' },
                       ].map((dept, i) => (
                           <div key={i}>
                               <div className="flex justify-between text-sm mb-2">
                                   <span className="text-slate-300">{dept.name}</span>
                                   <span className="text-slate-500">{dept.count} Members</span>
                               </div>
                               <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                   <div className={`h-full ${dept.color} rounded-full`} style={{ width: `${(dept.count / 50) * 100}%` }}></div>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
          </div>
      </div>

    </div>
  );
};

export default EmployeeDashboard;

