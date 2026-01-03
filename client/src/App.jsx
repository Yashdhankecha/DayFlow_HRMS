import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './routes/PrivateRoute';
import DashboardLayout from './layouts/DashboardLayout';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
             <Route path="/change-password" element={<ChangePassword />} />
             
             <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                {/* Add more sub-routes here like /dashboard/settings */}
                <Route path="*" element={<Navigate to="/dashboard" />} />
             </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

