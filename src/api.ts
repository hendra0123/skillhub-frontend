const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function handleResponse(res: Response) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${res.status}`;
    throw new Error(Array.isArray(message) ? message.join(', ') : String(message));
  }

  return data;
}

export const api = {
  get: async (path: string) => {
    const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
    return handleResponse(res);
  },
  post: async (path: string, body: any) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },
  patch: async (path: string, body: any) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },
  delete: async (path: string) => {
    const res = await fetch(`${API_URL}${path}`, { method: 'DELETE' });
    return handleResponse(res);
  },
};
