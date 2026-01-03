import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeProfile from './pages/employee/EmployeeProfile';
import EmployeeAttendance from './pages/employee/EmployeeAttendance';
import EmployeeLeave from './pages/employee/EmployeeLeave';
import HRDashboard from './pages/hr/HRDashboard';

import Employees from './pages/hr/employees/Employees';
import Attendance from './pages/hr/attendance/Attendance';
import Leaves from './pages/hr/leaves/Leaves';
import Payroll from './pages/hr/payroll/Payroll';
import Settings from './pages/hr/settings/Settings';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import DashboardLayout from './layouts/DashboardLayout';

import EmployeeLayout from './layouts/EmployeeLayout';

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

            {/* HR Dedicated Layout */}
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

            {/* Employee Dedicated Layout */}
            <Route path="/dashboard/employee" element={<EmployeeLayout />}>
              <Route index element={<EmployeeDashboard />} />
              <Route path="profile" element={<EmployeeProfile />} />
              <Route path="attendance" element={<EmployeeAttendance />} />
              <Route path="leave" element={<EmployeeLeave />} />
              <Route path="*" element={<Navigate to="/dashboard/employee" replace />} />
            </Route>

            {/* Default Dashboard - Redirect to employee */}
            <Route path="/dashboard" element={<Navigate to="/dashboard/employee" replace />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

