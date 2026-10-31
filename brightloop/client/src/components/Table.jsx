export default function Table({ columns, rows = [], page = 1, pages = 1, onPage, empty = 'No records found' }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            {columns.map((c, i) => (
              <th key={c.label || i} className="px-4 py-3 font-medium">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                {empty}
              </td>
            </tr>
          )}
          {rows.map((r, i) => (
            <tr key={r.id || i} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
              {columns.map((c, j) => (
                <td key={c.label || j} className="px-4 py-3">
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {pages > 1 && (
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 p-3 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
            className="disabled:opacity-40 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 cursor-pointer"
          >
            Previous
          </button>
          <span className="font-mono text-xs text-slate-600">{page} / {pages}</span>
          <button
            disabled={page >= pages}
            onClick={() => onPage(page + 1)}
            className="disabled:opacity-40 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
