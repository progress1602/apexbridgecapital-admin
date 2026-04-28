import React, { useState, useMemo } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { Bell, Send, User, Users, Clock, Trash2, Info, CheckCircle, AlertTriangle, Search, ChevronDown, Check, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../contexts/StoreContext';
import { toast } from 'sonner';
import { ConfirmModal } from '../components/ConfirmModal';

export const NotificationsPage = () => {
  const { users } = useStore();
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [targetType, setTargetType] = useState<'all' | 'targeted'>('all');
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  const filteredUsers = useMemo(() => {
    return users.filter(u => u.email.toLowerCase().includes(searchEmail.toLowerCase()));
  }, [users, searchEmail]);

  const [history, setHistory] = useState([
    { id: 1, target: 'All Users', message: 'Welcome to the new ApexBridge dashboard! Explore our updated investment plans.', date: '2024-04-24 09:00', type: 'info' },
    { id: 2, target: 'henrydavid1602@gmail.com', message: 'Your deposit of $5,000 has been successfully processed.', date: '2024-04-23 18:20', type: 'success' },
    { id: 3, target: 'Specific Users', message: 'System maintenance scheduled for Sunday, 02:00 AM UTC.', date: '2024-04-22 12:45', type: 'alert' },
  ]);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleSend = () => {
    if (!message) {
      alert("Please enter a message body.");
      return;
    }
    if (targetType === 'targeted' && !selectedEmail) {
      alert("Please select a target user.");
      return;
    }
    
    const newNotice = {
      id: Date.now(),
      target: targetType === 'all' ? 'All Users' : selectedEmail,
      message,
      date: new Date().toLocaleString(),
      type: 'info'
    };
    
    setHistory([newNotice, ...history]);
    setMessage('');
    toast.success(`Broadcasting initiated. Dispatched to: ${newNotice.target}`);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setHistory(prev => prev.filter(item => item.id !== deleteId));
      setDeleteId(null);
      toast.success("Notification purged from records.");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-brand-accent" />;
      case 'alert': return <AlertTriangle size={16} className="text-brand-danger" />;
      default: return <Info size={16} className="text-blue-400" />;
    }
  };

  return (
    <AdminLayout title="Communication Hub">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Tabs */}
        <div className="flex gap-4 p-1 bg-zinc-900 border border-brand-border rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab('create')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all",
              activeTab === 'create' ? "bg-brand-card text-brand-accent shadow-sm" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Create Notice
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all",
              activeTab === 'history' ? "bg-brand-card text-brand-accent shadow-sm" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
             Archive
          </button>
        </div>

        {activeTab === 'create' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-1">Broadcast Message</h3>
              <p className="text-zinc-500 text-sm">Send a notification to all users or specific accounts.</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div>
                  <label className="mono-label">Recipient Group</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setTargetType('all')}
                      className={cn(
                        "flex-1 py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition-all",
                        targetType === 'all' 
                          ? "bg-brand-accent/10 border-brand-accent text-brand-accent" 
                          : "bg-zinc-900 border-brand-border text-zinc-500 hover:text-zinc-400"
                      )}
                    >
                      <Users size={18} /> <span className="text-xs font-bold uppercase tracking-widest">All Users</span>
                    </button>
                    <button 
                      onClick={() => setTargetType('targeted')}
                      className={cn(
                        "flex-1 py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition-all",
                        targetType === 'targeted' 
                          ? "bg-brand-accent/20 border-brand-accent text-brand-accent" 
                          : "bg-zinc-900 border-brand-border text-zinc-500 hover:text-zinc-400"
                      )}
                    >
                      <User size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Targeted</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mono-label">Notification Priority</label>
                   <select className="w-full bg-zinc-900 border border-brand-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-accent appearance-none text-zinc-100 font-medium">
                      <option>Standard Information</option>
                      <option>Account Alert (High)</option>
                      <option>System Success (Normal)</option>
                   </select>
                </div>
              </div>

              <AnimatePresence>
                {targetType === 'targeted' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <label className="mono-label">Select Target Identity</label>
                    <div className="relative">
                      <button 
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full bg-zinc-900 border border-brand-border rounded-xl px-4 py-3.5 text-sm flex items-center justify-between cursor-pointer hover:border-brand-accent transition-all group active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                              <User size={16} />
                           </div>
                           <span className={selectedEmail ? 'text-zinc-100 font-bold' : 'text-zinc-600'}>
                             {selectedEmail || 'Search and select an account email...'}
                           </span>
                        </div>
                        <ChevronDown size={14} className={cn("text-zinc-500 transition-transform group-hover:text-brand-accent", isDropdownOpen && "rotate-180")} />
                      </button>

                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className={cn(
                              "absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-brand-border rounded-2xl shadow-2xl z-[60] overflow-hidden backdrop-blur-xl",
                              "md:max-h-[400px] flex flex-col"
                            )}
                          >
                            <div className="p-3 border-b border-brand-border bg-zinc-900/80 sticky top-0 z-10">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                                <input 
                                  autoFocus
                                  type="text"
                                  placeholder="Filter by name or email..."
                                  value={searchEmail}
                                  onChange={e => setSearchEmail(e.target.value)}
                                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-accent text-zinc-100 transition-colors"
                                />
                                {searchEmail && (
                                  <button 
                                    onClick={() => setSearchEmail('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300"
                                  >
                                    <X size={12} />
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="overflow-y-auto no-scrollbar scroll-smooth">
                              {filteredUsers.length === 0 ? (
                                <div className="p-8 text-center text-xs text-zinc-600 italic flex flex-col items-center gap-2">
                                   <Search size={24} className="opacity-20" />
                                   No identities matched your query.
                                </div>
                              ) : (
                                filteredUsers.map(user => (
                                  <div 
                                    key={user.id}
                                    onClick={() => {
                                      setSelectedEmail(user.email);
                                      setIsDropdownOpen(false);
                                    }}
                                    className={cn(
                                      "px-4 py-3.5 hover:bg-brand-accent/5 cursor-pointer flex items-center justify-between group transition-colors border-b border-brand-border/20 last:border-0",
                                      selectedEmail === user.email && "bg-brand-accent/5"
                                    )}
                                  >
                                    <div className="flex flex-col">
                                      <span className={cn(
                                        "text-sm font-bold transition-colors",
                                        selectedEmail === user.email ? "text-brand-accent" : "text-zinc-200 group-hover:text-brand-accent"
                                      )}>
                                        {user.name}
                                      </span>
                                      <span className="text-[10px] text-zinc-500 font-mono italic tracking-tighter">{user.email}</span>
                                    </div>
                                    {selectedEmail === user.email && (
                                      <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center">
                                        <Check size={12} className="text-brand-accent" />
                                      </div>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                            {filteredUsers.length > 5 && (
                              <div className="p-3 bg-zinc-950/50 border-t border-brand-border text-[9px] text-zinc-600 text-center font-bold uppercase tracking-[0.2em]">
                                Scroll to view all records
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {isDropdownOpen && (
                        <div 
                          className="fixed inset-0 z-50 pointer-events-auto" 
                          onClick={() => setIsDropdownOpen(false)} 
                        />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="mono-label">Message Body</label>
                <textarea 
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Enter the notification content here..."
                  className="w-full bg-zinc-900 border border-brand-border rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-brand-accent transition-all resize-none text-zinc-100 placeholder:text-zinc-700"
                />
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleSend}
                  className="w-full md:w-auto px-8 py-4 bg-brand-accent text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-accent-hover active:scale-95 transition-all shadow-[0_8px_30px_rgba(192,38,211,0.3)]"
                >
                  <Send size={18} /> Disseminate Notice
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {history.map((item) => (
              <div key={item.id} className="glass-card p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-brand-border flex items-center justify-center shrink-0">
                  <Bell size={20} className="text-zinc-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    {getTypeIcon(item.type)}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Sent to: {item.target}</span>
                  </div>
                  <p className="text-sm font-medium text-zinc-200 line-clamp-2">{item.message}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0 w-full md:w-auto">
                   <div className="flex items-center gap-1.5 text-zinc-500">
                    <Clock size={12} />
                    <span className="text-[10px] font-mono">{item.date}</span>
                   </div>
                   <button 
                     onClick={() => setDeleteId(item.id)}
                     className="p-2 text-zinc-700 hover:text-brand-danger transition-colors cursor-pointer"
                   >
                    <Trash2 size={16} />
                   </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <ConfirmModal 
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Purge Notification"
        message="Are you sure you want to permanently delete this notification record? This action is irreversible."
        confirmText="Confirm Purge"
        variant="danger"
      />
    </AdminLayout>
  );
};
