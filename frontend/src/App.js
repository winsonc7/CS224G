// App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/Authentication/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './Layout';
import ChatInterface from './components/ChatInterface/ChatInterface'; 
import AuthContainer from './components/Authentication/AuthContainer';
import ClientDashboard from './components/UserTabs/Dashboard/ClientDashboard';
import TherapistDashboard from './components/TherapistTabs/Dashboard/TherapistDashboard';
import ClientsPage from './components/TherapistTabs/Clients/ClientsPage';
import CalendarPage from './components/TherapistTabs/Calendar/CalendarPage';
import SessionsPage from './components/UserTabs/Sessions/SessionsPage';
import SettingsPage from './components/Settings/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth route (outside layout) */}
          <Route path="/auth" element={<AuthContainer />} />
          
          
          {/* Layout wrapper for authenticated routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            
            {/* Therapist routes */}
            <Route path="/therapist-dashboard" element={<TherapistDashboard />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            
            {/* Client routes */}
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/sessions" element={<SessionsPage />} />
            
            {/* Common routes */}
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/settings" element={<SettingsPage />} />
            
            {/* Default redirect based on user type handled in Layout component */}
            <Route path="/" element={<Navigate to="/chat" />} />
            <Route path="*" element={<Navigate to="/chat" />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;