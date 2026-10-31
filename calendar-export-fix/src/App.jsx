import React from 'react';
import EventForm from './components/EventForm';

export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <div className="brand-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="brand-text">
              <h1 className="brand-title">Daymark</h1>
              <span className="brand-subtitle">Event Manager</span>
            </div>
          </div>
          <div className="header-status">
            <span className="status-dot"></span>
            <span className="status-label">Operational</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <EventForm />
      </main>

      <footer className="app-footer">
        <p>Daymark Event Manager &bull; Calendar Synchronization Tool</p>
      </footer>
    </div>
  );
}

