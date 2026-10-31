import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import FormField, { inputClass } from '../../components/FormField';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api('/auth/forgot-password', { method: 'POST', body: { email } });
      setMessage(res.message);
    } catch (err) {
      setMessage('If that email is registered, a reset link has been sent.');
    }
    setBusy(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-indigo-600">Brightloop</h1>
        <p className="mb-5 text-sm text-slate-500">Reset your password</p>

        {message ? (
          <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
            <p>{message}</p>
            <Link to="/login" className="mt-4 block font-medium text-indigo-600 hover:underline">
              Return to log in
            </Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <FormField label="Email address">
              <input
                type="email"
                required
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </FormField>
            <button
              disabled={busy}
              className="w-full rounded-lg bg-indigo-600 py-2 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {busy ? 'Sending...' : 'Send reset link'}
            </button>
            <div className="mt-4 text-center text-sm">
              <Link to="/login" className="text-indigo-600 hover:underline">
                Back to log in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
