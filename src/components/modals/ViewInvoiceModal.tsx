import React from 'react';
import { X, Printer, CheckCircle, Ban, Send, Download } from 'lucide-react';
import { useBrightloop } from '../../context/BrightloopContext';
import { Invoice } from '../../types';

interface ViewInvoiceModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export const ViewInvoiceModal: React.FC<ViewInvoiceModalProps> = ({ invoice, onClose }) => {
  const { markInvoiceAsPaid, voidInvoice, formatCurrency, showToast } = useBrightloop();

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendReminder = () => {
    showToast('Reminder Sent', `Payment reminder emailed to ${invoice.customerEmail}.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[95vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Invoice Document</span>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">#{invoice.number}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Print / PDF</span>
            </button>

            {invoice.status !== 'paid' && invoice.status !== 'void' && (
              <>
                <button
                  onClick={handleSendReminder}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span className="hidden sm:inline">Send Notice</span>
                </button>
                <button
                  onClick={() => {
                    markInvoiceAsPaid(invoice.id);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Mark Paid</span>
                </button>
              </>
            )}

            {invoice.status === 'open' && (
              <button
                onClick={() => {
                  voidInvoice(invoice.id);
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Void Invoice"
              >
                <Ban className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formal Printable Invoice Body */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-8 bg-white dark:bg-slate-900 print:bg-white print:text-black print:p-0">
          {/* Header Row */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  BL
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white print:text-black font-sans">
                  Brightloop Systems Ltd.
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 leading-relaxed">
                Outer Ring Road, Bellandur<br />
                Bengaluru, Karnataka 560103, India<br />
                billing@brightloop.io · GSTIN: 29AAACB1234F1Z5
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white print:text-black uppercase">
                Invoice
              </div>
              <div className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 print:text-slate-800">
                {invoice.number}
              </div>
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                  invoice.status === 'paid' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/50' :
                  invoice.status === 'overdue' ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800/50' :
                  invoice.status === 'void' ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700' :
                  'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800/50'
                }`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>

          {/* Bill To & Meta Grid */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 dark:border-slate-800 print:border-slate-300 text-xs">
            <div>
              <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                Billed To
              </span>
              <div className="font-bold text-slate-900 dark:text-white print:text-black text-sm">{invoice.company}</div>
              <div className="text-slate-600 dark:text-slate-300 print:text-slate-700 mt-0.5">{invoice.customerName}</div>
              <div className="text-slate-500 dark:text-slate-400 font-mono">{invoice.customerEmail}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-right">
              <div>
                <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                  Issue Date
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-mono">{invoice.issueDate}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                  Due Date
                </span>
                <span className="text-slate-900 dark:text-white print:text-black font-bold font-mono">{invoice.dueDate}</span>
              </div>
              {invoice.paidDate && (
                <div className="col-span-2 text-emerald-600 dark:text-emerald-400 font-medium font-mono text-[11px]">
                  Paid in full on {invoice.paidDate} {invoice.paymentMethod ? `via ${invoice.paymentMethod}` : ''}
                </div>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 dark:border-slate-800 print:border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 print:bg-slate-100 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-center w-16">Qty</th>
                  <th className="px-4 py-3 text-right w-24">Unit Rate</th>
                  <th className="px-4 py-3 text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-medium">
                      {item.description}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-center font-mono">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-right font-mono">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-4 py-3 text-slate-900 dark:text-white print:text-black font-semibold text-right font-mono">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Promotional Discount:</span>
                  <span className="font-mono">-{formatCurrency(invoice.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GST / Taxes:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{formatCurrency(invoice.tax)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white print:text-black pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Total Due:</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes & Bank Details */}
          {invoice.notes && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">Notes & Remittance:</span>
              {invoice.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
