import { useState, useEffect } from "react";
import { Plus, Trash2, StickyNote, RefreshCw, AlertCircle, Calendar, X, Edit2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { noteApi } from "../api/noteApi";
import { taskApi } from "../api/taskApi";

export default function NotesDrawer({ isOpen, onClose }) {
  const [notes, setNotes] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editTaskId, setEditTaskId] = useState("");
  const [availableTasks, setAvailableTasks] = useState([]);
  const [createTaskId, setCreateTaskId] = useState("");

  const fetchNotes = async () => {
    setIsLoading(true);
    setError("");
    try {
      const notesRes = await noteApi.getAllNotes();
      setNotes(Array.isArray(notesRes.data) ? notesRes.data : (notesRes.data?.content || []));
      
      const tasksRes = await taskApi.getAll({ size: 100 });
      setAvailableTasks(tasksRes.data?.content || tasksRes.data || []);
    } catch (err) {
      setError("Failed to synchronize with secure node.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotes();
    }
  }, [isOpen]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    try {
      await noteApi.createNote(
        newContent.trim(),
        createTaskId ? parseInt(createTaskId, 10) : null
      );
      setNewContent("");
      setCreateTaskId("");
      fetchNotes();
    } catch (err) {
      setError("Note creation rejected.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await noteApi.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError("Deletion failed.");
    }
  };

  const startEdit = (note) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
    setEditTaskId(note.taskId ? note.taskId.toString() : "");
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setEditContent("");
    setEditTaskId("");
  };

  const handleUpdate = async (id) => {
    if (!editContent.trim()) return;
    try {
      await noteApi.updateNote(id, { 
        content: editContent.trim(), 
        taskId: editTaskId ? parseInt(editTaskId, 10) : null 
      });
      setEditingNoteId(null);
      fetchNotes();
    } catch (err) {
      setError("Update failed.");
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 250 }}
          className="fixed top-0 right-0 h-screen w-full md:w-[450px] bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-3xl border-l border-slate-200/50 dark:border-white/10 shadow-2xl z-[100] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200/50 dark:border-white/10 flex items-center justify-between bg-white/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center">
                <StickyNote size={18} />
              </div>
              <div>
                <h2 className="text-lg font-display font-black text-slate-900 dark:text-white tracking-tight leading-tight">Strategic Notes</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Memory Vault</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={fetchNotes}
                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-amber-500 hover:border-amber-500/30 transition-all group"
              >
                <RefreshCw size={16} className={`${isLoading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-700`} />
              </button>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 transition-all group"
              >
                <X size={18} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 scroll-thin">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3">
                <AlertCircle className="text-rose-500 flex-shrink-0" size={16} />
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{error}</p>
              </motion.div>
            )}

            {isLoading && notes.length === 0 ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin"></div>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 transform -rotate-6">
                  <StickyNote size={24} />
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">Vault is Empty</h3>
                <p className="text-[11px] font-bold text-slate-500 max-w-[200px] mx-auto">No intelligence logged yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {notes.map(note => (
                    <motion.div
                      key={note.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      layout
                      className="group relative bg-white dark:bg-slate-900 rounded-[1.5rem] p-6 border border-slate-200 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-500/30 shadow-sm hover:shadow-md transition-all overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-amber-100 to-white dark:from-slate-800 dark:to-slate-900 border-l border-b border-slate-200 dark:border-slate-800 rounded-bl-[1rem] pointer-events-none"></div>

                      {editingNoteId === note.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none resize-none"
                            rows={3}
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertCircle size={14} className="text-indigo-400" />
                              <select
                                value={editTaskId}
                                onChange={(e) => setEditTaskId(e.target.value)}
                                className="w-32 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-400 appearance-none shadow-sm cursor-pointer"
                              >
                                <option value="">Standalone</option>
                                {availableTasks.map(t => (
                                  <option key={t.id} value={t.id}>
                                    {t.title.length > 25 ? t.title.substring(0, 25) + '...' : t.title}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={cancelEdit} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors">
                                <X size={14} />
                              </button>
                              <button onClick={() => handleUpdate(note.id)} className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors shadow-sm">
                                <Check size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {note.taskId && (
                            <div 
                              className="mb-3 inline-flex items-center gap-1.5 px-2 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded transition text-[9px] font-black uppercase tracking-widest border border-indigo-500/20"
                              title={availableTasks.find(t => t.id === note.taskId)?.title || `Task #${note.taskId}`}
                            >
                              <AlertCircle size={10} />
                              {(() => {
                                const linkedTask = availableTasks.find(t => t.id === note.taskId);
                                if (!linkedTask) return `Task #${note.taskId}`;
                                return linkedTask.title.length > 30 ? linkedTask.title.substring(0, 30) + '...' : linkedTask.title;
                              })()}
                            </div>
                          )}
                          
                          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium whitespace-pre-wrap">
                            {note.content}
                          </p>
                        </>
                      )}

                      {editingNoteId !== note.id && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            <Calendar size={12} />
                            {note.createdAt ? new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Recently'}
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => startEdit(note)}
                              className="text-slate-400 hover:text-amber-500 p-1 rounded-md hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                              title="Edit Intelligence"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button 
                              onClick={() => handleDelete(note.id)}
                              className="text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                              title="Purge"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer Input */}
          <div className="p-4 border-t border-slate-200/50 dark:border-white/10 bg-white/50 dark:bg-slate-900/50">
            <form onSubmit={handleCreate} className="relative group">
              <div className="absolute inset-0 bg-amber-500/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              
              <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-700 shadow-sm transition-all group-focus-within:border-amber-500/30 flex flex-col gap-2">
                <input
                  type="text"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Log intelligence..."
                  className="w-full bg-transparent border-none py-2 px-3 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-0 font-medium text-sm"
                  disabled={isLoading}
                />
                
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-1.5 mt-1">
                  <select
                    value={createTaskId}
                    onChange={(e) => setCreateTaskId(e.target.value)}
                    className="bg-transparent border-none text-[10px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-0 cursor-pointer pl-3 pr-2 py-1 appearance-none hover:text-indigo-500 transition-colors w-32 truncate"
                  >
                    <option value="">Standalone Note</option>
                    {availableTasks.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.title.length > 20 ? t.title.substring(0, 20) + '...' : t.title}
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    disabled={!newContent.trim() || isLoading}
                    className="w-8 h-8 flex-shrink-0 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-300 dark:disabled:text-slate-600 text-white rounded-[0.6rem] flex items-center justify-center transition-all active:scale-95"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
