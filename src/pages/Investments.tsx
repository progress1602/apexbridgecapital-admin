import React, { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { TrendingUp, Clock, CheckCircle2, DollarSign, Settings2, BarChart3, Plus, X, Search, ChevronDown, Check } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, Investment } from '../contexts/StoreContext';
import { toast } from 'sonner';
import { ConfirmModal } from '../components/ConfirmModal';

const CreateInvestmentModal = ({ onClose }: { onClose: () => void }) => {
  const { users, addInvestment } = useStore();
  const [userEmail, setUserEmail] = useState('');
  const [plan, setPlan] = useState('Starter Node');
  const [amount, setAmount] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const plans = [
    { name: 'Starter Node', yield: 8, days: 7, min: 100, max: 1000 },
    { name: 'Premium Flow', yield: 15, days: 30, min: 1500, max: 10000 },
    { name: 'Institutional', yield: 28, days: 90, min: 15000, max: Infinity },
  ];

  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(searchEmail.toLowerCase()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail || !amount) {
      toast.error("Please provide both identity and volume.");
      return;
    }
    const selectedPlan = plans.find(p => p.name === plan);
    if (!selectedPlan) return;
    
    const vol = parseFloat(amount);
    if (vol < selectedPlan.min || (selectedPlan.max !== Infinity && vol > selectedPlan.max)) {
      toast.error(`Volume outside parameters for this node. Expected ${formatCurrency(selectedPlan.min)} - ${selectedPlan.max === Infinity ? '∞' : formatCurrency(selectedPlan.max)}`);
      return;
    }

    addInvestment({
      userEmail,
      plan: plan as any,
      amount: vol,
      profit: 0,
      yieldTarget: selectedPlan.yield,
      durationDays: selectedPlan.days
    });
    toast.success(`Investment portfolio initialized for ${userEmail}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg glass-card p-6 md:p-8 shadow-2xl overflow-visible max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-100 z-50">
          <X size={20} />
        </button>
        <h3 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-2 pt-2 md:pt-0">
          <Plus className="text-brand-accent" /> New Allocation
        </h3>
        <p className="text-zinc-500 text-xs mb-8 font-mono italic tracking-tighter">Initializing new yield cycle in the global ledger.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="mono-label">Target Identity</label>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-zinc-900 border border-brand-border rounded-xl px-4 py-3.5 text-sm flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-all font-medium"
            >
              <span className={cn("truncate max-w-[200px]", userEmail ? 'text-zinc-100' : 'text-zinc-600')}>
                {userEmail || 'Select an identity...'}
              </span>
              <ChevronDown size={16} className={cn("transition-transform text-zinc-500 shrink-0", isDropdownOpen && "rotate-180")} />
            </div>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#09090b] border border-brand-border rounded-xl shadow-2xl z-[150] overflow-hidden"
                >
                  <div className="p-3 border-b border-brand-border bg-zinc-900/50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                      <input 
                        autoFocus
                        type="text"
                        placeholder="Filter database..."
                        value={searchEmail}
                        onChange={e => setSearchEmail(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-brand-accent"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto no-scrollbar">
                    {filteredUsers.map(user => (
                      <div 
                        key={user.id}
                        onClick={() => {
                          setUserEmail(user.email);
                          setIsDropdownOpen(false);
                        }}
                        className="px-4 py-3 hover:bg-brand-accent/5 cursor-pointer flex items-center justify-between group border-b border-brand-border/30 last:border-0"
                      >
                         <div className="flex flex-col">
                            <span className="text-sm font-bold text-zinc-300 group-hover:text-brand-accent transition-colors">{user.name}</span>
                            <span className="text-[10px] text-zinc-600 font-mono italic">{user.email}</span>
                          </div>
                          {userEmail === user.email && <Check size={14} className="text-brand-accent shadow-[0_0_10px_rgba(16,185,129,0.3)]" />}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mono-label">Asset Plan</label>
              <select 
                value={plan}
                onChange={e => setPlan(e.target.value)}
                className="w-full bg-zinc-900 border border-brand-border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-accent text-zinc-100 font-bold"
              >
                {plans.map(p => (
                  <option key={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mono-label">Injection Volume</label>
              <input 
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-zinc-900 border border-brand-border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-accent text-zinc-100 font-mono font-bold"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold uppercase tracking-widest transition-colors text-[10px]"
            >
              Abort
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-4 rounded-xl bg-brand-accent text-brand-bg hover:brightness-110 font-black uppercase tracking-widest shadow-[0_8px_30px_rgba(16,185,129,0.3)] transition-all active:scale-95 text-[10px]"
            >
              Initialize Portfolio
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export const InvestmentsPage = () => {
  const { investments, updateInvestmentProfit, completeInvestment, processInvestmentRequest } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    id: string;
    action: 'approve' | 'reject' | 'settle';
    userEmail: string;
    amount: number;
  }>({
    isOpen: false,
    id: '',
    action: 'approve',
    userEmail: '',
    amount: 0
  });

  const requested = investments.filter(i => i.status === 'requested');
  const active = investments.filter(i => i.status === 'active');
  const completed = investments.filter(i => i.status === 'completed');

  const handleAuthorizeClick = (id: string, email: string, amount: number) => {
    setConfirmState({
      isOpen: true,
      id,
      action: 'approve',
      userEmail: email,
      amount
    });
  };

  const handleSetProfit = (id: string, currentProfit: number) => {
    const val = prompt("Enter new ROI value:", currentProfit.toString());
    if (val !== null) {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        updateInvestmentProfit(id, num);
        toast.success("ROI thresholds adjusted successfully.");
      }
    }
  };

  const handleCompleteClick = (id: string, userEmail: string, total: number) => {
    setConfirmState({
      isOpen: true,
      id,
      action: 'settle',
      userEmail,
      amount: total
    });
  };

  const handleRejectClick = (id: string, userEmail: string, amount: number) => {
    setConfirmState({
      isOpen: true,
      id,
      action: 'reject',
      userEmail,
      amount
    });
  };

  const handleConfirmAction = () => {
    if (confirmState.action === 'approve') {
      processInvestmentRequest(confirmState.id, 'approve');
      toast.success("Investment authorized and capital secured.");
    } else if (confirmState.action === 'reject') {
      processInvestmentRequest(confirmState.id, 'reject');
      toast.info(`Portfolio initialization rejected for ${confirmState.userEmail}`);
    } else if (confirmState.action === 'settle') {
      completeInvestment(confirmState.id);
      toast.success(`Settlement finalized for ${confirmState.userEmail}`);
    }
    setConfirmState(prev => ({ ...prev, isOpen: false }));
  };

  const totalAUM = investments.reduce((a, b) => a + b.amount, 0);
  const totalReturns = investments.reduce((a, b) => a + b.profit, 0);

  return (
    <AdminLayout title="Capital Portfolio Hub">
      <div className="flex flex-col gap-8">
        {/* Market Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-5 flex items-center justify-between border-t-2 border-t-brand-accent">
            <div>
              <p className="mono-label">A.U.M</p>
              <p className="text-2xl font-bold font-mono tracking-tighter text-brand-accent">{formatCurrency(totalAUM)}</p>
            </div>
            <BarChart3 className="text-brand-accent opacity-20" size={32} />
          </div>
          <div className="glass-card p-5 flex items-center justify-between border-t-2 border-t-blue-500">
             <div>
              <p className="mono-label">Accrued ROI</p>
              <p className="text-2xl font-bold font-mono tracking-tighter text-blue-500">{formatCurrency(totalReturns)}</p>
            </div>
            <TrendingUp className="text-blue-500 opacity-20" size={32} />
          </div>
          <div className="glass-card p-5 flex items-center justify-between border-t-2 border-t-purple-500">
             <div>
              <p className="mono-label">Active Portfolios</p>
              <p className="text-2xl font-bold font-mono tracking-tighter text-purple-500">{investments.filter(i => i.status === 'active').length}</p>
            </div>
            <Clock className="text-purple-500 opacity-20" size={32} />
          </div>
           <button 
             onClick={() => setShowCreate(true)}
             className="glass-card bg-brand-accent border-brand-accent p-5 flex items-center justify-center gap-3 text-brand-bg group hover:brightness-110 transition-all hover:-translate-y-1 shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
           >
              <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300 text-white" />
              <span className="font-black text-white uppercase tracking-widest text-sm">New Allocation</span>
           </button>
        </div>

        {/* Pending Requests Section */}
        {requested.length > 0 && (
          <section className="mt-4">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                   <Clock size={18} />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Active Requests Queue</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requested.map(inv => (
                  <motion.div 
                    key={inv.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card overflow-hidden border-amber-500/30 bg-amber-500/[0.02]"
                  >
                     <div className="p-6 border-b border-brand-border flex justify-between items-start">
                        <div>
                           <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{inv.id}</span>
                           <h4 className="text-lg font-bold text-zinc-100">{inv.plan}</h4>
                           <p className="text-xs text-zinc-500 font-mono italic">{inv.userEmail}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Volume</p>
                           <p className="text-xl font-bold font-mono text-zinc-100">{formatCurrency(inv.amount)}</p>
                        </div>
                     </div>
                     <div className="p-4 grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleAuthorizeClick(inv.id, inv.userEmail, inv.amount)}
                          className="px-4 py-3 bg-brand-accent text-brand-bg rounded-xl font-black uppercase tracking-widest text-[10px] hover:brightness-110 active:scale-95 transition-all shadow-lg"
                        >
                           Authorize
                        </button>
                        <button 
                          onClick={() => handleRejectClick(inv.id, inv.userEmail, inv.amount)}
                          className="px-4 py-3 bg-zinc-900 text-brand-danger rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-danger hover:text-brand-bg transition-all border border-brand-danger/30"
                        >
                           Reject
                        </button>
                     </div>
                  </motion.div>
                ))}
             </div>
          </section>
        )}

        {/* Investment Portfolio */}
        <section>
          <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                 <BarChart3 size={18} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">Active Portfolio</h2>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-12">
            {[...active, ...completed].map((inv) => (
             <motion.div 
               key={inv.id}
               layout
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="glass-card overflow-hidden group hover:border-brand-accent/30 transition-colors"
             >
                <div className="p-6 border-b border-brand-border flex justify-between items-start">
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{inv.id}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                          inv.status === 'active' ? "bg-brand-accent/20 text-brand-accent border-brand-accent/30" : "bg-black text-zinc-500 border-zinc-800"
                        )}>
                          {inv.status}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold tracking-tight">{inv.plan}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-brand-accent font-black uppercase tracking-widest">{inv.yieldTarget}% Yield</span>
                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{inv.durationDays} Days</span>
                      </div>
                      <p className="text-xs text-zinc-500 font-mono tracking-tighter mt-2 italic">{inv.userEmail}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] text-zinc-500 uppercase font-black tracking-[0.2em] leading-none mb-1 text-right">Principal</p>
                      <p className="text-2xl font-bold font-mono text-zinc-100 tracking-tighter">{formatCurrency(inv.amount)}</p>
                   </div>
                </div>

                <div className="p-6 bg-zinc-950/20">
                  <div className="grid grid-cols-2 gap-8 mb-6">
                    <div>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2 tracking-widest">Yield Produced</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-brand-accent font-mono tracking-tighter">{formatCurrency(inv.profit)}</span>
                        {inv.status === 'active' && (
                          <button 
                            onClick={() => handleSetProfit(inv.id, inv.profit)}
                            className="p-1.5 bg-zinc-900 border border-brand-border rounded-lg text-zinc-500 hover:text-brand-accent transition-colors shadow-sm"
                          >
                            <Settings2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2 tracking-widest">Current Valuation</p>
                      <p className="text-2xl font-bold text-zinc-200 font-mono tracking-tighter">{formatCurrency(inv.amount + inv.profit)}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center text-[10px] uppercase font-black mb-2 tracking-widest">
                      <span className="text-zinc-500">Maturity Cycle</span>
                      <span className="font-mono text-zinc-200">{inv.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-brand-border/30">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${inv.progress}%` }}
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          inv.status === 'active' ? "bg-gradient-to-r from-brand-accent to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-zinc-700"
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {inv.status === 'active' ? (
                      <>
                        <button 
                          onClick={() => handleSetProfit(inv.id, inv.profit)}
                          className="flex-1 py-3 bg-zinc-900 border border-brand-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 text-zinc-400"
                        >
                          <TrendingUp size={14} /> Adjust ROI
                        </button>
                        <button 
                          onClick={() => handleCompleteClick(inv.id, inv.userEmail, inv.amount + inv.profit)}
                          className="flex-1 py-3 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent hover:text-brand-bg transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <CheckCircle2 size={14} /> Settle Portfolio
                        </button>
                      </>
                    ) : (
                      <div className="flex-1 py-4 bg-zinc-900/50 border border-brand-border/30 rounded-xl text-center text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                        Settlement completed • Record Locked
                      </div>
                    )}
                  </div>
                </div>
             </motion.div>
          ))}
        </div>
      </section>
    </div>

      <AnimatePresence>
        {showCreate && <CreateInvestmentModal onClose={() => setShowCreate(false)} />}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={
          confirmState.action === 'approve' ? 'Authorize Allocation' : 
          confirmState.action === 'reject' ? 'Reject Application' : 
          'Settle Portfolio'
        }
        message={
          confirmState.action === 'approve' ? `By authorizing this allocation, ${formatCurrency(confirmState.amount)} will be secured from ${confirmState.userEmail}'s active balance to begin the yield cycle.` :
          confirmState.action === 'reject' ? `You are about to reject the investment request from ${confirmState.userEmail}. No funds will be deducted.` :
          `Are you sure you want to settle this portfolio? Total valuation of ${formatCurrency(confirmState.amount)} will be disbursed to ${confirmState.userEmail}.`
        }
        confirmText={
          confirmState.action === 'approve' ? 'Authorize' : 
          confirmState.action === 'reject' ? 'Reject Request' : 
          'Disburse Funds'
        }
        variant={confirmState.action === 'reject' ? 'danger' : 'success'}
      />
    </AdminLayout>
  );
};

