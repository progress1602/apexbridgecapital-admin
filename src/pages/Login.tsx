import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, passcode);
      toast.success("Identity verified. Accessing matrix...");
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-transparent to-transparent">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-accent to-[#10b981aa] flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)] mx-auto mb-6">
            <ShieldCheck className="text-zinc-950" size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-zinc-100 mb-2">APEX BRIDGE</h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em]">Administrative Terminal</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
          <div className="space-y-2">
            <label className="mono-label">Identity Credential</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@apexbridge.com"
                className="w-full bg-zinc-950/50 border border-brand-border rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-brand-accent transition-all placeholder:text-zinc-700"
              />
            </div>
          </div>

          <div className="space-y-2">
             <div className="flex items-center justify-between">
                <label className="mono-label">Passcode</label>
                <button type="button" className="text-[10px] text-brand-accent hover:underline font-bold uppercase tracking-wider">Lost Key?</button>
             </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input 
                type="password" 
                required
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950/50 border border-brand-border rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-brand-accent transition-all placeholder:text-zinc-700 font-mono"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-accent text-brand-bg rounded-xl py-4 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-[0_8px_30px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <LogIn size={18} className="group-hover:translate-x-1 transition-transform" /> 
                Initialize Session
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-zinc-600 text-[10px] font-mono leading-relaxed px-6">
           ACCESS TO THIS TERMINAL IS RESTRICTED TO AUTHORIZED PERSONNEL ONLY. ALL ATTEMPTS TO BYPASS SECURITY PROTOCOLS ARE LOGGED CRYPTOGRAPHICALLY.
        </p>
      </motion.div>
    </div>
  );
};
