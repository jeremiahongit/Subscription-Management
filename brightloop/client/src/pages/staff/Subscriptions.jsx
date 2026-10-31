import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FileStack } from 'lucide-react';
import { api } from '../../api/client';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import FormField, { inputClass } from '../../components/FormField';
import StatusBadge from '../../components/StatusBadge';

export default function Subscriptions() {
  const navigate = useNavigate();
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  // Template Modal State
  const [templateModal, setTemplateModal] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [templateForm, setTemplateForm] = useState({
    templateId: '',
    customerId: '',
    startDate: new Date().toISOString().slice(0, 10),
    paymentTerms: 'NET_30',
  });
  const [tplError, setTplError] = useState('');

  const load = () => {
    const q = new URLSearchParams({
      page,
      ...(search && { search }),
      ...(status && { status }),
    }).toString();
    api(`/subscriptions?${q}`).then(setData).catch(() => {});
  };

  useEffect(() => {
    load();
  }, [page, search, status]);

  const openTemplateModal = async () => {
    setTplError('');
    try {
      const [tRes, cRes] = await Promise.all([
        api('/templates?limit=100'),
        api('/users?role=CUSTOMER&limit=100'),
      ]);
      setTemplates(tRes.items || []);
      setCustomers(cRes.items || []);
      setTemplateForm((prev) => ({
        ...prev,
        templateId: tRes.items?.[0]?.id || '',
        customerId: cRes.items?.[0]?.id || '',
      }));
      setTemplateModal(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleTemplateSubmit = async (e) => {
    e.preventDefault();
    setTplError('');
    try {
      const res = await api(`/subscriptions/from-template/${templateForm.templateId}`, {
        method: 'POST',
        body: {
          customerId: templateForm.customerId,
          startDate: templateForm.startDate,
          paymentTerms: templateForm.paymentTerms,
        },
      });
      setTemplateModal(false);
      navigate(`/subscriptions/${res.id}`);
    } catch (err) {
      setTplError(err.message);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">Subscriptions</h2>
        <div className="flex flex-wrap items-center gap-2">
          <input
            className={inputClass}
            placeholder="Search number or customer..."
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
            <option value="QUOTATION">Quotation</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ACTIVE">Active</option>
            <option value="CLOSED">Closed</option>
          </select>
          <button
            onClick={openTemplateModal}
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
          >
            <FileStack size={16} /> From template
          </button>
          <Link
            to="/subscriptions/new"
            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 whitespace-nowrap"
          >
            <Plus size={16} /> New subscription
          </Link>
        </div>
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
              <Link to={`/subscriptions/${r.id}`} className="font-mono text-indigo-600 hover:underline">
                {r.number}
              </Link>
            ),
          },
          { label: 'Customer', render: (r) => r.customer?.name || 'N/A' },
          { label: 'Plan', render: (r) => r.plan?.name || 'N/A' },
          { label: 'Start', render: (r) => r.startDate?.slice(0, 10) },
          { label: 'Expiry', render: (r) => r.expiryDate?.slice(0, 10) },
          { label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          {
            label: '',
            render: (r) => (
              <div className="flex justify-end">
                <Link to={`/subscriptions/${r.id}`} className="text-indigo-600 hover:underline text-xs">
                  View
                </Link>
              </div>
            ),
          },
        ]}
      />

      <Modal open={templateModal} title="Create Subscription From Template" onClose={() => setTemplateModal(false)}>
        <form onSubmit={handleTemplateSubmit} className="space-y-3">
          <FormField label="Quotation Template">
            <select
              className={inputClass}
              required
              value={templateForm.templateId}
              onChange={(e) => setTemplateForm({ ...templateForm, templateId: e.target.value })}
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (Plan: {t.plan?.name})
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Target Customer">
            <select
              className={inputClass}
              required
              value={templateForm.customerId}
              onChange={(e) => setTemplateForm({ ...templateForm, customerId: e.target.value })}
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Start Date">
            <input
              type="date"
              className={inputClass}
              required
              value={templateForm.startDate}
              onChange={(e) => setTemplateForm({ ...templateForm, startDate: e.target.value })}
            />
          </FormField>

          <FormField label="Payment Terms">
            <select
              className={inputClass}
              value={templateForm.paymentTerms}
              onChange={(e) => setTemplateForm({ ...templateForm, paymentTerms: e.target.value })}
            >
              <option value="IMMEDIATE">Immediate</option>
              <option value="NET_15">Net 15</option>
              <option value="NET_30">Net 30</option>
              <option value="NET_60">Net 60</option>
            </select>
          </FormField>

          {tplError && <p className="text-sm text-red-600">{tplError}</p>}
          <button className="w-full rounded-lg bg-indigo-600 py-2 text-white font-medium hover:bg-indigo-700 cursor-pointer">
            Create Subscription
          </button>
        </form>
      </Modal>
    </div>
  );
}
