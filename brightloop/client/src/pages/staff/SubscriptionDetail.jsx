import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { api } from '../../api/client';
import StatusBadge, { Stepper } from '../../components/StatusBadge';
import FormField, { inputClass } from '../../components/FormField';

const NEXT = {
  DRAFT: ['QUOTATION', 'Send quotation'],
  QUOTATION: ['CONFIRMED', 'Confirm'],
  CONFIRMED: ['ACTIVE', 'Activate'],
  ACTIVE: ['CLOSED', 'Close subscription'],
};

export default function SubscriptionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [sub, setSub] = useState(null);
  const [preview, setPreview] = useState(null);
  const [plans, setPlans] = useState([]);
  const [products, setProducts] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [form, setForm] = useState({
    customerId: '',
    planId: '',
    startDate: new Date().toISOString().slice(0, 10),
    expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
    paymentTerms: 'NET_30',
    lines: [],
  });

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api('/plans?limit=100').then((r) => setPlans(r.items || [])).catch(() => {});
    api('/products?limit=100').then((r) => setProducts(r.items || [])).catch(() => {});
    api('/taxes?limit=100').then((r) => setTaxes(r.items || [])).catch(() => {});
    api('/users?role=CUSTOMER&limit=100').then((r) => setCustomers(r.items || [])).catch(() => {});

    if (!isNew) {
      api(`/subscriptions/${id}`)
        .then((s) => {
          setSub(s);
          setForm({
            customerId: s.customerId,
            planId: s.planId,
            startDate: s.startDate?.slice(0, 10),
            expiryDate: s.expiryDate?.slice(0, 10),
            paymentTerms: s.paymentTerms,
            lines: s.lines?.map((l) => ({
              productId: l.productId,
              variantId: l.variantId,
              quantity: l.quantity,
              unitPrice: Number(l.unitPrice),
              taxId: l.taxId,
            })) || [],
          });
        })
        .catch((e) => setError(e.message));

      api(`/subscriptions/${id}/preview`)
        .then(setPreview)
        .catch(() => {});
    }
  }, [id, isNew]);

  const addLine = () => {
    const prod = products[0];
    setForm({
      ...form,
      lines: [
        ...form.lines,
        {
          productId: prod?.id || '',
          variantId: null,
          quantity: 1,
          unitPrice: Number(prod?.salesPrice || 0),
          taxId: taxes[0]?.id || null,
        },
      ],
    });
  };

  const removeLine = (idx) => {
    setForm({ ...form, lines: form.lines.filter((_, i) => i !== idx) });
  };

  const updateLine = (idx, field, val) => {
    const lines = [...form.lines];
    lines[idx][field] = val;
    if (field === 'productId') {
      const p = products.find((x) => x.id === val);
      lines[idx].variantId = null;
      lines[idx].unitPrice = Number(p?.salesPrice || 0);
    }
    if (field === 'variantId') {
      const p = products.find((x) => x.id === lines[idx].productId);
      const v = p?.variants?.find((x) => x.id === val);
      lines[idx].unitPrice = Number(p?.salesPrice || 0) + Number(v?.extraPrice || 0);
    }
    setForm({ ...form, lines });
  };

  const save = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.lines || form.lines.length === 0) return setError('Add at least one line');
    setBusy(true);
    try {
      if (isNew) {
        const created = await api('/subscriptions', { method: 'POST', body: form });
        navigate(`/subscriptions/${created.id}`);
      } else {
        await api(`/subscriptions/${id}`, { method: 'PUT', body: form });
        const refreshed = await api(`/subscriptions/${id}`);
        setSub(refreshed);
        const p = await api(`/subscriptions/${id}/preview`);
        setPreview(p);
      }
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  };

  const changeStatus = async (targetStatus) => {
    setError('');
    try {
      const updated = await api(`/subscriptions/${id}/status`, {
        method: 'PATCH',
        body: { status: targetStatus },
      });
      setSub(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  const isDraftOrNew = isNew || sub?.status === 'DRAFT';
  const nextAction = sub ? NEXT[sub.status] : null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">
              {isNew ? 'New Subscription' : sub?.number}
            </h2>
            {sub && <StatusBadge status={sub.status} />}
          </div>
          {sub && <div className="mt-2"><Stepper status={sub.status} /></div>}
        </div>

        {sub && (
          <div className="flex items-center gap-2">
            {nextAction && (
              <button
                onClick={() => changeStatus(nextAction[0])}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 cursor-pointer"
              >
                {nextAction[1]}
              </button>
            )}
            {['DRAFT', 'QUOTATION', 'CONFIRMED'].includes(sub.status) && (
              <button
                onClick={() => changeStatus('CLOSED')}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
              >
                Cancel / Close
              </button>
            )}
          </div>
        )}
      </div>

      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">{error}</div>}

      <form onSubmit={save} className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Customer">
            {isDraftOrNew ? (
              <select
                className={inputClass}
                required
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value })}
              >
                <option value="">-- Choose Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm font-medium text-slate-800">{sub?.customer?.name}</p>
            )}
          </FormField>

          <FormField label="Subscription Plan">
            {isDraftOrNew ? (
              <select
                className={inputClass}
                required
                value={form.planId}
                onChange={(e) => setForm({ ...form, planId: e.target.value })}
              >
                <option value="">-- Choose Plan --</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.billingPeriod}) - ₹{Number(p.price)}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm font-medium text-slate-800">{sub?.plan?.name}</p>
            )}
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Start Date">
            {isDraftOrNew ? (
              <input
                type="date"
                className={inputClass}
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            ) : (
              <p className="text-sm font-mono">{sub?.startDate?.slice(0, 10)}</p>
            )}
          </FormField>

          <FormField label="Expiry Date">
            {isDraftOrNew ? (
              <input
                type="date"
                className={inputClass}
                required
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              />
            ) : (
              <p className="text-sm font-mono">{sub?.expiryDate?.slice(0, 10)}</p>
            )}
          </FormField>

          <FormField label="Payment Terms">
            {isDraftOrNew ? (
              <select
                className={inputClass}
                value={form.paymentTerms}
                onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })}
              >
                <option value="IMMEDIATE">Immediate</option>
                <option value="NET_15">Net 15</option>
                <option value="NET_30">Net 30</option>
                <option value="NET_60">Net 60</option>
              </select>
            ) : (
              <p className="text-sm font-medium">{sub?.paymentTerms}</p>
            )}
          </FormField>
        </div>

        {/* Lines table */}
        <div className="border-t border-slate-100 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-900">Subscription Line Items</h4>
            {isDraftOrNew && (
              <button
                type="button"
                onClick={addLine}
                className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
              >
                + Add Line
              </button>
            )}
          </div>

          <div className="space-y-2">
            {form.lines.map((l, idx) => {
              const selProd = products.find((p) => p.id === l.productId);
              return (
                <div key={idx} className="flex flex-wrap items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                  {isDraftOrNew ? (
                    <>
                      <select
                        className={`${inputClass} text-xs flex-1 min-w-[140px]`}
                        value={l.productId}
                        onChange={(e) => updateLine(idx, 'productId', e.target.value)}
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>

                      <select
                        className={`${inputClass} text-xs w-28`}
                        value={l.variantId || ''}
                        onChange={(e) => updateLine(idx, 'variantId', e.target.value || null)}
                      >
                        <option value="">No variant</option>
                        {selProd?.variants?.map((v) => (
                          <option key={v.id} value={v.id}>{v.value} (+₹{Number(v.extraPrice)})</option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        className={`${inputClass} text-xs w-16 text-center`}
                        value={l.quantity}
                        onChange={(e) => updateLine(idx, 'quantity', Number(e.target.value))}
                      />

                      <input
                        type="number"
                        step="0.01"
                        className={`${inputClass} text-xs w-20 text-right`}
                        value={l.unitPrice}
                        onChange={(e) => updateLine(idx, 'unitPrice', Number(e.target.value))}
                      />

                      <select
                        className={`${inputClass} text-xs w-24`}
                        value={l.taxId || ''}
                        onChange={(e) => updateLine(idx, 'taxId', e.target.value || null)}
                      >
                        <option value="">No tax</option>
                        {taxes.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>

                      <span className="font-mono font-semibold text-slate-800 w-20 text-right">
                        ₹{(l.quantity * l.unitPrice).toFixed(2)}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeLine(idx)}
                        className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="flex justify-between w-full">
                      <span>{selProd?.name || 'Product'} × {l.quantity}</span>
                      <span className="font-mono font-medium">₹{(l.quantity * l.unitPrice).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {isDraftOrNew && (
          <button
            disabled={busy}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 cursor-pointer"
          >
            {isNew ? 'Create Subscription' : 'Save Draft'}
          </button>
        )}
      </form>

      {/* Next invoice preview */}
      {preview && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h4 className="text-sm font-bold text-indigo-900 mb-2">Next Invoice Preview (Auto-calculated)</h4>
          <p className="text-xs text-indigo-700 mb-4">
            Shows automatic product/whole-subscription discounts and tax engine output
          </p>
          <div className="space-y-1 text-xs">
            {preview.lines?.map((pl, i) => (
              <div key={i} className="flex justify-between text-slate-700">
                <span>{pl.description} (Qty: {pl.quantity})</span>
                <span className="font-mono">₹{pl.lineTotal.toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-indigo-200 flex justify-between font-medium">
              <span>Subtotal:</span>
              <span className="font-mono">₹{preview.subtotal.toFixed(2)}</span>
            </div>
            {preview.discountTotal > 0 && (
              <div className="flex justify-between text-green-700 font-medium">
                <span>Discount Applied:</span>
                <span className="font-mono">-₹{preview.discountTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Tax Total:</span>
              <span className="font-mono">₹{preview.taxTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-indigo-200">
              <span>Estimated Invoice Total:</span>
              <span className="font-mono text-indigo-600">₹{preview.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
