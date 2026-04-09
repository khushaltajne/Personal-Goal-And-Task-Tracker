import { useState, useCallback } from "react";
import {
  Users,
  CheckCircle2,
  Target,
  Pencil,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  TrendingUp,
  Activity,
  BarChart3,
  AlertTriangle,
  RefreshCw,
  Search,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { dashboardApi } from "../api/dashboardApi";
import { Modal, Confirmation } from "../components/Modal";
import { useFetch } from "../hooks/useCustom";
import { Card, Button, Badge, Loading, Input, Select } from "../components/Common";
import { StatsCard, AnimatedNumber } from "../components/DataDisplay";

export default function AdminDashboardView({ stats, refetch }) {
  const fetchUsersFn = useCallback(() => dashboardApi.getUsers(), []);
  const { data: rawUsers, isLoading: usersLoading, error: usersError, refetch: refetchUsers } = useFetch(fetchUsersFn, []);

  const handleRefetch = () => { refetch(); refetchUsers(); };
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const allUsers = Array.isArray(rawUsers) ? rawUsers : [];
  const totalUsers = stats?.totalUsers ?? allUsers.length;
  const activeUsers = stats?.activeUsers ?? allUsers.filter(u => u.enabled).length;
  const inactiveUsers = totalUsers - activeUsers;
  const adminCount = allUsers.filter((u) => u.role === "ROLE_ADMIN").length;

  const openEdit = (user) => {
    setSelectedUser(user);
    setEditForm({ username: user.username, email: user.email, role: user.role, enabled: user.enabled });
    setEditModalOpen(true);
  };
  const openDelete = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };
  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await dashboardApi.updateUser(selectedUser.id, editForm);
      setEditModalOpen(false);
      handleRefetch();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };
  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await dashboardApi.deleteUser(selectedUser.id);
      setDeleteModalOpen(false);
      handleRefetch();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = allUsers.filter(
    (u) =>
      (u.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activePercent = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
  const adminPercent = totalUsers > 0 ? Math.round((adminCount / totalUsers) * 100) : 0;
  const tasksPerUser = totalUsers > 0 ? (stats?.totalTasks / totalUsers).toFixed(1) : 0;
  const goalsPerUser = totalUsers > 0 ? (stats?.totalGoals / totalUsers).toFixed(1) : 0;

  return (
    <div className="space-y-12 pb-20">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Users}
          label="Total Users"
          value={totalUsers}
          trend={{ direction: "up", value: 4 }}
          color="primary"
        />
        <StatsCard
          icon={UserCheck}
          label="Active Users"
          value={activeUsers}
          color="success"
        />
        <StatsCard
          icon={CheckCircle2}
          label="Total Tasks"
          value={stats?.totalTasks ?? 0}
          trend={{ direction: "up", value: 12 }}
          color="warning"
        />
        <StatsCard
          icon={Target}
          label="Total Goals"
          value={stats?.totalGoals ?? 0}
          color="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Analytics Panel */}
        <div className="lg:col-span-8">
          <Card premium className="h-full relative overflow-hidden group border-none dark:bg-slate-900 shadow-2xl dark:shadow-none p-10">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-transparent rounded-full blur-2xl opacity-50 group-hover:bg-indigo-500/10 transition-colors duration-700"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
              <div>
                <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight mb-1">System Analytics</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Monitoring system-wide user engagement and resource allocation.</p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleRefetch} className="rounded-xl font-black uppercase tracking-widest text-[10px] px-6">
                <RefreshCw size={14} className="mr-2" /> Synced Just Now
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              <div className="space-y-8">
                <div className="flex items-center justify-center p-8 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 relative group/donut">
                  <div className="relative w-40 h-40">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-100 dark:text-slate-800" />
                      <motion.circle
                        initial={{ strokeDasharray: "0 100" }}
                        animate={{ strokeDasharray: `${activePercent} ${100 - activePercent}` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx="18" cy="18" r="15.9" fill="none"
                        stroke="url(#gradient-success)" strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient-success" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tighter italic">
                        <AnimatedNumber value={activePercent} suffix="%" />
                      </span>
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Active</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <LegendRow color="bg-emerald-500" label="Active Users" count={activeUsers} />
                  <LegendRow color="bg-slate-300 dark:bg-slate-700" label="Inactive Users" count={inactiveUsers} />
                  <LegendRow color="bg-indigo-500" label="Admins" count={adminCount} />
                </div>
              </div>

              <div className="space-y-8 px-2">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Performance Metrics</h3>
                  <MetricBar label="Active User Rate" value={activePercent} color="bg-emerald-500" />
                  <MetricBar label="Admin Ratio" value={adminPercent} color="bg-indigo-500" />
                  <MetricBar label="Avg Tasks per User" value={Math.min(Math.round((tasksPerUser / 10) * 100), 100)} color="bg-amber-500" displayValue={tasksPerUser} />
                  <MetricBar label="Avg Goals per User" value={Math.min(Math.round((goalsPerUser / 5) * 100), 100)} color="bg-indigo-600" displayValue={goalsPerUser} />
                </div>

                <div className="p-6 bg-slate-900 dark:bg-indigo-900/40 rounded-[2rem] text-white relative overflow-hidden group/card shadow-2xl">
                   <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform duration-500 group-hover/card:scale-110">
                      <Activity size={64} />
                   </div>
                   <p className="text-[10px] font-black text-slate-500 dark:text-indigo-200 uppercase tracking-widest mb-2 leading-none">System Insight</p>
                   <h4 className="font-bold text-sm mb-4 leading-snug tracking-tight italic">Average user completion rate is trending <span className="text-emerald-400">+14% higher</span> this week.</h4>
                   <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">
                     Open Command Logs <ArrowUpRight size={14} />
                   </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Insights */}
        <div className="lg:col-span-4 space-y-8">
           <Card className="p-8 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-800">
                   <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-display font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">System Status</h3>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Health & Status</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <InsightItem icon={Users} color="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30" text={<><AnimatedNumber value={totalUsers} /> Total Population</>} />
                <InsightItem icon={UserCheck} color="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30" text={<><AnimatedNumber value={activeUsers} /> Authorized Access</>} />
                {inactiveUsers > 0 && (
                  <InsightItem icon={AlertTriangle} color="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20" text={<><AnimatedNumber value={inactiveUsers} /> Revoked Access</>} />
                )}
                <InsightItem icon={CheckCircle2} color="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30" text={<><AnimatedNumber value={stats?.totalTasks ?? 0} /> Active Deployments</>} />
                <InsightItem icon={Target} color="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30" text={<><AnimatedNumber value={stats?.totalGoals ?? 0} /> Strategic Objectives</>} />
                <InsightItem icon={Shield} color="text-indigo-800 dark:text-indigo-200 bg-indigo-100 dark:bg-indigo-800/50" text={<><AnimatedNumber value={adminCount} /> Master Command Keys</>} />
              </div>
           </Card>

           <div className="p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl opacity-50 group-hover:bg-white/20 transition-colors duration-700"></div>
             <Zap className="text-indigo-200 mb-8 transition-transform duration-500 group-hover:scale-110" size={32} />
             <h3 className="text-xl font-display font-black mb-3 tracking-tight italic">System Efficiency</h3>
             <p className="text-indigo-100/80 text-sm font-medium leading-relaxed mb-6">Your current infrastructure handles <span className="text-white font-bold">1.4M events</span> per period.</p>
             <div className="h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
               <motion.div 
                 initial={{ width: 0 }}
                 whileInView={{ width: '88%' }}
                 transition={{ duration: 2, ease: "easeOut" }}
                 className="h-full bg-white rounded-full shadow-lg shadow-white/20"
               />
             </div>
           </div>
        </div>
      </div>

      {/* User Management Table */}
      <Card premium className="relative overflow-hidden border-none dark:bg-slate-900 shadow-2xl dark:shadow-none p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-indigo-600 flex items-center justify-center text-white shadow-lg">
               <Shield size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight mb-1">User Command Console</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Managing access and roles across the tactical network.</p>
            </div>
          </div>
          
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search User..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-8 py-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white rounded-[1.5rem] focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none w-full transition-all font-bold text-sm"
            />
          </div>
        </div>

        <div className="relative z-10">
          {usersLoading && allUsers.length === 0 ? (
            <div className="py-24"><Loading /></div>
          ) : allUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mb-8 shadow-sm">
                <Users className="w-10 h-10 text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mb-2 tracking-tight">No Operators Identified</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">The system was unable to establish a link with any active entities.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                    <th className="px-8 py-2">User Entity</th>
                    <th className="px-8 py-2">Signal Address</th>
                    <th className="px-8 py-2">Command Level</th>
                    <th className="px-8 py-2">Link Status</th>
                    <th className="px-8 py-2 text-right">Overrides</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-32">
                           <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest italic">Zero matches in current search scope.</p>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((u, idx) => (
                        <motion.tr 
                          key={u.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: idx * 0.03 }}
                          className="group bg-slate-50/50 dark:bg-slate-800/20 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-600/5 transition-all duration-300"
                        >
                          <td className="px-8 py-6 rounded-l-[2rem]">
                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-[1.2rem] bg-indigo-600/5 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-base group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm ring-1 ring-indigo-500/10 focus-ring">
                                {(u.username || u.email || "?")[0].toUpperCase()}
                              </div>
                              <div>
                                 <p className="font-display font-black text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors normal-case text-base leading-none mb-1">{u.username || "—"}</p>
                                 <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Lvl {idx + 1} Profile</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                             <p className="text-sm font-bold text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{u.email}</p>
                          </td>
                          <td className="px-8 py-6">
                            <Badge variant={u.role === "ROLE_ADMIN" ? "info" : "neutral"} className="font-black italic px-4 py-1.5 rounded-xl uppercase tracking-widest text-[9px]">
                              {u.role === "ROLE_ADMIN" ? "ADMIN" : "USER"}
                            </Badge>
                          </td>
                          <td className="px-8 py-6">
                            {u.enabled ? (
                              <div className="flex items-center gap-3">
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-sm"></span>
                                </span>
                                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">Healthy Link</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest leading-none">Severed Link</span>
                              </div>
                            )}
                          </td>
                          <td className="px-8 py-6 rounded-r-[2rem]">
                            <div className="flex items-center justify-end gap-3 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                              <button
                                onClick={() => openEdit(u)}
                                className="w-10 h-10 rounded-[1rem] bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm"
                              >
                                <div className="flex items-center justify-center h-full"><Pencil size={14} /></div>
                              </button>
                              <button
                                onClick={() => openDelete(u)}
                                className="w-10 h-10 rounded-[1rem] bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-sm"
                              >
                                <div className="flex items-center justify-center h-full"><Trash2 size={14} /></div>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {/* Edit User Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Admin Override Grid"
        size="md"
        footerButtons={
          <>
            <Button variant="secondary" onClick={() => setEditModalOpen(false)} className="rounded-2xl px-10">Abort</Button>
            <Button onClick={handleSaveEdit} disabled={saving} className="rounded-2xl px-10">
              {saving ? "Processing..." : "Commit Override"}
            </Button>
          </>
        }
      >
        <div className="space-y-8 py-6">
          <Input 
            label="Entity Identifier" 
            value={editForm.username || ""} 
            onChange={(e) => setEditForm((f) => ({ ...f, username: e.target.value }))} 
            className="rounded-[1.2rem]"
          />
          <Input 
            label="Signal Pathway (Email)" 
            type="email" 
            value={editForm.email || ""} 
            onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} 
            className="rounded-[1.2rem]"
          />
          <Select 
            label="Strategic Role Allocation" 
            value={editForm.role || "ROLE_USER"} 
            onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
            options={[
              { label: "Limited Operator (USER)", value: "ROLE_USER" },
              { label: "Full Command (ADMIN)", value: "ROLE_ADMIN" }
            ]}
            className="rounded-[1.2rem]"
          />
          <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
            <div>
               <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-2">Protocol Access</p>
               <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verify or suspend system-wide access.</p>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={editForm.enabled ?? true} 
                onChange={(e) => setEditForm((f) => ({ ...f, enabled: e.target.checked }))} 
              />
              <div className="w-14 h-8 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600 transition-colors shadow-inner"></div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Confirmation
        isOpen={deleteModalOpen}
        title="Sever Entity Access"
        message={`Are you sure you want to permanently sever access for user "${selectedUser?.username || selectedUser?.email}"? All tactical logs associated with this entity will be purged from the central grid.`}
        confirmText="Confirm Purge"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        variant="danger"
      />
    </div>
  );
}

// Sub-components
function MetricBar({ label, value, color, displayValue }) {
  return (
    <div className="group/bar">
      <div className="flex justify-between items-center mb-3 px-1">
        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover/bar:text-indigo-600 dark:group-hover/bar:text-indigo-400 transition-colors leading-none">{label}</span>
        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tighter italic leading-none">{displayValue ?? `${value}%`}</span>
      </div>
      <div className="h-4 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden p-0.5 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full ${color} rounded-full shadow-lg shadow-current/20`}
        />
      </div>
    </div>
  );
}

function LegendRow({ color, label, count }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-[1.5rem] transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800 group">
      <div className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${color} shadow-lg shadow-current/50 group-hover:scale-110 transition-transform`} />
        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-sm font-black text-slate-900 dark:text-white italic">{count}</span>
    </div>
  );
}

function InsightItem({ icon: Icon, color, text }) {
  return (
    <div className="flex items-center gap-5 p-5 rounded-[1.5rem] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
      <div className={`w-12 h-12 rounded-[1.2rem] ${color} flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-sm group-hover:scale-105 group-hover:rotate-6`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest leading-snug">{text}</p>
    </div>
  );
}
