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
    <header className="header">
      <div className="header__logo">
        <span className="header__logo-text">{getTitle()}</span>
      </div>
      
      <div className="header__right">
        {/* Show different actions based on user type */}
        {userType === 'therapist' && (
          <>
            <div className="header__search">
              <Search size={18} className="header__search-icon" />
              <input type="text" placeholder="Search..." className="header__search-input" />
            </div>
          </>
        )}
        
        {/* Common actions for all user types */}
        <div className="header__actions">
          <button className="header__action-button">
            <Bell size={18} />
          </button>
          <button className="header__action-button">
            <HelpCircle size={18} />
          </button>
          <div className="header__user-info">
            <div className="header__avatar">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;