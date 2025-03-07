import React from 'react';
import { useAuth } from '../Authentication/AuthContext';
import './Settings.css';

/**
 * Settings component for all users to manage their account settings
 */
const SettingsPage = () => {
  const { user, isTherapist, isClient } = useAuth();
  
  const userTypeLabel = isTherapist ? 'Therapist' : isClient ? 'Client' : 'User';
  
  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Account Settings</h1>
          <p>Manage your account preferences</p>
        </div>
        
        <div className="settings-info">
          <div className="settings-section">
            <h2>Profile Information</h2>
            <div className="settings-item">
              <span className="settings-label">Email:</span>
              <span className="settings-value">{user?.email || 'Not available'}</span>
            </div>
            <div className="settings-item">
              <span className="settings-label">Account Type:</span>
              <span className="settings-value">{userTypeLabel}</span>
            </div>
          </div>
        </div>
        
        <div className="coming-soon-container">
          <div className="coming-soon-message">
            <h2>More Settings Coming Soon</h2>
            <p>Additional account settings and customization options are currently under development.</p>
            <p>Check back soon for updates!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 