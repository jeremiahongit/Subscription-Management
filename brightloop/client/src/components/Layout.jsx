import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Repeat,
  FileText,
  CreditCard,
  Package,
  ListChecks,
  Percent,
  Tag,
  UserCog,
  FileStack,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { getUser } from '../routes/ProtectedRoute';

const MENUS = {
  ADMIN: [
    ['/dashboard', 'Dashboard', LayoutDashboard],
    ['/customers', 'Customers', Users],
    ['/subscriptions', 'Subscriptions', Repeat],
    ['/invoices', 'Invoices', FileText],
    ['/payments', 'Payments', CreditCard],
    ['/products', 'Products', Package],
    ['/plans', 'Plans', ListChecks],
    ['/templates', 'Templates', FileStack],
    ['/taxes', 'Taxes', Percent],
    ['/discounts', 'Discounts', Tag],
    ['/staff', 'Staff', UserCog],
  ],
  STAFF: [
    ['/dashboard', 'Dashboard', LayoutDashboard],
    ['/customers', 'Customers', Users],
    ['/subscriptions', 'Subscriptions', Repeat],
    ['/invoices', 'Invoices', FileText],
    ['/payments', 'Payments', CreditCard],
  ],
  CUSTOMER: [
    ['/portal/subscriptions', 'My Subscriptions', Repeat],
    ['/portal/invoices', 'My Invoices', FileText],
  ],
};

export default function Layout() {
  const user = getUser() || { name: 'Demo', role: 'ADMIN' };
  const items = MENUS[user.role] || [];
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`print:hidden fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-slate-900 p-4 text-slate-200 transition-transform md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between px-2">
          <h1 className="text-xl font-bold text-white">Brightloop</h1>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-slate-400 hover:text-white md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {items.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Content wrapper */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="print:hidden flex items-center justify-between border-b bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-slate-600 md:hidden"
            >
              <Menu size={20} />
            </button>
            <span className="text-sm text-slate-500 font-medium">
              {user.name} · <span className="font-semibold text-slate-700">{user.role}</span>
            </span>
          </div>
          <button
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 cursor-pointer"
            onClick={() => {
              localStorage.clear();
              window.location = '/login';
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
