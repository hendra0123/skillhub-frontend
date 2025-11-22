import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

type ParticipantLite = {
  id: number;
  nim: string;
  full_name: string;
  email: string;
  phone: string;
};

type Enrollment = {
  id: number;
  participant: ParticipantLite;
};

type ClassDetail = {
  id: number;
  name: string;
  description: string;
  instructor: string;
  status: string;
  enrollments?: Enrollment[];
};

const ClassDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!id) return;
    setError(null);
    setLoading(true);
    try {
      const data: ClassDetail = await api.get(`/classes/${id}`);
      setForm(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data kelas');
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
      await api.patch(`/classes/${id}`, {
        name: form.name,
        description: form.description,
        instructor: form.instructor,
        status: form.status,
      });
      await load();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!id) return;
    const ok = window.confirm('Yakin ingin menghapus kelas ini?');
    if (!ok) return;

    setError(null);
    try {
      await api.delete(`/classes/${id}`);
      navigate('/classes');
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus kelas');
    }
  }

  if (loading || !form) {
    return <div className="text-sm text-slate-300">Loading...</div>;
  }

  const enrollments = form.enrollments || [];

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Class Detail</h2>
        <button
          onClick={() => navigate('/classes')}
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

      {/* Peserta di kelas ini */}
      <div className="bg-slate-900 p-4 rounded border border-slate-700 space-y-2">
        <h3 className="text-sm font-semibold">Participants in this class</h3>
        {enrollments.length === 0 ? (
          <p className="text-xs text-slate-400">
            Belum ada peserta di kelas ini.
          </p>
        ) : (
          <table className="w-full text-xs border border-slate-700 rounded">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-2 py-1 text-left">ID</th>
                <th className="px-2 py-1 text-left">NIM</th>
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1 text-left">Email</th>
                <th className="px-2 py-1 text-left">Phone</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((en) => (
                <tr key={en.id} className="border-t border-slate-700">
                  <td className="px-2 py-1">
                    {en.participant?.id ?? '-'}
                  </td>
                  <td className="px-2 py-1">
                    {en.participant?.nim ?? '-'}
                  </td>
                  <td className="px-2 py-1">
                    {en.participant?.full_name ?? '-'}
                  </td>
                  <td className="px-2 py-1">
                    {en.participant?.email ?? '-'}
                  </td>
                  <td className="px-2 py-1">
                    {en.participant?.phone ?? '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClassDetailPage;
