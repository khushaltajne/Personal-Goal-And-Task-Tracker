import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Stars } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative" style={{ perspective: 1000 }}>
      {/* 3D Flip Container */}
      <motion.button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleTheme();
        }}
        className={`
          relative flex items-center justify-center w-12 h-12 rounded-2xl 
          backdrop-blur-xl border transition-all duration-500 focus:outline-none z-50 group shadow-lg
          ${theme === 'light' 
            ? 'bg-white/60 border-indigo-100 shadow-indigo-500/10 hover:shadow-indigo-500/20' 
            : 'bg-slate-700/80 border-indigo-400/60 shadow-[0_8px_30px_-10px_rgba(79,70,229,0.5)] hover:bg-slate-600 hover:shadow-[0_10px_40px_-10px_rgba(79,70,229,0.7)] hover:border-indigo-300'}
        `}
        aria-label="Toggle Theme"
        whileHover={{ scale: 1.08, rotateZ: 5 }}
        whileTap={{ scale: 0.9, rotateZ: -5 }}
        animate={{ rotateY: theme === 'dark' ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, mass: 1 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* LIGHT MODE FACET (Front of 3D coin) */}
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-2xl transition-opacity duration-300"
          style={{ opacity: theme === 'light' ? 1 : 0 }}
        >
          {/* Subtle warm glow behind sun */}
          <div className="absolute inset-2 bg-amber-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Sun size={22} className="text-amber-500 fill-amber-500/20 drop-shadow-sm group-hover:scale-110 transition-transform" />
        </div>

        {/* DARK MODE FACET (Back of 3D coin) */}
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-2xl transition-opacity duration-300 pointer-events-none"
          style={{ transform: 'rotateY(180deg)', opacity: theme === 'dark' ? 1 : 0 }}
        >
          {/* Subtle cool glow behind moon */}
          <div className="absolute inset-2 bg-indigo-400/60 rounded-full blur-md opacity-80 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative">
            <Moon size={22} className="text-white fill-white/40 drop-shadow-lg group-hover:scale-110 transition-transform" />
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: theme === 'dark' ? 1 : 0, scale: theme === 'dark' ? 1 : 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute -top-1 -right-1 text-white"
            >
              <Stars size={8} className="animate-pulse drop-shadow-sm" />
            </motion.div>
          </div>
        </div>
      </motion.button>
    </div>
  );
};

export default ThemeToggle;
