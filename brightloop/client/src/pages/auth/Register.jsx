import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { homeFor } from '../../routes/ProtectedRoute';
import { isEmail, isStrongPassword } from '../../utils/validators';
import FormField, { inputClass } from '../../components/FormField';
import PasswordChecklist from '../../components/PasswordChecklist';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.name.trim().length < 2) return setError('Name must be at least 2 characters');
    if (!isEmail(form.email)) return setError('Enter a valid email address');
    if (!isStrongPassword(form.password)) return setError('Password does not meet the requirements');
    if (form.password !== form.confirm) return setError('Passwords do not match');

    setBusy(true);
    try {
      const { token, user } = await api('/auth/register', {
        method: 'POST',
        body: { name: form.name, email: form.email, password: form.password },
      });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate(homeFor(user.role), { replace: true });
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-indigo-600">Brightloop</h1>
        <p className="mb-5 text-sm text-slate-500">Create your customer account</p>
        <FormField label="Full Name">
          <input
            type="text"
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Jane Doe"
          />
        </FormField>
        <FormField label="Email">
          <input
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="jane@example.com"
          />
        </FormField>
        <FormField label="Password">
          <input
            type="password"
            className={inputClass}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </FormField>
        <PasswordChecklist password={form.password} />
        <FormField label="Confirm Password">
          <input
            type="password"
            className={inputClass}
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            placeholder="••••••••"
          />
        </FormField>
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <button
          disabled={busy}
          className="w-full rounded-lg bg-indigo-600 py-2 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {busy ? 'Creating account...' : 'Create account'}
        </button>
        <div className="mt-4 text-center text-sm">
          <span className="text-slate-500">Already have an account? </span>
          <Link to="/login" className="text-indigo-600 hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
