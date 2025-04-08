import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Adjust path
import ThemeProvider from '@mui/material/styles/ThemeProvider'; // Import ThemeProvider directly
import CssBaseline from '@mui/material/CssBaseline';

import LoginPage from './pages/LoginPage';           // Adjust path
import DashboardPage from './pages/DashboardPage';     // Adjust path
import ResumeBuilderPage from './pages/ResumeBuilderPage'; // Adjust path
import theme from './theme'; // Adjust path (Import the single theme object)

// Protected Route Component
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Optional: Show a global loading spinner here instead of rendering null
    return null; // Or a loading indicator
  }

  return currentUser ? children : <Navigate to="/login" replace />;
}


function App() {
  return (
    <AuthProvider>
       {/* Use the single theme object directly */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume/:resumeId" // Route for editing/viewing specific resume
              element={
                <ProtectedRoute>
                  <ResumeBuilderPage />
                </ProtectedRoute>
              }
            />
            {/* Default route: Redirect to dashboard if logged in, else to login */}
            <Route
              path="*"
              element={
                 <AuthRedirector />
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Helper component to handle the default route redirect logic
function AuthRedirector() {
    const { currentUser, loading } = useAuth();
    if (loading) return null; // Or loading indicator
    return currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}


export default App;