import React from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatCurrency } from '../lib/utils';
import { useStore } from '../contexts/StoreContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: any) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden"
  >
    <div className="flex justify-between items-start">
      <div className={cn("p-2 rounded-lg bg-zinc-800 border border-brand-border", color)}>
        <Icon size={20} />
      </div>
      <div className={cn(
        "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
        trend === 'up' ? "bg-brand-accent/10 text-brand-accent" : "bg-brand-danger/10 text-brand-danger"
      )}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trendValue}
      </div>
    </div>
    <div>
      <p className="mono-label">{title}</p>
      <h3 className="text-3xl font-bold mt-1 tracking-tighter font-mono">{value}</h3>
    </div>
    <div className={cn("absolute -right-4 -bottom-4 opacity-5", color)}>
      <Icon size={80} />
    </div>
  </motion.div>
);

export const Dashboard = () => {
  const { users, deposits, withdrawals, investments } = useStore();
  
  const totalBalance = users.reduce((acc, user) => acc + user.balance, 0);
  const totalDeposits = deposits.reduce((acc, d) => d.status === 'approved' ? acc + d.amount : acc, 0);
  const totalWithdrawals = withdrawals.reduce((acc, w) => w.status === 'approved' ? acc + w.amount : acc, 0);
  const pendingDeposits = deposits.filter(d => d.status === 'pending');

  const chartData = [
    { name: 'Jan', dep: 4000, wit: 2400 },
    { name: 'Feb', dep: 3000, wit: 1398 },
    { name: 'Mar', dep: 2000, wit: 9800 },
    { name: 'Apr', dep: totalDeposits, wit: totalWithdrawals },
  ];

  const pieData = [
    { name: 'Active', value: users.filter(u => u.status === 'active').length, color: '#10b981' },
    { name: 'Suspended', value: users.filter(u => u.status === 'suspended').length, color: '#ef4444' },
  ];

  return (
    <AdminLayout title="Intelligence Core">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value={users.length.toString()} 
          icon={Users} 
          trend="up" 
          trendValue="12%" 
          color="text-blue-400"
        />
        <StatCard 
          title="Total Deposits" 
          value={formatCurrency(totalDeposits)} 
          icon={ArrowUpCircle} 
          trend="up" 
          trendValue="8.4%" 
          color="text-brand-accent"
        />
        <StatCard 
          title="Total Withdrawals" 
          value={formatCurrency(totalWithdrawals)} 
          icon={ArrowDownCircle} 
          trend="down" 
          trendValue="2.1%" 
          color="text-brand-danger"
        />
        <StatCard 
          title="Active Investments" 
          value={investments.filter(i => i.status === 'active').length.toString()} 
          icon={TrendingUp} 
          trend="up" 
          trendValue="5.7%" 
          color="text-purple-400"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* Main Chart */}
        <div className="xl:col-span-2 glass-card p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold flex items-center gap-2 text-lg">
              <BarChartIcon size={20} className="text-brand-accent" />
              Capital Flow Analysis
            </h3>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#10b981] rounded-full" />
                <span className="text-zinc-500">Deposits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#ef4444] rounded-full" />
                <span className="text-zinc-500">Withdrawals</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] lg:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10 }}
                />
                <Tooltip 
                  cursor={{ fill: '#27272a' }}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="dep" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="wit" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-card p-6 lg:p-8 flex flex-col items-center justify-center">
           <h3 className="font-bold mb-8 flex items-center gap-2 text-lg self-start">
            <PieChartIcon size={20} className="text-blue-400" />
            User Allocation
          </h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold font-mono tracking-tighter">{users.length}</span>
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Users</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full mt-8">
            {pieData.map((item) => (
              <div key={item.name} className="p-3 bg-zinc-900 rounded-xl border border-brand-border">
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">{item.name}</p>
                <p className="text-xl font-bold font-mono" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Pending Transactions */}
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Activity size={18} className="text-brand-accent" />
              Prioritized In-Queue
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/40">
                  <th className="table-header">Identity</th>
                  <th className="table-header">Volume</th>
                  <th className="table-header text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingDeposits.slice(0, 5).map((row, i) => (
                  <tr key={i} className="group hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 border-b border-brand-border">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight">{row.userEmail}</span>
                        <span className="text-[10px] text-zinc-500 font-mono italic">{row.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-brand-border">
                      <span className="text-sm font-mono font-bold text-brand-accent">{formatCurrency(row.amount)}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-brand-border text-right">
                       <Link 
                         to="/admin/deposits"
                         className="text-[10px] font-black tracking-widest uppercase text-brand-accent hover:brightness-125 transition-all inline-block"
                       >
                         Review
                       </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Liquidity Tracking */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="font-bold flex items-center gap-2 mb-6">
            <ArrowUpRight size={18} className="text-purple-400" />
            Global Liquidity
          </h3>
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Total Managed Capital</p>
                <p className="text-2xl font-bold font-mono tracking-tighter text-zinc-100">{formatCurrency(totalBalance)}</p>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-zinc-900 rounded-2xl border border-brand-border">
                 <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2">Risk Adjusted Yield</p>
                 <p className="text-xl font-bold text-brand-accent font-mono">+18.2%</p>
               </div>
               <div className="p-4 bg-zinc-900 rounded-2xl border border-brand-border">
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2">Platform Reserve</p>
                  <p className="text-xl font-bold text-blue-400 font-mono">92%</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

