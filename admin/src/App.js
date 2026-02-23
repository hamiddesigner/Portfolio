import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './admin/auth/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './admin/auth/Login';
import Dashboard from './admin/pages/Dashboard';
import CaseStudies from './admin/pages/CaseStudies';
import Posts from './admin/pages/Posts';
import PageContent from './admin/pages/PageContent';
import Availability from './admin/pages/Availability';
import Messages from './admin/pages/Messages';
import Settings from './admin/pages/Settings';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/components/AdminLayout';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Toaster position="top-right" />
        <Routes>
          {/* Public route */}
          <Route path="/admin/login" element={<Login />} />
          
          {/* Protected routes with layout */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="case-studies" element={<CaseStudies />} />
            <Route path="posts" element={<Posts />} />
            <Route path="page-content" element={<PageContent />} />
            <Route path="availability" element={<Availability />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Redirect root to admin */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
