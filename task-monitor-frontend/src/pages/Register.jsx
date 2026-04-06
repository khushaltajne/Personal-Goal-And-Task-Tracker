import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff, ShieldCheck, Zap, Activity, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authApi } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { handleApiError } from "../utils/helpers";
import { Button } from "../components/Common";
import ThemeToggle from "../components/ThemeToggle";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !email || !password) {
      setError("Registration protocols require all parameters.");
      return;
    }

    try {
      setIsLoading(true);
      await authApi.register(username, email, password);

      setSuccess("Profile initialized successfully. Redirecting to access portal...");
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10 my-auto"
      >
        <button 
          onClick={() => navigate('/')} 
          className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 w-10 h-10 bg-white dark:bg-slate-800 shadow-xl rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors z-[101] border border-slate-200 dark:border-slate-700"
        >
          <X size={20} />
        </button>


        {/* Register Card */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[3.5rem] p-1 border border-slate-200/50 dark:border-white/10 shadow-2xl overflow-hidden">
          <div className="bg-white/90 dark:bg-white/5 rounded-[3.3rem] p-8 md:p-12 border border-slate-100 dark:border-white/5">
            <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-1 tracking-tight">New Operator Registration</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium text-sm">Configure your tactical identity below.</p>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-start gap-4 mb-8"
                >
                  <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="text-rose-200 text-sm font-bold leading-tight">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-4 mb-8"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-emerald-200 text-sm font-bold leading-tight">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Identity Name</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter Full Legal Name"
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-[1.5rem] focus:bg-white dark:focus:bg-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Communication Vector</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@mission-critical.io"
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-[1.5rem] focus:bg-white dark:focus:bg-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Secure Passphrase</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-14 pr-16 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-[1.5rem] focus:bg-white dark:focus:bg-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-sm tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-2">
                <input type="checkbox" required className="w-4 h-4 bg-white/5 border-white/10 rounded focus:ring-indigo-500 accent-indigo-600" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">I acknowledge the tactical protocols.</span>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full py-6 rounded-[1.5rem] shadow-2xl shadow-indigo-600/20 active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="font-bold uppercase tracking-[0.2em] text-xs">Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="font-bold uppercase tracking-[0.2em] text-xs">Initialize Profile</span>
                    <ArrowRight size={18} />
                  </div>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Login CTA */}
        <div className="mt-8 py-6 px-10 rounded-[2.5rem] bg-white/60 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 backdrop-blur-xl flex items-center justify-between shadow-xl">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Existing Operator?</p>
          <Link to="/login" className="text-xs font-black text-slate-900 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 uppercase tracking-[0.2em] transition-colors flex items-center gap-2">
            Establish Link <Zap size={14} className="text-indigo-400" />
          </Link>
        </div>

        {/* Security Footer */}
        <div className="mt-8 flex items-center justify-center gap-8 py-4 px-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-lg">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">AES-256</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Verified</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
