import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import Table from '../../components/Table';
import StatusBadge from '../../components/StatusBadge';

const money = (v) => `₹${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function MyInvoices() {
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const load = () => {
    api(`/me/invoices?page=${page}`)
      .then(setData)
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    load();
  }, [page]);

  const totalOutstanding = data.items.reduce((sum, i) => sum + (i.outstanding || 0), 0);
  const overdueCount = data.items.filter((i) => i.isOverdue).length;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-slate-900">My Invoices</h2>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-slate-600">
            Total Outstanding: <strong className="text-red-600">{money(totalOutstanding)}</strong>
          </span>
          {overdueCount > 0 && (
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {overdueCount} Overdue
            </span>
          )}
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <Table
        page={data.page}
        pages={data.pages}
        onPage={setPage}
        rows={data.items}
        columns={[
          {
            label: 'Number',
            render: (r) => (
              <Link to={`/portal/invoices/${r.id}`} className="font-mono text-indigo-600 hover:underline">
                {r.number}
              </Link>
            ),
          },
          { label: 'Issue Date', render: (r) => r.issueDate?.slice(0, 10) },
          { label: 'Due Date', render: (r) => r.dueDate?.slice(0, 10) },
          { label: 'Total', render: (r) => money(r.total) },
          { label: 'Outstanding', render: (r) => money(r.outstanding) },
          {
            label: 'Status',
            render: (r) => <StatusBadge status={r.isOverdue ? 'OVERDUE' : r.status} />,
          },
          {
            label: '',
            render: (r) => (
              <Link to={`/portal/invoices/${r.id}`} className="text-indigo-600 hover:underline text-xs">
                View
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}
