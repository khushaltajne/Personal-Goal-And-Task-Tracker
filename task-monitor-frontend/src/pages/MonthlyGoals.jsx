import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Edit2, Calendar, Target, ChevronRight, Zap, TrendingUp } from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { MainLayout } from "../components/Layout";
import { Table, StatsCard, ProgressBar } from "../components/DataDisplay";
import { Card, Button, Input, Select, Badge } from "../components/Common";
import { Modal, Confirmation } from "../components/Modal";
import { FormInput, FormSelect, FormTextarea, Form } from "../components/Form";
import { useForm } from "../hooks/useCustom";
import { monthlyGoalApi } from "../api/monthlyGoalApi";
import { yearlyGoalApi } from "../api/yearlyGoalApi";

export default function MonthlyGoals() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [yearlyGoals, setYearlyGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));

  const form = useForm(
    {
      title: '',
      description: '',
      targetValue: '',
      currentValue: '',
      yearlyGoalId: '',
      month: selectedMonth
    },
    handleSubmitForm
  );

  async function handleSubmitForm(values) {
    try {
      setIsLoading(true);
      const payload = {
        title: values.title,
        description: values.description,
        targetValue: Number(values.targetValue) || 0,
        currentValue: Number(values.currentValue) || 0,
        yearlyGoalId: values.yearlyGoalId,
        month: values.month || selectedMonth
      };

      if (selectedGoal?.id) {
        alert('Updating monthly goals is not currently supported by the backend. Please delete and create a new goal.');
        return;
      } else {
        await monthlyGoalApi.create(payload);
      }
      fetchGoals();
      setIsModalOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error saving goal:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchGoals() {
    try {
      setIsLoading(true);
      const currentYear = new Date(selectedMonth + '-01').getFullYear();
      const yrResp = await yearlyGoalApi.getAll(currentYear);
      setYearlyGoals(yrResp.data || []);

      const mResp = await monthlyGoalApi.getAll();
      setGoals(mResp.data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    form.setValues(goal);
    setIsModalOpen(true);
  };

  const handleDeleteGoal = async () => {
    try {
      setIsLoading(true);
      await monthlyGoalApi.delete(selectedGoal.id);
      fetchGoals();
      setIsDeleteConfirmOpen(false);
      setSelectedGoal(null);
    } catch (error) {
      console.error('Error deleting goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (!user?.loggedIn) {
      navigate("/");
    } else {
      fetchGoals();
    }
  }, [user, navigate]);

  const filteredGoals = goals.filter(g => g.month === selectedMonth);
  const totalGoals = filteredGoals.length;
  const completedGoals = filteredGoals.filter(g => g.completed || (g.targetValue > 0 && g.currentValue >= g.targetValue)).length;
  const avgProgress = filteredGoals.length > 0 
    ? Math.round(filteredGoals.reduce((sum, g) => {
        const prog = (g.targetValue && g.targetValue > 0) 
          ? Math.min(100, (g.currentValue / g.targetValue) * 100) 
          : (g.progress || 0);
        return sum + prog;
      }, 0) / filteredGoals.length)
    : 0;

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(new Date().getFullYear(), i);
    const value = date.toISOString().substring(0, 7);
    return { value, label: date.toLocaleString('en-US', { month: 'long', year: 'numeric' }) };
  });

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100">Milestones</span>
            <div className="h-px w-8 bg-indigo-100"></div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-black tracking-tighter text-slate-900 dark:text-white">
            Monthly <span className="text-gradient">Milestones</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl leading-relaxed">
            Design your path by setting meaningful milestones for this month.
          </p>
        </div>
        <Button 
          size="lg" 
          onClick={() => {
            setSelectedGoal(null);
            form.reset();
            setIsModalOpen(true);
          }}
          className="shadow-2xl shadow-indigo-200"
        >
          <Plus size={20} className="mr-2 stroke-[3]" />
          Add Milestone
        </Button>
      </div>

      {/* Selectors and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Month Selector */}
        <div className="lg:col-span-4 self-start">
          <Card premium className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                  <Calendar size={20} />
                </div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Timeframe</h2>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 leading-relaxed">Select a month to view and manage your personal milestones.</p>
            </div>
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block p-4 pr-12 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all cursor-pointer shadow-sm"
              >
                {months.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-indigo-500">
                <Calendar size={18} />
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatsCard
            icon={Zap}
            label="Active Milestones"
            value={totalGoals}
            color="primary"
            trend={{ direction: 'up', value: 12 }}
          />
          <StatsCard
            icon={Target}
            label="Achieved"
            value={completedGoals}
            color="success"
          />
          <StatsCard
            icon={TrendingUp}
            label="Avg Velocity"
            value={`${avgProgress}%`}
            color="warning"
          />
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredGoals.map((goal, index) => {
            const progress = (goal.targetValue && goal.targetValue > 0) 
              ? Math.min(100, (goal.currentValue / goal.targetValue) * 100) 
              : (goal.progress || 0);
            const isCompleted = progress >= 100;
            
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                key={goal.id}
              >
                <Card className="h-full flex flex-col group relative overflow-hidden">
                  {isCompleted && (
                    <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-emerald-500/10 rounded-full blur-2xl"></div>
                  )}
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {isCompleted ? (
                          <Badge variant="success">Completed</Badge>
                        ) : (
                          <Badge variant="info">In Progress</Badge>
                        )}
                        {goal.yearlyGoalId && <Badge variant="neutral">Yearly Vision</Badge>}
                      </div>
                      <h3 className="text-xl font-display font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight line-clamp-1">{goal.title}</h3>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedGoal(goal);
                          setIsDeleteConfirmOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-8 leading-relaxed italic pr-4">
                      "{goal.description}"
                    </p>
                  )}

                  <div className="mt-auto space-y-8">
                    <ProgressBar value={progress} max={100} label="Completion Status" />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50/80 dark:bg-slate-800/40 p-4 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 group-hover:border-indigo-100 dark:group-hover:border-indigo-800 transition-all">
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Current</p>
                        <p className="font-display font-black text-slate-900 dark:text-white text-2xl tracking-tighter ring-offset-2">{goal.currentValue}</p>
                      </div>
                      <div className="bg-slate-50/80 dark:bg-slate-800/40 p-4 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 group-hover:border-indigo-100 dark:group-hover:border-indigo-800 transition-all">
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Target</p>
                        <p className="font-display font-black text-slate-900 dark:text-white text-2xl tracking-tighter ring-offset-2">{goal.targetValue}</p>
                      </div>
                    </div>
                  </div>

                  {isCompleted && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mt-6 flex items-center justify-center gap-2 p-3 bg-emerald-50 rounded-2xl border border-emerald-100"
                    >
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-glow"></div>
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">Milestone Achieved</span>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredGoals.length === 0 && !isLoading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 card-elevated border-dashed border-2 border-slate-200 bg-slate-50/30 rounded-[3rem]"
        >
          <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 flex items-center justify-center mx-auto mb-10 animate-float">
            <Calendar size={40} className="text-indigo-400" />
          </div>
          <h3 className="text-3xl font-display font-black text-slate-900 mb-4 tracking-tight uppercase">Milestone Vacuum</h3>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed mb-10 text-lg">
            No milestones found for this timeframe. Every journey begins with a single defined milestone.
          </p>
          <Button
            size="lg"
            onClick={() => {
              setSelectedGoal(null);
              form.reset();
              setIsModalOpen(true);
            }}
            className="shadow-2xl shadow-indigo-200 px-10"
          >
            Initiate Expansion
          </Button>
        </motion.div>
      )}

      {/* Goal Creation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedGoal ? 'Refine Milestone' : 'New Milestone'}
        size="lg"
        footerButtons={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={form.handleSubmit} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Set Milestone'}
            </Button>
          </>
        }
      >
        <Form onSubmit={form.handleSubmit} className="space-y-6 pt-2">
          <Input
            label="Milestone Name"
            name="title"
            placeholder="e.g., Learn 50 New Words"
            value={form.values.title}
            onChange={form.handleChange}
            error={form.errors.title}
            required
            helperText="Provide a clear name for this milestone."
          />
          <FormTextarea
            label="Personal Notes"
            name="description"
            placeholder="Details about this milestone..."
            value={form.values.description}
            onChange={form.handleChange}
            className="min-h-[120px]"
          />
          <Select
            label="Link to Yearly Vision"
            name="yearlyGoalId"
            options={yearlyGoals.map(g => ({ value: g.id, label: g.title }))}
            value={form.values.yearlyGoalId}
            onChange={form.handleChange}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Target Milestone"
              name="targetValue"
              type="number"
              value={form.values.targetValue}
              onChange={form.handleChange}
              required
            />
            <Input
              label="Initial Progress"
              name="currentValue"
              type="number"
              value={form.values.currentValue}
              onChange={form.handleChange}
            />
          </div>
        </Form>
      </Modal>

      <Confirmation
        isOpen={isDeleteConfirmOpen}
        title="Remove Milestone"
        message={`Are you certain you wish to delete "${selectedGoal?.title}"? This milestone cannot be recovered.`}
        confirmText="Remove Milestone"
        onConfirm={handleDeleteGoal}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        variant="danger"
      />
    </MainLayout>
  );
}
