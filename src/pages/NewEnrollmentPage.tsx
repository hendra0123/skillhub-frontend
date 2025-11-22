import React, { useEffect, useState } from 'react';
import { api } from '../api';

type Participant = {
  id: number;
  nim: string;
  full_name: string;
};

type ClassEntity = {
  id: number;
  name: string;
};

const NewEnrollmentPage: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [participantId, setParticipantId] = useState<string>('');
  const [classId, setClassId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadOptions() {
    try {
      setLoading(true);
      setError(null);

      const [p, c] = await Promise.all([
        api.get('/participants'),
        api.get('/classes'),
      ]);

      setParticipants(p);
      setClasses(c);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data peserta/kelas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOptions();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!participantId || !classId) {
      setError('Participant dan Class wajib dipilih.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/enrollments', {
        participant_id: Number(participantId),
        class_id: Number(classId),
      });
      setSuccess('Pendaftaran peserta ke kelas berhasil.');
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftarkan peserta ke kelas');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="text-sm text-slate-300">Loading...</div>;
  }

  return (
    <div className="max-w-lg space-y-4">
      <h2 className="text-2xl font-semibold">New Enrollment</h2>

      <p className="text-xs text-slate-300">
        Pilih satu peserta dan satu kelas, lalu simpan untuk mencatat
        pendaftaran.
      </p>

      {error && (
        <div className="text-sm text-red-300 bg-red-900/30 border border-red-500 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-emerald-300 bg-emerald-900/30 border border-emerald-500 px-3 py-2 rounded">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-3 bg-slate-900 p-4 rounded border border-slate-700"
      >
        <div className="space-y-1 text-sm">
          <label className="block font-medium">Participant</label>
          <select
            className="w-full border border-slate-600 bg-slate-950 rounded px-2 py-1.5 text-sm"
            value={participantId}
            onChange={(e) => setParticipantId(e.target.value)}
          >
            <option value="">-- Pilih participant --</option>
            {participants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nim} - {p.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1 text-sm">
          <label className="block font-medium">Class</label>
          <select
            className="w-full border border-slate-600 bg-slate-950 rounded px-2 py-1.5 text-sm"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            <option value="">-- Pilih class --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Save Enrollment'}
        </button>
      </form>
    </div>
  );
};

export default NewEnrollmentPage;
