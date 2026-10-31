import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '../../api/client';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import FormField, { inputClass } from '../../components/FormField';

const empty = {
  name: '',
  type: 'PERCENT',
  value: '',
  minPurchase: '',
  minQuantity: '',
  startDate: '',
  endDate: '',
  usageLimit: '',
  appliesTo: 'SUBSCRIPTION',
  productId: null,
};

export default function Discounts() {
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    api(`/discounts?page=${page}&search=${encodeURIComponent(search)}`).then(setData).catch(() => {});
    api('/products?limit=100').then((r) => setProducts(r.items || [])).catch(() => {});
  };

  useEffect(() => {
    load();
  }, [page, search]);

  const save = async (e) => {
    e.preventDefault();
    setError('');
    if (form.endDate < form.startDate) {
      return setError('End date must be after start date');
    }
    if (form.type === 'PERCENT' && Number(form.value) > 100) {
      return setError('Percentage cannot be above 100%');
    }
    if (form.appliesTo === 'PRODUCT' && !form.productId) {
      return setError('Please pick a product');
    }
    try {
      const payload = {
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        productId: form.appliesTo === 'PRODUCT' ? form.productId : null,
      };
      if (form.id) await api(`/discounts/${form.id}`, { method: 'PUT', body: payload });
      else await api('/discounts', { method: 'POST', body: payload });
      setForm(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this discount?')) return;
    try {
      await api(`/discounts/${id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">Discounts & Rules</h2>
        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="Search discounts..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <button
            onClick={() => setForm(empty)}
            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 cursor-pointer whitespace-nowrap"
          >
            <Plus size={16} /> New Discount
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
          { label: 'Type', key: 'type' },
          {
            label: 'Value',
            render: (r) => (r.type === 'PERCENT' ? `${Number(r.value)}%` : `₹${Number(r.value)}`),
          },
          {
            label: 'Applies to',
            render: (r) => (r.appliesTo === 'PRODUCT' ? `Product: ${r.product?.name || 'N/A'}` : 'Whole subscription'),
          },
          {
            label: 'Valid',
            render: (r) => `${r.startDate?.slice(0, 10)} to ${r.endDate?.slice(0, 10)}`,
          },
          {
            label: 'Used',
            render: (r) => `${r.timesUsed} / ${r.usageLimit ?? '∞'}`,
          },
          {
            label: '',
            render: (r) => (
              <div className="flex gap-3 justify-end">
                <button
                  className="text-indigo-600 hover:underline cursor-pointer"
                  onClick={() =>
                    setForm({
                      ...r,
                      startDate: r.startDate?.slice(0, 10),
                      endDate: r.endDate?.slice(0, 10),
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

      <Modal open={!!form} title={form?.id ? 'Edit Discount' : 'New Discount'} onClose={() => setForm(null)}>
        {form && (
          <form onSubmit={save} className="space-y-3">
            <FormField label="Discount Name">
              <input
                className={inputClass}
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Type">
                <select
                  className={inputClass}
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="PERCENT">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount (₹)</option>
                </select>
              </FormField>
              <FormField label="Discount Value">
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  className={inputClass}
                  required
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Min Purchase (₹) (Optional)">
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  value={form.minPurchase ?? ''}
                  onChange={(e) => setForm({ ...form, minPurchase: e.target.value })}
                />
              </FormField>
              <FormField label="Min Quantity (Optional)">
                <input
                  type="number"
                  min="1"
                  className={inputClass}
                  value={form.minQuantity ?? ''}
                  onChange={(e) => setForm({ ...form, minQuantity: e.target.value })}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Start Date">
                <input
                  type="date"
                  className={inputClass}
                  required
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </FormField>
              <FormField label="End Date">
                <input
                  type="date"
                  className={inputClass}
                  required
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Usage Limit (Optional)">
                <input
                  type="number"
                  min="1"
                  className={inputClass}
                  value={form.usageLimit ?? ''}
                  onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                />
              </FormField>
              <FormField label="Applies To">
                <select
                  className={inputClass}
                  value={form.appliesTo}
                  onChange={(e) => setForm({ ...form, appliesTo: e.target.value })}
                >
                  <option value="SUBSCRIPTION">Whole Subscription</option>
                  <option value="PRODUCT">Specific Product</option>
                </select>
              </FormField>
            </div>

            {form.appliesTo === 'PRODUCT' && (
              <FormField label="Select Product">
                <select
                  className={inputClass}
                  value={form.productId || ''}
                  onChange={(e) => setForm({ ...form, productId: e.target.value })}
                >
                  <option value="">-- Choose Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </FormField>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="w-full rounded-lg bg-indigo-600 py-2 text-white font-medium hover:bg-indigo-700 cursor-pointer">
              Save Discount
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
