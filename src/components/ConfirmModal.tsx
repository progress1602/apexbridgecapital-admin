import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X, CheckSquare, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  variant?: 'danger' | 'success' | 'warning';
}

export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  variant = 'success'
}: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm glass-card p-8 shadow-2xl text-center border-zinc-800"
          >
            <div className={cn(
              "w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg",
              variant === 'danger' ? "bg-red-500/10 text-red-500" :
              variant === 'warning' ? "bg-amber-500/10 text-amber-500" :
              "bg-brand-accent/10 text-brand-accent"
            )}>
              {variant === 'danger' ? <Trash2 size={32} /> :
               variant === 'warning' ? <AlertTriangle size={32} /> :
               <CheckSquare size={32} />}
            </div>

            <h3 className="text-xl font-bold mb-2 text-zinc-100">{title}</h3>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed px-4">{message}</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-zinc-900 border border-brand-border text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-200 transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={cn(
                  "w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-brand-bg transition-all active:scale-95 text-[10px] shadow-lg order-1 sm:order-2",
                  variant === 'danger' ? "bg-red-500 hover:bg-red-600" :
                  variant === 'warning' ? "bg-amber-500 hover:bg-amber-600" :
                  "bg-brand-accent hover:brightness-110"
                )}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
