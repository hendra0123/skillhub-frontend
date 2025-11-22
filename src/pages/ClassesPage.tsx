import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

type ClassEntity = {
  id: number;
  name: string;
  description: string;
  instructor: string;
  status: string;
};

const ClassesPage: React.FC = () => {
  const [data, setData] = useState<ClassEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Classes</h2>
        <Link
          to="/classes/new"
          className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm"
        >
          + New Class
        </Link>
      </div>

      {error && (
        <div className="text-sm text-red-300 bg-red-900/30 border border-red-500 px-3 py-2 rounded">
          {error}
        </div>
      )}

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
            {data.map((c) => (
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

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-4 text-center text-slate-400 text-sm"
                >
                  Belum ada kelas.
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
