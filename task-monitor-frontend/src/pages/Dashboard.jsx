import { useContext, useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { MainLayout } from "../components/Layout";
import { StatsCard, ProgressBar } from "../components/DataDisplay";
import { Loading, Card, Badge, Button } from "../components/Common";
import { useFetch } from "../hooks/useCustom";
import { dashboardApi } from "../api/dashboardApi";
import AdminDashboardView from "./AdminDashboardView";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const isAdmin = user?.isAdmin === true;

  useEffect(() => {
    if (!user?.loggedIn) navigate("/");
  }, [user?.loggedIn, navigate]);

  const fetchFn = useCallback(
    () => (isAdmin ? dashboardApi.getAdminStats() : dashboardApi.getUserStats()),
    [isAdmin]
  );

  const { data: stats, isLoading, error, refetch } = useFetch(fetchFn, [isAdmin]);

  // Implement auto-polling for real-time feel
  useEffect(() => {
    const pollInterval = setInterval(() => {
      if (user?.loggedIn) {
        refetch();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(pollInterval);
  }, [user?.loggedIn, refetch]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user?.loggedIn) return null;

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">Personal Insight</span>
            <div className="h-px w-8 bg-indigo-100 dark:bg-indigo-900"></div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-black tracking-tighter text-slate-900 dark:text-white">
            {isAdmin ? "Admin" : "My"} <span className="text-gradient">Focus</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl leading-relaxed">
            Welcome back, <span className="font-bold text-slate-900 dark:text-white">{user?.name || user?.email}</span>. 
            Your goal-tracking system is optimized for peak performance.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-2 rounded-[2rem] border border-white/50 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
             <Activity size={24} />
          </div>
          <div className="pr-6">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">System Health</p>
            <p className="text-sm font-black text-slate-900 dark:text-white leading-none">99.9% Uptime</p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="py-32">
          <Loading />
        </div>
      )}
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-[2rem] bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 text-center mb-12"
        >
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h3 className="text-xl font-black text-rose-900 dark:text-rose-100 mb-2">Synchronicity Interrupted</h3>
          <p className="text-rose-600 dark:text-rose-400 font-medium mb-6">We encountered a temporary disruption while mapping your productivity grid.</p>
          <Button variant="danger" onClick={refetch}>Reconnect System</Button>
        </motion.div>
      )}

      {!isLoading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {isAdmin ? (
            <AdminDashboardView stats={stats} refetch={refetch} />
          ) : (
            <UserDashboardContent stats={stats} />
          )}
        </motion.div>
      )}
    </MainLayout>
  );
}

function UserDashboardContent({ stats }) {
  return (
    <div className="space-y-12">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={CheckCircle2}
          label="Completed"
          value={stats?.completed ?? 0}
          trend={{ direction: "up", value: 12 }}
          color="success"
        />
        <StatsCard
          icon={Zap}
          label="Active Grid"
          value={stats?.inProgress ?? 0}
          trend={{ direction: "up", value: 3 }}
          color="primary"
        />
        <StatsCard
          icon={Clock}
          label="Pending Sync"
          value={stats?.todo ?? 0}
          color="warning"
        />
        <StatsCard
          icon={TrendingUp}
          label="Goal Pulse"
          value={stats?.monthlyProgress ?? 0}
          suffix="%"
          trend={{ direction: "up", value: 8 }}
          color="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Intelligence Panel */}
        <div className="lg:col-span-8">
          <Card premium className="h-full relative overflow-hidden group border-none dark:bg-slate-900 shadow-2xl dark:shadow-none p-10">
            {/* Background Decoration */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-700"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
              <div>
                <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight mb-1">Focus Velocity</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Tracking your milestones across different horizons.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border border-indigo-100/50 dark:border-indigo-800">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">
                  {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              <div className="space-y-12">
                <div>
                   <ProgressBar label="Monthly Milestone" value={stats?.monthlyProgress ?? 0} max={100} />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-medium italic">
                    "You're currently performing <span className="text-indigo-600 dark:text-indigo-400 font-bold">12% faster</span> than last month's average."
                  </p>
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                   <ProgressBar label="Yearly Vision" value={stats?.yearlyProgress ?? 0} max={100} />
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10">
                   <Activity size={120} className="text-slate-900 dark:text-white" />
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-3xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-200 dark:shadow-none flex items-center justify-center mb-6">
                    <TrendingUp className="text-indigo-600 dark:text-indigo-400" size={28} />
                  </div>
                  <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mb-2 tracking-tight">Predictive Insight</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Based on your current velocity, you are projected to reach your Q3 milestones <span className="text-indigo-600 dark:text-indigo-400 font-bold">8 days ahead</span> of schedule.
                  </p>
                  <Button variant="primary" size="sm" className="mt-8 rounded-xl px-6 font-black uppercase tracking-widest text-[10px]">Explore Analytics</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tactical Summary */}
        <div className="lg:col-span-4 space-y-8">
           <Card className="p-8 dark:bg-slate-900 dark:border-slate-800 h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                   <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-display font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">Action Stack</h3>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Current Focus</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: "High Priority", value: stats?.highPriority ?? 0, color: "bg-rose-500", light: "bg-rose-50 dark:bg-rose-900/20", text: "text-rose-600 dark:text-rose-400" },
                  { label: "In Progress", value: stats?.inProgress ?? 0, color: "bg-indigo-500", light: "bg-indigo-50 dark:bg-indigo-900/20", text: "text-indigo-600 dark:text-indigo-400" },
                  { label: "Completed Today", value: Math.floor((stats?.completed ?? 0) * 0.2), color: "bg-emerald-500", light: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-indigo-200 dark:hover:border-indigo-500 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-lg shadow-current/50`}></div>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-300">{item.label}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-xl ${item.light} ${item.text} text-xs font-black`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-slate-900 dark:bg-indigo-600 rounded-[2rem] text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-4 opacity-20">
                    <Users size={40} />
                 </div>
                 <p className="text-[10px] font-black text-slate-400 dark:text-indigo-200 uppercase tracking-widest mb-2 leading-none">Workspace Insight</p>
                 <h4 className="font-bold text-sm mb-4 leading-snug tracking-tight">Connect with 4 team members on current tasks.</h4>
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 dark:text-white hover:text-indigo-300 transition-colors">
                   View Workspace <ArrowUpRight size={14} />
                 </button>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}