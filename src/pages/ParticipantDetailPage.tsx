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

type EnrollmentClass = {
  id: number;
  name: string;
  description: string;
  instructor: string;
  status: string;
};

type Enrollment = {
  id: number;
  classEntity: EnrollmentClass | null;
};

type ParticipantDetail = Participant & {
  enrollments?: Enrollment[];
};

const ParticipantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Participant | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!id) return;
    setError(null);
    setLoading(true);
    try {
      const data: ParticipantDetail = await api.get(`/participants/${id}`);

      // isi form basic participant
      setForm({
        id: data.id,
        nim: data.nim,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
      });

      // isi enrollments (kalau ada)
      setEnrollments(data.enrollments || []);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data peserta');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return <div className="text-sm text-slate-300">Loading...</div>;
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

      {/* FORM UPDATE PARTICIPANT */}
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

      {/* TABEL KELAS YANG DIIKUTI PESERTA */}
      <div className="bg-slate-900 p-4 rounded border border-slate-700 space-y-2">
        <h3 className="text-sm font-semibold">Classes Enrolled</h3>
        {enrollments.length === 0 ? (
          <p className="text-xs text-slate-400">
            Peserta ini belum terdaftar di kelas mana pun.
          </p>
        ) : (
          <table className="w-full text-xs border border-slate-700 rounded">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-2 py-1 text-left">Enrollment ID</th>
                <th className="px-2 py-1 text-left">Class Name</th>
                <th className="px-2 py-1 text-left">Instructor</th>
                <th className="px-2 py-1 text-left">Status</th>
                <th className="px-2 py-1 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((en) => (
                <tr key={en.id} className="border-t border-slate-700">
                  <td className="px-2 py-1">{en.id}</td>
                  <td className="px-2 py-1">
                    {en.classEntity?.name ?? 'Unnamed class'}
                  </td>
                  <td className="px-2 py-1">
                    {en.classEntity?.instructor ?? '-'}
                  </td>
                  <td className="px-2 py-1">
                    {en.classEntity?.status ?? '-'}
                  </td>
                  <td className="px-2 py-1">
                    <button
                      type="button"
                      className="text-[11px] text-red-300 underline"
                      onClick={async () => {
                        const ok = window.confirm(
                          'Yakin ingin membatalkan pendaftaran peserta dari kelas ini?',
                        );
                        if (!ok) return;
                        try {
                          await api.delete(`/enrollments/${en.id}`);
                          await load(); // refresh data setelah delete
                        } catch (err: any) {
                          alert(
                            err.message || 'Gagal menghapus enrollment',
                          );
                        }
                      }}
                    >
                      Remove
                    </button>
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

export default ParticipantDetailPage;
