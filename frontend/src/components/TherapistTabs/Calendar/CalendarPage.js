import React from 'react';
import '../../../components/shared/Container.css';

/**
 * Calendar component for therapists to manage appointments
 */
const CalendarPage = () => {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className="content-header">
          <h1>Calendar</h1>
          <p>Manage your appointments and schedule</p>
        </div>
        
        <div className="coming-soon-container">
          <div className="coming-soon-message">
            <h2>Coming Soon</h2>
            <p>The calendar with appointment scheduling features is currently under development.</p>
            <p>Check back soon for updates!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage; 