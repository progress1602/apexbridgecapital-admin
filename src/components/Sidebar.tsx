import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCog } from 'lucide-react';
import { 
  LayoutDashboard, 
  Users, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  TrendingUp, 
  Bell, 
  Menu, 
  X, 
  ChevronLeft,
  LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  active: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, collapsed, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
      active 
        ? "bg-brand-accent/10 text-brand-accent border-l-2 border-brand-accent rounded-r-md shadow-[0_0_20px_rgba(16,185,129,0.05)]" 
        : "text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/50 border-l-2 border-transparent"
    )}
  >
    <Icon size={18} className={cn("shrink-0", active ? "text-brand-accent" : "group-hover:text-zinc-100")} />
    {!collapsed && (
      <span className="font-semibold text-sm overflow-hidden whitespace-nowrap tracking-tight">
        {label}
      </span>
    )}
    {collapsed && (
      <div className="absolute left-14 bg-brand-card border border-brand-border px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
        {label}
      </div>
    )}
  </Link>
);

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar = ({ mobileOpen, setMobileOpen }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (!isLargeScreen) {
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/deposits', icon: ArrowUpCircle, label: 'Deposits' },
    { to: '/admin/withdrawals', icon: ArrowDownCircle, label: 'Withdrawals' },
    { to: '/admin/investments', icon: TrendingUp, label: 'Investments' },
    { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { to: '/admin/management', icon: UserCog, label: 'Admins' },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, setMobileOpen]);

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: collapsed ? 88 : 280,
          x: isLargeScreen ? 0 : (mobileOpen ? 0 : -280)
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className={cn(
          "fixed top-0 left-0 h-screen bg-[#09090b] border-r border-[#1e1e1e] z-50 flex flex-col",
          "lg:relative lg:h-screen lg:shrink-0"
        )}
      >
        {/* Logo Section */}
        <div className="px-6 mb-12 flex items-center justify-between overflow-hidden shrink-0">
          {!collapsed ? (
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-accent to-[#10b981aa] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <ShieldCheck className="text-zinc-950" size={24} />
                </div>
                <div>
                  <span className="text-xl font-black tracking-tighter text-zinc-100 block leading-tight">APEX</span>
                  <span className="text-[10px] font-bold tracking-[0.3em] text-brand-accent uppercase -mt-1 block">Bridge</span>
                </div>
             </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-accent to-[#10b981aa] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <ShieldCheck className="text-zinc-950" size={20} />
            </div>
          )}
          
          <div className="flex items-center gap-1">
             {/* Mobile Close Button */}
            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-100 transition-colors"
            >
              <X size={18} />
            </button>
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex shrink-0 p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-100 transition-colors"
            >
              <ChevronLeft className={cn("transition-transform", collapsed && "rotate-180")} size={18} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar scroll-smooth">
          {navItems.map((item) => (
            <NavItem 
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.to}
              collapsed={collapsed}
              onClick={handleNavClick}
            />
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="px-4 mt-auto pt-6 border-t border-[#1e1e1e] flex flex-col gap-6">
           {!collapsed && (
              <div className="px-2 py-3 bg-zinc-900/50 rounded-xl border border-brand-border flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-black text-brand-accent">
                    {user?.name.split(' ').map(n => n[0]).join('') || 'AD'}
                 </div>
                 <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold text-zinc-300 truncate">{user?.name || 'Admin User'}</span>
                    <span className="text-[8px] text-zinc-600 font-mono tracking-tighter truncate">{user?.role || 'Access Tier'}</span>
                 </div>
              </div>
           )}
           <button 
             onClick={handleLogout}
             className={cn(
               "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm tracking-widest uppercase hover:bg-brand-danger/10 hover:text-brand-danger group",
               collapsed ? "justify-center text-zinc-500" : "text-zinc-500"
             )}
           >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};
