import React from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  RefreshCw,
  FileText,
  CreditCard,
  Percent,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  TestTube2,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useBrightloop } from '../context/BrightloopContext';
import { NavigationTab } from '../types';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  onCloseMobile
}) => {
  const {
    currentTab,
    setCurrentTab,
    sandboxMode,
    setSandboxMode,
    subscriptions,
    invoices,
    customers,
    users,
    currentUser,
    logout,
    showToast
  } = useBrightloop();

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: number | string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users, badge: customers.length },
    { id: 'products', label: 'Products & Plans', icon: Package },
    { id: 'subscriptions', label: 'Subscriptions', icon: RefreshCw, badge: subscriptions.filter(s => s.status === 'active').length },
    { id: 'invoices', label: 'Invoices', icon: FileText, badge: invoices.filter(i => i.status === 'open' || i.status === 'overdue').length },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'discounts', label: 'Discounts', icon: Percent },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
    { id: 'users', label: 'Team & Access', icon: ShieldCheck, badge: users.length }
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setCurrentTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Dark Navy Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#0A1128] text-slate-300 border-r border-[#1C2541] transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[#1C2541] shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20">
              {/* Loop icon geometry */}
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 0113.856-5.657l1.414-1.414M20 12a8 8 0 01-13.856 5.657l-1.414 1.414" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white font-sans">
                  Brightloop
                </span>
                <span className="text-[10px] font-medium tracking-wide px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 uppercase">
                  B2B
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-sans">
                Billing & Subscription
              </span>
            </div>
          </div>
        </div>

        {/* Workspace Switcher / Sandbox toggle */}
        <div className="p-3 mx-3 my-3 rounded-lg bg-[#0F172A] border border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Workspace
            </span>
            <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
              sandboxMode ? 'bg-amber-950 text-amber-300 border border-amber-800/60' : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
            }`}>
              {sandboxMode ? 'Test Mode' : 'Live Mode'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Sandbox Sandbox</span>
            <button
              onClick={() => setSandboxMode(!sandboxMode)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-hidden ${
                sandboxMode ? 'bg-amber-600' : 'bg-slate-700'
              }`}
              title="Toggle Sandbox test environment"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                  sandboxMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Platform Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg font-medium transition-colors duration-150 text-left cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-[#131F3F] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono tabular-nums ${
                      isActive
                        ? 'bg-blue-700 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Operations
          </div>
          <button
            onClick={() => setCurrentTab('reports')}
            className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg font-medium text-slate-400 hover:text-slate-200 hover:bg-[#131F3F] transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>ASC 606 Revenue</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
          <button
            onClick={() => setCurrentTab('invoices')}
            className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg font-medium text-slate-400 hover:text-slate-200 hover:bg-[#131F3F] transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <TestTube2 className="w-4 h-4 text-emerald-400" />
              <span>Dunning Cycles</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>

        {/* Footer User & Environment Info */}
        <div className="p-3 border-t border-[#1C2541] shrink-0 bg-[#070D1E]">
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-[#101A38] transition-colors">
            <button
              onClick={() => setCurrentTab('users')}
              className="flex items-center gap-2.5 overflow-hidden text-left cursor-pointer flex-1"
            >
              <div className={`w-8 h-8 rounded-full ${currentUser?.avatarBg || 'bg-gradient-to-br from-indigo-500 to-blue-600'} flex items-center justify-center text-white font-semibold text-xs shrink-0 shadow-xs`}>
                {currentUser?.avatarInitials || 'BL'}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-medium text-white truncate">
                  {currentUser?.name || 'Administrator'}
                </span>
                <span className="text-[10px] font-mono text-slate-400 truncate">
                  {currentUser?.role || 'ADMIN'}
                </span>
              </div>
            </button>
            <button
              onClick={() => {
                showToast(
                  'Brightloop v2.4 Platform',
                  'Enterprise Subscription & Recurring Revenue Engine. ASC 606 compliant with vector PDF reporting.',
                  'info'
                );
              }}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
              title="Documentation & Guides"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
