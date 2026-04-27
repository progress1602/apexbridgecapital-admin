import React, { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { Search, CheckCircle2, XCircle, CreditCard, Filter, MapPin, HandCoins, AlertCircle } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { useStore } from '../contexts/StoreContext';
import { toast } from 'sonner';
import { ConfirmModal } from '../components/ConfirmModal';

export const WithdrawalsPage = () => {
  const { withdrawals, processWithdrawal, users } = useStore();
  const [search, setSearch] = useState('');
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    id: string;
    action: 'approve' | 'reject';
    userEmail: string;
    amount: number;
  }>({
    isOpen: false,
    id: '',
    action: 'approve',
    userEmail: '',
    amount: 0
  });

  const filtered = withdrawals.filter(w => 
    w.id.toLowerCase().includes(search.toLowerCase()) || 
    w.userEmail.toLowerCase().includes(search.toLowerCase()) ||
    w.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleApproveClick = (id: string, userEmail: string, amount: number) => {
    const user = users.find(u => u.email === userEmail);
    if (!user) {
      toast.error("System Error: Identity trace failed.");
      return;
    }
    if (user.balance < amount) {
      toast.error(`Insolvency: User balance ($${user.balance}) below requested volume ($${amount}).`);
      return;
    }
    setConfirmState({
      isOpen: true,
      id,
      action: 'approve',
      userEmail,
      amount
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
      processWithdrawal(confirmState.id, 'approved');
      toast.success(`Disbursement authorized for ${confirmState.userEmail}`);
    } else {
      processWithdrawal(confirmState.id, 'rejected');
      toast.info(`Claim rejected and capital returned to ${confirmState.userEmail}`);
    }
    setConfirmState(prev => ({ ...prev, isOpen: false }));
  };

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;
  const approvedTotal = withdrawals.filter(w => w.status === 'approved').reduce((a, b) => a + b.amount, 0);

  return (
    <>
      <AdminLayout title="Fiduciary Outflow Control">
        <div className="flex flex-col gap-6">
           {/* Summary Row */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 flex items-center gap-5 border-l-4 border-amber-500 bg-amber-500/[0.02]">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-inner">
                      <HandCoins size={28} />
                  </div>
                  <div>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Awaiting Authorization</p>
                      <p className="text-3xl font-bold font-mono tracking-tighter">{pendingCount}</p>
                  </div>
              </div>
              <div className="glass-card p-6 flex items-center gap-5 border-l-4 border-brand-accent bg-brand-accent/[0.02]">
                  <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent shadow-inner">
                      <CheckCircle2 size={28} />
                  </div>
                  <div>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Settled Outflows</p>
                      <p className="text-3xl font-bold font-mono tracking-tighter text-brand-accent">{formatCurrency(approvedTotal)}</p>
                  </div>
              </div>
           </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mt-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                placeholder="Search destination, ID or identity..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#09090b] border border-brand-border rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-brand-accent transition-all placeholder:text-zinc-700"
              />
            </div>
          </div>

          {/* Table */}
          <div className="glass-card overflow-hidden border-[#1e1e1e]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/40">
                    <th className="table-header">Transaction ID</th>
                    <th className="table-header">Destination Address</th>
                    <th className="table-header text-right">Volume</th>
                    <th className="table-header text-center">Protocol Status</th>
                    <th className="table-header text-right px-8">Action Hub</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-zinc-600 font-mono text-sm italic tracking-widest uppercase">No outflow logs detected in local matrix.</td>
                    </tr>
                  ) : (
                    filtered.map((wd) => (
                      <tr key={wd.id} className="hover:bg-zinc-800/10 transition-colors border-b border-brand-border/30 group">
                        <td className="px-6 py-6 transition-all group-hover:pl-8">
                          <div className="flex flex-col">
                            <span className="font-mono text-zinc-100 font-black tracking-widest text-xs">{wd.id}</span>
                            <span className="text-[10px] text-zinc-500 italic truncate max-w-[180px] font-mono mt-1">{wd.userEmail}</span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2 group/addr">
                            <div className="p-1.5 rounded bg-zinc-900 border border-brand-border text-zinc-500">
                               <MapPin size={12} />
                            </div>
                            <span className="text-xs text-zinc-400 font-mono truncate max-w-[200px] group-hover/addr:text-zinc-100 transition-colors" title={wd.address}>
                              {wd.address}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <span className="font-black text-brand-danger font-mono text-lg tracking-tighter">-{formatCurrency(wd.amount)}</span>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <span className={cn(
                            "text-[9px] font-black uppercase px-3 py-1 rounded tracking-widest border transition-all",
                            wd.status === 'approved' ? "bg-brand-accent/5 border-brand-accent/20 text-brand-accent" : 
                            wd.status === 'rejected' ? "bg-brand-danger/5 border-brand-danger/20 text-brand-danger shadow-[0_0_15px_rgba(239,68,68,0.1)]" : 
                            "bg-black border-amber-500/30 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                          )}>
                            {wd.status}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-right px-8">
                          {wd.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-3 translate-x-0">
                              <button 
                                onClick={() => handleApproveClick(wd.id, wd.userEmail, wd.amount)}
                                className="whitespace-nowrap px-4 py-2 bg-brand-accent text-brand-bg rounded-lg text-[10px] font-black uppercase hover:brightness-110 transition-all shadow-[0_5px_15px_rgba(16,185,129,0.2)] active:scale-95"
                              >
                                Authorize
                              </button>
                              <button 
                                onClick={() => handleRejectClick(wd.id, wd.userEmail, wd.amount)}
                                className="whitespace-nowrap px-4 py-2 bg-zinc-900 text-brand-danger rounded-lg text-[10px] font-black uppercase hover:bg-brand-danger hover:text-brand-bg transition-all border border-brand-danger/30 active:scale-95"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5 text-zinc-700 italic font-mono text-[9px] font-bold uppercase tracking-widest">
                               Archived Sequence
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>

      <ConfirmModal 
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={confirmState.action === 'approve' ? 'Authorize Disbursement' : 'Reject Withdrawal Claim'}
        message={confirmState.action === 'approve' 
          ? `You are about to authorize a withdrawal of ${formatCurrency(confirmState.amount)} to ${confirmState.userEmail}. This action will deduct capital from their balance. Proceed?`
          : `Rejecting this claim for ${formatCurrency(confirmState.amount)} from ${confirmState.userEmail} will mark it as failed and keep the funds in their virtual ledger. Proceed?`
        }
        confirmText={confirmState.action === 'approve' ? 'Authorize' : 'Reject Claim'}
        variant={confirmState.action === 'approve' ? 'success' : 'danger'}
      />
    </>
  );
};

