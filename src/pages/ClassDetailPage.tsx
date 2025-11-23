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
    return <div className="page">Loading...</div>;
  }

  const enrollments = form.enrollments || [];

  return (
    <div className="page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Class Detail</h2>
          <p className="page-subtitle">
            Informasi kelas dan peserta yang terdaftar.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => navigate('/classes')}
        >
          ← Back to List
        </button>
      </div>

      {/* ERROR */}
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

      {/* CARD: FORM EDIT KELAS */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 10 }}>
          Edit Class
        </div>

        <form onSubmit={handleSave} className="form-grid">
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nama kelas"
            />
          </div>

          {/* Instructor */}
          <div className="form-group">
            <label className="form-label">Instructor</label>
            <input
              className="input"
              value={form.instructor}
              onChange={(e) =>
                setForm({ ...form, instructor: e.target.value })
              }
              placeholder="Nama instruktur"
            />
          </div>

          {/* Description */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Description</label>
            <textarea
              className="input"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Deskripsi singkat kelas"
            />
          </div>

          {/* Status */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Status</label>
            <select
              className="select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="aktif">aktif</option>
              <option value="nonaktif">nonaktif</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="form-action-row">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              type="button"
              className="btn-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </form>
      </div>

      {/* CARD: PARTICIPANTS DI KELAS INI */}
      <div className="card">
        <div className="card-title">Participants in this Class</div>

        {enrollments.length === 0 ? (
          <p className="page-subtitle" style={{ fontSize: 12 }}>
            Belum ada peserta di kelas ini.
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Enrollment ID</th>
                  <th>NIM</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>

              <tbody>
                {enrollments.map((en) => (
                  <tr key={en.id}>
                    <td>{en.id}</td>
                    <td>{en.participant?.nim ?? '-'}</td>
                    <td>{en.participant?.full_name ?? '-'}</td>
                    <td>{en.participant?.email ?? '-'}</td>
                    <td>{en.participant?.phone ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetailPage;
