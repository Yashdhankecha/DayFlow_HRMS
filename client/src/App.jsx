import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import HRDashboard from './pages/HRDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import DashboardLayout from './layouts/DashboardLayout';
import PrivateRoute from './routes/PrivateRoute';

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
   <Route path="admin" element={<AdminDashboard />} />
   <Route path="hr" element={<HRDashboard />} />
   <Route path="manager" element={<ManagerDashboard />} />
   {/* Add more sub‑routes here like /dashboard/settings */}
   <Route path="*" element={<Navigate to="/dashboard" replace />} />
</Route>
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

