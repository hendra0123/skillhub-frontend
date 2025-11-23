import { NavLink, Routes, Route } from 'react-router-dom';
import ParticipantsPage from './pages/ParticipantsPage';
import NewParticipantPage from './pages/NewParticipantPage';
import ParticipantDetailPage from './pages/ParticipantDetailPage';
import ClassesPage from './pages/ClassesPage';
import NewClassPage from './pages/NewClassPage';
import ClassDetailPage from './pages/ClassDetailPage';
import NewEnrollmentPage from './pages/NewEnrollmentPage';
import './App.css';

function App() {
  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-title">
            SkillHub <span className="sidebar-title-accent">Admin</span>
          </span>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              'nav-link' + (isActive ? ' nav-link-active' : '')
            }
          >
            Dashboard
          </NavLink>

          <div className="nav-section-title">Management</div>

          <NavLink
            to="/participants"
            className={({ isActive }) =>
              'nav-link' + (isActive ? ' nav-link-active' : '')
            }
          >
            Participants
          </NavLink>

          <NavLink
            to="/classes"
            className={({ isActive }) =>
              'nav-link' + (isActive ? ' nav-link-active' : '')
            }
          >
            Classes
          </NavLink>

          <NavLink
            to="/enrollments/new"
            className={({ isActive }) =>
              'nav-link' + (isActive ? ' nav-link-active' : '')
            }
          >
            New Enrollment
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          © {new Date().getFullYear()} SkillHub
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="main-area">
        <header className="topbar">
          <div>
            <h1 className="topbar-title">Admin Dashboard</h1>
            <p className="topbar-subtitle">
              Manage participants, classes, and enrollments
            </p>
          </div>
          <div className="topbar-badge">Certification Project</div>
        </header>

        <main className="page-content">
          <Routes>
            {/* Dashboard */}
            <Route
              path="/"
              element={
                <div className="page">
                  <div className="page-header">
                    <div>
                      <h2 className="page-title">Overview</h2>
                      <p className="page-subtitle">
                        Pilih menu di sidebar untuk mengelola data.
                      </p>
                    </div>
                  </div>

                  <div className="grid-3">
                    <div className="card">
                      <div className="card-title">Participants</div>
                      <div className="card-text">
                        CRUD data peserta + pencarian.
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-title">Classes</div>
                      <div className="card-text">
                        Pengelolaan kelas dan instruktur.
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-title">Enrollments</div>
                      <div className="card-text">
                        Pendaftaran peserta ke satu atau banyak kelas.
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

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
    </div>
  );
}

export default App;
