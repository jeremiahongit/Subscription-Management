import React, { useState } from 'react';
import { X, RotateCcw, AlertTriangle } from 'lucide-react';
import { useBrightloop } from '../../context/BrightloopContext';
import { PaymentTransaction } from '../../types';

interface RefundPaymentModalProps {
  payment: PaymentTransaction | null;
  onClose: () => void;
}

export const RefundPaymentModal: React.FC<RefundPaymentModalProps> = ({ payment, onClose }) => {
  const { refundPayment, formatCurrency, currency } = useBrightloop();

  const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
  const [partialAmount, setPartialAmount] = useState(payment ? payment.amount : 0);
  const [reason, setReason] = useState('Customer requested cancellation and pro-rata credit');

  if (!payment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRefundAmount = refundType === 'full' ? payment.amount : Number(partialAmount);
    refundPayment(payment.id, finalRefundAmount, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded-lg">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Refund Transaction</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{payment.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Customer:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{payment.customerName}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Original Amount:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(payment.amount)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Settlement Date:</span>
              <span className="font-mono text-slate-500 dark:text-slate-400">{payment.date}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Refund Scope
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRefundType('full')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  refundType === 'full'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'
                }`}
              >
                Full Refund ({formatCurrency(payment.amount)})
              </button>
              <button
                type="button"
                onClick={() => setRefundType('partial')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  refundType === 'partial'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'
                }`}
              >
                Partial Refund
              </button>
            </div>
          </div>

          {refundType === 'partial' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Custom Refund Amount ({currency === 'INR' ? '₹' : '$'})
              </label>
              <input
                type="number"
                step="0.01"
                min={0.01}
                max={payment.amount}
                value={partialAmount}
                onChange={(e) => setPartialAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-hidden focus:border-blue-500 font-mono"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Refund Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-hidden focus:border-blue-500 cursor-pointer"
            >
              <option value="Customer requested cancellation and pro-rata credit">Customer requested cancellation & pro-rata</option>
              <option value="Accidental duplicate charge">Accidental duplicate charge</option>
              <option value="Billing dispute resolved amicably">Billing dispute resolved amicably</option>
              <option value="Service downtime credit">Service downtime credit</option>
              <option value="Fraudulent transaction reported">Fraudulent transaction reported</option>
            </select>
          </div>

          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-lg text-amber-800 dark:text-amber-300 text-[11px] leading-snug">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              Refunds take 2-5 business days to reverse back to the customer's card statement. The subscription state may adjust accordingly.
            </span>
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
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Process Refund
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
