import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute, { getUser, homeFor } from './routes/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import Dashboard from './pages/dashboard/Dashboard';
import Customers from './pages/staff/Customers';
import Subscriptions from './pages/staff/Subscriptions';
import SubscriptionDetail from './pages/staff/SubscriptionDetail';
import Invoices from './pages/staff/Invoices';
import InvoiceDetail from './pages/staff/InvoiceDetail';
import Payments from './pages/staff/Payments';

import Products from './pages/admin/Products';
import Plans from './pages/admin/Plans';
import Templates from './pages/admin/Templates';
import Taxes from './pages/admin/Taxes';
import Discounts from './pages/admin/Discounts';
import Staff from './pages/admin/Staff';

import MySubscriptions from './pages/portal/MySubscriptions';
import MyInvoices from './pages/portal/MyInvoices';
import MyInvoiceDetail from './pages/portal/MyInvoiceDetail';

export default function App() {
  const user = getUser();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Must be logged in */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Admin + Staff routes */}
            <Route element={<ProtectedRoute roles={['ADMIN', 'STAFF']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/subscriptions/new" element={<SubscriptionDetail />} />
              <Route path="/subscriptions/:id" element={<SubscriptionDetail />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/invoices/:id" element={<InvoiceDetail />} />
              <Route path="/payments" element={<Payments />} />
            </Route>

            {/* Admin only routes */}
            <Route element={<ProtectedRoute roles={['ADMIN']} />}>
              <Route path="/products" element={<Products />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/taxes" element={<Taxes />} />
              <Route path="/discounts" element={<Discounts />} />
              <Route path="/staff" element={<Staff />} />
            </Route>

            {/* Customer only routes */}
            <Route element={<ProtectedRoute roles={['CUSTOMER']} />}>
              <Route path="/portal/subscriptions" element={<MySubscriptions />} />
              <Route path="/portal/invoices" element={<MyInvoices />} />
              <Route path="/portal/invoices/:id" element={<MyInvoiceDetail />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to={user ? homeFor(user.role) : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
