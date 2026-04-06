import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  footerButtons,
  size = 'md'
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></motion.div>

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-50 border border-slate-200 dark:border-slate-800 ${sizes[size]} w-full overflow-hidden`}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-10 py-8 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight italic">{title}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="px-10 py-8">
            {children}
          </div>

          {/* Footer */}
          {footerButtons && (
            <div className="flex justify-end gap-4 px-10 py-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
              {footerButtons}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export const Confirmation = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title = 'Confirm',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size="sm"
      footerButtons={
        <>
          <button
            onClick={onCancel}
            className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 ${
              variant === 'danger' 
                ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200 dark:shadow-none' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none'
            }`}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{message}</p>
    </Modal>
  );
};
