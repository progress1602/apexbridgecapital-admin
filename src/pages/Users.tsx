import React, { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { Search, Filter, MoreVertical, Edit2, Ban, Trash2, CheckCircle, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from '../lib/utils';
import { useStore, User } from '../contexts/StoreContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { toast } from 'sonner';

const BalanceModal = ({ user, onClose }: { user: User, onClose: () => void }) => {
  const { updateUserBalance } = useStore();
  const [amount, setAmount] = useState(user.balance);

  const handleUpdate = () => {
    updateUserBalance(user.id, amount);
    toast.success(`Capital adjusted for ${user.email}`);
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
        className="relative w-full max-w-md glass-card p-6 md:p-8 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-100">
          <X size={20} />
        </button>
        <h3 className="text-xl font-bold mb-2 pt-2 md:pt-0">Adjust Capital</h3>
        <p className="text-zinc-500 text-xs mb-6 font-mono tracking-tighter">Liquidating/Infusing funds for {user.email}</p>
        
        <div className="space-y-6">
          <div>
            <label className="mono-label">Current Assets</label>
            <div className="text-2xl font-mono text-brand-accent tracking-tighter">{formatCurrency(user.balance)}</div>
          </div>
          
          <div>
            <label className="mono-label">Revised Asset Value</label>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-brand-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-accent transition-colors font-mono text-zinc-100 text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button 
              onClick={onClose}
              className="px-4 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold uppercase tracking-widest transition-colors text-[10px] order-2 sm:order-1"
            >
              Discard
            </button>
            <button 
              onClick={handleUpdate}
              className="flex-1 px-4 py-3.5 rounded-xl bg-brand-accent text-brand-bg hover:brightness-110 font-black uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(16,185,129,0.2)] text-[10px] order-1 sm:order-2"
            >
              Sync Assets
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const UsersPage = () => {
  const { users, updateUserStatus, deleteUser } = useStore();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);
  
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    if (confirmDelete) {
      deleteUser(confirmDelete.id);
      toast.info(`Account trace purged: ${confirmDelete.email}`);
    }
  };

  return (
    <AdminLayout title="Capital Registry">
      <div className="flex flex-col gap-6">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Query identity database..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-brand-card border border-brand-border rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand-accent transition-colors text-sm"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-2.5 bg-brand-accent text-brand-bg rounded-xl font-black hover:brightness-110 transition-all text-[10px] uppercase tracking-widest shadow-[0_8px_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2">
              <Download size={14} /> Extract Ledger
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/40">
                  <th className="table-header">Identity</th>
                  <th className="table-header">Capital</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Registry Date</th>
                  <th className="table-header text-right">Operations</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-zinc-800/20 transition-colors border-b border-brand-border/50">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold tracking-tight text-zinc-100">{user.name}</span>
                        <span className="text-[10px] text-zinc-500 font-mono italic tracking-tighter">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-mono text-zinc-200 font-bold">
                      {formatCurrency(user.balance)}
                    </td>
                    <td className="px-6 py-5">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest",
                        user.status === 'active' ? "bg-brand-accent/10 text-brand-accent border border-brand-accent/20" : "bg-brand-danger/10 text-brand-danger border border-brand-danger/20"
                      )}>
                        {user.status}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs text-zinc-500 font-mono">
                      {user.joined}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="p-2.5 rounded-lg bg-zinc-900 border border-brand-border text-zinc-500 hover:text-brand-accent hover:border-brand-accent/30 transition-all active:scale-95"
                          title="Modify Assets"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            updateUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active');
                            toast.success(`Identity state updated for ${user.email}`);
                          }}
                          className={cn(
                            "p-2.5 rounded-lg bg-zinc-900 border border-brand-border transition-all active:scale-95",
                            user.status === 'active' ? "text-amber-500 hover:text-amber-400 hover:border-amber-400/30" : "text-brand-accent hover:text-brand-accent hover:border-brand-accent/30"
                          )}
                          title={user.status === 'active' ? 'Suspend' : 'Reinstate'}
                        >
                          {user.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                        </button>
                        <button 
                          onClick={() => setConfirmDelete(user)}
                          className="p-2.5 rounded-lg bg-zinc-900 border border-brand-border text-zinc-500 hover:text-brand-danger hover:border-brand-danger/30 transition-all active:scale-95"
                          title="Terminate"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedUser && (
          <BalanceModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Terminate Identity"
        message={`Are you absolutely certain you wish to purge all records for ${confirmDelete?.email}? This action is cryptographically irreversible and will terminate their access to the fund matrix.`}
        confirmText="Terminate Account"
        variant="danger"
      />
    </AdminLayout>
  );
};
