import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const NewParticipantPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nim: '',
    full_name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post('/participants', form);
      navigate('/participants');
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2 className="page-title">New Participant</h2>
          <p className="page-subtitle">
            Tambahkan peserta baru ke sistem SkillHub.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => navigate('/participants')}
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

      {/* FORM CARD */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 10 }}>
          Participant Information
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          {/* NIM */}
          <div className="form-group">
            <label className="form-label">NIM</label>
            <input
              className="input"
              value={form.nim}
              onChange={(e) => setForm({ ...form, nim: e.target.value })}
              placeholder="Masukkan NIM"
            />
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="input"
              value={form.full_name}
              onChange={(e) =>
                setForm({ ...form, full_name: e.target.value })
              }
              placeholder="Nama lengkap"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div className="form-action-row">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Participant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewParticipantPage;
