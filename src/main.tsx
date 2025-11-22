import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import ParticipantsPage from './pages/ParticipantsPage';
import NewParticipantPage from './pages/NewParticipantPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100">
        <header className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
          <h1 className="font-semibold text-sm">SkillHub Admin</h1>
          <nav className="flex gap-4 text-xs">
            <Link to="/participants">Participants</Link>
            <Link to="/classes">Classes</Link>
            <Link to="/enrollments">Enrollments</Link>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<div>Dashboard SkillHub</div>} />
            <Route path="/participants" element={<ParticipantsPage />} />
            <Route path="/participants/new" element={<NewParticipantPage />} />
            {/* nanti tambah:
              <Route path="/participants/:id" element={<ParticipantDetailPage />} />
              <Route path="/classes" ... />
            */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);