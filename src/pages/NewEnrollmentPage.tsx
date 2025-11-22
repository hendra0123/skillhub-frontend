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
  instructor: string;
};

const NewEnrollmentPage: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [classes, setClasses] = useState<ClassEntity[]>([]);

  const [participantId, setParticipantId] = useState<string>('');
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);

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

  function toggleClassSelection(id: number) {
    setSelectedClassIds((prev) =>
      prev.includes(String(id))
        ? prev.filter((x) => x !== String(id))
        : [...prev, String(id)],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!participantId) {
      setError('Participant wajib dipilih.');
      return;
    }
    if (selectedClassIds.length === 0) {
      setError('Minimal pilih satu kelas.');
      return;
    }

    setSubmitting(true);
    try {
      // Kirim beberapa POST /enrollments sekaligus
      await Promise.all(
        selectedClassIds.map((classId) =>
          api.post('/enrollments', {
            participant_id: Number(participantId),
            class_id: Number(classId),
          }),
        ),
      );

      setSuccess(
        `Berhasil mendaftarkan participant ke ${selectedClassIds.length} kelas.`,
      );
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftarkan participant ke kelas');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="text-sm text-slate-300">Loading...</div>;
  }

  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="text-2xl font-semibold">New Enrollment</h2>

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
        className="space-y-4 bg-slate-900 p-4 rounded border border-slate-700"
      >
        {/* Participant */}
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

        {/* Kelas (multi via checkbox) */}
        <div className="space-y-2 text-sm">
          <label className="block font-medium">Classes</label>
          <div className="grid md:grid-cols-2 gap-2">
            {classes.map((cls) => {
              const checked = selectedClassIds.includes(String(cls.id));
              return (
                <label
                  key={cls.id}
                  className="flex items-start gap-2 border border-slate-700 rounded px-2 py-1.5 bg-slate-950 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={checked}
                    onChange={() => toggleClassSelection(cls.id)}
                  />
                  <div>
                    <div className="font-medium text-xs">{cls.name}</div>
                    <div className="text-[11px] text-slate-400">
                      Instructor: {cls.instructor || '-'}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
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
