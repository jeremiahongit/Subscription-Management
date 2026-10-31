import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import StatusBadge from '../../components/StatusBadge';

const money = (v) => `₹${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function MySubscriptions() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/me/subscriptions')
      .then((r) => setItems(r.items || []))
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-red-600 p-4">{error}</p>;

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-slate-900">My Subscriptions</h2>

      {items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-400">
          You have no subscriptions yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((sub) => (
            <div key={sub.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-900 text-lg">{sub.number}</span>
                  <StatusBadge status={sub.status} />
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  {sub.startDate?.slice(0, 10)} to {sub.expiryDate?.slice(0, 10)}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">Plan:</span>
                  <span className="font-semibold text-slate-800">{sub.plan?.name}</span>
                  <span className="text-xs text-slate-500 ml-1">({sub.plan?.billingPeriod})</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Plan Rate:</span>
                  <span className="font-mono font-bold text-indigo-600">{money(sub.plan?.price)}</span>
                </div>
              </div>

              {sub.lines?.length > 0 && (
                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="p-2.5">Item</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Unit Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sub.lines.map((l) => (
                        <tr key={l.id}>
                          <td className="p-2.5 font-medium text-slate-800">
                            {l.product?.name} {l.variant ? `(${l.variant.value})` : ''}
                          </td>
                          <td className="p-2.5 text-center font-mono">{l.quantity}</td>
                          <td className="p-2.5 text-right font-mono">{money(l.unitPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
