import React from 'react';
import { useAuth } from '../Authentication/AuthContext';
import { Search, Bell, HelpCircle } from 'lucide-react';
import './Header.css';

function Header({ userType }) {
  const { user } = useAuth();

  // Helper function to get the title based on user type
  const getTitle = () => {
    if (userType === 'therapist') {
      return 'Therapist Dashboard';
    } else if (userType === 'client') {
      return 'Client Dashboard';
    }
    return 'Talk2Me'; // Default title
  };

  return (
    <header className="app-header">
      <div className="app-logo">
        <span className="app-logo-text">{getTitle()}</span>
      </div>
      
      <div className="header-right">
        {/* Show different actions based on user type */}
        {userType === 'therapist' && (
          <>
            <div className="header-search">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search..." />
            </div>
          </>
        )}
        
        {/* Common actions for all user types */}
        <div className="header-actions">
          <button className="header-action-button">
            <Bell size={18} />
          </button>
          <button className="header-action-button">
            <HelpCircle size={18} />
          </button>
          <div className="header-user-info">
            <div className="header-avatar">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;