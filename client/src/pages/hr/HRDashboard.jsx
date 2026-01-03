import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Users, Calendar, Clock, DollarSign, 
  Briefcase, Plus, Bell, Search, 
  ChevronRight, ArrowUpRight, TrendingUp,
  FileText, CheckCircle, AlertTriangle
} from 'lucide-react';

const HRDashboard = () => {
  const { user } = useAuth();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const stats = [
    { 
      title: 'Total Employees', 
      value: '142', 
      trend: '+12%', 
      trendUp: true, 
      icon: Users,
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      title: 'Attendance', 
      value: '94%', 
      trend: '+2.1%', 
      trendUp: true, 
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-600'
    },
    { 
      title: 'Open Roles', 
      value: '12', 
      trend: '4 Urgent', 
      trendUp: false, 
      icon: Briefcase,
      color: 'from-orange-500 to-red-600'
    },
    { 
      title: 'On Leave', 
      value: '8', 
      trend: 'Today', 
      trendUp: false, 
      icon: Calendar,
      color: 'from-purple-500 to-fuchsia-600'
    }
  ];

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-slate-400 font-medium mb-1">Overview</h2>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Hello, {user?.name?.split(' ')[0] || 'HR Officer'}
          </h1>
        </div>
        
        <div className="flex gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search employees..." 
              className="bg-slate-900 border border-slate-700 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64 transition-all"
            />
          </div>
          <button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-900/30 flex items-center gap-2 transition-all active:scale-95">
            <Plus size={20} />
            <span className="hidden sm:inline">New Employee</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx} 
            variants={item}
            className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-1 overflow-hidden hover:border-slate-700 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500 from-white to-transparent" />
            
            <div className="bg-slate-950/50 backdrop-blur-xl rounded-xl p-5 h-full relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} shadow-lg shadow-indigo-900/20`}>
                  <stat.icon size={22} className="text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.trendUp ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
                  {stat.trend}
                  {stat.trendUp && <ArrowUpRight size={12} />}
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-slate-100 tracking-tight">{stat.value}</h3>
                <p className="text-slate-500 font-medium">{stat.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recruitment Funnel */}
        <motion.div variants={item} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
             <div>
               <h3 className="text-lg font-bold text-white">Recruitment Pipeline</h3>
               <p className="text-sm text-slate-500">Active candidates across all stages</p>
             </div>
             <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1">
                View All <ChevronRight size={16} />
             </button>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {[
                { label: 'Screening', count: 45, total: 100, color: 'bg-blue-500' },
                { label: 'Technical Interview', count: 28, total: 100, color: 'bg-indigo-500' },
                { label: 'Manager Review', count: 12, total: 100, color: 'bg-violet-500' },
                { label: 'Offer Sent', count: 5, total: 100, color: 'bg-emerald-500' }
              ].map((stage, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-300 group-hover:text-white transition-colors">{stage.label}</span>
                    <span className="text-slate-400">{stage.count} Candidates</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${(stage.count / 60) * 100}%` }}
                      transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                      className={`h-full rounded-full ${stage.color} relative`}
                    >
                        <div className="absolute inset-0 bg-white/20 ml-[-100%] animate-[shimmer_2s_infinite]" />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-950/30 p-4 border-t border-slate-800 text-center">
             <div className="grid grid-cols-3 divide-x divide-slate-800">
                <div className="px-4">
                   <div className="text-2xl font-bold text-white">12</div>
                   <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Open Roles</div>
                </div>
                <div className="px-4">
                   <div className="text-2xl font-bold text-white">45</div>
                   <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Total Applicants</div>
                </div>
                <div className="px-4">
                   <div className="text-2xl font-bold text-white">18d</div>
                   <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Avg. Time to Hire</div>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Requests & Approvals */}
        <motion.div variants={item} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-800">
             <h3 className="text-lg font-bold text-white">Pending Requests</h3>
             <p className="text-sm text-slate-500">Requires your attention</p>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-[400px]">
             {[
               { name: 'Alex Morgan', type: 'Sick Leave', date: 'Oct 24 - Oct 25', status: 'pending' },
               { name: 'Sam Smith', type: 'Expense Report', date: '$450.00', status: 'urgent' },
               { name: 'Jordan Lee', type: 'Casual Leave', date: 'Oct 28', status: 'pending' },
               { name: 'Casey West', type: 'Profile Update', date: 'Address Change', status: 'pending' },
             ].map((req, i) => (
               <div key={i} className="p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors flex items-center gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                     {req.name[0]}
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between items-start">
                        <h4 className="font-medium text-slate-200 text-sm">{req.name}</h4>
                        {req.status === 'urgent' && (
                           <span className="text-[10px] font-bold bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full">URGENT</span>
                        )}
                     </div>
                     <p className="text-xs text-slate-400 mt-0.5">{req.type} • {req.date}</p>
                  </div>
                  <button className="p-2 hover:bg-indigo-500/20 hover:text-indigo-400 rounded-lg text-slate-500 transition-colors">
                     <ChevronRight size={16} />
                  </button>
               </div>
             ))}
          </div>
          
          <div className="p-4 border-t border-slate-800">
            <button className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-all text-sm">
                View All Requests
            </button>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default HRDashboard;
