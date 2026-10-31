import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '../../api/client';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import FormField, { inputClass } from '../../components/FormField';
import PasswordChecklist from '../../components/PasswordChecklist';
import { isEmail, isStrongPassword } from '../../utils/validators';

const empty = { name: '', email: '', password: '' };

export default function Staff() {
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  const load = () =>
    api(`/users?role=STAFF&page=${page}&search=${encodeURIComponent(search)}`).then(setData).catch(() => {});

  useEffect(() => {
    load();
  }, [page, search]);

  const save = async (e) => {
    e.preventDefault();
    setError('');
    if (!isEmail(form.email)) return setError('Enter a valid email address');
    if (!isStrongPassword(form.password)) return setError('Password does not meet requirements');

    try {
      await api('/users/staff', { method: 'POST', body: form });
      setForm(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Remove this staff member?')) return;
    try {
      await api(`/users/staff/${id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">Internal Staff</h2>
        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="Search staff..."
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
            <Plus size={16} /> Add Staff
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
          {
            label: '',
            render: (r) => (
              <div className="flex justify-end">
                <button className="text-red-600 hover:text-red-700 cursor-pointer" onClick={() => remove(r.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ),
          },
        ]}
      />

      <Modal open={!!form} title="Add Staff Member" onClose={() => setForm(null)}>
        {form && (
          <form onSubmit={save} className="space-y-3">
            <FormField label="Full Name">
              <input
                className={inputClass}
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Staff"
              />
            </FormField>
            <FormField label="Staff Email">
              <input
                type="email"
                className={inputClass}
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@brightloop.com"
              />
            </FormField>
            <FormField label="Initial Password">
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
              Create Staff Member
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
