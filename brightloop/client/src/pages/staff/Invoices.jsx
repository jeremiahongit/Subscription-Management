import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import Table from '../../components/Table';
import StatusBadge from '../../components/StatusBadge';
import { inputClass } from '../../components/FormField';

const money = (v) => `₹${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function Invoices() {
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [overdue, setOverdue] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => {
    const q = new URLSearchParams({
      page,
      ...(search && { search }),
      ...(status && { status }),
      ...(overdue && { overdue: 'true' }),
      ...(from && { from }),
      ...(to && { to }),
    }).toString();
    api(`/invoices?${q}`).then(setData).catch(() => {});
  };

  useEffect(() => {
    load();
  }, [page, search, status, overdue, from, to]);

  const runBilling = async () => {
    if (!confirm('Generate invoices for all due subscriptions?')) return;
    setBusy(true);
    setMsg('');
    try {
      const r = await api('/billing/run', { method: 'POST', body: {} });
      setMsg(`Created ${r.invoicesCreated} invoices, skipped ${r.skipped} already billed.`);
      load();
    } catch (e) {
      setMsg(`Billing run error: ${e.message}`);
    }
    setBusy(false);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">Invoices</h2>
        <button
          onClick={runBilling}
          disabled={busy}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer shadow-xs"
        >
          {busy ? 'Running Billing Engine...' : 'Run Billing'}
        </button>
      </div>

      {msg && (
        <div
          className={`mb-4 rounded-lg p-3 text-sm border ${
            msg.includes('error') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-800 border-green-200'
          }`}
        >
          {msg}
        </div>
      )}

      {/* Filter bar */}
      <div className="mb-4 flex flex-wrap items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
        <input
          className={`${inputClass} max-w-xs`}
          placeholder="Search invoice, customer, sub..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className={inputClass}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PAID">Paid</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer px-2">
          <input
            type="checkbox"
            checked={overdue}
            onChange={(e) => {
              setOverdue(e.target.checked);
              setPage(1);
            }}
          />
          Overdue only
        </label>

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

      <Table
        page={data.page}
        pages={data.pages}
        onPage={setPage}
        rows={data.items}
        columns={[
          {
            label: 'Number',
            render: (r) => (
              <Link to={`/invoices/${r.id}`} className="font-mono text-indigo-600 hover:underline">
                {r.number}
              </Link>
            ),
          },
          { label: 'Customer', render: (r) => r.customer?.name || 'N/A' },
          { label: 'Sub #', render: (r) => r.subscription?.number || '—' },
          { label: 'Issue Date', render: (r) => r.issueDate?.slice(0, 10) },
          { label: 'Due Date', render: (r) => r.dueDate?.slice(0, 10) },
          { label: 'Total', render: (r) => money(r.total) },
          { label: 'Paid', render: (r) => money(r.amountPaid) },
          { label: 'Outstanding', render: (r) => money(r.outstanding) },
          {
            label: 'Status',
            render: (r) => <StatusBadge status={r.isOverdue ? 'OVERDUE' : r.status} />,
          },
          {
            label: '',
            render: (r) => (
              <Link to={`/invoices/${r.id}`} className="text-indigo-600 hover:underline text-xs">
                View
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}
