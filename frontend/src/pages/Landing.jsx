import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle, Shield, Zap, Users, 
  BarChart3, Calendar, Clock, Lock, ChevronRight, Globe 
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden font-sans selection:bg-primary-500/30">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-primary-500/20">
              DF
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
              Dayflow
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Customers</a>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="px-5 py-2.5 rounded-full bg-white/5 text-white border border-white/10 font-medium hover:bg-white/10 transition-all text-sm"
            >
              Log In
            </Link>
            <Link 
              to="/login" // No public register, so leading to login/contact
              className="hidden md:flex px-5 py-2.5 rounded-full bg-primary-600 text-white font-medium hover:bg-primary-500 transition-all shadow-lg shadow-primary-500/25 text-sm items-center gap-2"
            >
              Book Demo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-500/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary-400 text-xs font-semibold uppercase tracking-wider mb-8">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              v1.0 Enterprise Edition
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-8 tracking-tight">
              Modernize your <br/>
              <span className="bg-gradient-to-r from-primary-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Human Resources
              </span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Dayflow eliminates the chaos of spreadsheets. Manage attendance, payroll, and employee data in one unified, secure, and beautiful platform.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/login" className="px-8 py-4 rounded-full bg-white text-slate-950 font-bold text-lg hover:bg-slate-200 transition-all shadow-xl hover:scale-105 transform duration-200">
                Get Started Now
              </Link>
              <button className="px-8 py-4 rounded-full bg-white/5 text-white font-bold text-lg border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 backdrop-blur-sm">
                <Globe size={20} className="text-slate-400"/> Live Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Abstract Dashboard Visual */}
          <motion.div 
            initial={{ opacity: 0, y: 100, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-2 shadow-2xl shadow-primary-500/10 backdrop-blur-sm">
               <div className="rounded-lg bg-slate-950 overflow-hidden relative aspect-[16/9] flex flex-col border border-slate-800">
                  {/* Mock Window Header */}
                  <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                     <div className="ml-4 h-4 w-64 bg-slate-800 rounded-full opacity-50 text-[10px] flex items-center px-2 text-slate-500 font-mono">dayflow.app/dashboard</div>
                  </div>

                  {/* Mock App Interface */}
                  <div className="flex-1 flex overflow-hidden">
                      {/* Sidebar */}
                      <div className="w-48 bg-slate-900 border-r border-slate-800 p-4 hidden md:flex flex-col gap-4">
                          <div className="h-8 w-8 rounded-lg bg-primary-600 mb-4"></div>
                          {[1, 2, 3, 4, 5].map(i => (
                              <div key={i} className="h-3 w-3/4 bg-slate-800 rounded-full"></div>
                          ))}
                      </div>

                      {/* Main */}
                      <div className="flex-1 bg-slate-950 p-6">
                          {/* Top Bar */}
                          <div className="flex justify-between mb-8">
                              <div className="h-8 w-32 bg-slate-900 rounded-lg"></div>
                              <div className="h-8 w-8 rounded-full bg-slate-800"></div>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-3 gap-4 mb-8">
                              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                                  <div className="h-3 w-20 bg-slate-800 rounded-full mb-2"></div>
                                  <div className="h-6 w-12 bg-primary-500/20 rounded-lg border border-primary-500/30"></div>
                              </div>
                              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                                  <div className="h-3 w-20 bg-slate-800 rounded-full mb-2"></div>
                                  <div className="h-6 w-12 bg-green-500/20 rounded-lg border border-green-500/30"></div>
                              </div>
                              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                                  <div className="h-3 w-20 bg-slate-800 rounded-full mb-2"></div>
                                  <div className="h-6 w-12 bg-purple-500/20 rounded-lg border border-purple-500/30"></div>
                              </div>
                          </div>

                          {/* Graph Area */}
                          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 h-40 flex items-end gap-2 px-8 pb-4">
                              <div className="w-full bg-slate-800/30 h-full absolute left-0 top-0 pointer-events-none"></div>
                              {[40, 70, 45, 90, 65, 85, 40, 60].map((h, i) => (
                                  <div key={i} className="flex-1 bg-gradient-to-t from-primary-600 to-indigo-600 rounded-t-sm opacity-80" style={{ height: `${h}%` }}></div>
                              ))}
                          </div>
                      </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-10 border-y border-white/5 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-slate-500 text-sm font-medium mb-8 uppercase tracking-widest">Trusted by next-gen companies</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Placeholders for logos */}
                {['Acme Corp', 'Global Tech', 'Nebula Inc', 'Fox Run', 'Circle AI'].map((name) => (
                    <span key={name} className="text-xl font-bold font-serif text-slate-300 flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-700 rounded-full"></div> {name}
                    </span>
                ))}
            </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
            <div className="mb-20">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Everything you need to <br/> run your organization</h2>
                <div className="w-20 h-1 bg-primary-500 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { 
                        icon: <Users className="w-8 h-8 text-primary-400" />, 
                        title: "People Management", 
                        desc: "Centralize employee data. Digital onboarding, document storage, and designation history in one place." 
                    },
                    { 
                        icon: <Clock className="w-8 h-8 text-indigo-400" />, 
                        title: "Smart Attendance", 
                        desc: "Geo-fenced clock-ins, biometric integration support, and automated late-marking rules." 
                    },
                    { 
                        icon: <BarChart3 className="w-8 h-8 text-purple-400" />, 
                        title: "Payroll Processing", 
                        desc: "Automated salary calculation including basic, allowances, deductions, and tax computations." 
                    },
                    { 
                        icon: <Calendar className="w-8 h-8 text-pink-400" />, 
                        title: "Leave Management", 
                        desc: "Customizable leave policies, approval workflows, and real-time balance tracking for employees." 
                    },
                    { 
                        icon: <Shield className="w-8 h-8 text-teal-400" />, 
                        title: "Role-Based Security", 
                        desc: "Granular access controls. Ensure managers only see their teams and sensitive data remains protected." 
                    },
                    { 
                        icon: <Lock className="w-8 h-8 text-orange-400" />, 
                        title: "Audit Trails", 
                        desc: "Every action is logged. Complete transparency for HR actions, ensuring compliance and security." 
                    }
                ].map((feature, idx) => (
                    <motion.div 
                        key={idx}
                        whileHover={{ y: -5 }}

                        className="p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-primary-500/30 hover:bg-slate-900/80 transition-all group"
                    >
                        <div className="mb-6 bg-slate-950 p-4 rounded-2xl w-fit border border-slate-800 group-hover:border-primary-500/30 transition-colors">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                        <p className="text-slate-400 leading-relaxed">{feature.desc}</p>

                    </motion.div>
                ))}
            </div>
        </div>
      </section>


      {/* Feature Spotlight: Efficiency */}
      <section id="solutions" className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
                        <Zap size={14} /> Workflow Automation
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                        Save 40+ hours per month on administrative tasks.
                    </h2>
                    <p className="text-slate-400 text-lg mb-8">
                        Stop chasing emails for leave approvals. Dayflow automates the boring stuff so you can focus on building culture.
                    </p>
                    
                    <ul className="space-y-4 mb-10">
                        {['One-click payroll generation', 'Automated leave balance updates', 'Self-service employee portal'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-300">
                                <CheckCircle className="text-primary-500" size={20} />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <Link to="/login" className="text-primary-400 font-bold hover:text-primary-300 flex items-center gap-2 group">
                        Explore Features <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                    </Link>
                </div>
                <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-20"></div>
                    
                    {/* Main Card: Leave Request */}
                    <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg">
                                    JE
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">John Employee</h4>
                                    <p className="text-slate-400 text-sm">Product Designer</p>
                                </div>
                            </div>
                            
                        </div>
                        
                        <div className="space-y-4 mb-8">
                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-400 text-sm font-medium">Leave Type</span>
                                    <span className="text-indigo-400 text-sm font-bold flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-400"></div> Sick Leave
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-sm font-medium">Duration</span>
                                    <span className="text-white text-sm">Oct 24 - Oct 26 (3 Days)</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm mb-1">Reason</p>
                                <p className="text-slate-300 text-sm italic">"Not feeling well since morning, need rest to recover."</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 py-3 rounded-xl bg-green-500/10 text-green-500 font-bold border border-green-500/20 hover:bg-green-500/20 transition-colors">
                                Approve Request
                            </button>
                            <button className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-500 font-bold border border-red-500/20 hover:bg-red-500/20 transition-colors">
                                Reject
                            </button>
                        </div>
                    </div>

                    {/* Floating Toast Notification */}
                    <div className="absolute -right-8 top-12 bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                             <CheckCircle size={16} />
                        </div>
                        <div>
                            <div className="text-white text-xs font-bold">Payroll Processed</div>
                            <div className="text-slate-400 text-[10px]">Just now for 45 employees</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-slate-950">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-white mb-4">Loved by HR Teams</h2>
                  <p className="text-slate-500">See what HR professionals are saying about Dayflow.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                      { quote: "Dayflow transformed our payroll process. What used to take 3 days now takes 30 minutes. It's simply magic.", name: "Sarah Jenkins", role: "HR Director, TechFlow" },
                      { quote: "The attendance tracking with geo-fencing is a game changer for our remote sales team. Highly recommended.", name: "Michael Chen", role: "Operations Lead, Construct Co" },
                      { quote: "Finally, an HRMS that doesn't look like it was built in 1990. The user interface is beautiful and intuitive.", name: "Jessica Alverez", role: "People Ops, Designify" }
                  ].map((t, i) => (
                      <div key={i} className="p-8 rounded-2xl bg-slate-900 border border-slate-800 relative">
                          <div className="absolute top-8 left-8 text-primary-600/20 transform -translate-x-2 -translate-y-2">
                             <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" /></svg>
                          </div>
                          <p className="text-slate-300 italic mb-6 relative z-10 pt-4">"{t.quote}"</p>
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                  {t.name.charAt(0)}
                              </div>
                              <div>
                                  <div className="text-white font-bold text-sm">{t.name}</div>
                                  <div className="text-slate-500 text-xs">{t.role}</div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>


      {/* CTA Section */}
      <section className="py-32 px-6">
         <div className="max-w-5xl mx-auto relative rounded-[3rem] overflow-hidden bg-primary-600 text-center px-6 py-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to streamline your flow?</h2>
                <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
                    Join forward-thinking companies that trust Dayflow for their HR operations. Setup takes less than 10 minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-8 py-4 rounded-full bg-white text-primary-700 font-bold text-lg hover:bg-slate-100 transition-all shadow-lg">
                        Contact Sales
                    </button>
                    <Link to="/login" className="px-8 py-4 rounded-full bg-primary-700 text-white font-bold text-lg hover:bg-primary-800 transition-all border border-primary-500">
                        Login to Dashboard
                    </Link>
                </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center font-bold text-white">DF</div>
                    <span className="text-xl font-bold text-white">Dayflow</span>
                </div>
                <p className="text-slate-500 leading-relaxed">
                    Designed for modern enterprises to manage their most valuable asset - their people.
                </p>
            </div>
            
            <div>
                <h4 className="font-bold text-white mb-6">Product</h4>
                <ul className="space-y-4 text-slate-500">
                    <li><a href="#" className="hover:text-primary-400 transition-colors">Features</a></li>
                    <li><a href="#" className="hover:text-primary-400 transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-primary-400 transition-colors">Security</a></li>
                    <li><a href="#" className="hover:text-primary-400 transition-colors">Roadmap</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-white mb-6">Company</h4>
                <ul className="space-y-4 text-slate-500">
                    <li><a href="#" className="hover:text-primary-400 transition-colors">About</a></li>
                    <li><a href="#" className="hover:text-primary-400 transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-primary-400 transition-colors">Contact</a></li>
                    <li><a href="#" className="hover:text-primary-400 transition-colors">Partners</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-white mb-6">Legal</h4>
                <ul className="space-y-4 text-slate-500">
                    <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-primary-400 transition-colors">Cookie Policy</a></li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-600 text-sm">
            <p>© 2024 Dayflow Systems Inc. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

