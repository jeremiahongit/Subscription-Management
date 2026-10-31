const BASE = 'http://localhost:5000/api';

export async function api(path, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  // expired or invalid session: send them to login (except login itself)
  if (res.status === 401 && !path.startsWith('/auth/')) {
    localStorage.clear();
    window.location = '/login';
    throw new Error('Session expired');
  }

  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
