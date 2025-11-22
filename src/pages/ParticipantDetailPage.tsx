import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

type Participant = {
  id: number;
  nim: string;
  full_name: string;
  email: string;
  phone: string;
};

const ParticipantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!id) return;
    setError(null);
    setLoading(true);
    try {
      const data: Participant = await api.get(`/participants/${id}`);
      setForm(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data peserta');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !form) return;

    setError(null);
    setSaving(true);
    try {
      await api.patch(`/participants/${id}`, {
        nim: form.nim,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
      });
      await load(); // refresh data setelah update
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!id) return;
    const ok = window.confirm('Yakin ingin menghapus peserta ini?');
    if (!ok) return;

    setError(null);
    try {
      await api.delete(`/participants/${id}`);
      navigate('/participants');
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus peserta');
    }
  }

  if (loading || !form) {
    return <div className="text-sm">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Participant Detail</h2>
        <button
          onClick={() => navigate('/participants')}
          className="text-sm underline"
        >
          ← Back to list
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-300 bg-red-900/30 border border-red-500 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="space-y-3 bg-slate-800 p-4 rounded border border-slate-700"
      >
        <div className="space-y-1 text-sm">
          <label className="block font-medium">NIM</label>
          <input
            className="w-full border rounded px-2 py-1.5 text-sm text-black"
            value={form.nim}
            onChange={(e) => setForm({ ...form, nim: e.target.value })}
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="block font-medium">Full Name</label>
          <input
            className="w-full border rounded px-2 py-1.5 text-sm text-black"
            value={form.full_name}
            onChange={(e) =>
              setForm({ ...form, full_name: e.target.value })
            }
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="block font-medium">Email</label>
          <input
            className="w-full border rounded px-2 py-1.5 text-sm text-black"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="block font-medium">Phone</label>
          <input
            className="w-full border rounded px-2 py-1.5 text-sm text-black"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="px-3 py-1.5 rounded border border-red-500 text-red-400 text-sm"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParticipantDetailPage;
