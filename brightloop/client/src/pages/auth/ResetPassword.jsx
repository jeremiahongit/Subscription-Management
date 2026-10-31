import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { api } from '../../api/client';
import { isStrongPassword } from '../../utils/validators';
import FormField, { inputClass } from '../../components/FormField';
import PasswordChecklist from '../../components/PasswordChecklist';

export default function ResetPassword() {
  const navigate = useNavigate();
  const token = new URLSearchParams(useLocation().search).get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-sm text-red-600 mb-4">Invalid or missing reset token.</p>
          <Link to="/login" className="text-sm font-medium text-indigo-600 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isStrongPassword(password)) return setError('Password does not meet requirements');
    if (password !== confirm) return setError('Passwords do not match');

    setBusy(true);
    try {
      const res = await api('/auth/reset-password', { method: 'POST', body: { token, password } });
      setSuccess(res.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-indigo-600">Brightloop</h1>
        <p className="mb-5 text-sm text-slate-500">Set a new password</p>

        {success ? (
          <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
            {success} Redirecting to login...
          </div>
        ) : (
          <>
            <FormField label="New Password">
              <input
                type="password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </FormField>
            <PasswordChecklist password={password} />
            <FormField label="Confirm Password">
              <input
                type="password"
                className={inputClass}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
              />
            </FormField>
            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
            <button
              disabled={busy}
              className="w-full rounded-lg bg-indigo-600 py-2 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {busy ? 'Updating password...' : 'Update password'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
