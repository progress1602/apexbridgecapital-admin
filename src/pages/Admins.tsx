import React, { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { UserPlus, Shield, X, Trash2, Mail, Calendar } from 'lucide-react';
import { useStore, AdminUser } from '../contexts/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ConfirmModal } from '../components/ConfirmModal';
import { toast } from 'sonner';

export const AdminsPage = () => {
  const { admins, addAdmin, deleteAdmin } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'sub' as 'sub' });
  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAdmin({ ...formData, role: 'sub' });
    setIsModalOpen(false);
    setFormData({ name: '', email: '', role: 'sub' });
    toast.success(`${formData.name} has been authorized as sub-admin.`);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteAdmin(confirmDelete.id);
      setConfirmDelete(null);
      toast.info("Administrative access revoked.");
    }
  };

  return (
    <AdminLayout title="Administrative Control">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">System Staff</h2>
            <p className="text-zinc-500 text-sm">Manage administrative access and sub-admin accounts.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="editorial-button bg-brand-accent text-brand-bg flex items-center gap-2 px-4 sm:px-6 h-11 w-full sm:w-auto justify-center"
          >
            <UserPlus size={16} /> 
            <span className="font-bold uppercase tracking-widest text-[10px]">Create Sub-Admin</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {admins.map((admin) => (
            <motion.div 
              key={admin.id}
              layout
              className="glass-card p-6 flex flex-col gap-4 relative group"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-brand-border flex items-center justify-center text-zinc-400">
                  <Shield size={24} className={admin.role === 'super' ? 'text-brand-accent' : 'text-blue-400'} />
                </div>
                <div className={cn(
                  "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                  admin.role === 'super' ? "bg-brand-accent/20 text-brand-accent" : "bg-blue-500/10 text-blue-500"
                )}>
                  {admin.role === 'super' ? 'Master' : 'Associate'}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg leading-none mb-1">{admin.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Mail size={12} /> {admin.email}
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border mt-auto flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 uppercase font-bold tracking-tighter">
                  <Calendar size={12} /> Joined {admin.createdAt}
                </div>
                {admin.role !== 'super' && (
                  <button 
                    onClick={() => setConfirmDelete(admin)}
                    className="p-2 text-zinc-600 hover:text-brand-danger transition-colors cursor-pointer"
                    title="Revoke Access"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md glass-card p-8"
            >
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-100"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold mb-6">Dispatch New Credential</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mono-label">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-zinc-900 border border-brand-border rounded-lg px-4 py-3 focus:outline-none focus:border-brand-accent text-sm"
                    placeholder="e.g. John Smith"
                  />
                </div>
                <div>
                  <label className="mono-label">Institutional Email</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-zinc-900 border border-brand-border rounded-lg px-4 py-3 focus:outline-none focus:border-brand-accent text-sm"
                    placeholder="admin@apexbridge.com"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 font-semibold transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-lg bg-brand-accent text-brand-bg hover:brightness-110 font-bold transition-all text-sm uppercase tracking-widest"
                  >
                    Authorize Staff
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Revoke Credentials"
        message={`Warning: You are about to terminate all administrative privileges for ${confirmDelete?.name}. They will lose access to all system matrices immediately.`}
        confirmText="Revoke Access"
        variant="danger"
      />
    </AdminLayout>
  );
};
