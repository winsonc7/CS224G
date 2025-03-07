import React, { useState} from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './components/LayoutStructure/Sidebar/Sidebar';
import Header from './components/LayoutStructure/Header/Header';
import { useAuth } from './components/Authentication/AuthContext';
import './Layout.css';

function Layout() {
  const { isTherapist, isClient } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (!isTherapist && !isClient) {
    return null;
  }

  const userType = isTherapist ? "therapist" : "client";
  
  return (
    <div className="layout">
      <SideBar 
        collapsed={sidebarCollapsed} 
        onToggle={toggleSidebar}
        userType={userType}
      />
      <div className={`layout__main ${sidebarCollapsed ? 'layout__main--sidebar-collapsed' : ''}`}>
        <Header userType={userType} />
        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;