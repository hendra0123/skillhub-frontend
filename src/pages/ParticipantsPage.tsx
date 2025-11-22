import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

type Participant = {
  id: number;
  nim: string;
  full_name: string;
  email: string;
  phone: string;
};

const ParticipantsPage: React.FC = () => {
  const [data, setData] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Participants</h2>
        <Link
          to="/participants/new"
          className="px-3 py-1.5 rounded bg-slate-900 text-white text-xs"
        >
          + New Participant
        </Link>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-slate-600">Loading...</div>
      ) : (
        <table className="w-full text-sm bg-white border border-slate-200 rounded">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">NIM</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Phone</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id} className="border-t border-slate-200">
                <td className="px-3 py-2">{p.id}</td>
                <td className="px-3 py-2">{p.nim}</td>
                <td className="px-3 py-2">{p.full_name}</td>
                <td className="px-3 py-2">{p.email}</td>
                <td className="px-3 py-2">{p.phone}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-4 text-center text-slate-500 text-xs"
                >
                  Belum ada peserta.
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
