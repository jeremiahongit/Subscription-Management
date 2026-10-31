import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Users, RefreshCw, FileText, Package, ArrowRight } from 'lucide-react';
import { useBrightloop } from '../context/BrightloopContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    customers,
    subscriptions,
    invoices,
    plans,
    setCurrentTab,
    setSelectedCustomerId,
    formatCurrency
  } = useBrightloop();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Keybindings (Cmd+K, Ctrl+K, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchedCustomers = trimmed
    ? customers.filter(
        c => c.name.toLowerCase().includes(trimmed) ||
             c.company.toLowerCase().includes(trimmed) ||
             c.email.toLowerCase().includes(trimmed)
      ).slice(0, 4)
    : [];

  const matchedSubscriptions = trimmed
    ? subscriptions.filter(
        s => s.customerName.toLowerCase().includes(trimmed) ||
             s.company.toLowerCase().includes(trimmed) ||
             s.planName.toLowerCase().includes(trimmed) ||
             s.id.toLowerCase().includes(trimmed)
      ).slice(0, 4)
    : [];

  const matchedInvoices = trimmed
    ? invoices.filter(
        i => i.number.toLowerCase().includes(trimmed) ||
             i.customerName.toLowerCase().includes(trimmed) ||
             i.company.toLowerCase().includes(trimmed)
      ).slice(0, 4)
    : [];

  const matchedPlans = trimmed
    ? plans.filter(
        p => p.name.toLowerCase().includes(trimmed) ||
             p.tierCode.toLowerCase().includes(trimmed) ||
             p.description.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const totalResults =
    matchedCustomers.length +
    matchedSubscriptions.length +
    matchedInvoices.length +
    matchedPlans.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subscriptions, customers, invoices, plans..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {!trimmed && (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
              Type to search by customer name, company, invoice number (e.g. INV-2026-1092), or plan tier.
            </div>
          )}

          {trimmed && totalResults === 0 && (
            <div className="py-10 text-center text-xs text-slate-500 dark:text-slate-400">
              No matching records found for "{query}".
            </div>
          )}

          {/* Customer matches */}
          {matchedCustomers.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Customers</span>
              </div>
              <div className="mt-1 space-y-1">
                {matchedCustomers.map((cust) => (
                  <button
                    key={cust.id}
                    onClick={() => {
                      setCurrentTab('customers');
                      setSelectedCustomerId(cust.id);
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-left group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {cust.name} <span className="font-normal text-slate-500 dark:text-slate-400">({cust.company})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">{cust.email} · Spend: {formatCurrency(cust.lifetimeSpend)}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subscription matches */}
          {matchedSubscriptions.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Subscriptions</span>
              </div>
              <div className="mt-1 space-y-1">
                {matchedSubscriptions.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setCurrentTab('subscriptions');
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-left group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {sub.customerName} · {sub.planName} Tier
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        {formatCurrency(sub.amount)} / {sub.billingCycle} · Renewal: {sub.renewalDate}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Invoice matches */}
          {matchedInvoices.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Invoices</span>
              </div>
              <div className="mt-1 space-y-1">
                {matchedInvoices.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => {
                      setCurrentTab('invoices');
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-left group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {inv.number} · {inv.company}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        {formatCurrency(inv.total)} · Due {inv.dueDate} · Status: {inv.status.toUpperCase()}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Plan matches */}
          {matchedPlans.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>Plans</span>
              </div>
              <div className="mt-1 space-y-1">
                {matchedPlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => {
                      setCurrentTab('products');
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-left group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {plan.name} Plan ({plan.tierCode})
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">
                        {formatCurrency(plan.priceMonthly)}/mo · {plan.subscribersCount} subscribers
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-850/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <span>Navigate with arrow keys or click to open</span>
          <span>Brightloop Quick Finder</span>
        </div>
      </div>
    </div>
  );
};
