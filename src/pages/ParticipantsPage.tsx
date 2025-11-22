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

  // 🔍 Filter client-side
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
    <div className="space-y-4">
      {/* Header + tombol tambah */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Participants</h2>
        <Link
          to="/participants/new"
          className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm"
        >
          + New Participant
        </Link>
      </div>

      {/* 🔍 Search bar + filter dropdown */}
      <div className="flex flex-wrap gap-3 items-center text-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300">Search by</span>
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as SearchField)}
            className="border border-slate-600 bg-slate-900 text-xs px-2 py-1 rounded"
          >
            <option value="all">All fields</option>
            <option value="nim">NIM</option>
            <option value="full_name">Name</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Ketik kata kunci..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] border border-slate-600 bg-slate-900 text-xs px-2 py-1.5 rounded"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-300 bg-red-900/30 border border-red-500 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {/* Tabel data */}
      {loading ? (
        <div className="text-sm text-slate-300">Loading...</div>
      ) : (
        <table className="w-full text-sm bg-slate-900 border border-slate-700 rounded">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">NIM</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Phone</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((p) => (
              <tr key={p.id} className="border-t border-slate-700">
                <td className="px-3 py-1.5">{p.id}</td>
                <td className="px-3 py-1.5">{p.nim}</td>
                <td className="px-3 py-1.5">{p.full_name}</td>
                <td className="px-3 py-1.5">{p.email}</td>
                <td className="px-3 py-1.5">{p.phone}</td>
                <td className="px-3 py-1.5">
                  <Link
                    to={`/participants/${p.id}`}
                    className="text-xs text-blue-300 underline"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-4 text-center text-slate-400 text-sm"
                >
                  Tidak ada peserta yang cocok dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ParticipantsPage;
