import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CreditCard,
  FileText,
  ArrowUpRight,
  RefreshCw,
  Plus,
  Percent,
  CheckCircle2,
  AlertCircle,
  Eye,
  RotateCcw,
  Calendar,
  Layers,
  IndianRupee
} from 'lucide-react';
import { useBrightloop } from '../context/BrightloopContext';
import { REVENUE_TIMELINE_DATA } from '../data/mockData';
import { TimeRange } from '../types';

interface OverviewViewProps {
  onOpenCreateCustomer: () => void;
  onOpenCreateSubscription: () => void;
  onOpenCreateInvoice: () => void;
  onViewInvoice: (invoiceId: string) => void;
  onRefundPayment: (paymentId: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onOpenCreateCustomer,
  onOpenCreateSubscription,
  onOpenCreateInvoice,
  onViewInvoice,
  onRefundPayment
}) => {
  const {
    currency,
    formatCurrency,
    totalMrr,
    totalArr,
    activeSubscribersCount,
    averageRevenuePerUser,
    churnRatePercent,
    invoices,
    payments,
    plans,
    setCurrentTab,
    setSelectedCustomerId,
    theme
  } = useBrightloop();

  const [timeRange, setTimeRange] = useState<TimeRange>('12m');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Filter timeline based on timeRange
  const timelineData = React.useMemo(() => {
    if (timeRange === '7d' || timeRange === '30d') {
      return REVENUE_TIMELINE_DATA.slice(-4);
    }
    if (timeRange === '90d') {
      return REVENUE_TIMELINE_DATA.slice(-6);
    }
    return REVENUE_TIMELINE_DATA;
  }, [timeRange]);

  const activeHoverPoint = hoveredPointIndex !== null ? timelineData[hoveredPointIndex] : timelineData[timelineData.length - 1];

  // SVG Chart Dimensions & Curves
  const chartWidth = 720;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const minMrr = Math.min(...timelineData.map(d => d.mrr)) * 0.95;
  const maxMrr = Math.max(...timelineData.map(d => d.mrr)) * 1.05;

  const getX = (idx: number) => {
    if (timelineData.length <= 1) return paddingX;
    return paddingX + (idx / (timelineData.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    return chartHeight - paddingY - ((val - minMrr) / (maxMrr - minMrr)) * (chartHeight - paddingY * 2);
  };

  // Build SVG smooth path
  const points = timelineData.map((d, i) => `${getX(i)},${getY(d.mrr)}`);
  const linePath = points.length > 0 ? `M ${points.join(' L ')}` : '';
  const areaPath = points.length > 0
    ? `M ${getX(0)},${chartHeight - paddingY} L ${points.join(' L ')} L ${getX(timelineData.length - 1)},${chartHeight - paddingY} Z`
    : '';

  const recentInvoices = invoices.slice(0, 5);
  const recentPayments = payments.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner & Time Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Executive Revenue Analytics</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Consolidated subscription cash flow, subscriber growth, and churn prevention in {currency === 'INR' ? 'Indian Rupees (₹)' : currency}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(['7d', '30d', '90d', '12m'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  timeRange === r
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenCreateSubscription}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Subscription</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: MRR */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Monthly Recurring (MRR)
            </span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              {currency === 'INR' ? <IndianRupee className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(totalMrr)}
            </span>
            <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              +8.4%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center justify-between">
            <span>vs previous month</span>
            <span className="font-mono text-slate-600 dark:text-slate-400">ARR: {formatCurrency(totalArr)}</span>
          </div>
        </div>

        {/* KPI 2: Active Subscriptions */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Subscriptions
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
              {activeSubscribersCount.toLocaleString()}
            </span>
            <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              +5.2%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center justify-between">
            <span>Net added this month</span>
            <span className="font-mono text-slate-600 dark:text-slate-400">+12 accounts</span>
          </div>
        </div>

        {/* KPI 3: ARPU */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Average Revenue / User
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(averageRevenuePerUser)}
            </span>
            <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              +3.1%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center justify-between">
            <span>Expansion driven</span>
            <span className="font-mono text-slate-600 dark:text-slate-400">LTV: {formatCurrency(averageRevenuePerUser * 28)}</span>
          </div>
        </div>

        {/* KPI 4: Churn Rate */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Net Churn Rate
            </span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
              {churnRatePercent}%
            </span>
            <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              -0.4%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center justify-between">
            <span>Benchmark target &lt; 2.0%</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Optimal</span>
          </div>
        </div>
      </div>

      {/* Main Revenue Chart & Plan Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Revenue Trend Chart */}
        <div className="lg:col-span-2 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Historical Recurring Growth
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {formatCurrency(activeHoverPoint ? activeHoverPoint.mrr : totalMrr)}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  MRR ({activeHoverPoint ? activeHoverPoint.label : 'Current'})
                </span>
              </div>
            </div>

            {activeHoverPoint && (
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>+{formatCurrency(activeHoverPoint.newMrr)} New</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>+{formatCurrency(activeHoverPoint.expansionMrr)} Exp</span>
                </div>
                <div className="flex items-center gap-1 text-rose-500 dark:text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>-{formatCurrency(activeHoverPoint.churnMrr)} Churn</span>
                </div>
              </div>
            )}
          </div>

          {/* SVG Area Curve */}
          <div className="relative w-full overflow-hidden mt-4 pt-2">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-56 overflow-visible"
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={theme === 'dark' ? 0.35 : 0.25} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0.25, 0.5, 0.75].map((pct, idx) => {
                const yPos = paddingY + pct * (chartHeight - paddingY * 2);
                return (
                  <line
                    key={idx}
                    x1={paddingX}
                    y1={yPos}
                    x2={chartWidth - paddingX}
                    y2={yPos}
                    stroke={theme === 'dark' ? '#1E293B' : '#E2E8F0'}
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Gradient Area Fill */}
              <path d={areaPath} fill="url(#revenueGradient)" />

              {/* Blue Trend Curve */}
              <path
                d={linePath}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points & hover triggers */}
              {timelineData.map((d, i) => {
                const cx = getX(i);
                const cy = getY(d.mrr);
                const isHovered = hoveredPointIndex === i;

                return (
                  <g key={d.date} className="cursor-pointer">
                    {/* Hover vertical guide line */}
                    {isHovered && (
                      <line
                        x1={cx}
                        y1={paddingY}
                        x2={cx}
                        y2={chartHeight - paddingY}
                        stroke={theme === 'dark' ? '#475569' : '#94A3B8'}
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                    )}
                    {/* Visual point circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 6 : 4}
                      fill="#3B82F6"
                      stroke={theme === 'dark' ? '#0F172A' : '#FFFFFF'}
                      strokeWidth={isHovered ? 2.5 : 2}
                      className="transition-all duration-150"
                    />
                    {/* Invisible larger hover hit area */}
                    <rect
                      x={cx - (chartWidth / timelineData.length) / 2}
                      y={0}
                      width={chartWidth / timelineData.length}
                      height={chartHeight}
                      fill="transparent"
                      onMouseEnter={() => setHoveredPointIndex(i)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* X-Axis Month Labels */}
            <div className="flex justify-between px-2 pt-2 text-[11px] font-mono text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800">
              {timelineData.map((d) => (
                <span key={d.date}>{d.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Subscription Plan Breakdown */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Tier Allocation
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Plan MRR Breakdown</h3>
              </div>
              <button
                onClick={() => setCurrentTab('products')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold cursor-pointer"
              >
                View Plans
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              {plans.map((p) => {
                const percent = Math.min(100, Math.round((p.mrrContributed / (totalMrr || 1)) * 100));
                return (
                  <div key={p.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                        <span>{p.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-normal">
                          ({p.tierCode})
                        </span>
                      </div>
                      <div className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                        {formatCurrency(p.mrrContributed)}
                      </div>
                    </div>
                    {/* Progress Track */}
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                      <span>{p.subscribersCount} subscribers</span>
                      <span>{percent}% of revenue</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-lg text-xs flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">Total Run Rate (ARR):</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(totalArr)}</span>
          </div>
        </div>
      </div>

      {/* Two Responsive Tables: Recent Invoices & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Invoices Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Invoices</h3>
            </div>
            <button
              onClick={() => setCurrentTab('invoices')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 cursor-pointer"
            >
              View all invoices ({invoices.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2.5">Invoice</th>
                  <th className="px-4 py-2.5">Company</th>
                  <th className="px-4 py-2.5 text-right">Amount</th>
                  <th className="px-4 py-2.5 text-center">Status</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-slate-900 dark:text-white">
                      {inv.number}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">
                      {inv.company}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(inv.total)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        inv.status === 'paid' ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50' :
                        inv.status === 'overdue' ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50' :
                        inv.status === 'void' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' :
                        'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onViewInvoice(inv.id)}
                        className="p-1 text-slate-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                        title="View invoice preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Recent Payment Transactions */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
            </div>
            <button
              onClick={() => setCurrentTab('payments')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 cursor-pointer"
            >
              View ledger ({payments.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2.5">Transaction</th>
                  <th className="px-4 py-2.5">Customer</th>
                  <th className="px-4 py-2.5 text-right">Amount</th>
                  <th className="px-4 py-2.5 text-center">Status</th>
                  <th className="px-4 py-2.5 text-right">Refund</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {p.id}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium truncate max-w-[120px]">
                      {p.customerName}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        p.status === 'succeeded' ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50' :
                        p.status === 'failed' ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50' :
                        'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {p.status === 'succeeded' ? (
                        <button
                          onClick={() => onRefundPayment(p.id)}
                          className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium cursor-pointer"
                        >
                          Refund
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
