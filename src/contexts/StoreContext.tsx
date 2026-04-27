import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  status: 'active' | 'suspended';
  joined: string;
}

export interface Deposit {
  id: string;
  userEmail: string;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  receiptUrl?: string;
}

export interface Withdrawal {
  id: string;
  userEmail: string;
  amount: number;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface Investment {
  id: string;
  userEmail: string;
  plan: 'Starter Node' | 'Premium Flow' | 'Institutional' | string;
  amount: number;
  profit: number;
  status: 'requested' | 'active' | 'completed';
  progress: number;
  yieldTarget?: number;
  durationDays?: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super' | 'sub';
  createdAt: string;
}

interface StoreContextType {
  users: User[];
  deposits: Deposit[];
  withdrawals: Withdrawal[];
  investments: Investment[];
  admins: AdminUser[];
  updateUserBalance: (userId: string, newBalance: number) => void;
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => void;
  deleteUser: (userId: string) => void;
  processDeposit: (id: string, status: 'approved' | 'rejected', adjustedAmount?: number) => void;
  processWithdrawal: (id: string, status: 'approved' | 'rejected') => void;
  updateInvestmentProfit: (id: string, newProfit: number) => void;
  completeInvestment: (id: string) => void;
  addInvestment: (investment: Omit<Investment, 'id' | 'status' | 'progress'>) => void;
  processInvestmentRequest: (id: string, action: 'approve' | 'reject') => void;
  addAdmin: (admin: Omit<AdminUser, 'id' | 'createdAt'>) => void;
  deleteAdmin: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Henry David', email: 'henrydavid1602@gmail.com', balance: 15400, status: 'active', joined: 'Oct 12, 2023' },
    { id: '2', name: 'Alice Morgan', email: 'alice.m@web.com', balance: 2100, status: 'active', joined: 'Nov 05, 2023' },
    { id: '3', name: 'Bob Smith', email: 'bob.smith@finance.io', balance: 0, status: 'suspended', joined: 'Jan 20, 2024' },
    { id: '4', name: 'Chloe Chen', email: 'chloe.chen@tech.net', balance: 50200, status: 'active', joined: 'Dec 15, 2023' },
  ]);

  const [deposits, setDeposits] = useState<Deposit[]>([
    { id: 'DP-8821', userEmail: 'henrydavid1602@gmail.com', amount: 5000, method: 'USDT (TRC20)', status: 'pending', date: '2024-04-24 10:30', receiptUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600&auto=format&fit=crop' },
    { id: 'DP-8820', userEmail: 'alice.m@web.com', amount: 1200, method: 'Bitcoin', status: 'approved', date: '2024-04-23 15:45', receiptUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=600&auto=format&fit=crop' },
  ]);

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([
    { id: 'WD-201', userEmail: 'henrydavid1602@gmail.com', amount: 1500, address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', status: 'pending', date: '2024-04-24 11:20' },
  ]);

  const [investments, setInvestments] = useState<Investment[]>([
    { id: 'INV-1025', userEmail: 'henrydavid1602@gmail.com', plan: 'Premium Flow', amount: 5000, profit: 450, status: 'active', progress: 65, yieldTarget: 15, durationDays: 30 },
    { id: 'INV-1024', userEmail: 'alice.m@web.com', plan: 'Starter Node', amount: 1000, profit: 120, status: 'completed', progress: 100, yieldTarget: 8, durationDays: 7 },
    { id: 'INV-1023', userEmail: 'henrydavid1602@gmail.com', plan: 'Institutional', amount: 20000, profit: 0, status: 'requested', progress: 0, yieldTarget: 28, durationDays: 90 },
  ]);

  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: 'adm-1', name: 'Henry David', email: 'henrydavid1602@gmail.com', role: 'super', createdAt: '2023-01-01' },
  ]);

  const updateUserBalance = (userId: string, newBalance: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, balance: newBalance } : u));
  };

  const updateUserStatus = (userId: string, status: 'active' | 'suspended') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const processDeposit = (id: string, status: 'approved' | 'rejected', adjustedAmount?: number) => {
    setDeposits(prev => prev.map(d => {
      if (d.id === id) {
        const finalAmount = adjustedAmount ?? d.amount;
        if (status === 'approved') {
          const user = users.find(u => u.email === d.userEmail);
          if (user) {
            updateUserBalance(user.id, user.balance + finalAmount);
          }
        }
        return { ...d, status, amount: finalAmount };
      }
      return d;
    }));
  };

  const processWithdrawal = (id: string, status: 'approved' | 'rejected') => {
    setWithdrawals(prev => prev.map(w => {
      if (w.id === id) {
        if (status === 'approved') {
          const user = users.find(u => u.email === w.userEmail);
          if (user) {
            updateUserBalance(user.id, user.balance - w.amount);
          }
        }
        return { ...w, status };
      }
      return w;
    }));
  };

  const updateInvestmentProfit = (id: string, newProfit: number) => {
    setInvestments(prev => prev.map(i => i.id === id ? { ...i, profit: newProfit } : i));
  };

  const completeInvestment = (id: string) => {
    setInvestments(prev => prev.map(i => {
      if (i.id === id) {
        const user = users.find(u => u.email === i.userEmail);
        if (user) {
          updateUserBalance(user.id, user.balance + i.amount + i.profit);
        }
        return { ...i, status: 'completed', progress: 100 };
      }
      return i;
    }));
  };

  const addInvestment = (inv: Omit<Investment, 'id' | 'status' | 'progress'>) => {
    const newInv: Investment = {
      ...inv,
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'active',
      progress: 5
    };
    setInvestments(prev => [newInv, ...prev]);
  };

  const processInvestmentRequest = (id: string, action: 'approve' | 'reject') => {
    setInvestments(prev => prev.map(inv => {
      if (inv.id === id) {
        if (action === 'approve') {
          // Subtract from user balance when investment starts
          const user = users.find(u => u.email === inv.userEmail);
          if (user) {
            updateUserBalance(user.id, user.balance - inv.amount);
          }
          return { ...inv, status: 'active', progress: 5 };
        }
        return { ...inv, status: 'completed', progress: 0 }; // 'completed' but zero progress means cancelled/rejected
      }
      return inv;
    }));
  };

  const addAdmin = (admin: Omit<AdminUser, 'id' | 'createdAt'>) => {
    const newAdmin: AdminUser = {
      ...admin,
      id: `adm-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAdmins(prev => [...prev, newAdmin]);
  };

  const deleteAdmin = (id: string) => {
    setAdmins(prev => prev.filter(a => a.id !== id));
  };

  const value = useMemo(() => ({
    users, deposits, withdrawals, investments, admins,
    updateUserBalance, updateUserStatus, deleteUser,
    processDeposit, processWithdrawal,
    updateInvestmentProfit, completeInvestment, addInvestment,
    processInvestmentRequest,
    addAdmin, deleteAdmin
  }), [users, deposits, withdrawals, investments, admins]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
