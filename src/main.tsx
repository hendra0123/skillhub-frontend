import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import ParticipantsPage from './pages/ParticipantsPage';
import NewParticipantPage from './pages/NewParticipantPage';
import ParticipantDetailPage from './pages/ParticipantDetailPage';
import ClassesPage from './pages/ClassesPage';
import NewClassPage from './pages/NewClassPage';
import ClassDetailPage from './pages/ClassDetailPage';
import NewEnrollmentPage from './pages/NewEnrollmentPage';
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-white">
        <header className="px-6 py-4 border-b border-slate-700">
          <h1 className="text-4xl font-bold mb-2">SkillHub Admin</h1>
          <nav className="flex gap-4 text-sm">
            <Link to="/participants">Participants</Link>
            <Link to="/classes">Classes</Link>
            <Link to="/enrollments/new">Enrollments</Link>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto p-6">
          <Routes>
  <Route path="/" element={<div>Dashboard</div>} />

  {/* Participants */}
  <Route path="/participants" element={<ParticipantsPage />} />
  <Route path="/participants/new" element={<NewParticipantPage />} />
  <Route path="/participants/:id" element={<ParticipantDetailPage />} />

  {/* Classes */}
  <Route path="/classes" element={<ClassesPage />} />
  <Route path="/classes/new" element={<NewClassPage />} />
  <Route path="/classes/:id" element={<ClassDetailPage />} />

  {/* Enrollments */}
  <Route path="/enrollments/new" element={<NewEnrollmentPage />} />

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
