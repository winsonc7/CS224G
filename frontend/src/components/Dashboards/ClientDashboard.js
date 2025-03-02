import React from 'react';
import './Dashboard.css';

/**
 * Dashboard component specifically for clients
 */
const ClientDashboard = () => {
  return (
    <div className="client-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Client Dashboard</h1>
          <p>Welcome to your personal therapy dashboard</p>
        </div>
        
        <div className="coming-soon-container">
          <div className="coming-soon-message">
            <h2>Coming Soon</h2>
            <p>The client dashboard with mood tracking and session management is currently under development.</p>
            <p>Check back soon for updates!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard; 