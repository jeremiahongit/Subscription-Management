import React, { useState } from 'react';
import {
  TrendingUp,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { useBrightloop } from '../context/BrightloopContext';
import { generateRevenueReportPDF, generateSubscriptionReportPDF } from '../utils/pdfGenerator';

interface ReportsViewProps {
  onOpenExportModal?: (defaultType?: 'subscriptions' | 'revenue') => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onOpenExportModal }) => {
  const {
    totalMrr,
    totalArr,
    currency,
    formatCurrency,
    showToast,
    currentUser,
    subscriptions,
    plans,
    invoices,
    payments,
    activeSubscribersCount
  } = useBrightloop();

  const [selectedCohortYear, setSelectedCohortYear] = useState('2026');

  // MRR Waterfall calculations for recent month
  const waterfall = {
    startingMrr: 139200,
    newMrr: 14100,
    expansionMrr: 8100,
    contractionMrr: -1930,
    churnedMrr: -1650,
    endingMrr: 157820
  };

  const netMrrGrowth = waterfall.newMrr + waterfall.expansionMrr + waterfall.contractionMrr + waterfall.churnedMrr;
  const quickRatio = Number(((waterfall.newMrr + waterfall.expansionMrr) / Math.abs(waterfall.contractionMrr + waterfall.churnedMrr)).toFixed(2));

  // Cohort Retention Heatmap (6 months)
  const cohorts = [
    { cohort: 'May 2026', size: 140, m0: 100, m1: 96, m2: 94, m3: 92, m4: 91, m5: 90 },
    { cohort: 'Jun 2026', size: 165, m0: 100, m1: 97, m2: 95, m3: 94, m4: 92, m5: 91 },
    { cohort: 'Jul 2026', size: 182, m0: 100, m1: 98, m2: 96, m3: 95, m4: 94, m5: null },
    { cohort: 'Aug 2026', size: 194, m0: 100, m1: 98, m2: 97, m3: 96, m4: null, m5: null },
    { cohort: 'Sep 2026', size: 210, m0: 100, m1: 99, m2: 98, m3: null, m4: null, m5: null },
    { cohort: 'Oct 2026', size: 235, m0: 100, m1: 99, m2: null, m3: null, m4: null, m5: null }
  ];

  const handleExportFinancials = () => {
    const reportData = {
      system: 'Brightloop SaaS Billing & Subscription Engine',
      generatedDate: new Date().toISOString(),
      runRateARR: totalArr,
      mrr: totalMrr,
      waterfall,
      saasKPIs: {
        nrr: '114.2%',
        grr: '94.8%',
        quickRatio: quickRatio,
        ltvCacRatio: '3.8x',
        averagePaybackMonths: 7.2
      },
      cohortRetention: cohorts
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `brightloop_financial_report_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Report Exported', 'Full financial audit JSON package generated.');
  };

  const handleDownloadRevenuePDF = () => {
    try {
      const filename = generateRevenueReportPDF({
        totalMrr,
        totalArr,
        currency,
        formatCurrency,
        adminUser: currentUser,
        invoices,
        payments
      });
      showToast('Revenue PDF Exported', `${filename} generated successfully.`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Export Error', 'Failed to generate Revenue PDF report.', 'error');
    }
  };

  const handleDownloadSubscriptionsPDF = () => {
    try {
      const filename = generateSubscriptionReportPDF({
        subscriptions,
        plans,
        totalMrr,
        totalArr,
        activeCount: activeSubscribersCount,
        currency,
        formatCurrency,
        adminUser: currentUser
      });
      showToast('Subscription PDF Exported', `${filename} generated successfully.`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Export Error', 'Failed to generate Subscriptions PDF report.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Financial Reports & ASC 606 Analytics</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit-ready revenue recognition, cohort retention heatmaps, and SaaS capital efficiency metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenExportModal ? (
            <button
              onClick={() => onOpenExportModal('revenue')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export PDF Report</span>
            </button>
          ) : (
            <button
              onClick={handleDownloadRevenuePDF}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Revenue PDF</span>
            </button>
          )}

          <button
            onClick={handleDownloadSubscriptionsPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            title="Download Subscriptions PDF Report"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Subscriptions PDF</span>
          </button>
        </div>
      </div>

      {/* SaaS North Star Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Net Revenue Retention (NRR)
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">114.2%</span>
            <span className="text-xs font-semibold font-mono text-emerald-600 dark:text-emerald-400">+2.4%</span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
            Expansion outpacing churn (&gt;100% net expansion)
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Gross Revenue Retention (GRR)
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">94.8%</span>
            <span className="text-xs font-semibold font-mono text-emerald-600 dark:text-emerald-400">Top Quartile</span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
            Excluding expansion revenue
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            SaaS Quick Ratio
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{quickRatio}x</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">Elite &gt; 4.0</span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
            (New + Expansion) / (Churn + Contraction)
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            LTV to CAC Ratio
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">3.8x</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">7.2 mo payback</span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
            Healthy sustainable unit economics
          </span>
        </div>
      </div>

      {/* MRR Waterfall Breakdown Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Recurring Revenue (MRR) Waterfall</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Deconstructed revenue components showing new subscriber gains, tier expansions, and churn losses
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
            Net Monthly Add: +{formatCurrency(netMrrGrowth)}
          </span>
        </div>

        {/* Waterfall Bars Graphic */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Starting MRR
            </span>
            <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200 mt-1 block">
              {formatCurrency(waterfall.startingMrr)}
            </span>
            <div className="w-full h-1 bg-slate-300 dark:bg-slate-600 rounded mt-2" />
          </div>

          <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800/60 text-center">
            <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
              + New Subscriptions
            </span>
            <span className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-1 block">
              +{formatCurrency(waterfall.newMrr)}
            </span>
            <div className="w-full h-1 bg-emerald-500 rounded mt-2" />
          </div>

          <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800/60 text-center">
            <span className="text-[10px] font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider block">
              + Expansion MRR
            </span>
            <span className="text-sm font-bold font-mono text-blue-700 dark:text-blue-400 mt-1 block">
              +{formatCurrency(waterfall.expansionMrr)}
            </span>
            <div className="w-full h-1 bg-blue-500 rounded mt-2" />
          </div>

          <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800/60 text-center">
            <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
              - Contraction
            </span>
            <span className="text-sm font-bold font-mono text-amber-700 dark:text-amber-400 mt-1 block">
              {formatCurrency(waterfall.contractionMrr)}
            </span>
            <div className="w-full h-1 bg-amber-500 rounded mt-2" />
          </div>

          <div className="p-3 bg-rose-50/70 dark:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-800/60 text-center">
            <span className="text-[10px] font-semibold text-rose-800 dark:text-rose-300 uppercase tracking-wider block">
              - Churned MRR
            </span>
            <span className="text-sm font-bold font-mono text-rose-700 dark:text-rose-400 mt-1 block">
              {formatCurrency(waterfall.churnedMrr)}
            </span>
            <div className="w-full h-1 bg-rose-500 rounded mt-2" />
          </div>

          <div className="p-3 bg-slate-900 dark:bg-slate-800 rounded-lg border border-slate-800 dark:border-slate-700 text-center text-white">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Ending MRR
            </span>
            <span className="text-sm font-bold font-mono text-white mt-1 block">
              {formatCurrency(waterfall.endingMrr)}
            </span>
            <div className="w-full h-1 bg-blue-500 rounded mt-2" />
          </div>
        </div>
      </div>

      {/* Cohort Retention Heatmap */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs transition-colors">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Subscriber Cohort Retention Heatmap</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Percentage of paying subscribers retained each month following initial sign-up cohort
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Target retention &gt; 88% at M+5
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Cohort Month</th>
                <th className="px-5 py-3 text-center">Starting Accounts</th>
                <th className="px-4 py-3 text-center">Month 0</th>
                <th className="px-4 py-3 text-center">Month 1</th>
                <th className="px-4 py-3 text-center">Month 2</th>
                <th className="px-4 py-3 text-center">Month 3</th>
                <th className="px-4 py-3 text-center">Month 4</th>
                <th className="px-4 py-3 text-center">Month 5</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {cohorts.map((row) => (
                <tr key={row.cohort} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-3 font-semibold text-slate-900 dark:text-white">
                    {row.cohort}
                  </td>
                  <td className="px-5 py-3 text-center font-mono text-slate-600 dark:text-slate-400">
                    {row.size}
                  </td>
                  {[row.m0, row.m1, row.m2, row.m3, row.m4, row.m5].map((val, idx) => {
                    if (val === null) {
                      return (
                        <td key={idx} className="px-4 py-3 text-center text-slate-300 dark:text-slate-600">
                          —
                        </td>
                      );
                    }
                    const bgClass =
                      val >= 97
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                        : val >= 93
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                        : val >= 90
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300';

                    return (
                      <td key={idx} className={`px-4 py-3 text-center font-mono ${bgClass}`}>
                        {val}%
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
