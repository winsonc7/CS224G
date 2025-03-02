// components/Layout/SideBar.js
import React from 'react';
import { 
  User, 
  MessageSquare, 
  Calendar, 
  LayoutDashboard, 
  Users,
  Settings,
  LogOut, 
  Menu, 
  ChevronLeft 
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authentication/AuthContext';
import './SideBar.css';

function SideBar({ collapsed, onToggle, userType }) {
  const navigate = useNavigate();
  const { user, isTherapist, isClient, signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Determine navigation items based on user type
  const getNavItems = () => {
    // Default navigation items
    const defaultItems = [
      { 
        path: '/dashboard', 
        label: 'Dashboard', 
        icon: <LayoutDashboard size={20} />
      },
      {
        path: '/chat',
        label: 'Chat',
        icon: <MessageSquare size={20} />
      }
    ];
    
    // Therapist-specific items
    if (userType === 'therapist' || isTherapist) {
      return [
        ...defaultItems,
        {
          path: '/clients',
          label: 'Clients',
          icon: <Users size={20} />
        },
        {
          path: '/calendar',
          label: 'Calendar',
          icon: <Calendar size={20} />
        }
      ];
    }
    
    // Client-specific items
    if (userType === 'client' || isClient) {
      return [
        ...defaultItems,
        {
          path: '/sessions',
          label: 'Sessions',
          icon: <Calendar size={20} />
        }
      ];
    }
    
    // Return default if userType is not specified
    return defaultItems;
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Toggle button with updated icon based on state */}
      <button className="sidebar-toggle-button" onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
        {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
      </button>
      
      {/* Navigation Menu */}
      <div className="sidebar-menu">
        {getNavItems().map((item, index) => (
          <NavLink 
            key={index}
            to={item.path} 
            className={({ isActive }) => 
              `sidebar-menu-item ${isActive ? 'sidebar-menu-item-active' : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
      
      {/* Footer with user info, settings and logout */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            <User size={18} />
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-label">Signed in as</span>
            <p className="sidebar-user-name">{user?.email || 'User'}</p>
          </div>
        </div>
        
        <div className="sidebar-footer-actions">
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `sidebar-footer-link ${isActive ? 'sidebar-footer-link-active' : ''}`
            }
          >
            <Settings size={16} />
            <span>Settings</span>
          </NavLink>
          
          <button 
            className="sidebar-footer-link sidebar-logout-link"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SideBar;