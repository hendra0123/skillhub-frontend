import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const NewParticipantPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nim: '',
    full_name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post('/participants', form);
      navigate('/participants');
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-lg font-semibold">New Participant</h2>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-3 bg-white p-4 rounded border border-slate-200"
      >
        <div className="space-y-1 text-sm">
          <label className="block font-medium">NIM</label>
          <input
            className="w-full border rounded px-2 py-1.5 text-sm"
            value={form.nim}
            onChange={(e) => setForm({ ...form, nim: e.target.value })}
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="block font-medium">Full Name</label>
          <input
            className="w-full border rounded px-2 py-1.5 text-sm"
            value={form.full_name}
            onChange={(e) =>
              setForm({ ...form, full_name: e.target.value })
            }
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="block font-medium">Email</label>
          <input
            className="w-full border rounded px-2 py-1.5 text-sm"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="block font-medium">Phone</label>
          <input
            className="w-full border rounded px-2 py-1.5 text-sm"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1.5 rounded bg-slate-900 text-white text-sm disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default NewParticipantPage;
