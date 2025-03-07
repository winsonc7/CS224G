import React from 'react';
import './Sessions.css';

/**
 * Sessions component for clients to view and manage therapy sessions
 */
const SessionsPage = () => {
  return (
    <div className="sessions-page">
      <div className="sessions-container">
        <div className="sessions-header">
          <h1>Your Sessions</h1>
          <p>View and manage your therapy sessions</p>
        </div>
        
        <div className="coming-soon-container">
          <div className="coming-soon-message">
            <h2>Coming Soon</h2>
            <p>The sessions management feature is currently under development.</p>
            <p>You'll soon be able to view past sessions, schedule new ones, and access session notes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionsPage; 