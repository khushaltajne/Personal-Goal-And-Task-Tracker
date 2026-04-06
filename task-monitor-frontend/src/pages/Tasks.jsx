import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  CheckCircle,
  Play,
  Edit2,
  LayoutList,
  Calendar as CalendarIcon,
  Filter,
  Target,
  Search,
  ChevronRight,
  Zap,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { MainLayout } from "../components/Layout";
import { Table } from "../components/DataDisplay";
import { Card, Button, Input, Select, Badge } from "../components/Common";
import { Modal, Confirmation } from "../components/Modal";
import { FormInput, FormSelect, FormTextarea, Form } from "../components/Form";
import { useForm } from "../hooks/useCustom";
import { taskApi } from "../api/taskApi";
import { monthlyGoalApi } from "../api/monthlyGoalApi";
import { formatDate } from "../utils/helpers";

export default function Tasks() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // goal dropdown data
  const [monthlyGoals, setMonthlyGoals] = useState([]);

  const form = useForm(
    {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      status: 'pending',
      monthlyGoalId: ''
    },
    handleSubmitForm
  );

  async function handleSubmitForm(values) {
    try {
      setIsLoading(true);
      const backendValues = {
        title: values.title,
        description: values.description,
        monthlyGoalId: values.monthlyGoalId,
        status: values.status === 'pending' ? 'TODO' :
          values.status === 'in-progress' ? 'IN_PROGRESS' :
            values.status?.toUpperCase() || 'TODO',
        priority: values.priority?.toUpperCase() || 'MEDIUM'
      };

      if (values.dueDate && values.dueDate.trim() !== "") {
        backendValues.dueDate = values.dueDate;
      }

      if (selectedTask?.id) {
        await taskApi.update(selectedTask.id, backendValues);
      } else {
        await taskApi.create(backendValues);
      }
      fetchTasks();
      setIsModalOpen(false);
      form.reset();
    } catch (error) {
      if (error.response?.status === 403) {
        alert(error.response?.data || 'Forbidden: you may not own the selected goal');
      } else {
        console.error('Error saving task:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchTasks() {
    try {
      setIsLoading(true);
      const response = await taskApi.getAll();
      const tasksData = response.data.content || response.data || [];

      const mappedTasks = tasksData.map(task => ({
        ...task,
        status: task.status === 'TODO' ? 'pending' :
          task.status === 'IN_PROGRESS' ? 'in-progress' :
            task.status?.toLowerCase() || 'pending',
        priority: task.priority?.toLowerCase() || 'medium',
        createdAt: task.createdAt
      }));

      setTasks(mappedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditTask = (task) => {
    setSelectedTask(task);
    form.setValues(task);
    loadGoalLists(task.monthlyGoalId);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async () => {
    try {
      setIsLoading(true);
      await taskApi.delete(selectedTask.id);
      fetchTasks();
      setIsDeleteConfirmOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteTask = async (task) => {
    try {
      await taskApi.complete(task.id);
      fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleStartTask = async (task) => {
    try {
      await taskApi.start(task.id);
      fetchTasks();
    } catch (error) {
      console.error('Error starting task:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const loadGoalLists = async (existingMonthlyId = null) => {
    try {
      const mgResp = await monthlyGoalApi.getAll();
      let mgs = mgResp.data || [];
      if (existingMonthlyId && !mgs.find(m => m.id === existingMonthlyId)) {
        mgs = [...mgs, { id: existingMonthlyId, title: `#${existingMonthlyId}` }];
      }
      setMonthlyGoals(mgs);
    } catch (err) {
      console.error('Failed to load goals for task form', err);
    }
  };

  useEffect(() => {
    if (!user?.loggedIn) {
      navigate("/");
    } else {
      fetchTasks();
      loadGoalLists();
    }
  }, [user, navigate]);

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 italic">Current Focus</span>
            <div className="h-px w-8 bg-indigo-100 dark:bg-indigo-900/50"></div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-black tracking-tighter text-slate-900 dark:text-white">
            Daily <span className="text-gradient">Actions</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl leading-relaxed">
            Take consistent steps toward your goals with focused daily execution.
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => {
            setSelectedTask(null);
            form.reset();
            loadGoalLists();
            setIsModalOpen(true);
          }}
          className="shadow-2xl shadow-indigo-200 dark:shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)]"
        >
          <Plus size={20} className="mr-2 stroke-[3]" />
          Add Action
        </Button>
      </div>

      {/* Control Panel */}
      <Card premium className="mb-12 p-0 overflow-hidden border-indigo-500/10 dark:border-slate-800/60">
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800/60">
          {/* Search Box */}
          <div className="p-6 lg:w-1/3 relative group">
            <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Filter actions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border border-transparent dark:border-slate-800 rounded-[1.5rem] text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500/20 dark:focus:border-indigo-500/40 focus:ring-4 focus:ring-indigo-500/5 dark:focus:ring-indigo-500/20 transition-all outline-none"
            />
          </div>

          {/* Filter Tabs */}
          <div className="p-6 lg:flex-1 flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              {Object.entries(statusCounts).map(([key, count]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`
                    flex items-center justify-center gap-3 px-5 py-3 flex-shrink-0 text-xs font-black uppercase tracking-widest transition-all duration-300 rounded-2xl
                    ${filter === key
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 active:scale-95'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                  `}
                >
                  {key}
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] ${filter === key ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Productivity Pulse */}
          <div className="p-6 lg:w-auto flex items-center justify-center gap-4 bg-indigo-50/30 dark:bg-indigo-900/10">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg border border-indigo-100 dark:border-slate-700">
              <Zap size={22} className="text-indigo-600 dark:text-indigo-400 animate-pulse-glow" />
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-400 dark:text-indigo-500 uppercase tracking-widest leading-none mb-1">Momentum</p>
              <p className="text-lg font-display font-black text-slate-900 dark:text-white leading-none">High Momentum</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Task Table Container */}
      <div className="card-elevated p-0 overflow-hidden">
        <Table
          isLoading={isLoading}
          data={filteredTasks}
          columns={[
            {
              key: 'title',
              label: 'Action Details',
              render: (title, task) => (
                <div className="flex items-start gap-4 py-3 group">
                  <div className={`mt-1.5 w-3 h-3 rounded-full flex-shrink-0 ring-4 ${task.status === 'completed' ? 'bg-emerald-500 ring-emerald-50' :
                    task.status === 'in-progress' ? 'bg-indigo-500 ring-indigo-50' : 'bg-amber-500 ring-amber-50'
                    }`}></div>
                  <div className="min-w-0">
                    <p className={`font-display font-black text-lg mb-1 tracking-tight truncate transition-all ${task.status === 'completed' ? 'text-slate-400 line-through grayscale' : 'text-slate-900 group-hover:text-indigo-600'
                      }`}>{title}</p>
                    {task.description && (
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium italic">"{task.description}"</p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 rounded-lg border border-slate-100">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{formatDate(task.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              key: 'priority',
              label: 'Impact',
              render: (priority) => (
                <div className="flex items-center">
                  <Badge variant={priority === 'high' ? 'danger' : priority === 'medium' ? 'warning' : 'neutral'}>
                    {priority}
                  </Badge>
                </div>
              )
            },
            {
              key: 'monthlyGoalId',
              label: 'Milestone Path',
              render: (goalId) => {
                const goal = monthlyGoals.find(g => g.id === goalId);
                return (
                  <div className="flex items-center gap-3 bg-slate-50/50 p-2 rounded-2xl border border-slate-100 max-w-[200px]">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <Target size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {goal ? goal.title : `#${goalId || 'N/A'}`}
                    </span>
                  </div>
                );
              }
            },
            {
              key: 'dueDate',
              label: 'Timeline',
              render: (date) => {
                const isOverdue = new Date(date) < new Date() && new Date(date).toDateString() !== new Date().toDateString();
                const isToday = new Date(date).toDateString() === new Date().toDateString();

                return (
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${isOverdue ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                      isToday ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                      }`}>
                      <CalendarIcon size={18} />
                    </div>
                    <div className="text-sm">
                      <p className={`font-black tracking-tight ${isOverdue ? 'text-rose-700' : 'text-slate-900'}`}>{formatDate(date)}</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${isOverdue ? 'text-rose-500' : isToday ? 'text-amber-600' : 'text-slate-400'
                        }`}>
                        {isOverdue ? 'CRITICAL' : isToday ? 'TODAY' : 'PLANNED'}
                      </p>
                    </div>
                  </div>
                );
              }
            }
          ]}
          actions={(task) => (
            <div className="flex items-center gap-2">
              <AnimatePresence>
                {task.status !== 'completed' && (
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={(e) => { e.stopPropagation(); handleCompleteTask(task); }}
                    className="group flex items-center p-2.5 text-emerald-500 hover:text-white hover:bg-emerald-500 rounded-2xl transition-all shadow-sm hover:shadow-emerald-200 active:scale-90"
                  >
                    <CheckCircle size={20} className="flex-shrink-0" />
                    <span className="overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
                      Complete Task
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {task.status === 'pending' && (
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={(e) => { e.stopPropagation(); handleStartTask(task); }}
                    className="group flex items-center p-2.5 text-indigo-500 hover:text-white hover:bg-indigo-500 rounded-2xl transition-all shadow-sm hover:shadow-indigo-200 active:scale-90"
                  >
                    <Play size={20} className="flex-shrink-0" />
                    <span className="overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
                      Start Task
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>

              <button
                onClick={(e) => { e.stopPropagation(); handleEditTask(task); }}
                className="group flex items-center p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all active:scale-90"
              >
                <Edit2 size={20} className="flex-shrink-0" />
                <span className="overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
                  Edit
                </span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTask(task);
                  setIsDeleteConfirmOpen(true);
                }}
                className="group flex items-center p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all active:scale-90"
              >
                <Trash2 size={20} className="flex-shrink-0" />
                <span className="overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
                  Delete
                </span>
              </button>
            </div>
          )}
        />
      </div>

      {filteredTasks.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 rounded-[3rem] border-2 border-dashed border-slate-200 mt-12 bg-slate-50/20"
        >
          <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 flex items-center justify-center mx-auto mb-8 animate-float">
            <LayoutList size={40} className="text-indigo-400" />
          </div>
          <h3 className="text-2xl font-display font-black text-slate-900 mb-2 uppercase tracking-tight">Focus Idle</h3>
          <p className="text-slate-500 max-w-sm mx-auto leading-relaxed mb-10 font-medium">
            No active actions found for the current filter. Add a new action to resume your streak.
          </p>
          <Button
            size="lg"
            onClick={() => {
              setSelectedTask(null);
              form.reset();
              loadGoalLists();
              setIsModalOpen(true);
            }}
            className="shadow-2xl shadow-indigo-200 px-12"
          >
            Deploy Mission
          </Button>
        </motion.div>
      )}

      {/* Task Creation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTask ? 'Create Action' : 'Create Action'}
        size="lg"
        footerButtons={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Abort</Button>
            <Button onClick={form.handleSubmit} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Deploy Task'}
            </Button>
          </>
        }
      >
        <Form onSubmit={form.handleSubmit} className="space-y-6 pt-2">
          <Input
            label="Action Name"
            name="title"
            placeholder="e.g., Daily Meditation"
            value={form.values.title}
            onChange={form.handleChange}
            error={form.errors.title}
            required
            helperText="Clear name for your daily action."
          />
          <FormTextarea
            label="Personal Notes"
            name="description"
            placeholder="Details about this action..."
            value={form.values.description}
            onChange={form.handleChange}
            className="min-h-[120px]"
          />
          <Select
            label="Linked Milestone"
            name="monthlyGoalId"
            options={monthlyGoals.map(g => ({ value: g.id, label: g.title }))}
            value={form.values.monthlyGoalId}
            onChange={form.handleChange}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Priority Level"
              name="priority"
              options={[
                { value: 'low', label: 'Low priority' },
                { value: 'medium', label: 'Medium priority' },
                { value: 'high', label: 'High priority' },
              ]}
              value={form.values.priority}
              onChange={form.handleChange}
              required
            />
            <Select
              label="Action Status"
              name="status"
              options={[
                { value: 'pending', label: 'To Do' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Done' },
              ]}
              value={form.values.status}
              onChange={form.handleChange}
              required
            />
          </div>
          <Input
            label="Set Deadline"
            name="dueDate"
            type="date"
            value={form.values.dueDate}
            onChange={form.handleChange}
            helperText="Target completion date."
          />
        </Form>
      </Modal>

      <Confirmation
        isOpen={isDeleteConfirmOpen}
        title="Discard Operation"
        message={`Are you certain you wish to discard "${selectedTask?.title}"? This data will be purged from the core.`}
        confirmText="Confirm Purge"
        onConfirm={handleDeleteTask}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        variant="danger"
      />
    </MainLayout>
  );
}
