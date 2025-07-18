import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import Dashboard from './features/dashboard/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './layouts/MainLayout';
import CustomerListPage from './features/customers/CustomerListPage';
import RoomListPage from './features/rooms/RoomListPage';
import BookingListPage from './features/bookings/BookingListPage';
import EmployeeListPage from './features/employees/EmployeeListPage';
import StatisticsPage from './features/statistics/StatisticsPage';
import ProfilePage from './features/profile/ProfilePage';
import ChangePasswordPage from './features/profile/ChangePasswordPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <PrivateRoute>
            <MainLayout>
              <CustomerListPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/rooms"
        element={
          <PrivateRoute>
            <MainLayout>
              <RoomListPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <PrivateRoute>
            <MainLayout>
              <BookingListPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <PrivateRoute>
            <MainLayout>
              <EmployeeListPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/statistics"
        element={
          <PrivateRoute>
            <MainLayout>
              <StatisticsPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <PrivateRoute>
            <MainLayout>
              <ChangePasswordPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Redirect tất cả route lạ về login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
