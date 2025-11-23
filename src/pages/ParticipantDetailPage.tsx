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

      setForm({
        id: data.id,
        nim: data.nim,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
      });

      setEnrollments(data.enrollments || []);
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

    setSaving(true);
    setError(null);

    try {
      await api.patch(`/participants/${id}`, {
        nim: form.nim,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
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
    const ok = window.confirm('Yakin ingin menghapus peserta ini?');
    if (!ok) return;

    try {
      await api.delete(`/participants/${id}`);
      navigate('/participants');
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus peserta');
    }
  }

  if (loading || !form) {
    return <div className="page">Loading...</div>;
  }

  return (
    <div className="page">
      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Participant Detail</h2>
          <p className="page-subtitle">Informasi dan riwayat kelas peserta.</p>
        </div>

        <button className="btn-primary" onClick={() => navigate('/participants')}>
          ← Back to List
        </button>
      </div>

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

      {/* CARD: FORM UPDATE */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 10 }}>Edit Participant</div>

        <form className="form-grid" onSubmit={handleSave}>
          {/* NIM */}
          <div className="form-group">
            <label className="form-label">NIM</label>
            <input
              className="input"
              value={form.nim}
              onChange={(e) => setForm({ ...form, nim: e.target.value })}
            />
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="input"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

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

      {/* CARD: ENROLLMENTS */}
      <div className="card">
        <div className="card-title">Classes Enrolled</div>

        {enrollments.length === 0 ? (
          <p className="page-subtitle" style={{ fontSize: 12 }}>
            Peserta ini belum terdaftar di kelas mana pun.
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Enrollment ID</th>
                  <th>Class</th>
                  <th>Instructor</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {enrollments.map((en) => (
                  <tr key={en.id}>
                    <td>{en.id}</td>
                    <td>{en.classEntity?.name ?? '-'}</td>
                    <td>{en.classEntity?.instructor ?? '-'}</td>
                    <td>{en.classEntity?.status ?? '-'}</td>

                    <td>
                      <button
                        className="btn-link-danger"
                        onClick={async () => {
                          const ok = window.confirm(
                            'Yakin ingin membatalkan pendaftaran kelas ini?',
                          );
                          if (!ok) return;

                          try {
                            await api.delete(`/enrollments/${en.id}`);
                            await load();
                          } catch (err: any) {
                            alert(err.message || 'Gagal menghapus enrollment');
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantDetailPage;
