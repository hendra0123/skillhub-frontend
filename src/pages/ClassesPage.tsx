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

  // 🔍 Filter client-side
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
    <div className="space-y-4">
      {/* Header + tombol tambah */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Classes</h2>
        <Link
          to="/classes/new"
          className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm"
        >
          + New Class
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
            <option value="name">Name</option>
            <option value="instructor">Instructor</option>
            <option value="status">Status</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Ketik kata kunci kelas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] border border-slate-600 bg-slate-900 text-xs px-2 py-1.5 rounded"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-300 bg-red-900/30 border border-red-500 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {/* Tabel */}
      {loading ? (
        <div className="text-sm text-slate-300">Loading...</div>
      ) : (
        <table className="w-full text-sm bg-slate-900 border border-slate-700 rounded">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Instructor</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((c) => (
              <tr key={c.id} className="border-t border-slate-700">
                <td className="px-3 py-1.5">{c.id}</td>
                <td className="px-3 py-1.5">{c.name}</td>
                <td className="px-3 py-1.5">{c.instructor}</td>
                <td className="px-3 py-1.5">{c.status}</td>
                <td className="px-3 py-1.5">
                  <Link
                    to={`/classes/${c.id}`}
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
                  colSpan={5}
                  className="px-3 py-4 text-center text-slate-400 text-sm"
                >
                  Tidak ada kelas yang cocok dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClassesPage;
