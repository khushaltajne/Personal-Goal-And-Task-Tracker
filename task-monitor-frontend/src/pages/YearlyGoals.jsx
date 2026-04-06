import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Edit2, Target, Trophy, Calendar, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { MainLayout } from "../components/Layout";
import { Table, StatsCard, ProgressBar } from "../components/DataDisplay";
import { Card, Button, Input, Select, Badge, Loading } from "../components/Common";
import { Modal, Confirmation } from "../components/Modal";
import { FormInput, FormTextarea, Form } from "../components/Form";
import { useForm } from "../hooks/useCustom";
import { yearlyGoalApi } from "../api/yearlyGoalApi";
import { formatDate } from "../utils/helpers";

export default function YearlyGoals() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const form = useForm(
    {
      title: '',
      description: '',
      targetValue: '',
      currentValue: '',
      deadline: ''
    },
    handleSubmitForm
  );

  async function handleSubmitForm(values) {
    try {
      setIsLoading(true);
      const payload = {
        ...values,
        targetValue: Number(values.targetValue) || 0,
        currentValue: Number(values.currentValue) || 0,
        year: values.deadline ? new Date(values.deadline).getFullYear() : new Date().getFullYear(),
        status: 'ACTIVE'
      };
      if (selectedGoal?.id) {
        await yearlyGoalApi.update(selectedGoal.id, payload);
      } else {
        await yearlyGoalApi.create(payload);
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
      const response = await yearlyGoalApi.getAll();
      setGoals(response.data || []);
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
      await yearlyGoalApi.delete(selectedGoal.id);
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

  const totalGoals = goals.length;
  const activeGoals = goals.filter(g => !g.status || g.status.toUpperCase() === 'ACTIVE').length;
  const avgProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, g) => {
        const prog = (g.targetValue && g.targetValue > 0) 
          ? (g.currentValue / g.targetValue) * 100 
          : (g.progress || 0);
        return sum + prog;
      }, 0) / goals.length)
    : 0;

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100 italic">Long-term Vision</span>
            <div className="h-px w-8 bg-indigo-100"></div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-black tracking-tighter text-slate-900">
            Yearly <span className="text-gradient">Visions</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
            Architect your life by defining high-impact yearly visions and dreams.
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
          Set Vision
        </Button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <StatsCard
          icon={Trophy}
          label="Total Visions"
          value={totalGoals}
          color="primary"
        />
        <StatsCard
          icon={ShieldCheck}
          label="Active Visions"
          value={activeGoals}
          color="success"
        />
        <StatsCard
          icon={Zap}
          label="Total Progress"
          value={`${avgProgress}%`}
          color="warning"
        />
      </div>

      {isLoading && goals.length === 0 ? (
        <div className="py-24">
          <Loading />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {goals.map((goal, idx) => {
              const progress = (goal.targetValue && goal.targetValue > 0) 
                ? (goal.currentValue / goal.targetValue) * 100 
                : (goal.progress || 0);
              const deadlineDate = goal.deadline ? new Date(goal.deadline) : null;
              const isOverdue = deadlineDate && deadlineDate < new Date() && progress < 100;
              
              return (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card premium className="h-full flex flex-col group hover:-translate-y-2 transition-transform duration-500">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600/5 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-lg shadow-indigo-500/10">
                        <Target size={24} />
                      </div>
                      <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

                    <h3 className="text-xl font-display font-black text-slate-900 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors">
                      {goal.title}
                    </h3>
                    
                    {goal.description && (
                      <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed italic">
                        "{goal.description}"
                      </p>
                    )}

                    <div className="mt-auto space-y-6">
                      <div>
                        <div className="flex justify-between items-end mb-3">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                          <span className="text-sm font-black text-slate-900">{Math.round(progress)}%</span>
                        </div>
                        <ProgressBar value={progress} max={100} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current</p>
                          <p className="text-xl font-display font-black text-slate-900 tracking-tighter">{goal.currentValue}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target</p>
                          <p className="text-xl font-display font-black text-slate-900 tracking-tighter">{goal.targetValue}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {goal.deadline ? formatDate(goal.deadline) : 'NO DEADLINE'}
                          </span>
                        </div>
                        {isOverdue && (
                          <Badge variant="danger" className="animate-pulse">CRITICAL</Badge>
                        )}
                        {progress >= 100 && (
                          <Badge variant="success">ACHIEVED</Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {goals.length === 0 && !isLoading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 rounded-[3rem] border-2 border-dashed border-slate-200 mt-12 bg-slate-50/20"
        >
          <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 flex items-center justify-center mx-auto mb-8 animate-float">
            <Trophy size={40} className="text-indigo-400" />
          </div>
          <h3 className="text-2xl font-display font-black text-slate-900 mb-2 uppercase tracking-tight">Visionary Void</h3>
          <p className="text-slate-500 max-w-sm mx-auto leading-relaxed mb-10 font-medium">
            You haven't defined any yearly visions yet. Map out your path to fulfillment.
          </p>
          <Button
            size="lg"
            onClick={() => {
              setSelectedGoal(null);
              form.reset();
              setIsModalOpen(true);
            }}
            className="shadow-2xl shadow-indigo-200 px-12"
          >
            Chart New Vision
          </Button>
        </motion.div>
      )}

      {/* Goal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedGoal ? 'Refine Vision' : 'Initialize Vision'}
        size="lg"
        footerButtons={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={form.handleSubmit} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Set Vision'}
            </Button>
          </>
        }
      >
        <Form onSubmit={form.handleSubmit} className="space-y-6 pt-2">
          <Input
            label="Vision Name"
            name="title"
            placeholder="e.g., Run a Marathon"
            value={form.values.title}
            onChange={form.handleChange}
            error={form.errors.title}
            required
          />
          <FormTextarea
            label="Personal Notes"
            name="description"
            placeholder="Details about your vision..."
            value={form.values.description}
            onChange={form.handleChange}
            className="min-h-[120px]"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Target Metric"
              name="targetValue"
              type="number"
              placeholder="100"
              value={form.values.targetValue}
              onChange={form.handleChange}
              required
            />
            <Input
              label="Current Progress"
              name="currentValue"
              type="number"
              placeholder="0"
              value={form.values.currentValue}
              onChange={form.handleChange}
            />
          </div>
          <Input
            label="Target Date"
            name="deadline"
            type="date"
            value={form.values.deadline}
            onChange={form.handleChange}
            required
          />
        </Form>
      </Modal>

      <Confirmation
        isOpen={isDeleteConfirmOpen}
        title="Remove Vision"
        message={`Are you certain you wish to remove "${selectedGoal?.title}"? This vision will be deleted.`}
        confirmText="Remove Vision"
        onConfirm={handleDeleteGoal}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        variant="danger"
      />
    </MainLayout>
  );
}