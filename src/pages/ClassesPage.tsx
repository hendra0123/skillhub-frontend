import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

type ClassEntity = {
  id: number;
  name: string;
  description: string;
  instructor: string;
  status: string;
};

type SearchField = 'all' | 'name' | 'instructor' | 'status';

const ClassesPage: React.FC = () => {
  const [data, setData] = useState<ClassEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [searchField, setSearchField] = useState<SearchField>('all');

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get('/classes');
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data kelas');
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

    return data.filter((c) => {
      const fields = {
        name: c.name?.toLowerCase() ?? '',
        instructor: c.instructor?.toLowerCase() ?? '',
        status: c.status?.toLowerCase() ?? '',
      };

      if (searchField === 'all') {
        return (
          fields.name.includes(term) ||
          fields.instructor.includes(term) ||
          fields.status.includes(term)
        );
      }

      return fields[searchField].includes(term);
    });
  }, [data, search, searchField]);

  return (
    <div className="page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Classes</h2>
          <p className="page-subtitle">
            Daftar semua kelas yang tersedia di SkillHub.
          </p>
        </div>

        <Link to="/classes/new" className="btn-primary">
          + New Class
        </Link>
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

      {/* CARD WRAPPER */}
      <div className="card">
        {/* FILTERS */}
        <div className="filters-row" style={{ marginBottom: 12 }}>
          <label>Search by</label>

          <select
            className="select"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as SearchField)}
            style={{ width: 140 }}
          >
            <option value="all">All fields</option>
            <option value="name">Name</option>
            <option value="instructor">Instructor</option>
            <option value="status">Status</option>
          </select>

          <input
            type="text"
            className="input"
            placeholder="Ketik kata kunci..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
          />
        </div>

        {/* TABLE */}
        {loading ? (
          <div style={{ fontSize: 13 }}>Loading...</div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Class Name</th>
                  <th>Instructor</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.instructor}</td>
                    <td>{c.status}</td>
                    <td>
                      <Link to={`/classes/${c.id}`} className="btn-link">
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="table-empty">
                      Tidak ada kelas yang cocok dengan filter.
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

export default ClassesPage;
