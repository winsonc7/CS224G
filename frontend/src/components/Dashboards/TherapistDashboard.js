import React from 'react';
import './Dashboard.css';

/**
 * Dashboard component specifically for therapists
 */
const TherapistDashboard = () => {
  return (
    <div className="therapist-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Therapist Dashboard</h1>
          <p>Welcome to your therapist dashboard</p>
        </div>
        
        <div className="coming-soon-container">
          <div className="coming-soon-message">
            <h2>Coming Soon</h2>
            <p>The therapist dashboard with client management features is currently under development.</p>
            <p>Check back soon for updates!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboard; 