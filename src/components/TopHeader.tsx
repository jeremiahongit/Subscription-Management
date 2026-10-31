import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Plus,
  DollarSign,
  ChevronDown,
  UserPlus,
  FilePlus2,
  RefreshCw,
  Tag,
  Check,
  ShieldAlert,
  Sun,
  Moon,
  IndianRupee,
  Download,
  LogOut,
  Users as UsersIcon,
  ShieldCheck
} from 'lucide-react';
import { useBrightloop } from '../context/BrightloopContext';
import { NavigationTab } from '../types';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
  onOpenCreateCustomer: () => void;
  onOpenCreateSubscription: () => void;
  onOpenCreateInvoice: () => void;
  onOpenCreateDiscount: () => void;
  onOpenExportReportModal?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenMobileMenu,
  onOpenCreateCustomer,
  onOpenCreateSubscription,
  onOpenCreateInvoice,
  onOpenCreateDiscount,
  onOpenExportReportModal
}) => {
  const {
    currentTab,
    setCurrentTab,
    sandboxMode,
    currency,
    setCurrency,
    theme,
    toggleTheme,
    setIsSearchOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsRead,
    unreadNotificationsCount,
    currentUser,
    logout,
    switchUser,
    users
  } = useBrightloop();

  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const createRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (createRef.current && !createRef.current.contains(e.target as Node)) {
        setCreateDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (currRef.current && !currRef.current.contains(e.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabTitles: Record<NavigationTab, { title: string; subtitle: string }> = {
    overview: { title: 'Billing Overview', subtitle: 'Real-time revenue metrics, run rates and subscription performance' },
    customers: { title: 'Customers', subtitle: 'Subscriber accounts, lifetime value, and payment credentials' },
    products: { title: 'Products & Plans', subtitle: 'Tier packaging, pricing intervals, quotas and feature entitlements' },
    subscriptions: { title: 'Subscriptions', subtitle: 'Active subscriber contracts, renewal cadences, and lifecycle states' },
    invoices: { title: 'Invoices', subtitle: 'Billing statements, tax calculations, and payment statuses' },
    payments: { title: 'Payments & Transactions', subtitle: 'Gateway processing logs, card authorizations, and refunds' },
    discounts: { title: 'Discounts & Coupons', subtitle: 'Promotional campaign codes, duration rules, and redemptions' },
    reports: { title: 'Financial Reports & ASC 606', subtitle: 'ASC 606 revenue recognition, waterfall analysis, and churn metrics' },
    users: { title: 'Team & Access Control', subtitle: 'Role-based access governance, staff credentials, and security settings' }
  };

  const currentMeta = tabTitles[currentTab] || tabTitles.overview;

  const currencyOptions = [
    { code: 'INR', label: 'INR (₹) Rupee', symbol: '₹' },
    { code: 'USD', label: 'USD ($) Dollar', symbol: '$' },
    { code: 'EUR', label: 'EUR (€) Euro', symbol: '€' },
    { code: 'GBP', label: 'GBP (£) Pound', symbol: '£' },
  ] as const;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-white dark:bg-[#0A1128] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Zone 1: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span>Brightloop</span>
            <span>/</span>
            <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">{currentTab.replace('_', ' ')}</span>
          </div>
          <h1 className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            {currentMeta.title}
          </h1>
        </div>
      </div>

      {/* Zone 2: Global Search Trigger & Sandbox Alert */}
      <div className="flex items-center gap-3">
        {sandboxMode && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 rounded-md">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Sandbox Active</span>
          </div>
        )}

        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer w-44 md:w-64"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="truncate">Search customers, invoices...</span>
          <kbd className="hidden md:inline-block ml-auto text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Theme Toggle, Currency, Notifications & Primary Create Action */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Dark/Light Mode Switcher */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300 transition-colors" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 hover:text-slate-900 transition-colors" />
          )}
        </button>

        {/* Currency Switcher */}
        <div className="relative" ref={currRef}>
          <button
            onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Change active currency display"
          >
            {currency === 'INR' ? (
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <DollarSign className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            )}
            <span className="font-semibold">{currency}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {currencyDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50 text-xs">
              <div className="px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                Display Currency
              </div>
              {currencyOptions.map((opt) => (
                <button
                  key={opt.code}
                  onClick={() => {
                    setCurrency(opt.code);
                    setCurrencyDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer ${
                    currency === opt.code
                      ? 'font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{opt.symbol}</span>
                    <span>{opt.label}</span>
                  </span>
                  {currency === opt.code && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Activity & Alerts</span>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                    No new activity alerts.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationAsRead(notif.id);
                        if (notif.linkTab) {
                          setCurrentTab(notif.linkTab);
                          setNotificationsOpen(false);
                        }
                      }}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                        notif.unread ? 'bg-blue-50/40 dark:bg-blue-950/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {notif.title}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0 font-mono">
                          {notif.timeAgo}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                        {notif.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Create Quick Action Dropdown */}
        <div className="relative" ref={createRef}>
          <button
            onClick={() => setCreateDropdownOpen(!createDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create</span>
            <ChevronDown className="w-3 h-3 ml-0.5 text-blue-200" />
          </button>

          {createDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs">
              <button
                onClick={() => {
                  setCreateDropdownOpen(false);
                  onOpenCreateSubscription();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-left"
              >
                <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">New Subscription</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">Enroll customer in plan</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setCreateDropdownOpen(false);
                  onOpenCreateCustomer();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-left"
              >
                <UserPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">Add Customer</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">Create new billing account</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setCreateDropdownOpen(false);
                  onOpenCreateInvoice();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-left"
              >
                <FilePlus2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">Issue Invoice</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">One-off or custom invoice</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setCreateDropdownOpen(false);
                  onOpenCreateDiscount();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-left border-t border-slate-100 dark:border-slate-800"
              >
                <Tag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">Discount Code</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">Campaign coupon code</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Export Reports (PDF) Quick Trigger */}
        {onOpenExportReportModal && (
          <button
            onClick={onOpenExportReportModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Download Subscription & Revenue Reports as PDF"
          >
            <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        )}

        {/* User Profile & Role Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title="Account profile and role switcher"
          >
            <div className={`w-7 h-7 rounded-full ${currentUser?.avatarBg || 'bg-indigo-600'} flex items-center justify-center text-white text-xs font-bold shadow-xs`}>
              {currentUser?.avatarInitials || 'BL'}
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {currentUser?.name || 'Account'}
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {currentUser?.role || 'ADMIN'}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="font-bold text-slate-900 dark:text-white">{currentUser?.name}</div>
                <div className="text-[11px] font-mono text-slate-400 truncate">{currentUser?.email}</div>
                <div className="mt-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {currentUser?.role}
                  </span>
                </div>
              </div>

              {/* Quick Role Switcher */}
              <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Quick Role Switch (Demo)
              </div>
              <div className="px-2 space-y-0.5 max-h-40 overflow-y-auto">
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors cursor-pointer ${
                      currentUser?.id === u.id
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-medium text-slate-900 dark:text-white">{u.name}</div>
                      <div className="text-[10px] text-slate-400">{u.role}</div>
                    </div>
                    {currentUser?.id === u.id && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                  </button>
                ))}
              </div>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              <button
                onClick={() => {
                  setCurrentTab('users');
                  setUserDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-left"
              >
                <UsersIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Team & Access Control</span>
              </button>

              <button
                onClick={() => {
                  setUserDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
