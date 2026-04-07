import { ChevronRight, ChevronLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

// Animated Number Component for smooth counter transitions
export const AnimatedNumber = ({ value, suffix = "", prefix = "", decimals = 0 }) => {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(current);
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
};

export const Table = ({ 
  columns = [], 
  data = [], 
  isLoading = false,
  onRowClick,
  actions,
  pagination
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-indigo-600 animate-spin"></div>
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 normal-case tracking-normal">Fetching records...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="empty-state my-8 border-dashed border-2 border-slate-200 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl p-12 text-center"
      >
        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-400/80">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-xl font-sans font-semibold text-slate-900 dark:text-white mb-2 tracking-tight">No records found</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">It seems there's nothing to show here yet. Try adjusting your filters or creating a new entry.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="table-container bg-white/50 dark:bg-slate-900/50 dark:border-slate-800 backdrop-blur-xl"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-5 text-[11px] font-bold text-slate-400 dark:text-slate-500 normal-case tracking-normal bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                  {col.label}
                </th>
              ))}
              {actions && <th className="px-6 py-5 text-[11px] font-bold text-slate-400 dark:text-slate-500 normal-case tracking-normal bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.map((row, idx) => (
              <tr 
                key={idx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`${onRowClick ? 'cursor-pointer' : ''} group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all duration-300`}
              >
                {columns.map((col) => (
                   <td key={col.key} className="px-6 py-5 text-[14px] text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-5">
                    <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {actions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {pagination && (
        <div className="px-8 py-5 bg-slate-50/30 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 normal-case tracking-normal">
            Showing <span className="text-slate-900 dark:text-slate-200">{pagination.from}-{pagination.to}</span> of <span className="text-slate-900 dark:text-slate-200">{pagination.total}</span>
          </span>
          <div className="flex gap-3">
            <button 
              disabled={pagination.currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const StatsCard = ({ icon: Icon, label, value, trend, color = 'primary', suffix = "" }) => {
  const colorMap = {
    primary: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800 shadow-indigo-100/50 dark:shadow-none',
    success: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800 shadow-emerald-100/50 dark:shadow-none',
    warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800 shadow-amber-100/50 dark:shadow-none',
    accent: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800 shadow-rose-100/50 dark:shadow-none',
    neutral: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 shadow-slate-100/50 dark:shadow-none'
  };

  const trendStyles = {
    up: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800',
    down: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800',
  };

  return (
    <motion.div 
      style={{ perspective: 1000 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        rotateX: 4, 
        rotateY: -2,
        z: 10,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className="stats-card group bg-white dark:bg-slate-900/90 dark:backdrop-blur-xl border border-slate-100 dark:border-slate-800/60 p-6 rounded-[2rem] shadow-sm dark:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_20px_40px_-10px_rgba(99,102,241,0.2)] relative overflow-hidden transform-gpu"
    >
      <div className="flex items-center justify-between mb-8">
        <div className={`w-14 h-14 rounded-lg flex items-center justify-center border shadow-xl transition-all duration-500 ${colorMap[color] || colorMap.primary}`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        {trend && (
          <motion.span 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold normal-case tracking-normal border flex items-center gap-1.5 ${trendStyles[trend.direction]}`}
          >
            {trend.direction === 'up' ? <TrendingUp size={14} strokeWidth={3} /> : <TrendingDown size={14} strokeWidth={3} />} 
            {trend.value}%
          </motion.span>
        )}
      </div>
      <p className="text-sm font-bold text-slate-400 dark:text-slate-500 normal-case tracking-normal mb-2 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors uppercase tracking-[0.1em]">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors italic">
          {typeof value === 'number' ? (
            <AnimatedNumber value={value} suffix={suffix} />
          ) : (
            value
          )}
        </h3>
      </div>
      
      {/* Decorative gradient blob */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-transparent rounded-full blur-2xl opacity-50 group-hover:bg-indigo-500/10 transition-colors"></div>
    </motion.div>
  );
};

export const ProgressBar = ({ value = 0, max = 100, label, showPercentage = true }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-3 px-1">
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">{label}</span>
        {showPercentage && (
          <span className="text-3xl font-display font-black text-indigo-600 dark:text-indigo-400 tracking-tighter italic">{Math.round(percentage)}<span className="text-sm ml-0.5 opacity-60">%</span></span>
        )}
      </div>
      <div className="progress-bar bg-slate-100 dark:bg-slate-800/80 group overflow-hidden h-4 rounded-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="progress-fill h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full shadow-lg shadow-indigo-500/20"
        >
          {/* Shimmer effect is already in CSS with ::after */}
        </motion.div>
      </div>
    </div>
  );
};
