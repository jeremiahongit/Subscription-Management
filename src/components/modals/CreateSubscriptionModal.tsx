import React, { useState } from 'react';
import { X, RefreshCw, Check, Tag } from 'lucide-react';
import { useBrightloop } from '../../context/BrightloopContext';

interface CreateSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCustomerId?: string;
}

export const CreateSubscriptionModal: React.FC<CreateSubscriptionModalProps> = ({
  isOpen,
  onClose,
  preselectedCustomerId
}) => {
  const { customers, plans, discounts, createSubscription, formatCurrency } = useBrightloop();

  const [customerId, setCustomerId] = useState(preselectedCustomerId || customers[0]?.id || '');
  const [planId, setPlanId] = useState(plans[0]?.id || '');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [seats, setSeats] = useState(5);
  const [selectedDiscount, setSelectedDiscount] = useState('');
  const [autoRenew, setAutoRenew] = useState(true);

  if (!isOpen) return null;

  const selectedCustomer = customers.find(c => c.id === customerId);
  const selectedPlan = plans.find(p => p.id === planId) || plans[0];

  // Base price calculation
  const basePrice = billingCycle === 'annual' ? selectedPlan.priceAnnual : selectedPlan.priceMonthly;
  
  // Apply discount if any
  const coupon = discounts.find(d => d.code === selectedDiscount && d.status === 'active');
  let finalAmount = basePrice;
  if (coupon) {
    if (coupon.type === 'percent') {
      finalAmount = Math.round(basePrice * (1 - coupon.value / 100));
    } else {
      finalAmount = Math.max(0, basePrice - coupon.value);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedPlan) return;

    const startDate = new Date().toISOString().split('T')[0];
    const renewal = new Date();
    if (billingCycle === 'annual') {
      renewal.setFullYear(renewal.getFullYear() + 1);
    } else {
      renewal.setMonth(renewal.getMonth() + 1);
    }
    const renewalDate = renewal.toISOString().split('T')[0];

    createSubscription({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerEmail: selectedCustomer.email,
      company: selectedCustomer.company,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      status: 'active',
      billingCycle,
      amount: finalAmount,
      startDate,
      renewalDate,
      autoRenew,
      seats,
      discountCode: selectedDiscount || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Create New Subscription</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Attach customer to recurring plan cadence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Subscriber Account *
            </label>
            <select
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.company} ({c.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subscription Plan Tier *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {plans.map((p) => {
                const isSelected = p.id === planId;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPlanId(p.id)}
                    className={`p-3 text-left border rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    </div>
                    <div className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 mt-1">
                      {formatCurrency(p.priceMonthly)}/mo
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{p.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Billing Cycle
              </label>
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    billingCycle === 'annual'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>Annual</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">-20%</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Allocated Seats
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-hidden focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Apply Promotional Coupon (Optional)
            </label>
            <div className="relative">
              <select
                value={selectedDiscount}
                onChange={(e) => setSelectedDiscount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="">No promotional discount</option>
                {discounts.filter(d => d.status === 'active').map((d) => (
                  <option key={d.id} value={d.code}>
                    {d.code} - {d.type === 'percent' ? `${d.value}% Off` : `${formatCurrency(d.value)} Off`} ({d.description})
                  </option>
                ))}
              </select>
              <Tag className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Standard Tier Price:</span>
              <span className="font-mono">{formatCurrency(basePrice)}</span>
            </div>
            {coupon && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Discount Applied ({coupon.code}):</span>
                <span className="font-mono">-{coupon.type === 'percent' ? `${coupon.value}%` : formatCurrency(coupon.value)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-700">
              <span>First Charge Total:</span>
              <span className="font-mono text-sm text-blue-600 dark:text-blue-400">{formatCurrency(finalAmount)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoRenew"
              checked={autoRenew}
              onChange={(e) => setAutoRenew(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="autoRenew" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              Enable automated recurring card charge at end of billing cycle
            </label>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Start Subscription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
