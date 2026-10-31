import React, { useState } from 'react';
import {
  Tag,
  Search,
  Plus,
  Copy,
  Check,
  Clock,
  Sparkles,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Percent,
  Calendar
} from 'lucide-react';
import { useBrightloop } from '../context/BrightloopContext';
import { DiscountCoupon } from '../types';

interface DiscountsViewProps {
  onOpenCreateDiscount: () => void;
}

export const DiscountsView: React.FC<DiscountsViewProps> = ({ onOpenCreateDiscount }) => {
  const {
    discounts,
    toggleDiscountStatus,
    deleteDiscount,
    formatCurrency,
    showToast
  } = useBrightloop();

  const [search, setSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'disabled'>('all');

  const filteredDiscounts = discounts.filter((d) => {
    const matchesSearch =
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast('Code Copied', `Coupon code "${code}" copied to clipboard.`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const activeCount = discounts.filter(d => d.status === 'active').length;
  const totalRedemptions = discounts.reduce((sum, d) => sum + d.timesRedeemed, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Discounts & Promotion Campaigns</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>{discounts.length} campaign codes</span>
            <span>·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">{activeCount} currently active</span>
            <span>·</span>
            <span className="text-blue-600 dark:text-blue-400 font-mono font-medium">{totalRedemptions} total redemptions</span>
          </div>
        </div>

        <button
          onClick={onOpenCreateDiscount}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Discount Code</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search promo codes or campaign description..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800/70 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          />
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {(['all', 'active', 'expired', 'disabled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Discount Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDiscounts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            No promotional codes found matching current criteria.
          </div>
        ) : (
          filteredDiscounts.map((discount) => {
            const isPercent = discount.type === 'percent';
            const progressPct = Math.min(100, Math.round((discount.timesRedeemed / discount.maxRedemptions) * 100));

            return (
              <div
                key={discount.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-extrabold text-slate-900 dark:text-white tracking-wider bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700">
                        {discount.code}
                      </span>
                      <button
                        onClick={() => handleCopy(discount.code)}
                        className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors cursor-pointer"
                        title="Copy code"
                      >
                        {copiedCode === discount.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      discount.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50' :
                      discount.status === 'expired' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' :
                      'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50'
                    }`}>
                      {discount.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                    {discount.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Deduction Value:</span>
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {isPercent ? `${discount.value}% Off` : `${formatCurrency(discount.value)} Flat Credit`}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Duration Rule:</span>
                      <span className="capitalize font-medium text-slate-800 dark:text-slate-200">
                        {discount.duration === 'repeating'
                          ? `Repeating ${discount.durationInMonths} months`
                          : discount.duration}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Expiration Date:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{discount.expiryDate}</span>
                    </div>
                  </div>

                  {/* Redemptions Progress */}
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <span>Redeemed:</span>
                      <span>{discount.timesRedeemed} / {discount.maxRedemptions} ({progressPct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Controls */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => toggleDiscountStatus(discount.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    {discount.status === 'active' ? (
                      <>
                        <ToggleRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Enabled</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        <span>Disabled</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => deleteDiscount(discount.id)}
                    className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded cursor-pointer"
                    title="Archive coupon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
