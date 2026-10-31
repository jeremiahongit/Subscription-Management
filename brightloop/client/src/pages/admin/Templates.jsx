import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '../../api/client';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import FormField, { inputClass } from '../../components/FormField';

export default function Templates() {
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });
  const [plans, setPlans] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    api(`/templates?page=${page}&search=${encodeURIComponent(search)}`).then(setData).catch(() => {});
    api('/plans?limit=100').then((r) => setPlans(r.items || [])).catch(() => {});
    api('/products?limit=100').then((r) => setProducts(r.items || [])).catch(() => {});
  };

  useEffect(() => {
    load();
  }, [page, search]);

  const addLine = () => {
    setForm({
      ...form,
      lines: [...form.lines, { productId: products[0]?.id || '', variantId: null, quantity: 1 }],
    });
  };

  const removeLine = (idx) => {
    setForm({ ...form, lines: form.lines.filter((_, i) => i !== idx) });
  };

  const updateLine = (idx, field, val) => {
    const updated = [...form.lines];
    updated[idx][field] = val;
    if (field === 'productId') updated[idx].variantId = null;
    setForm({ ...form, lines: updated });
  };

  const save = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.lines || form.lines.length === 0) {
      return setError('Add at least one product line');
    }
    try {
      if (form.id) await api(`/templates/${form.id}`, { method: 'PUT', body: form });
      else await api('/templates', { method: 'POST', body: form });
      setForm(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this template?')) return;
    try {
      await api(`/templates/${id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">Quotation Templates</h2>
        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="Search templates..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <button
            onClick={() =>
              setForm({
                name: '',
                planId: plans[0]?.id || '',
                validityDays: 30,
                lines: [{ productId: products[0]?.id || '', variantId: null, quantity: 1 }],
              })
            }
            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 cursor-pointer whitespace-nowrap"
          >
            <Plus size={16} /> New Template
          </button>
        </div>
      </div>

      <Table
        page={data.page}
        pages={data.pages}
        onPage={setPage}
        rows={data.items}
        columns={[
          { label: 'Name', key: 'name' },
          { label: 'Plan', render: (r) => r.plan?.name || 'N/A' },
          { label: 'Validity (days)', key: 'validityDays' },
          { label: 'No. of lines', render: (r) => r.lines?.length || 0 },
          {
            label: '',
            render: (r) => (
              <div className="flex gap-3 justify-end">
                <button
                  className="text-indigo-600 hover:underline cursor-pointer"
                  onClick={() =>
                    setForm({
                      ...r,
                      lines: r.lines?.map((l) => ({
                        productId: l.productId,
                        variantId: l.variantId,
                        quantity: l.quantity,
                      })) || [],
                    })
                  }
                >
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-700 cursor-pointer" onClick={() => remove(r.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ),
          },
        ]}
      />

      <Modal open={!!form} title={form?.id ? 'Edit Template' : 'New Template'} onClose={() => setForm(null)}>
        {form && (
          <form onSubmit={save} className="space-y-3">
            <FormField label="Template Name">
              <input
                className={inputClass}
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Associated Plan">
                <select
                  className={inputClass}
                  value={form.planId}
                  onChange={(e) => setForm({ ...form, planId: e.target.value })}
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{Number(p.price)})
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Validity (Days)">
                <input
                  type="number"
                  min="1"
                  className={inputClass}
                  required
                  value={form.validityDays}
                  onChange={(e) => setForm({ ...form, validityDays: Number(e.target.value) })}
                />
              </FormField>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium text-slate-800">Product Lines</h4>
                <button
                  type="button"
                  onClick={addLine}
                  className="text-xs text-indigo-600 hover:underline cursor-pointer"
                >
                  + Add Line
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto">
                {form.lines?.map((line, idx) => {
                  const selProd = products.find((p) => p.id === line.productId);
                  return (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                      <select
                        className={`${inputClass} text-xs flex-1`}
                        value={line.productId}
                        onChange={(e) => updateLine(idx, 'productId', e.target.value)}
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>

                      <select
                        className={`${inputClass} text-xs w-28`}
                        value={line.variantId || ''}
                        onChange={(e) => updateLine(idx, 'variantId', e.target.value || null)}
                      >
                        <option value="">No variant</option>
                        {selProd?.variants?.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.attribute}: {v.value} (+₹{Number(v.extraPrice)})
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        className={`${inputClass} text-xs w-16 text-center`}
                        value={line.quantity}
                        onChange={(e) => updateLine(idx, 'quantity', Number(e.target.value))}
                      />

                      <button
                        type="button"
                        onClick={() => removeLine(idx)}
                        className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="w-full rounded-lg bg-indigo-600 py-2 text-white font-medium hover:bg-indigo-700 cursor-pointer">
              Save Template
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
