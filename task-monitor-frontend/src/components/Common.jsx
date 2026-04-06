import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-[15px]',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button 
      style={{ perspective: 1000 }}
      whileHover={{ y: -3, scale: 1.01, rotateX: 5, rotateY: -2, z: 10, boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.15)' }}
      whileTap={{ scale: 0.97, y: 0, rotateX: 0, z: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const Card = ({ children, className = '', premium, ...props }) => {
  return (
    <motion.div 
      style={{ perspective: 1200 }}
      initial={{ opacity: 0, y: 20, rotateX: -5 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ 
        scale: 1.01,
        y: -5,
        rotateX: 2, 
        rotateY: -1,
        rotateZ: 0.5,
        z: 20,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`${premium ? 'card-premium' : 'card-elevated'} dark:bg-slate-900/80 dark:backdrop-blur-xl dark:border-slate-700/50 dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)] dark:hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.15)] ${className}`} 
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const Input = ({ 
  label, 
  error, 
  helperText,
  className = '',
  ...props 
}) => {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-[13px] font-bold text-slate-900 dark:text-slate-200 mb-2 uppercase tracking-widest pl-1">
          {label}
        </label>
      )}
      <motion.input 
        whileFocus={{ scale: 1.005 }}
        className={`input dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 ${error ? 'border-rose-500 focus:ring-rose-500/10 bg-rose-50/30' : ''} ${className}`}
        {...props}
      />
      {helperText && (
        <p className={`mt-2 text-[11px] font-bold uppercase tracking-wider pl-1 ${error ? 'text-rose-600' : 'text-slate-400 dark:text-slate-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export const Select = ({ 
  label, 
  options = [],
  error,
  className = '',
  ...props 
}) => {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-[13px] font-bold text-slate-900 dark:text-slate-200 mb-2 uppercase tracking-widest pl-1">
          {label}
        </label>
      )}
      <motion.select 
        whileFocus={{ scale: 1.005 }}
        className={`input dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:selection:bg-slate-800 ${error ? 'border-rose-500 focus:ring-rose-500/10 bg-rose-50/30' : ''} ${className}`}
        {...props}
      >
        <option value="" className="dark:bg-slate-900">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="dark:bg-slate-900">
            {opt.label}
          </option>
        ))}
      </motion.select>
    </div>
  );
};

export const Badge = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    neutral: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  return (
    <motion.span 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`badge ${variants[variant]} dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 ${className}`}
    >
      {children}
    </motion.span>
  );
};

export const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center py-20 gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-slate-100"></div>
        <div className="w-12 h-12 rounded-full border-4 border-t-indigo-600 animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading experience...</p>
    </div>
  );
};

export const EmptyState = ({ icon: Icon, title, description }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center card-elevated border-dashed border-2 border-slate-200 bg-slate-50/30"
    >
      {Icon && (
        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-slate-200/50 flex items-center justify-center mb-8 animate-float">
          <Icon className="h-10 w-10 text-indigo-500" />
        </div>
      )}
      <h3 className="text-2xl font-display font-black text-slate-900 mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-500 max-w-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

export const Alert = ({ type = 'info', title, message, onClose }) => {
  const types = {
    success: 'bg-emerald-50/80 border-emerald-100 text-emerald-800',
    error: 'bg-rose-50/80 border-rose-100 text-rose-800',
    warning: 'bg-amber-50/80 border-amber-100 text-amber-800',
    info: 'bg-indigo-50/80 border-indigo-100 text-indigo-800',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`border backdrop-blur-md rounded-2xl p-5 mb-5 shadow-xl ${types[type]}`}
    >
      <div className="flex justify-between items-start gap-5">
        <div className="flex-1">
          {title && <h4 className="font-bold text-[15px] mb-1 tracking-tight uppercase">{title}</h4>}
          <p className="text-sm font-medium opacity-90 leading-snug">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-lg transition-colors">
            <span className="text-xl leading-none">&times;</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
