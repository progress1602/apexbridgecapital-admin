/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { UsersPage } from './pages/Users';
import { DepositsPage } from './pages/Deposits';
import { WithdrawalsPage } from './pages/Withdrawals';
import { InvestmentsPage } from './pages/Investments';
import { NotificationsPage } from './pages/Notifications';
import { AdminsPage } from './pages/Admins';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" theme="dark" richColors closeButton />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="deposits" element={<DepositsPage />} />
              <Route path="withdrawals" element={<WithdrawalsPage />} />
              <Route path="investments" element={<InvestmentsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="management" element={<AdminsPage />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
