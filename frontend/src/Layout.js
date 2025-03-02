// components/Layout/Layout.js
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './components/Sidebar/SideBar';
import Header from './components/Header/Header';
import { useAuth } from './components/Authentication/AuthContext';
import './Layout.css';

function Layout() {
  const { isTherapist, isClient } = useAuth();
  // State to track sidebar visibility
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // Optionally store preference in localStorage
    localStorage.setItem('sidebarCollapsed', (!sidebarCollapsed).toString());
  };
  
  // Load user preference on initial render
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setSidebarCollapsed(savedState === 'true');
    }
  }, []);

  // Render therapist layout
  if (isTherapist) {
    return (
      <div className="therapist-layout">
        <SideBar 
          collapsed={sidebarCollapsed} 
          onToggle={toggleSidebar}
          userType="therapist"
        />
        <div className={`layout-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Header userType="therapist" />
          <main className="layout-content">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }
  
  // Render client layout
  if (isClient) {
    return (
      <div className="client-layout">
        <SideBar 
          collapsed={sidebarCollapsed} 
          onToggle={toggleSidebar}
          userType="client"
        />
        <div className={`layout-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Header userType="client" />
          <main className="layout-content">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  // Default layout (fallback)
  return (
    <>
      <SideBar 
        collapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      <div className={`layout-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Layout;