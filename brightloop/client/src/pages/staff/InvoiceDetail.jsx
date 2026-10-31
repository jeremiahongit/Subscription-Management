import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, Send, CreditCard } from 'lucide-react';
import { api } from '../../api/client';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import FormField, { inputClass } from '../../components/FormField';

const money = (v) => `₹${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function InvoiceDetail() {
  const { id } = useParams();
  const [inv, setInv] = useState(null);
  const [error, setError] = useState('');
  const [payModal, setPayModal] = useState(false);
  const [payForm, setPayForm] = useState({
    method: 'CARD',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    note: '',
  });

  const load = () => {
    api(`/invoices/${id}`).then(setInv).catch((e) => setError(e.message));
  };

  useEffect(() => {
    load();
  }, [id]);

  const changeStatus = async (status) => {
    try {
      await api(`/invoices/${id}/status`, { method: 'PATCH', body: { status } });
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const sendInvoice = async () => {
    try {
      await api(`/invoices/${id}/send`, { method: 'POST' });
      alert('Invoice marked as sent and logged.');
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const openPayment = () => {
    setPayForm({
      method: 'CARD',
      amount: inv.outstanding,
      date: new Date().toISOString().slice(0, 10),
      note: '',
    });
    setPayModal(true);
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    if (Number(payForm.amount) <= 0 || Number(payForm.amount) > inv.outstanding) {
      return alert('Payment must be positive and not exceed outstanding balance');
    }
    try {
      await api('/payments', {
        method: 'POST',
        body: {
          invoiceId: inv.id,
          method: payForm.method,
          amount: Number(payForm.amount),
          date: new Date(payForm.date).toISOString(),
          note: payForm.note,
        },
      });
      setPayModal(false);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <p className="text-red-600 p-4">{error}</p>;
  if (!inv) return <p className="text-slate-400 p-4">Loading invoice...</p>;

  return (
    <div className="space-y-6 max-w-4xl bg-white p-8 rounded-xl border border-slate-200 shadow-sm print:p-0 print:border-none print:shadow-none">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold font-mono text-slate-900">{inv.number}</h2>
            <StatusBadge status={inv.isOverdue ? 'OVERDUE' : inv.status} />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Subscription: <span className="font-mono">{inv.subscription?.number || '—'}</span>
            {inv.sentAt && ` · Sent on ${inv.sentAt.slice(0, 10)}`}
          </p>
        </div>

        <div className="print:hidden flex items-center gap-2">
          {inv.status === 'DRAFT' && (
            <>
              <button
                onClick={() => changeStatus('CONFIRMED')}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
              >
                Confirm Invoice
              </button>
              <button
                onClick={() => changeStatus('CANCELLED')}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 cursor-pointer"
              >
                Cancel
              </button>
            </>
          )}

          {inv.status === 'CONFIRMED' && (
            <>
              <button
                onClick={openPayment}
                className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 cursor-pointer"
              >
                <CreditCard size={14} /> Record Payment
              </button>
              <button
                onClick={sendInvoice}
                className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Send size={14} /> Send
              </button>
              {Number(inv.amountPaid) === 0 && (
                <button
                  onClick={() => changeStatus('CANCELLED')}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </>
          )}

          {inv.status === 'PAID' && (
            <button
              onClick={sendInvoice}
              className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Send size={14} /> Send Receipt
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <span className="text-xs uppercase text-slate-400 font-semibold block mb-1">Customer Details</span>
          <div className="font-semibold text-slate-800">{inv.customer?.name}</div>
          <div className="text-slate-500 font-mono text-xs">{inv.customer?.email}</div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-500">
            Issue Date: <span className="font-mono text-slate-800 font-medium">{inv.issueDate?.slice(0, 10)}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Due Date: <span className="font-mono text-slate-800 font-medium">{inv.dueDate?.slice(0, 10)}</span>
          </div>
        </div>
      </div>

      {/* Lines Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="p-3">Description</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Unit Price</th>
              <th className="p-3 text-right">Discount</th>
              <th className="p-3 text-right">Tax</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inv.lines?.map((l) => (
              <tr key={l.id}>
                <td className="p-3 font-medium text-slate-800">{l.description}</td>
                <td className="p-3 text-center font-mono">{l.quantity}</td>
                <td className="p-3 text-right font-mono">{money(l.unitPrice)}</td>
                <td className="p-3 text-right font-mono text-green-700">
                  {Number(l.discountAmount) > 0 ? `-${money(l.discountAmount)}` : '—'}
                </td>
                <td className="p-3 text-right font-mono text-slate-600">
                  {money(l.taxAmount)} ({Number(l.taxPercent)}%)
                </td>
                <td className="p-3 text-right font-mono font-semibold text-slate-900">{money(l.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Box */}
      <div className="flex justify-end pt-2">
        <div className="w-64 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-mono">{money(inv.subtotal)}</span>
          </div>
          {Number(inv.discountTotal) > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Discount Total:</span>
              <span className="font-mono">-{money(inv.discountTotal)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Tax Total:</span>
            <span className="font-mono">{money(inv.taxTotal)}</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200">
            <span>Total:</span>
            <span className="font-mono text-indigo-600">{money(inv.total)}</span>
          </div>
          <div className="flex justify-between text-slate-600 pt-1">
            <span>Amount Paid:</span>
            <span className="font-mono">{money(inv.amountPaid)}</span>
          </div>
          <div className="flex justify-between font-semibold text-slate-900 border-t border-slate-100 pt-1">
            <span>Outstanding:</span>
            <span className="font-mono text-red-600">{money(inv.outstanding)}</span>
          </div>
        </div>
      </div>

      {/* Payments History Table */}
      {inv.payments?.length > 0 && (
        <div className="border-t border-slate-200 pt-4">
          <h4 className="text-xs uppercase font-semibold text-slate-600 mb-2">Payment History</h4>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Method</th>
                  <th className="p-2.5 text-right">Amount</th>
                  <th className="p-2.5">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inv.payments.map((p) => (
                  <tr key={p.id}>
                    <td className="p-2.5 font-mono">{p.date?.slice(0, 10)}</td>
                    <td className="p-2.5">{p.method}</td>
                    <td className="p-2.5 text-right font-mono font-semibold text-green-700">{money(p.amount)}</td>
                    <td className="p-2.5 text-slate-500">{p.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      <Modal open={payModal} title={`Record Payment for ${inv.number}`} onClose={() => setPayModal(false)}>
        <form onSubmit={submitPayment} className="space-y-3">
          <FormField label="Payment Method">
            <select
              className={inputClass}
              value={payForm.method}
              onChange={(e) => setPayForm({ ...payForm, method: e.target.value })}
            >
              <option value="CARD">Card</option>
              <option value="CASH">Cash</option>
              <option value="UPI">UPI</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CHEQUE">Cheque</option>
            </select>
          </FormField>

          <FormField label={`Amount to Pay (Max: ${money(inv.outstanding)})`}>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={inv.outstanding}
              className={inputClass}
              required
              value={payForm.amount}
              onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
            />
          </FormField>

          <FormField label="Payment Date">
            <input
              type="date"
              className={inputClass}
              required
              value={payForm.date}
              onChange={(e) => setPayForm({ ...payForm, date: e.target.value })}
            />
          </FormField>

          <FormField label="Note (Optional)">
            <textarea
              className={inputClass}
              value={payForm.note}
              onChange={(e) => setPayForm({ ...payForm, note: e.target.value })}
              placeholder="Cheque #, reference code..."
            />
          </FormField>

          <button className="w-full rounded-lg bg-green-600 py-2 text-white font-medium hover:bg-green-700 cursor-pointer">
            Confirm Payment
          </button>
        </form>
      </Modal>
    </div>
  );
}
