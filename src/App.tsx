import React, { useState } from 'react';
import { Microscope, AlertCircle, Calendar, Clock, Users, FlaskRound, FileText, Bell } from 'lucide-react';
import { authorizedUsers } from './users';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<typeof authorizedUsers[0] | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = authorizedUsers.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  if (isLoggedIn && currentUser) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="header">
          <div className="header-content">
            <div className="header-logo">
              <Microscope size={32} />
              <h1 className="header-title">MediPath Lab Portal</h1>
            </div>
            <div className="user-info">
              <span>{currentUser.name}</span>
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setCurrentUser(null);
                  setUsername('');
                  setPassword('');
                }}
                className="logout-btn"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="main-content">
          <section className="welcome-section">
            <h2 className="welcome-title">Welcome back, {currentUser.name}</h2>
            <p>Role: {currentUser.role}</p>
          </section>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-content">
                <Calendar />
                <div>
                  <p className="stat-label">Today's Cases</p>
                  <p className="stat-value">24</p>
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-content">
                <Clock />
                <div>
                  <p className="stat-label">Pending Results</p>
                  <p className="stat-value">8</p>
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-content">
                <Users />
                <div>
                  <p className="stat-label">Staff On Duty</p>
                  <p className="stat-value">12</p>
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-content">
                <FlaskRound />
                <div>
                  <p className="stat-label">Tests in Progress</p>
                  <p className="stat-value">15</p>
                </div>
              </div>
            </div>
          </div>

          <div className="activity-grid">
            <div className="activity-card">
              <div className="activity-header">
                <FileText size={24} />
                <h3 className="activity-title">Recent Activity</h3>
              </div>
              <div className="activity-list">
                <div className="activity-item">
                  <p>Biopsy results updated for Patient #12458</p>
                  <p className="activity-time">10 minutes ago</p>
                </div>
                <div className="activity-item">
                  <p>New blood work samples received from Ward 3</p>
                  <p className="activity-time">25 minutes ago</p>
                </div>
                <div className="activity-item">
                  <p>Quality control check completed for Lab Equipment #5</p>
                  <p className="activity-time">1 hour ago</p>
                </div>
              </div>
            </div>

            <div className="activity-card">
              <div className="activity-header">
                <Bell size={24} />
                <h3 className="activity-title">Important Notifications</h3>
              </div>
              <div className="activity-list">
                <div className="notification warning">
                  <p>Maintenance scheduled for Mass Spectrometer - Tomorrow, 9 AM</p>
                </div>
                <div className="notification info">
                  <p>Weekly staff meeting - Today, 4 PM in Conference Room B</p>
                </div>
                <div className="notification success">
                  <p>New COVID-19 testing protocols available in the system</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Microscope />
          </div>
          <h1 className="login-title">MediPath Lab Portal</h1>
          <p className="login-subtitle">Enter your credentials to access the system</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <p>Contact system administrator for access</p>
        </div>
      </div>
    </div>
  );
}

export default App;