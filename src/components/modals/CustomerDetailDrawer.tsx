import React, { useState } from 'react';
import {
  X,
  Building2,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  Calendar,
  DollarSign,
  ArrowUpRight,
  Pause,
  Play,
  XCircle,
  FileText,
  Trash2,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useBrightloop } from '../../context/BrightloopContext';

interface CustomerDetailDrawerProps {
  customerId: string | null;
  onClose: () => void;
  onViewInvoice: (invoiceId: string) => void;
}

export const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
  customerId,
  onClose,
  onViewInvoice
}) => {
  const {
    customers,
    plans,
    subscriptions,
    invoices,
    changeSubscriptionPlan,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    deleteCustomer,
    updateCustomer,
    formatCurrency
  } = useBrightloop();

  const [editNotes, setEditNotes] = useState(false);
  const [notesVal, setNotesVal] = useState('');
  const [selectedPlanUpgrade, setSelectedPlanUpgrade] = useState('');

  if (!customerId) return null;

  const customer = customers.find(c => c.id === customerId);
  if (!customer) return null;

  const activeSubscription = subscriptions.find(s => s.customerId === customer.id && s.status !== 'canceled');
  const pastInvoices = invoices.filter(i => i.customerId === customer.id);
  const currentPlan = plans.find(p => p.id === customer.planId) || plans[0];

  const handleSaveNotes = () => {
    updateCustomer(customer.id, { notes: notesVal });
    setEditNotes(false);
  };

  const handleApplyPlanUpgrade = () => {
    if (!selectedPlanUpgrade || !activeSubscription) return;
    changeSubscriptionPlan(activeSubscription.id, selectedPlanUpgrade);
    setSelectedPlanUpgrade('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 h-full flex flex-col overflow-hidden animate-in slide-in-from-right duration-200 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
              {customer.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">{customer.name}</h2>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                  customer.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' :
                  customer.status === 'trialing' ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300' :
                  customer.status === 'delinquent' ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300' :
                  'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {customer.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{customer.company}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Current MRR
              </span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                {formatCurrency(customer.mrr)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Lifetime Value
              </span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                {formatCurrency(customer.lifetimeSpend)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Plan Tier
              </span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 block truncate mt-0.5">
                {currentPlan.name}
              </span>
            </div>
          </div>

          {/* Active Subscription Control Section */}
          <div className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Active Subscription Contract
              </span>
              {activeSubscription && (
                <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                  Renews: {activeSubscription.renewalDate}
                </span>
              )}
            </div>

            {activeSubscription ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">{activeSubscription.planName} Plan</span>
                    <span className="text-slate-400 dark:text-slate-500 ml-1.5">({activeSubscription.billingCycle})</span>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      {formatCurrency(activeSubscription.amount)} / {activeSubscription.billingCycle === 'annual' ? 'year' : 'month'} · {activeSubscription.seats} seats
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {activeSubscription.status === 'active' ? (
                      <button
                        onClick={() => pauseSubscription(activeSubscription.id)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded flex items-center gap-1 cursor-pointer"
                        title="Pause recurring billing"
                      >
                        <Pause className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                        Pause
                      </button>
                    ) : (
                      <button
                        onClick={() => resumeSubscription(activeSubscription.id)}
                        className="px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        Resume
                      </button>
                    )}

                    <button
                      onClick={() => {
                        cancelSubscription(activeSubscription.id, 'Canceled from account drawer');
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3 h-3" />
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Upgrade / Change Plan dropdown */}
                <div className="flex items-center gap-2 pt-1">
                  <select
                    value={selectedPlanUpgrade}
                    onChange={(e) => setSelectedPlanUpgrade(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  >
                    <option value="">Change subscription tier...</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.id} disabled={p.id === activeSubscription.planId}>
                        {p.name} ({formatCurrency(p.priceMonthly)}/mo)
                      </option>
                    ))}
                  </select>
                  <button
                    disabled={!selectedPlanUpgrade}
                    onClick={handleApplyPlanUpgrade}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg cursor-pointer"
                  >
                    Apply Change
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 dark:text-slate-400 italic p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                No active recurring subscription. This customer is currently canceled or inactive.
              </div>
            )}
          </div>

          {/* Account Details & Billing Address */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Account Information
            </h3>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono">{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{customer.phone}</span>
                </div>
              )}
              {customer.taxId && (
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">TAX / GSTIN:</span>
                  <span className="font-mono">{customer.taxId}</span>
                </div>
              )}
              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-700">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  {customer.billingAddress.street}, {customer.billingAddress.city}, {customer.billingAddress.state} {customer.billingAddress.postalCode}, {customer.billingAddress.country}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method on File */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Payment Method on File
            </h3>
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                  <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white capitalize">
                    {customer.paymentMethod.brand} ending in {customer.paymentMethod.last4}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Expires {customer.paymentMethod.expMonth.toString().padStart(2, '0')}/{customer.paymentMethod.expYear}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
                Default
              </span>
            </div>
          </div>

          {/* Invoice History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Billing Statements ({pastInvoices.length})
              </h3>
            </div>
            {pastInvoices.length === 0 ? (
              <div className="text-xs text-slate-400 dark:text-slate-500 italic p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800">
                No past invoices on record.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {pastInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => onViewInvoice(inv.id)}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-xs"
                  >
                    <div>
                      <div className="font-mono font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        {inv.number}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        Issued: {inv.issueDate}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(inv.total)}</div>
                      <span className={`inline-block text-[10px] font-semibold uppercase ${
                        inv.status === 'paid' ? 'text-emerald-600 dark:text-emerald-400' :
                        inv.status === 'overdue' ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Internal Notes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Internal Account Notes
              </h3>
              {!editNotes ? (
                <button
                  onClick={() => {
                    setNotesVal(customer.notes || '');
                    setEditNotes(true);
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium cursor-pointer"
                >
                  Edit Notes
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditNotes(false)}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            {editNotes ? (
              <textarea
                rows={3}
                value={notesVal}
                onChange={(e) => setNotesVal(e.target.value)}
                placeholder="Add account notes, SLA details, key contacts..."
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-hidden focus:border-blue-500"
              />
            ) : (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                {customer.notes || 'No customer notes entered.'}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">Member since {customer.createdAt}</span>
            <button
              onClick={() => {
                deleteCustomer(customer.id);
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Customer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
