# APEX BRIDGE - Administrative API Specification

This document outlines the API requirements for the back-end integration, maintaining the naming conventions used in the front-end Store and Auth contexts.

## Authentication (Auth)

### Login
- **Endpoint:** `POST /api/auth/login`
- **Payload:** `{ email: string, passcode: string }`
- **Response:** `{ token: string, user: { name: string, email: string, role: string } }`

### Signup (Admin Creation)
- **Endpoint:** `POST /api/auth/signup`
- **Payload:** `{ name: string, email: string, passcode: string }`
- **Response:** `{ success: boolean, message: string }`

### Logout
- **Endpoint:** `POST /api/auth/logout`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success: boolean }`

---

## User Management

### List Users
- **Endpoint:** `GET /api/users`
- **Response:** `User[]` (See Types below)

### Update User Balance
- **Endpoint:** `PATCH /api/users/:id/balance`
- **Payload:** `{ balance: number }`
- **Response:** `User`

### Update User Status
- **Endpoint:** `PATCH /api/users/:id/status`
- **Payload:** `{ status: 'active' | 'suspended' }`
- **Response:** `User`

### Delete User
- **Endpoint:** `DELETE /api/users/:id`
- **Response:** `{ success: boolean }`

---

## Financial Outflows (Withdrawals)

### List Withdrawals
- **Endpoint:** `GET /api/withdrawals`
- **Response:** `Withdrawal[]`

### Process Withdrawal
- **Endpoint:** `PATCH /api/withdrawals/:id/status`
- **Payload:** `{ status: 'approved' | 'rejected' }`
- **Response:** `Withdrawal`

---

## Capital Infusions (Deposits)

### List Deposits
- **Endpoint:** `GET /api/deposits`
- **Response:** `Deposit[]`

### Process Deposit
- **Endpoint:** `PATCH /api/deposits/:id/status`
- **Payload:** `{ status: 'approved' | 'rejected', adjustedAmount?: number }`
- **Response:** `Deposit`

---

## Investment Portfolios (Allocations)

### List Investments
- **Endpoint:** `GET /api/investments`
- **Response:** `Investment[]`

### Create Investment (Manual)
- **Endpoint:** `POST /api/investments`
- **Payload:** `{ userEmail: string, plan: string, amount: number, yieldTarget: number, durationDays: number }`
- **Response:** `Investment`

### Update Investment Profit
- **Endpoint:** `PATCH /api/investments/:id/profit`
- **Payload:** `{ profit: number }`
- **Response:** `Investment`

### Complete/Settle Investment
- **Endpoint:** `PATCH /api/investments/:id/complete`
- **Response:** `Investment`

### Process Investment Request (Approve/Reject)
- **Endpoint:** `PATCH /api/investments/:id/process`
- **Payload:** `{ action: 'approve' | 'reject' }`
- **Response:** `Investment`

---

## Communications (Notifications)

### Dispatch Notice
- **Endpoint:** `POST /api/notifications/send`
- **Payload:** `{ target: 'all' | string (email), message: string, type: 'info' | 'success' | 'alert' }`
- **Response:** `{ success: boolean }`

---

## Administrative Roles

### List Admins
- **Endpoint:** `GET /api/admins`
- **Response:** `AdminUser[]`

### Add Admin
- **Endpoint:** `POST /api/admins`
- **Payload:** `{ name: string, email: string, role: 'super' | 'sub' }`
- **Response:** `AdminUser`

### Delete Admin
- **Endpoint:** `DELETE /api/admins/:id`
- **Response:** `{ success: boolean }`

---

## Shared Data Structures (Types)

```typescript
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
  plan: string;
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
```
