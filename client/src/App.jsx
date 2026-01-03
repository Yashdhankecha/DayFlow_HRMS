import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import HRDashboard from './pages/hr/HRDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import DashboardLayout from './layouts/DashboardLayout';
import HRLayout from './layouts/HRLayout';
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
             
             {/* HR Dedicated Layout (Must be before general dashboard to take precedence) */}
             <Route path="/dashboard/hr" element={<HRLayout />}>
                 <Route index element={<HRDashboard />} />
                 {/* Future HR specific routes */}
                 <Route path="employees" element={<div className="p-4 text-white">Employees Module - Coming Soon</div>} /> 
                 <Route path="recruitment" element={<div className="p-4 text-white">Recruitment Module - Coming Soon</div>} /> 
                 <Route path="attendance" element={<div className="p-4 text-white">Attendance Module - Coming Soon</div>} /> 
                 <Route path="payroll" element={<div className="p-4 text-white">Payroll Module - Coming Soon</div>} /> 
                 <Route path="settings" element={<div className="p-4 text-white">Settings Module - Coming Soon</div>} /> 
                 <Route path="*" element={<Navigate to="/dashboard/hr" replace />} />
             </Route>

             {/* General Dashboard Layout */}
             <Route path="/dashboard" element={<DashboardLayout />}>
                 <Route index element={<EmployeeDashboard />} />
                 <Route path="admin" element={<AdminDashboard />} />
                 <Route path="manager" element={<ManagerDashboard />} />
                 {/* Fallback for /dashboard/* */}
                 <Route path="*" element={<Navigate to="/dashboard" replace />} />
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

