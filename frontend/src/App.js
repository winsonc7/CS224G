import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/Authentication/AuthContext';
import AuthenticationForm from './components/Authentication/AuthenticationForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import ChatInterface from './components/Chatbot/ChatInterface'; // Your existing chat component

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthenticationForm />} />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatInterface />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/auth" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;