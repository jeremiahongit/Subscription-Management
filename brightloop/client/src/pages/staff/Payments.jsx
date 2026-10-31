import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import Table from '../../components/Table';
import { inputClass } from '../../components/FormField';

const money = (v) => `₹${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function Payments() {
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });
  const [method, setMethod] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);

  const load = () => {
    const q = new URLSearchParams({
      page,
      ...(method && { method }),
      ...(from && { from }),
      ...(to && { to }),
    }).toString();
    api(`/payments?${q}`).then(setData).catch(() => {});
  };

  useEffect(() => {
    load();
  }, [page, method, from, to]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">Payments Ledger</h2>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className={inputClass}
            value={method}
            onChange={(e) => {
              setMethod(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Payment Methods</option>
            <option value="CARD">Card</option>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CHEQUE">Cheque</option>
          </select>

          <input
            type="date"
            className={`${inputClass} w-36 text-xs`}
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setPage(1);
            }}
          />
          <span className="text-xs text-slate-400">to</span>
          <input
            type="date"
            className={`${inputClass} w-36 text-xs`}
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <Table
        page={data.page}
        pages={data.pages}
        onPage={setPage}
        rows={data.items}
        columns={[
          { label: 'Date', render: (r) => r.date?.slice(0, 10) },
          {
            label: 'Invoice',
            render: (r) => (
              <Link to={`/invoices/${r.invoice?.id}`} className="font-mono text-indigo-600 hover:underline">
                {r.invoice?.number || r.invoiceId}
              </Link>
            ),
          },
          { label: 'Customer', render: (r) => r.invoice?.customer?.name || 'N/A' },
          { label: 'Method', key: 'method' },
          {
            label: 'Amount',
            render: (r) => <span className="font-mono font-semibold text-green-700">{money(r.amount)}</span>,
          },
          { label: 'Note', render: (r) => r.note || '—' },
        ]}
      />
    </div>
  );
}
