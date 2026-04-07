import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  CheckCircle,
  Menu, X,
  ArrowRight,
  BarChart3,
  Target,
  Shield,
  Zap,
  CheckCircle2,
  Calendar,
  Layers,
  Github, Linkedin, Twitter, Key,
  Sparkles,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/Common';
import ThemeToggle from '../components/ThemeToggle';
import { AnimatedNumber } from '../components/DataDisplay';


export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [stats, setStats] = useState({
    actions: 1428562,
    velocity: 38.4,
    success: 99.92,
    achievers: 4215
  });

  const location = useLocation();
  const showLogin = location.pathname === '/login';
  const showRegister = location.pathname === '/register';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        actions: prev.actions + Math.floor(Math.random() * 5) + 1,
        velocity: Math.min(45, prev.velocity + (Math.random() * 0.1 - 0.04)),
        success: Math.min(99.99, Math.max(99.90, prev.success + (Math.random() * 0.01 - 0.005))),
        achievers: prev.achievers + (Math.random() > 0.8 ? 1 : 0)
      }));
    }, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const features = [
    {
      icon: <Layers className="w-8 h-8 text-indigo-600" />,
      title: 'Action Flow',
      description: 'Streamline your daily actions with an intuitive interface designed for focus and momentum.',
    },
    {
      icon: <Target className="w-8 h-8 text-emerald-600" />,
      title: 'Vision Mapping',
      description: 'Connect your daily actions to long-term monthly milestones and yearly visions.',
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-amber-600" />,
      title: 'Personal Insights',
      description: 'Monitor your growth trends with beautiful, interactive personal dashboards.',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-indigo-800" />,
      title: 'Privacy First',
      description: 'Your goals and data are yours. Secure, private, and always available.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-indigo-100 overflow-x-hidden transition-colors duration-500">

      {/* Auth Modals */}
      <AnimatePresence>
        {showLogin && <Login />}
        {showRegister && <Register />}
      </AnimatePresence>

      {/* 1. Navigation */}
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 border-b ${isScrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 shadow-sm'
          : 'bg-transparent border-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:rotate-12 transition-transform duration-500">
                <CheckCircle2 size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
                Goal<span className="text-indigo-600">Flow</span>
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              <a href="#features" className="px-5 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">Principles</a>
              <a href="#preview" className="px-5 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">Experience</a>
              <a href="#pricing" className="px-5 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">Plans</a>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-4"></div>
              <div className="mr-2">
                <ThemeToggle />
              </div>
              <Link to="/login" className="px-6 py-2 text-sm font-black text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">
                Login
              </Link>
              <Link to="/register">
                <Button className="ml-4 rounded-2xl shadow-xl shadow-indigo-600/10">
                  Start Journey
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-4 md:hidden">
              <ThemeToggle />
              <button
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl"
            >
              <div className="flex flex-col p-6 gap-4">
                <a href="#features" className="px-6 py-4 text-slate-900 dark:text-white font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl" onClick={() => setMenuOpen(false)}>Principles</a>
                <a href="#preview" className="px-6 py-4 text-slate-900 dark:text-white font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl" onClick={() => setMenuOpen(false)}>Experience</a>
                <a href="#pricing" className="px-6 py-4 text-slate-900 dark:text-white font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl" onClick={() => setMenuOpen(false)}>Plans</a>
                <hr className="border-slate-100 dark:border-slate-800" />
                <Link to="/login" className="px-6 py-4 text-slate-900 dark:text-white font-black uppercase tracking-widest" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="w-full" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full py-5 rounded-2xl">Start Journey</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* 2. Hero Section */}
        <section className="relative pt-32 pb-40 lg:pt-52 lg:pb-64 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-[120px]">
            <div className="relative left-[50%] w-[50rem] h-[50rem] -translate-x-1/2 bg-gradient-to-tr from-indigo-200 to-rose-100 dark:from-indigo-900/20 dark:to-slate-950 opacity-60 rounded-full animate-float"></div>
            <div className="absolute top-[20%] right-[10%] w-[30rem] h-[30rem] bg-blue-100/50 dark:bg-indigo-900/10 rounded-full animate-pulse-slow"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-12 shadow-sm">
                <Sparkles size={14} className="animate-pulse" />
                GoalFlow v1.0.0 Is Live
              </div>

              <h1 className="text-6xl md:text-8xl font-display font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-10 max-w-5xl mx-auto italic">
                Personal Growth <br />
                <span className="text-gradient drop-shadow-sm">Mastered.</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-16 font-medium">
                The high-performance system for your personal ambitions. Align daily actions with your life's grandest visions effortlessly.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link to="/register">
                  <Button size="lg" className="px-12 py-8 rounded-[2rem] text-lg font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/30">
                    Start My Flow
                  </Button>
                </Link>
                <a href="#preview">
                  <button className="flex items-center gap-3 px-10 py-5 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                    <Zap size={20} className="text-amber-500 group-hover:scale-110 transition-transform" />
                    See Experience
                  </button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. Global Stats */}
        <section className="py-24 bg-white dark:bg-slate-950 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-500 border-y border-slate-100 dark:border-slate-800">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
          </div>

          <div className="max-w-7xl mx-auto px-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              <StatItem 
                label="Actions Tracked" 
                value={<AnimatedNumber value={stats.actions / 1000000} suffix="M+" decimals={2} />} 
                accent="text-indigo-600 dark:text-indigo-400" 
              />
              <StatItem 
                label="Growth Velocity" 
                value={<AnimatedNumber value={stats.velocity} prefix="+" suffix="%" decimals={1} />} 
                accent="text-emerald-600 dark:text-emerald-400" 
              />
              <StatItem 
                label="Goal Success" 
                value={<AnimatedNumber value={stats.success} suffix="%" decimals={2} />} 
                accent="text-amber-600 dark:text-amber-400" 
              />
              <StatItem 
                label="Active Achievers" 
                value={<AnimatedNumber value={stats.achievers / 1000} suffix="k" decimals={1} />} 
                accent="text-blue-600 dark:text-blue-400" 
              />
            </div>
          </div>
        </section>

        {/* 4. Ecosystem Preview */}
        <section id="preview" className="py-32 lg:py-48 bg-slate-50 dark:bg-slate-900/50 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20">
              <div className="max-w-2xl">
                <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Your Focus Center</h2>
                <h3 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">Elite Visual Intelligence Over Your Personal Goals.</h3>
              </div>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-md">From macro-strategic yearly visions down to micro-tactical daily actions. Full visibility into your growth.</p>
            </div>

            <motion.div
              style={{ perspective: 1000 }}
              className="relative rounded-[3rem] bg-slate-900 dark:bg-black shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-[12px] border-slate-900 dark:border-slate-800 group"
            >
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-500 rounded-[2.5rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>

              {/* Fake Dashboard Shell */}
              <div className="aspect-[16/10] bg-slate-50 dark:bg-slate-900 rounded-[2.2rem] overflow-hidden relative flex selection:bg-indigo-500/20">
                {/* Sidebar Mock */}
                <div className="w-[20%] h-full bg-slate-900 border-r border-slate-800 p-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <CheckCircle2 size={12} className="text-white" />
                    </div>
                    <div className="h-4 w-16 bg-slate-800 rounded-md"></div>
                  </div>
                  <div className="space-y-3 flex-1 flex flex-col">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl ${i === 1 ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : ''}`}>
                        <div className={`w-4 h-4 rounded-md ${i === 1 ? 'bg-indigo-400/30' : 'bg-slate-700'}`}></div>
                        <div className={`h-2.5 rounded-full w-3/4 ${i === 1 ? 'bg-white/80' : 'bg-slate-700'}`}></div>
                      </div>
                    ))}
                    <div className="mt-auto p-4 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-2xl border border-indigo-500/30 flex flex-col items-center">
                      <div className="h-6 w-6 rounded-full bg-white/20 mb-2"></div>
                      <div className="h-2 w-16 bg-indigo-200/50 rounded-full mb-3"></div>
                      <div className="h-6 w-full bg-white rounded-lg opacity-90"></div>
                    </div>
                  </div>
                </div>

                {/* Main Content Mock */}
                <div className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-slate-950">
                  {/* Topbar */}
                  <div className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-white/5 px-6 flex items-center justify-between">
                    <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800"></div>
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-6 flex-1 flex flex-col gap-6 overflow-hidden">
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* Stat 1 */}
                      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Goals</div>
                        <div className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tighter">14</div>
                      </div>
                      {/* Stat 2 */}
                      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Success Rate</div>
                        <div className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tighter">92%</div>
                      </div>
                      {/* Stat 3 */}
                      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Streak</div>
                        <div className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tighter">12<span className="text-lg text-slate-400 font-bold ml-1">Days</span></div>
                      </div>
                    </div>

                    {/* Chart & Activity Row */}
                    <div className="flex-1 flex gap-4 min-h-0">
                      <div className="flex-[2] bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 flex flex-col relative overflow-hidden h-full">
                        <div className="flex justify-between items-center mb-8">
                          <div className="text-sm font-bold text-slate-900 dark:text-white">Velocity Trend</div>
                          <div className="text-[10px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 rounded-lg uppercase tracking-widest">+18%</div>
                        </div>
                        {/* Fake Bar Chart */}
                        <div className="flex-1 flex items-end justify-between gap-3 min-h-0 relative">
                          {/* Grid Lines */}
                          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 z-0">
                            <div className="w-full h-px bg-slate-300 dark:bg-slate-700"></div>
                            <div className="w-full h-px bg-slate-300 dark:bg-slate-700"></div>
                            <div className="w-full h-px bg-slate-300 dark:bg-slate-700"></div>
                            <div className="w-full h-px bg-slate-300 dark:bg-slate-700"></div>
                          </div>
                          {[40, 60, 30, 80, 50, 90, 70, 45, 85, 65, 35, 75].map((h, i) => (
                            <div key={i} className="w-full bg-indigo-100/50 dark:bg-indigo-900/20 rounded-t-md relative z-10 transition-colors" style={{ height: `${h}%` }}>
                              <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-md opacity-90 relative group-hover:bg-indigo-600" style={{ height: `${h * 0.6}%` }}>
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-indigo-700 dark:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 px-2 py-0.5 rounded shadow-sm">
                                  {Math.floor(h * 1.2)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex-[1] bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 flex flex-col gap-6 overflow-hidden h-full">
                        <div className="text-sm font-bold text-slate-900 dark:text-white mb-2">Recent Log</div>
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-4 group cursor-pointer">
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-900 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors shrink-0 flex items-center justify-center">
                              <CheckCircle2 size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors" />
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                              <div className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">Action completed</div>
                              <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500">2 hours ago</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 5. Features Grid */}
        <section id="features" className="py-32 lg:py-48 bg-white dark:bg-slate-950 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-24">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4">Personal Growth Principles</h3>
              <h2 className="text-5xl font-display font-black text-slate-900 dark:text-white tracking-tighter">Designed for Achievers.</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-indigo-600/10 transition-all duration-500 group"
                >
                  <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-slate-950 shadow-xl flex items-center justify-center mb-8 border border-white/50 dark:border-slate-800 group-hover:scale-110 transition-transform duration-500 text-indigo-600">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-display font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">{feature.title}</h4>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Pricing */}
        <section id="pricing" className="py-32 lg:py-48 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-display font-black text-slate-900 dark:text-white tracking-tighter mb-4">Personal Growth Tiers.</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Clear plans for every stage of your journey.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              <TierCard
                title="ACHIEVER"
                price="0"
                description="Personal essentials for starting your growth."
                features={['Secure Data', 'Unlimited Daily Actions', 'Personal Dashboards']}
                cta="Start Growing"
              />
              <TierCard
                title="ELITE"
                price="12"
                description="The ultimate system for massive goals."
                features={['Unlimited Everything', 'Vison Integration Engine', 'Advanced Growth Analytics', 'Cloud Sync']}
                cta="Go Elite"
                premium
              />
            </div>
          </div>
        </section>

        {/* 7. Final CTA */}
        <section className="py-40 relative bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white overflow-hidden text-center transition-colors duration-500">
          <div className="absolute inset-x-0 bottom-0 top-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-slate-50 dark:from-indigo-900/30 dark:via-slate-950 dark:to-slate-950"></div>

          <div className="max-w-3xl mx-auto px-6 relative z-10">
            <h2 className="text-5xl md:text-7xl font-display font-black mb-10 tracking-tighter italic">Achieve <span className="text-indigo-600 dark:text-indigo-400">Greatness.</span></h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium mb-16 px-10">Modernize your planning and execution habits in minutes. Start your flow today.</p>
            <Link to="/register">
              <Button size="lg" className="px-16 py-8 rounded-[2rem] text-xl font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/20 dark:shadow-indigo-600/40">
                Start My Flow
              </Button>
            </Link>
            <p className="mt-8 text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-[0.3em]">No Credit Card Required • Start Your Streak Now</p>
          </div>
        </section>

        {/* 8. Footer */}
        <footer className="bg-white dark:bg-slate-950 pt-32 pb-16 px-6 lg:px-8 border-t border-slate-100 dark:border-slate-800 transition-colors duration-500">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-5 gap-20 mb-32">
              <div className="md:col-span-2 space-y-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-indigo-600 flex items-center justify-center">
                    <CheckCircle2 size={24} className="text-white" />
                  </div>
                  <h4 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tighter italic">GoalFlow</h4>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed max-w-sm">
                  Empowering achievers with the mission-critical systems to turn visions into reality.
                </p>
                <div className="flex gap-6">
                  <SocialLink icon={Github} />
                  <SocialLink icon={Linkedin} />
                  <SocialLink icon={Twitter} />
                </div>
              </div>

              <FooterCol title="SELF" links={['Principles', 'Experience', 'Growth Plans', 'Personal Roadmap']} />
              <FooterCol title="SYSTEM" links={['Personal Cloud', 'API Access', 'Growth Logs', 'Achievers']} />
              <FooterCol title="RESOURCES" links={['About Us', 'Contact', 'Support']} />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-slate-100 dark:border-slate-800 gap-8">
              <p className="text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">&copy; 2026 GOALFLOW INC. PERSONAL GROWTH SECURED.</p>
              <div className="flex gap-8">
                <a href="#" className="text-[10px] font-black text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">Privacy Protocol</a>
                <a href="#" className="text-[10px] font-black text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">Master Service Agreement</a>
                <a href="#" className="text-[10px] font-black text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">Security Grid</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// Sub-components
function StatItem({ label, value, accent }) {
  return (
    <div className="text-center group">
      <p className={`${accent} text-5xl md:text-6xl font-display font-black tracking-tighter mb-2 group-hover:scale-110 transition-transform duration-500`}>{value}</p>
      <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{label}</p>
    </div>
  );
}

function TierCard({ title, price, description, features, cta, premium }) {
  return (
    <div className={`p-1 border rounded-[3rem] ${premium ? 'bg-indigo-600 shadow-2xl shadow-indigo-600/30' : 'bg-slate-200 dark:bg-slate-800'} relative group`}>
      {premium && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-indigo-600 text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl">
          Strategic Choice
        </div>
      )}
      <div className={`h-full rounded-[2.9rem] p-10 flex flex-col ${premium ? 'bg-slate-900 border-none' : 'bg-white dark:bg-slate-900 border-none'}`}>
        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${premium ? 'text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>{title}</h4>
        <div className="flex items-baseline gap-2 mb-6">
          <span className={`text-6xl font-display font-black tracking-tighter ${premium ? 'text-white' : 'text-slate-900 dark:text-white'}`}>${price}</span>
          <span className={`text-xs font-bold ${premium ? 'text-slate-500' : 'text-slate-400'}`}>/MO</span>
        </div>
        <p className={`text-sm font-medium mb-10 ${premium ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>

        <div className="space-y-4 mb-12 flex-1">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle2 size={16} className={premium ? 'text-indigo-400' : 'text-indigo-600'} />
              <span className={`text-xs font-bold uppercase tracking-wide ${premium ? 'text-slate-300' : 'text-slate-700 dark:text-slate-300'}`}>{f}</span>
            </div>
          ))}
        </div>

        <Link to="/register">
          <Button variant={premium ? 'primary' : 'secondary'} className="w-full py-6 rounded-2xl font-black uppercase tracking-widest shadow-xl">
            {cta}
          </Button>
        </Link>
      </div>
    </div>
  );
}

function FooterCol({ title, links }) {
  return (
    <div className="space-y-8">
      <h5 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em]">{title}</h5>
      <ul className="space-y-4">
        {links.map((link, i) => (
          <li key={i}>
            <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold uppercase tracking-widest text-[10px] transition-colors">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ icon: Icon }) {
  return (
    <a href="#" className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-slate-900 dark:hover:bg-slate-800 hover:text-white transition-all duration-300">
      <Icon size={20} />
    </a>
  );
}
