import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Target,
  Calendar,
  LogOut,
  Menu,
  X,
  Bell,
  ArrowUpRight,
  ChevronRight,
  Zap,
  StickyNote
} from 'lucide-react';
import { useWindowSize } from '../hooks/useCustom';
import ThemeToggle from './ThemeToggle';
import NotesDrawer from './NotesDrawer';

const menuItems = [
  { path: '/dashboard', label: 'My Insight', icon: LayoutDashboard },
  { path: '/tasks', label: 'Daily Actions', icon: CheckSquare },
  { path: '/monthly-goals', label: 'Monthly Milestones', icon: Calendar },
  { path: '/yearly-goals', label: 'Yearly Visions', icon: Target },
];

export const Navbar = ({ user, onLogout, hamburgerOpen, setHamburgerOpen }) => {
  return (
    <nav className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border-b border-white/40 dark:border-slate-800/40 sticky top-0 z-40 transition-all duration-500">
      <div className="px-6 py-4 flex justify-between items-center max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setHamburgerOpen(!hamburgerOpen)}
            className="lg:hidden p-2.5 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800 hover:shadow-sm transition-all active:scale-90"
          >
            {hamburgerOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-200 dark:shadow-none group-hover:rotate-6 transition-transform">
              <CheckSquare size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white hidden sm:block">
              Goal<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-700">
            <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Workspace</button>
            <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-700 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-600">Personal</button>
          </div>

          <button className="relative p-2.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all hidden sm:block border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-4 ring-white dark:ring-slate-900"></span>
          </button>

          <ThemeToggle />

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-[13px] font-bold text-slate-900 dark:text-white leading-none mb-1 text-right truncate max-w-[150px]">{user?.email?.split('@')[0] || 'Achiever'}</span>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${
                user?.isAdmin 
                  ? 'text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/30' 
                  : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30'
              }`}>
                {user?.isAdmin ? 'ELITE TRACK' : 'PERSONAL TRACK'}
              </span>
            </div>
            <div className="flex-shrink-0 w-10 h-10 rounded-[1.2rem] bg-indigo-600/5 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black shadow-sm group-hover:shadow-md transition-shadow ring-1 ring-indigo-500/10">
              {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all sm:ml-2 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 active:scale-90"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export const Sidebar = ({ isOpen, setOpen, isCollapsed, setIsCollapsed, user, onNotesToggle }) => {
  const location = useLocation();
  const { width } = useWindowSize();
  const isMobile = width < 1024;
  const collapsed = isCollapsed && !isMobile;

  return (
    <>
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.aside 
            initial={isMobile ? { x: -300 } : false}
            animate={{ x: 0, width: collapsed ? 88 : 300 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`
              fixed lg:sticky top-0 left-0 h-full bg-slate-900 dark:bg-slate-950 text-slate-100
              z-50 lg:z-30 border-r border-slate-800 dark:border-slate-800 flex flex-col
            `}
          >
            {/* Toggle Button for Desktop */}
            {!isMobile && (
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-8 w-6 h-6 bg-slate-800 dark:bg-slate-900 hover:bg-indigo-600 rounded-full flex items-center justify-center text-white border border-slate-700 dark:border-slate-800 shadow-md transition-colors z-[60]"
              >
                <ChevronRight size={14} className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
              </button>
            )}

            <div className={`p-8 flex-1 overflow-y-auto scroll-thin overflow-x-hidden ${collapsed ? 'px-4' : ''}`}>
              <div className={`mb-12 flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20 flex-shrink-0">
                  <CheckSquare size={20} className="text-white" />
                </div>
                {!collapsed && (
                  <motion.h2 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="text-xl font-display font-black text-white tracking-tight italic"
                  >
                    Goal<span className="text-indigo-400">Flow</span>
                  </motion.h2>
                )}
              </div>
              
              <div className="space-y-2">
                {!collapsed && (
                  <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Main Navigation</p>
                )}
                {menuItems.map(({ path, label, icon: Icon }) => {
                  const isActive = location.pathname === path;
                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => isMobile && setOpen(false)}
                      title={collapsed ? label : undefined}
                      className={`flex items-center gap-4 py-4 rounded-2xl transition-all duration-300 group ${
                        isActive
                          ? 'bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-500/20'
                          : 'text-slate-400 dark:text-slate-500 hover:text-white hover:bg-slate-800/50'
                      } ${collapsed ? 'justify-center px-0' : 'px-4'}`}
                    >
                      <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} transition-colors duration-300`} />
                      {!collapsed && <span className="flex-1 whitespace-nowrap text-sm font-bold uppercase tracking-widest">{label}</span>}
                      {!collapsed && isActive && <ChevronRight size={14} className="opacity-50 flex-shrink-0" />}
                    </Link>
                  );
                })}

                {/* Notes Component Toggle */}
                <button
                  onClick={onNotesToggle}
                  title={collapsed ? "Strategic Notes" : undefined}
                  className={`w-full flex items-center gap-4 py-4 rounded-2xl transition-all duration-300 group text-slate-400 dark:text-slate-500 hover:text-white hover:bg-slate-800/50 ${collapsed ? 'justify-center px-0' : 'px-4'}`}
                >
                  <StickyNote size={20} className="flex-shrink-0 text-slate-500 group-hover:text-amber-400 transition-colors duration-300" />
                  {!collapsed && <span className="flex-1 text-left whitespace-nowrap text-sm font-bold uppercase tracking-widest">Strategic Notes</span>}
                </button>
              </div>
              
              <AnimatePresence>
                {!collapsed && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-16 p-6 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-indigo-900 border border-indigo-500/30 relative overflow-hidden shadow-2xl group"
                  >
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
                      <Zap size={80} />
                    </div>

                    <div className="relative z-10 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 mx-auto border border-white/20">
                        <Target size={22} className="text-white" />
                      </div>
                      <h4 className="font-bold text-white text-[15px] mb-1">Unleash Potential</h4>
                      <p className="text-[11px] text-indigo-100/70 mb-5 leading-relaxed">Upgrade to unlock advanced predictive goal analysis.</p>
                      <button className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-indigo-900 bg-white hover:bg-indigo-50 rounded-xl transition-all shadow-xl active:scale-95">
                        Go Premium
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar Footer */}
            <div className={`p-8 border-t border-white/5 dark:border-slate-800 bg-slate-900/50 flex items-center ${collapsed ? 'justify-center px-4' : 'gap-4'}`}>
              <div className="w-12 h-12 flex-shrink-0 rounded-[1.2rem] bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-indigo-500/10">
                {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-white truncate italic">{user?.email?.split('@')[0] || 'Achiever'}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest truncate ${user?.isAdmin ? 'text-rose-400' : 'text-indigo-400'}`}>
                    {user?.isAdmin ? 'Elite Track' : 'Personal Track'}
                  </p>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export const MainLayout = ({ children, user, onLogout }) => {
  const [hamburgerOpen, setHamburgerOpen] = React.useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = React.useState(false);
  const [isNotesOpen, setIsNotesOpen] = React.useState(false);

  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans flex text-slate-900 dark:text-slate-100 selection:bg-indigo-100 dark:selection:bg-indigo-900/30 selection:text-indigo-900 dark:selection:text-indigo-100 overflow-hidden relative transition-colors duration-300">
      <Sidebar 
        isOpen={hamburgerOpen} 
        setOpen={setHamburgerOpen} 
        isCollapsed={isDesktopCollapsed}
        setIsCollapsed={setIsDesktopCollapsed}
        user={user} 
        onNotesToggle={() => {
          setIsNotesOpen(!isNotesOpen);
          if (hamburgerOpen) setHamburgerOpen(false);
        }}
      />
      
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {hamburgerOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 lg:hidden"
            onClick={() => setHamburgerOpen(false)}
          />
        )}
      </AnimatePresence>
      
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden transition-all duration-300">
        <Navbar 
          user={user} 
          onLogout={onLogout}
          hamburgerOpen={hamburgerOpen}
          setHamburgerOpen={setHamburgerOpen}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full scroll-smooth">
          <div className="max-w-[1400px] mx-auto p-6 sm:p-8 lg:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Floating gradient blobs */}
        <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-indigo-500/[0.03] dark:bg-indigo-500/[0.05] rounded-full blur-[120px] pointer-events-none"></div>
        <div className="fixed bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-rose-500/[0.03] dark:bg-rose-500/[0.05] rounded-full blur-[120px] pointer-events-none"></div>

        <NotesDrawer isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} />
      </div>
    </div>
  );
};
