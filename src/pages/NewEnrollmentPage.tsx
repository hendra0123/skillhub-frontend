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
      setError(err.message || 'Gagal memuat data peserta & kelas.');
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
        : [...prev, String(id)]
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
      await Promise.all(
        selectedClassIds.map((classId) =>
          api.post('/enrollments', {
            participant_id: Number(participantId),
            class_id: Number(classId),
          })
        )
      );

      setSuccess(
        `Berhasil mendaftarkan participant ke ${selectedClassIds.length} kelas.`
      );
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftarkan participant ke kelas.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  return (
    <div className="page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2 className="page-title">New Enrollment</h2>
          <p className="page-subtitle">
            Pilih participant & kelas yang ingin di-enroll.
          </p>
        </div>
      </div>

      {/* ALERTS */}
      {error && (
        <div
          style={{
            background: '#7f1d1d',
            color: '#fecaca',
            padding: '8px 10px',
            borderRadius: 6,
            border: '1px solid #dc2626',
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            background: '#064e3b',
            color: '#a7f3d0',
            padding: '8px 10px',
            borderRadius: 6,
            border: '1px solid #10b981',
            fontSize: 13,
          }}
        >
          {success}
        </div>
      )}

      {/* CARD */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 10 }}>
          Enrollment Form
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          {/* PARTICIPANT */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Participant</label>
            <select
              className="select"
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

          {/* CLASSES (MULTI SELECT CHECKBOX GRID) */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Classes</label>

            <div className="checkbox-grid">
              {classes.map((cls) => {
                const checked = selectedClassIds.includes(String(cls.id));

                return (
                  <label key={cls.id} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleClassSelection(cls.id)}
                    />

                    <div className="checkbox-text">
                      <div className="checkbox-title">{cls.name}</div>
                      <div className="checkbox-sub">
                        Instructor: {cls.instructor || '-'}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* SUBMIT ROW */}
          <div className="form-action-row">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Enrollment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEnrollmentPage;
