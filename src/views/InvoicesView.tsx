import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Download,
  Eye,
  CheckCircle,
  Ban,
  Send,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useBrightloop } from '../context/BrightloopContext';
import { Invoice } from '../types';

interface InvoicesViewProps {
  onOpenCreateInvoice: () => void;
  onViewInvoice: (invoiceId: string) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  onOpenCreateInvoice,
  onViewInvoice
}) => {
  const {
    invoices,
    markInvoiceAsPaid,
    voidInvoice,
    formatCurrency,
    showToast
  } = useBrightloop();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'open' | 'overdue' | 'void'>('all');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      inv.company.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalInvoiced = invoices.reduce((sum, i) => sum + i.total, 0);
  const paidInvoices = invoices.filter(i => i.status === 'paid');
  const totalCollected = paidInvoices.reduce((sum, i) => sum + i.total, 0);
  const overdueInvoices = invoices.filter(i => i.status === 'overdue');
  const totalOverdue = overdueInvoices.reduce((sum, i) => sum + i.total, 0);
  const openInvoices = invoices.filter(i => i.status === 'open');
  const totalOpen = openInvoices.reduce((sum, i) => sum + i.total, 0);

  const handleExportCSV = () => {
    const headers = ['InvoiceNumber,CustomerName,Company,IssueDate,DueDate,Subtotal,Tax,Discount,Total,Status'];
    const rows = filteredInvoices.map(i =>
      `"${i.number}","${i.customerName}","${i.company}","${i.issueDate}","${i.dueDate}",${i.subtotal},${i.tax},${i.discountAmount},${i.total},"${i.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `brightloop_invoices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Invoices Exported', `${filteredInvoices.length} invoices downloaded.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Invoices & Statements</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage receivable billing statements, sales tax compliance, and automated collections
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenCreateInvoice}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Issue Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoice Financial Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Total Billed Volume
          </span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
            {formatCurrency(totalInvoiced)}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 block">
            {invoices.length} total issued
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Collected Cash
          </span>
          <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
            {formatCurrency(totalCollected)}
          </span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-500 font-mono mt-0.5 block">
            {paidInvoices.length} paid in full
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Open Receivables
          </span>
          <span className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1 block">
            {formatCurrency(totalOpen)}
          </span>
          <span className="text-[11px] text-blue-700 dark:text-blue-500 font-mono mt-0.5 block">
            {openInvoices.length} awaiting payment
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Overdue Balance
          </span>
          <span className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1 block">
            {formatCurrency(totalOverdue)}
          </span>
          <span className="text-[11px] text-rose-700 dark:text-rose-500 font-mono mt-0.5 block">
            {overdueInvoices.length} delinquent accounts
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice number (INV-...), company, recipient..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800/70 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          />
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto">
          {(['all', 'paid', 'open', 'overdue', 'void'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors cursor-pointer whitespace-nowrap ${
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

      {/* Invoices Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Invoice Number</th>
                <th className="px-5 py-3">Billed Customer</th>
                <th className="px-5 py-3">Issue Date</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3 text-right">Tax & Discount</th>
                <th className="px-5 py-3 text-right">Total Amount</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                    No invoices match the current query.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => onViewInvoice(inv.id)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-mono font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {inv.number}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        {inv.items.length} line {inv.items.length === 1 ? 'item' : 'items'}
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white">{inv.company}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{inv.customerEmail}</div>
                    </td>

                    <td className="px-5 py-3.5 font-mono text-slate-600 dark:text-slate-400">
                      {inv.issueDate}
                    </td>

                    <td className="px-5 py-3.5 font-mono font-medium text-slate-800 dark:text-slate-200">
                      {inv.dueDate}
                    </td>

                    <td className="px-5 py-3.5 text-right font-mono text-slate-500 dark:text-slate-400">
                      Tax: {formatCurrency(inv.tax)}
                      {inv.discountAmount > 0 && (
                        <span className="text-emerald-600 dark:text-emerald-400 block text-[11px]">
                          Disc: -{formatCurrency(inv.discountAmount)}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white text-sm">
                      {formatCurrency(inv.total)}
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        inv.status === 'paid' ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50' :
                        inv.status === 'overdue' ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50' :
                        inv.status === 'void' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' :
                        'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50'
                      }`}>
                        {inv.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onViewInvoice(inv.id)}
                          className="p-1 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded cursor-pointer"
                          title="View / Print Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {inv.status !== 'paid' && inv.status !== 'void' && (
                          <button
                            onClick={() => markInvoiceAsPaid(inv.id)}
                            className="px-2 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors cursor-pointer"
                            title="Mark as Paid"
                          >
                            Mark Paid
                          </button>
                        )}

                        {inv.status === 'open' && (
                          <button
                            onClick={() => voidInvoice(inv.id)}
                            className="p-1 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded cursor-pointer"
                            title="Void invoice"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
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
