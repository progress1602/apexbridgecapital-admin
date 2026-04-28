import React, { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { Check, X, Search, Clock, ShieldCheck, AlertCircle, CheckCircle2, XCircle, ExternalLink, Image as ImageIcon, Eye } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { useStore, Deposit } from '../contexts/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { ConfirmModal } from '../components/ConfirmModal';

const TransactionDetailModal = ({ deposit, onClose }: { deposit: Deposit, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-4xl glass-card overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:h-auto overflow-y-auto no-scrollbar"
      >
        {/* Detail Body */}
        <div className="flex-1 p-6 lg:p-10 order-2 md:order-1">
          <button onClick={onClose} className="absolute top-4 left-4 text-zinc-500 hover:text-zinc-100 z-50">
            <X size={20} />
          </button>
          
          <div className="mb-8 pt-4 md:pt-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-brand-border text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">
              Internal Log Report
            </div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-zinc-100 mb-2">Transaction Details</h3>
            <p className="text-zinc-500 font-mono text-[10px] break-all">{deposit.id}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-10">
             <div>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-2">Capital Source</p>
                <p className="text-sm font-bold text-zinc-200 truncate" title={deposit.userEmail}>{deposit.userEmail}</p>
                <p className="text-[10px] text-zinc-600 font-mono mt-1 italic">{deposit.date}</p>
             </div>
             <div>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-2">Asset Method</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(192,38,211,0.5)]" />
                   <p className="text-sm font-black text-zinc-200 tracking-tighter">{deposit.method}</p>
                </div>
             </div>
             <div>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-2">Volume</p>
                <p className="text-2xl md:text-3xl font-black text-brand-accent tracking-tighter font-mono">{formatCurrency(deposit.amount)}</p>
             </div>
             <div>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-2">Validation State</p>
                <span className={cn(
                  "text-[10px] font-black uppercase px-2.5 py-1 rounded-md border inline-block tracking-widest",
                   deposit.status === 'approved' ? "bg-brand-accent/5 border-brand-accent/20 text-brand-accent" : 
                   deposit.status === 'rejected' ? "bg-brand-danger/5 border-brand-danger/20 text-brand-danger" : 
                   "bg-amber-500/5 border-amber-500/20 text-amber-500"
                )}>
                  {deposit.status}
                </span>
             </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-brand-border/50">
             <div className="flex items-center gap-3 text-brand-accent mb-3">
                <ShieldCheck size={18} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Verification Integrity</span>
             </div>
             <p className="text-[11px] text-zinc-500 leading-relaxed italic">
               This transaction has been cryptographically logged. Ensure the receipt matches the blockchain confirmation before final authorization.
             </p>
          </div>
        </div>

        {/* Receipt Showcase */}
        <div className="w-full md:w-[350px] lg:w-[400px] bg-zinc-950 border-l border-brand-border flex flex-col order-1 md:order-2 shrink-0 relative min-h-[300px]">
          <div className="absolute top-4 right-4 z-20 flex gap-2">
             <a 
              href={deposit.receiptUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:bg-black transition-colors"
             >
                <ExternalLink size={16} />
             </a>
          </div>
          <div className="p-4 border-b border-brand-border bg-black/20">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                <ImageIcon size={12} /> User Submitted Receipt
             </span>
          </div>
          <div className="flex-1 overflow-hidden group">
            {deposit.receiptUrl ? (
               <img 
                src={deposit.receiptUrl} 
                alt="Payment Receipt" 
                className="w-full h-full object-contain bg-zinc-900 group-hover:scale-105 transition-transform duration-700" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 gap-4">
                 <ImageIcon size={48} strokeWidth={1} />
                 <span className="text-[10px] uppercase font-bold tracking-widest">No visual record attached</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ApproveModal = ({ deposit, onClose }: { deposit: Deposit, onClose: () => void }) => {
  const { processDeposit } = useStore();
  const [amount, setAmount] = useState(deposit.amount);

  const handleApprove = () => {
    processDeposit(deposit.id, 'approved', amount);
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
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-md glass-card p-8 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-100">
          <X size={20} />
        </button>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <ShieldCheck className="text-brand-accent" /> Validate Infusion
        </h3>
        <p className="text-zinc-500 text-sm mb-6 font-mono tracking-tighter">Verifying transaction {deposit.id}</p>
        
        <div className="space-y-4">
          <div className="p-4 bg-zinc-900 rounded-lg border border-brand-border">
            <div className="flex justify-between text-xs text-zinc-500 mb-1 uppercase font-bold tracking-widest">Submitted Amount</div>
            <div className="text-xl font-mono text-zinc-200">{formatCurrency(deposit.amount)}</div>
          </div>
          
          <div>
            <label className="mono-label">Final Verified Amount</label>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-brand-border rounded-lg px-4 py-3 focus:outline-none focus:border-brand-accent transition-colors font-mono text-zinc-100"
            />
            <p className="text-[10px] text-zinc-600 mt-2 italic font-mono">* This amount will be instantly credited to {deposit.userEmail}</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 font-semibold transition-colors text-sm"
            >
              Abort
            </button>
            <button 
              onClick={handleApprove}
              className="flex-1 px-4 py-3 rounded-lg bg-brand-accent text-white hover:bg-brand-accent-hover font-bold transition-all shadow-[0_4px_20px_rgba(192,38,211,0.2)] text-sm uppercase tracking-widest"
            >
              Authorize
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const DepositsPage = () => {
  const { deposits, processDeposit } = useStore();
  const [selectedDepositForReview, setSelectedDepositForReview] = useState<Deposit | null>(null);
  const [selectedDepositForDetails, setSelectedDepositForDetails] = useState<Deposit | null>(null);
  const [confirmReject, setConfirmReject] = useState<Deposit | null>(null);
  const [search, setSearch] = useState('');

  const filteredDeposits = deposits.filter(d => 
    d.id.toLowerCase().includes(search.toLowerCase()) || 
    d.userEmail.toLowerCase().includes(search.toLowerCase())
  );

  const pending = filteredDeposits.filter(d => d.status === 'pending');
  const history = filteredDeposits.filter(d => d.status !== 'pending');

  return (
    <AdminLayout title="Capital Infusions">
      <div className="flex flex-col gap-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 border-l-4 border-amber-500">
            <div className="flex items-center gap-3 text-amber-500 mb-2">
              <Clock size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Awaiting Validation</span>
            </div>
            <div className="text-3xl font-bold font-mono tracking-tighter">{deposits.filter(d => d.status === 'pending').length}</div>
          </div>
          <div className="glass-card p-6 border-l-4 border-brand-accent">
            <div className="flex items-center gap-3 text-brand-accent mb-2">
              <ShieldCheck size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Successfully Settled</span>
            </div>
            <div className="text-3xl font-bold font-mono tracking-tighter">{deposits.filter(d => d.status === 'approved').length}</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-brand-card border border-brand-border rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand-accent transition-colors text-sm"
            />
          </div>
        </div>

        {/* Pending Deposits */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} className="text-amber-500" />
            <h2 className="text-lg font-bold tracking-tight">Priority Queue</h2>
          </div>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/40">
                    <th className="table-header">Transaction ID</th>
                    <th className="table-header">User</th>
                    <th className="table-header">Volume</th>
                    <th className="table-header text-center">Status</th>
                    <th className="table-header text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 font-mono text-sm">No pending infusions in queue.</td>
                    </tr>
                  ) : (
                    pending.map((item) => (
                      <tr 
                        key={item.id} 
                        onClick={() => setSelectedDepositForDetails(item)}
                        className="group hover:bg-zinc-800/10 transition-colors border-b border-brand-border/30 cursor-pointer"
                      >
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-mono text-zinc-100 font-bold text-sm tracking-tight">{item.id}</span>
                            <span className="text-[10px] text-zinc-500 font-mono italic">{item.date}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                           <span className="text-sm font-semibold block truncate max-w-[200px] tracking-tight">{item.userEmail}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-brand-accent font-black font-mono text-lg tracking-tighter leading-none">{formatCurrency(item.amount)}</span>
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">{item.method}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[9px] font-black uppercase tracking-tighter border bg-black border-amber-500/30 text-amber-500">
                            {item.status}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDepositForReview(item);
                              }}
                              className="p-2 rounded-lg bg-brand-accent/10 hover:bg-brand-accent text-brand-accent hover:text-brand-bg transition-all"
                              title="Approve"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmReject(item);
                              }}
                              className="p-2 rounded-lg bg-brand-danger/10 hover:bg-brand-danger text-brand-danger hover:text-brand-bg transition-all"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* History */}
        <section>
          <h2 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
             Ledger History
          </h2>
          <div className="glass-card overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/40">
                    <th className="table-header">Transaction ID</th>
                    <th className="table-header">User</th>
                    <th className="table-header">Volume</th>
                    <th className="table-header text-center">Result</th>
                    <th className="table-header text-right">View</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr 
                      key={item.id} 
                      onClick={() => setSelectedDepositForDetails(item)}
                      className="group hover:bg-zinc-800/10 transition-colors border-b border-brand-border/30 cursor-pointer"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-zinc-500">{item.id}</td>
                      <td className="px-6 py-4 text-xs font-medium text-zinc-400">{item.userEmail}</td>
                      <td className="px-6 py-4 font-mono text-zinc-200">{formatCurrency(item.amount)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest border",
                          item.status === 'approved' ? "bg-brand-accent/5 border-brand-accent/20 text-brand-accent" : "bg-brand-danger/5 border-brand-danger/20 text-brand-danger"
                        )}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="p-2 text-zinc-600 hover:text-zinc-100 transition-colors">
                            <Eye size={16} />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {selectedDepositForReview && (
          <ApproveModal 
            deposit={selectedDepositForReview} 
            onClose={() => setSelectedDepositForReview(null)} 
          />
        )}
        {selectedDepositForDetails && (
          <TransactionDetailModal 
            deposit={selectedDepositForDetails}
            onClose={() => setSelectedDepositForDetails(null)}
          />
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={!!confirmReject}
        onClose={() => setConfirmReject(null)}
        onConfirm={() => {
          if (confirmReject) {
            processDeposit(confirmReject.id, 'rejected');
            toast.info(`Infusion record rejected for ${confirmReject.userEmail}`);
          }
        }}
        title="Reject Infusion"
        message={`Are you sure you want to reject the deposit request for ${formatCurrency(confirmReject?.amount || 0)} from ${confirmReject?.userEmail}? This will mark the transaction as failed.`}
        confirmText="Reject Request"
        variant="danger"
      />
    </AdminLayout>
  );
};
