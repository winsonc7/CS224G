import React from 'react';
import { useAuth } from '../../Authentication/AuthContext';
import './ClientsPage.css';

/**
 * Clients page for therapists
 */
const ClientsPage = () => {
  const { isTherapist } = useAuth();
  
  // This page should only be accessible to therapists
  if (!isTherapist) {
    return (
      <div className="unauthorized-message">
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }
  
  return (
    <div className="clients-page">
      <div className="clients-header">
        <h1>My Clients</h1>
        <p>Manage your client relationships</p>
      </div>
      
      <div className="coming-soon-container">
        <div className="coming-soon-message">
          <h2>Coming Soon</h2>
          <p>The client management interface is currently under development.</p>
          <p>You'll be able to view and manage your clients here soon.</p>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage; 