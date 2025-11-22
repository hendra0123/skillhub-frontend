import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const NewClassPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    instructor: '',
    status: 'aktif',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post('/classes', form);
      navigate('/classes');
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan kelas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-2xl font-semibold">New Class</h2>

      {error && (
        <div className="text-sm text-red-300 bg-red-900/30 border border-red-500 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-3 bg-slate-900 p-4 rounded border border-slate-700"
      >
        <div className="space-y-1 text-sm">
          <label className="block font-medium">Name</label>
          <input
            className="w-full border border-slate-600 rounded px-2 py-1.5 text-sm text-black"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="block font-medium">Description</label>
          <textarea
            className="w-full border border-slate-600 rounded px-2 py-1.5 text-sm text-black"
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="block font-medium">Instructor</label>
          <input
            className="w-full border border-slate-600 rounded px-2 py-1.5 text-sm text-black"
            value={form.instructor}
            onChange={(e) =>
              setForm({ ...form, instructor: e.target.value })
            }
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="block font-medium">Status</label>
          <select
            className="w-full border border-slate-600 rounded px-2 py-1.5 text-sm text-black"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="aktif">aktif</option>
            <option value="nonaktif">nonaktif</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default NewClassPage;
