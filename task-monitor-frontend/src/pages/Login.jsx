import { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { LogIn, Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff, ShieldCheck, Zap, Activity, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { authApi } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { handleApiError } from "../utils/helpers";
import { Button, Input } from "../components/Common";
import ThemeToggle from "../components/ThemeToggle";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    if (searchParams.get("expired") === "true") {
      setError("Session Expired. Please authenticate again.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Strategic credentials required.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await authApi.login(email, password);

      if (response.data?.accessToken) {
        setSuccess("Authentication confirmed. Initializing session...");

        setTimeout(() => {
          login(response.data.accessToken, rememberMe);
          navigate("/dashboard");
        }, 800);
      }
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
        className="w-full max-w-md relative z-10 my-auto"
      >
        <button
          onClick={() => navigate('/')}
          className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 w-10 h-10 bg-white dark:bg-slate-800 shadow-xl rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors z-[101] border border-slate-200 dark:border-slate-700"
        >
          <X size={20} />
        </button>


        {/* Login Card */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] p-1 border border-slate-200/50 dark:border-white/10 shadow-2xl overflow-hidden group">
          <div className="bg-white/90 dark:bg-white/5 rounded-[2.8rem] p-10 border border-slate-100 dark:border-white/5">
            <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white mb-2 tracking-tight">Access Portal</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">Synchronize your tactical environment.</p>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-start gap-4 mb-8"
                >
                  <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="text-rose-200 text-sm font-bold leading-tight">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-4 mb-8"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-emerald-200 text-sm font-bold leading-tight">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Username</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. operator@mission.mil"
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-[1.5rem] focus:bg-white dark:focus:bg-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
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

              <div className="flex items-center justify-between px-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="peer hidden"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <div className="w-5 h-5 border-2 border-white/10 rounded-lg group-hover:border-indigo-500/50 transition-colors peer-checked:bg-indigo-600 peer-checked:border-indigo-600"></div>
                    <CheckCircle className="absolute inset-0 w-3 h-3 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-300 transition-colors">Remember</span>
                </label>
                <a href="#" className="text-xs font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors">Reset Key</a>
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
                    <span className="font-bold uppercase tracking-[0.2em] text-xs">Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="font-bold uppercase tracking-[0.2em] text-xs">Establish Link</span>
                    <ArrowRight size={18} />
                  </div>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Register CTA */}
        <div className="mt-10 py-6 px-10 rounded-[2.5rem] bg-white/60 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 backdrop-blur-xl flex items-center justify-between shadow-xl">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">New User?</p>
          <Link to="/register" className="text-xs font-black text-slate-900 dark:text-white hover:text-indigo-400 uppercase tracking-[0.2em] transition-colors flex items-center gap-2">
            Create Profile <Zap size={14} className="text-indigo-400" />
          </Link>
        </div>

        {/* System Footer */}
        <div className="mt-8 flex flex-col items-center justify-center p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-lg">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="h-px w-8 bg-slate-200 dark:bg-white/10"></div>
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">Secure Node v2.6.0</p>
            <div className="h-px w-8 bg-slate-200 dark:bg-white/10"></div>
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 group cursor-help">
              <ShieldCheck className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Encrypted</span>
            </div>
            <div className="flex items-center gap-2 group cursor-help">
              <Zap className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Sub-Second</span>
            </div>
            <div className="flex items-center gap-2 group cursor-help">
              <Activity className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Active</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}