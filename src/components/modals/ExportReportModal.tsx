import React, { useState } from 'react';
import {
  FileText,
  Download,
  X,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Layers,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Sparkles,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useBrightloop } from '../../context/BrightloopContext';
import { generateSubscriptionReportPDF, generateRevenueReportPDF } from '../../utils/pdfGenerator';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'subscriptions' | 'revenue';
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'revenue'
}) => {
  const {
    subscriptions,
    plans,
    invoices,
    payments,
    totalMrr,
    totalArr,
    currency,
    formatCurrency,
    currentUser,
    switchUser,
    users,
    showToast
  } = useBrightloop();

  const [reportType, setReportType] = useState<'subscriptions' | 'revenue' | 'both'>(defaultType);
  const [period, setPeriod] = useState<'month' | 'quarter' | 'ytd' | 'all'>('month');
  const [subStatusFilter, setSubStatusFilter] = useState<'all' | 'active' | 'past_due'>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync defaultType when opened
  React.useEffect(() => {
    if (defaultType) {
      setReportType(defaultType);
    }
  }, [defaultType]);

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'BILLING_MANAGER';
  const adminUserRecord = users.find(u => u.role === 'ADMIN') || users[0];

  const periodLabels = {
    month: 'Current Month (October 2026)',
    quarter: 'Fiscal Q4 2026',
    ytd: 'Year-to-Date 2026',
    all: 'Complete Historic Ledger'
  };

  const filteredSubs = subscriptions.filter(s => {
    if (subStatusFilter === 'active') return s.status === 'active';
    if (subStatusFilter === 'past_due') return s.status === 'past_due';
    return true;
  });

  const activeCount = filteredSubs.filter(s => s.status === 'active').length;

  const handleDownloadPDF = async () => {
    if (!isAdmin) {
      showToast('Permission Denied', 'Administrator clearance required to export financial reports.', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      if (reportType === 'subscriptions' || reportType === 'both') {
        const subFile = generateSubscriptionReportPDF({
          subscriptions: filteredSubs,
          plans,
          totalMrr,
          totalArr,
          activeCount,
          currency,
          formatCurrency,
          adminUser: currentUser,
          periodLabel: periodLabels[period],
          statusFilter: subStatusFilter
        });
        showToast('PDF Exported', `${subFile} downloaded successfully.`, 'success');
      }

      if (reportType === 'revenue' || reportType === 'both') {
        const revFile = generateRevenueReportPDF({
          totalMrr,
          totalArr,
          currency,
          formatCurrency,
          adminUser: currentUser,
          invoices,
          payments,
          periodLabel: periodLabels[period]
        });
        showToast('PDF Exported', `${revFile} downloaded successfully.`, 'success');
      }

      onClose();
    } catch (err) {
      console.error(err);
      showToast('Export Error', 'An unexpected error occurred while compiling the PDF.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 rounded-lg text-blue-600 dark:text-blue-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Export Audit Reports (PDF)
                </h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Admin Clearance
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Generate formatted, vector-quality PDF audit packages for financial compliance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Admin Role Verification Card */}
          {isAdmin ? (
            <div className="flex items-center justify-between p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-lg">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="text-xs text-emerald-900 dark:text-emerald-200">
                  <span className="font-semibold">Authorized Administrator:</span>{' '}
                  {currentUser?.name} ({currentUser?.role}) · Digital audit stamp will be embedded
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold shrink-0">
                VERIFIED
              </span>
            </div>
          ) : (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg space-y-2">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                  Administrator Privileges Required
                </div>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                You are currently signed in as <span className="font-semibold">{currentUser?.name}</span> ({currentUser?.role}). Only Administrators or Billing Managers can download confidential customer subscription and revenue reports.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => switchUser(adminUserRecord.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Switch to Administrator ({adminUserRecord.name})</span>
                </button>
              </div>
            </div>
          )}

          {/* Select Report Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              1. Select Report Package
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setReportType('subscriptions')}
                className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                  reportType === 'subscriptions'
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  {reportType === 'subscriptions' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Subscriptions Audit
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Active contracts, renewal dates, tiers & customer MRR ledger
                </div>
              </button>

              <button
                type="button"
                onClick={() => setReportType('revenue')}
                className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                  reportType === 'revenue'
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {reportType === 'revenue' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Revenue & ASC 606
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  MRR waterfall, cohort retention, SaaS KPIs & cash collections
                </div>
              </button>

              <button
                type="button"
                onClick={() => setReportType('both')}
                className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                  reportType === 'both'
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  {reportType === 'both' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Full Executive Suite
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Both Revenue & Subscription reports exported simultaneously
                </div>
              </button>
            </div>
          </div>

          {/* Time Period Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              2. Reporting Period
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'month', label: 'Current Month' },
                { id: 'quarter', label: 'Fiscal Q4 2026' },
                { id: 'ytd', label: 'Year-to-Date' },
                { id: 'all', label: 'All-Time' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPeriod(opt.id as any)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer text-center ${
                    period === opt.id
                      ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subscription Specific Filters */}
          {(reportType === 'subscriptions' || reportType === 'both') && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                3. Subscription Status Scope
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: `All Contracts (${subscriptions.length})` },
                  { id: 'active', label: `Active Only (${subscriptions.filter(s => s.status === 'active').length})` },
                  { id: 'past_due', label: `Past Due / At Risk (${subscriptions.filter(s => s.status === 'past_due').length})` }
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSubStatusFilter(f.id as any)}
                    className={`px-3 py-1.5 text-xs rounded-md border transition-colors cursor-pointer ${
                      subStatusFilter === f.id
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent font-medium'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Report Document Specifications Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Document Specifications
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Format:</span>
                <span className="font-semibold text-slate-900 dark:text-white">A4 Vector PDF</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Records Included:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {reportType === 'revenue' ? `${invoices.length} Invoices` : `${filteredSubs.length} Subscriptions`}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Run-Rate ARR:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(totalArr)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Compliance:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">ASC 606 / GAAP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={!isAdmin || isGenerating}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 dark:disabled:bg-slate-700 rounded-lg shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>
              {isGenerating ? 'Compiling PDF...' : 'Download PDF Report'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
