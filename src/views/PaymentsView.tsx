import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  Download,
  RotateCcw,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  DollarSign
} from 'lucide-react';
import { useBrightloop } from '../context/BrightloopContext';
import { PaymentTransaction } from '../types';

interface PaymentsViewProps {
  onRefundPayment: (paymentId: string) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({ onRefundPayment }) => {
  const { payments, retryPayment, formatCurrency, showToast } = useBrightloop();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'succeeded' | 'refunded' | 'failed'>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      (p.invoiceId && p.invoiceId.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || p.paymentMethod === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalVolume = payments.filter(p => p.status === 'succeeded').reduce((sum, p) => sum + p.amount, 0);
  const totalFees = payments.filter(p => p.status === 'succeeded').reduce((sum, p) => sum + p.fee, 0);
  const netSettlement = payments.filter(p => p.status === 'succeeded').reduce((sum, p) => sum + p.net, 0);
  const failedCount = payments.filter(p => p.status === 'failed').length;

  const handleExportCSV = () => {
    const headers = ['TransactionID,InvoiceID,Customer,Email,Amount,Fee,Net,Method,Status,Date'];
    const rows = filteredPayments.map(p =>
      `"${p.id}","${p.invoiceId || ''}","${p.customerName}","${p.customerEmail}",${p.amount},${p.fee},${p.net},"${p.paymentMethod}","${p.status}","${p.date}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `brightloop_payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Completed', `${filteredPayments.length} payment records downloaded.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Payments & Settlement Ledger</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Credit card captures, ACH direct deposits, merchant fees, and customer refunds
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Export Ledger</span>
        </button>
      </div>

      {/* Dunning Alert if failed transactions exist */}
      {failedCount > 0 && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">
              {failedCount} Failed Transaction Requiring Attention
            </h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5 leading-relaxed">
              Automated smart dunning has notified customer(s) to refresh card on file. You can retry the card gateway charge manually below.
            </p>
          </div>
        </div>
      )}

      {/* Payment Settlement Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Gross Captured Volume
          </span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
            {formatCurrency(totalVolume)}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 block">
            Across all credit cards & bank transfers
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Payment Processing Fees
          </span>
          <span className="text-xl font-bold font-mono text-slate-700 dark:text-slate-300 mt-1 block">
            {formatCurrency(totalFees)}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 block">
            Gateway & Interchange fees
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Net Bank Payout
          </span>
          <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
            {formatCurrency(netSettlement)}
          </span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-500 font-mono mt-0.5 block">
            Ready for standard 2-day rolling payout
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by transaction ID (tx_...), customer or email..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800/70 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          />
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(['all', 'succeeded', 'refunded', 'failed'] as const).map((st) => (
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

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Gateways</option>
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
            <option value="amex">Amex</option>
            <option value="ach">ACH Wire</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Transaction ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Gateway Method</th>
                <th className="px-5 py-3 text-right">Gross Amount</th>
                <th className="px-5 py-3 text-right">Fee</th>
                <th className="px-5 py-3 text-right">Net Settlement</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3">Date & Timestamp</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                    No payment transactions matched the current filters.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-medium text-slate-900 dark:text-white">
                      {p.id}
                      {p.invoiceId && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-mono">
                          Ref: {p.invoiceId}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white">{p.customerName}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">{p.customerEmail}</div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 capitalize font-medium">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span>{p.paymentMethod}</span>
                        {p.last4 && <span className="font-mono text-slate-400 dark:text-slate-500">•••• {p.last4}</span>}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(p.amount)}
                    </td>

                    <td className="px-5 py-3.5 text-right font-mono text-slate-500 dark:text-slate-400">
                      {formatCurrency(p.fee)}
                    </td>

                    <td className="px-5 py-3.5 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(p.net)}
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        p.status === 'succeeded' ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50' :
                        p.status === 'failed' ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50' :
                        'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                      {p.date}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      {p.status === 'succeeded' && (
                        <button
                          onClick={() => onRefundPayment(p.id)}
                          className="px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-750 rounded transition-colors cursor-pointer"
                        >
                          Refund
                        </button>
                      )}

                      {p.status === 'failed' && (
                        <button
                          onClick={() => retryPayment(p.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
                        >
                          Retry Charge
                        </button>
                      )}

                      {p.status === 'refunded' && (
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium font-mono">
                          Refunded: -{formatCurrency(p.refundAmount || p.amount)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
