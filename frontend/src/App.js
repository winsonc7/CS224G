// App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/Authentication/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './Layout';
import ChatInterface from './components/ChatInterface/ChatInterface'; 
import AuthContainer from './components/Authentication/AuthContainer';
import Dashboard from './components/Dashboards/Dashboard';
import ClientsPage from './components/TherapistTabs/Clients/ClientsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth route (outside layout) */}
          <Route path="/auth" element={<AuthContainer />} />
          
          
          {/* Layout wrapper for authenticated routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Therapist routes */}
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/calendar" element={<div>Calendar (Coming Soon)</div>} />
            
            {/* Client routes */}
            <Route path="/sessions" element={<div>Sessions (Coming Soon)</div>} />
            
            {/* Common routes */}
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/settings" element={<div>Settings (Coming Soon)</div>} />
          </Route>
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;