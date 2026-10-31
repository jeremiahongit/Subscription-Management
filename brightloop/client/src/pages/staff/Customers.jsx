import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../../api/client';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import FormField, { inputClass } from '../../components/FormField';
import PasswordChecklist from '../../components/PasswordChecklist';
import { isEmail, isStrongPassword } from '../../utils/validators';

const empty = { name: '', email: '', password: '' };

export default function Customers() {
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  const load = () =>
    api(`/users?role=CUSTOMER&page=${page}&search=${encodeURIComponent(search)}`).then(setData).catch(() => {});

  useEffect(() => {
    load();
  }, [page, search]);

  const save = async (e) => {
    e.preventDefault();
    setError('');
    if (!isEmail(form.email)) return setError('Enter a valid email address');
    if (!isStrongPassword(form.password)) return setError('Password does not meet requirements');

    try {
      await api('/users/customers', { method: 'POST', body: form });
      setForm(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">Customers</h2>
        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="Search customers..."
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
            <Plus size={16} /> New Customer
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
          { label: 'Email', key: 'email' },
          { label: 'Joined', render: (r) => r.createdAt?.slice(0, 10) },
        ]}
      />

      <Modal open={!!form} title="Add Customer Account" onClose={() => setForm(null)}>
        {form && (
          <form onSubmit={save} className="space-y-3">
            <FormField label="Customer / Company Name">
              <input
                className={inputClass}
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Acme Corp"
              />
            </FormField>
            <FormField label="Work Email">
              <input
                type="email"
                className={inputClass}
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="billing@acme.com"
              />
            </FormField>
            <FormField label="Temporary Password">
              <input
                type="password"
                className={inputClass}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </FormField>
            <PasswordChecklist password={form.password} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="w-full rounded-lg bg-indigo-600 py-2 text-white font-medium hover:bg-indigo-700 cursor-pointer">
              Create Customer
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
