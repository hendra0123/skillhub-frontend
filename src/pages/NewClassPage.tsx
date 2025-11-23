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
    <div className="page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2 className="page-title">New Class</h2>
          <p className="page-subtitle">
            Tambahkan kelas baru beserta deskripsi & instruktur.
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

      {/* CARD FORM */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 10 }}>
          Class Information
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
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
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClassPage;
