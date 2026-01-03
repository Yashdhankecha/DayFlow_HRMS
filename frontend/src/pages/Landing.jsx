import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Zap, Layers } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 glass px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
            HackStack
          </div>
          <div className="space-x-4">
            <Link to="/login" className="px-4 py-2 rounded-lg text-slate-600 hover:text-primary-600 font-medium transition-colors">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 font-semibold text-sm mb-6 border border-primary-100">
              ⚡ Production Ready Template
            </span>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Build your next big idea with <span className="text-primary-600">HackStack</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              The ultimate full-stack boilerplate for hackathons. React, Node.js, Prisma, and PostgreSQL aimed at speed and scalability.
            </p>
            <div className="flex gap-4">
              <Link to="/register" className="px-8 py-3.5 rounded-xl bg-primary-600 text-white font-bold text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/30 flex items-center gap-2">
                Start Building <ArrowRight size={20} />
              </Link>
              <Link to="#features" className="px-8 py-3.5 rounded-xl bg-white text-slate-700 font-bold text-lg border border-slate-200 hover:bg-slate-50 transition-all">
                Learn More
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-2xl blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative glass p-8 rounded-2xl border border-white/40">
               <pre className="text-sm font-mono text-slate-600 overflow-x-auto">
{`// Ready to deploy
const config = {
  stack: ['React', 'Node', 'Prisma'],
  auth: 'JWT + Refresh',
  ui: 'Tailwind + Framer',
  status: 'Production Ready'
};

export default HackStack;`}
               </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">Don't waste time setting up authentication or database connections. We've done the heavy lifting for you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: <Shield className="w-8 h-8 text-primary-600" />, title: "Secure Auth", desc: "JWT-based authentication with refresh token rotation and role management." },
                    { icon: <Zap className="w-8 h-8 text-indigo-600" />, title: "High Performance", desc: "Optimized with Vite and Express for lightning fast development and production builds." },
                    { icon: <Layers className="w-8 h-8 text-purple-600" />, title: "Full Stack", desc: "Complete integration between React frontend and Node/Postgres backend." }
                ].map((feature, idx) => (
                    <motion.div 
                        key={idx}
                        whileHover={{ y: -5 }}
                        className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all"
                    >
                        <div className="mb-4 bg-white p-3 rounded-lg inline-block shadow-sm">{feature.icon}</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                        <p className="text-slate-600">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
                <span className="text-xl font-bold text-white">HackStack</span>
                <p className="text-sm mt-2">© 2024 Template. MIT License.</p>
            </div>
            <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">Github</a>
                <a href="#" className="hover:text-white transition-colors">Documentation</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
