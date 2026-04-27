import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, X, Bell } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-brand-bg text-zinc-100 overflow-hidden">
      <Sidebar mobileOpen={isMobileMenuOpen} setMobileOpen={setIsMobileMenuOpen} />
      
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 lg:h-20 shrink-0 flex items-center justify-between px-4 lg:px-8 bg-brand-bg/80 backdrop-blur-md border-b border-brand-border sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 group transition-colors"
            >
              <Menu size={20} className="group-hover:text-zinc-100" />
            </button>
            <h1 className="text-lg lg:text-xl font-bold tracking-tight truncate max-w-[200px] md:max-w-none">{title}</h1>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
            <button className="hidden md:flex p-2 text-zinc-500 hover:text-zinc-100 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-accent rounded-full border-2 border-brand-bg" />
            </button>
 
            <div className="flex items-center gap-3 pl-3 lg:pl-6 border-l border-brand-border">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-xs lg:text-sm font-bold tracking-tight">{user?.name || 'Admin'}</span>
                <span className="text-[10px] text-zinc-500 font-mono tracking-tighter truncate max-w-[150px]">{user?.email || 'identity.lock'}</span>
              </div>
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-brand-border flex items-center justify-center text-brand-accent font-black shadow-inner shrink-0 cursor-default">
                {user?.name.split(' ').map(n => n[0]).join('') || 'AD'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto no-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
