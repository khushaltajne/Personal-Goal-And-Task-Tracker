import React, { useState } from 'react';

export const Form = ({ onSubmit, children, className = '' }) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-8 ${className}`}>
      {children}
    </form>
  );
};

export const FormGroup = ({ children, className = '' }) => {
  return (
    <div className={`mb-6 ${className}`}>
      {children}
    </div>
  );
};

export const FormRow = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {children}
    </div>
  );
};

export const FormLabel = ({ children, required = false, className = '' }) => {
  return (
    <label className={`block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-1 ${className}`}>
      {children}
      {required && <span className="text-rose-500 ml-1.5">*</span>}
    </label>
  );
};

export const FormInput = ({ 
  label,
  error,
  required,
  helperText,
  className = '',
  ...props 
}) => {
  return (
    <FormGroup>
      {label && <FormLabel required={required}>{label}</FormLabel>}
      <input 
        className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all font-bold text-sm ${error ? 'border-rose-500 focus:ring-rose-500/10 bg-rose-50/30' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-rose-500 px-1">{error}</p>}
      {helperText && !error && <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">{helperText}</p>}
    </FormGroup>
  );
};

export const FormSelect = ({ 
  label,
  options = [],
  error,
  required,
  className = '',
  ...props 
}) => {
  return (
    <FormGroup>
      {label && <FormLabel required={required}>{label}</FormLabel>}
      <select 
        className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all font-bold text-sm appearance-none ${error ? 'border-rose-500 focus:ring-rose-500/10 bg-rose-50/30' : ''} ${className}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="dark:bg-slate-900 dark:text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-rose-500 px-1">{error}</p>}
    </FormGroup>
  );
};

export const FormTextarea = ({ 
  label,
  error,
  required,
  className = '',
  ...props 
}) => {
  return (
    <FormGroup>
      {label && <FormLabel required={required}>{label}</FormLabel>}
      <textarea 
        className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all font-bold text-sm min-h-[120px] resize-y ${error ? 'border-rose-500 focus:ring-rose-500/10 bg-rose-50/30' : ''} ${className}`}
        rows={4}
        {...props}
      />
      {error && <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-rose-500 px-1">{error}</p>}
    </FormGroup>
  );
};

export const FormCheckbox = ({ 
  label,
  error,
  className = '',
  ...props 
}) => {
  return (
    <FormGroup>
      <label className={`flex items-start gap-4 cursor-pointer group ${className}`}>
        <div className="flex items-center h-6 mt-0.5">
            <input 
              type="checkbox"
              className="w-5 h-5 text-indigo-600 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-4 focus:ring-indigo-500/10 focus:ring-offset-0 cursor-pointer transition-all accent-indigo-600"
              {...props}
            />
          </div>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-widest text-[11px]">{label}</span>
      </label>
      {error && <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-rose-500 ml-9">{error}</p>}
    </FormGroup>
  );
};

export const FormRadio = ({ 
  label,
  options = [],
  error,
  className = '',
  ...props 
}) => {
  return (
    <FormGroup>
      {label && <FormLabel>{label}</FormLabel>}
      <div className="space-y-4 mt-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-start gap-4 cursor-pointer group">
            <div className="flex items-center h-6 mt-0.5">
              <input 
                type="radio"
                value={opt.value}
                className="w-5 h-5 text-indigo-600 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:ring-offset-0 cursor-pointer transition-all accent-indigo-600"
                {...props}
              />
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-widest text-[11px]">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-rose-500 px-1">{error}</p>}
    </FormGroup>
  );
};
