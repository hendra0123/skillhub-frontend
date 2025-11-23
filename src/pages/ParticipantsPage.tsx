import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

type Participant = {
  id: number;
  nim: string;
  full_name: string;
  email: string;
  phone: string;
};

type SearchField = 'all' | 'nim' | 'full_name' | 'email' | 'phone';

const ParticipantsPage: React.FC = () => {
  const [data, setData] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [searchField, setSearchField] = useState<SearchField>('all');

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/participants');
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredData = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data;

    return data.filter((p) => {
      const fields = {
        nim: p.nim?.toLowerCase() ?? '',
        full_name: p.full_name?.toLowerCase() ?? '',
        email: p.email?.toLowerCase() ?? '',
        phone: p.phone?.toLowerCase() ?? '',
      };

      if (searchField === 'all') {
        return (
          fields.nim.includes(term) ||
          fields.full_name.includes(term) ||
          fields.email.includes(term) ||
          fields.phone.includes(term)
        );
      }

      return fields[searchField].includes(term);
    });
  }, [data, search, searchField]);

  return (
    <div className="page">
      {/* Header + tombol tambah */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Participants</h2>
          <p className="page-subtitle">
            Daftar peserta yang terdaftar di SkillHub.
          </p>
        </div>
        <Link to="/participants/new" className="btn-primary">
          + New Participant
        </Link>
      </div>

      <div className="table-card">
        {/* Search + filter */}
        <div className="filters-row">
          <label htmlFor="field-select">Search by</label>
          <select
            id="field-select"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as SearchField)}
            className="select"
          >
            <option value="all">All fields</option>
            <option value="nim">NIM</option>
            <option value="full_name">Name</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>

          <input
            type="text"
            placeholder="Ketik kata kunci..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ minWidth: 200, flex: 1 }}
          />
        </div>

        {error && (
          <div
            style={{
              fontSize: 12,
              color: '#fecaca',
              backgroundColor: '#7f1d1d',
              padding: '6px 8px',
              borderRadius: 6,
              marginBottom: 8,
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ fontSize: 13 }}>Loading...</div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NIM</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nim}</td>
                    <td>{p.full_name}</td>
                    <td>{p.email}</td>
                    <td>{p.phone}</td>
                    <td>
                      <Link to={`/participants/${p.id}`}>Detail</Link>
                    </td>
                  </tr>
                ))}

                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="table-empty">
                      Tidak ada peserta yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantsPage;
