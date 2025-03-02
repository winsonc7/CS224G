import React from 'react';
import { useAuth } from '../Authentication/AuthContext';
import TherapistDashboard from './TherapistDashboard';
import ClientDashboard from './ClientDashboard';
import './Dashboard.css';

/**
 * Dashboard component that renders the appropriate dashboard
 * based on user type
 */
const Dashboard = () => {
  const { isTherapist, isClient, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  // Render the therapist dashboard
  if (isTherapist) {
    return <TherapistDashboard />;
  }
  
  // Render the client dashboard
  if (isClient) {
    return <ClientDashboard />;
  }
  
  // If user type is not recognized
  return (
    <div className="unknown-user-type">
      <h1>Welcome to Talk2Me</h1>
      <p>Your user type is not set. Please contact support for assistance.</p>
    </div>
  );
};

export default Dashboard; 