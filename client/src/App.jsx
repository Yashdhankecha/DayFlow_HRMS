import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import HRDashboard from './pages/hr/HRDashboard';
import Employees from './pages/hr/employees/Employees';
import Attendance from './pages/hr/attendance/Attendance';
import Leaves from './pages/hr/leaves/Leaves';
import Payroll from './pages/hr/payroll/Payroll';
import Settings from './pages/hr/settings/Settings';
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
                 <Route path="employees" element={<Employees />} /> 
                 <Route path="attendance" element={<Attendance />} /> 
                 <Route path="leaves" element={<Leaves />} /> 
                 <Route path="payroll" element={<Payroll />} /> 
                 <Route path="settings" element={<Settings />} /> 
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

