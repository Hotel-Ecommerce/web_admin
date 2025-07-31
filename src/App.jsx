import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import Dashboard from './features/dashboard/Dashboard';
import CustomerListPage from './features/customers/CustomerListPage';
import RoomListPage from './features/rooms/RoomListPage';
import BookingListPage from './features/bookings/BookingListPage';
import EmployeePage from './features/employees/EmployeePage';
import ProfilePage from './features/profile/ProfilePage';
import ChangePasswordPage from './features/profile/ChangePasswordPage';
import RequestPage from './features/requests/RequestPage';
import StatisticsDashboard from './features/statistics/StatisticsDashboard';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

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
              <EmployeePage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/statistics"
        element={
          <PrivateRoute>
            <MainLayout>
              <StatisticsDashboard />
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
      <Route
        path="/requests"
        element={
          <PrivateRoute>
            <MainLayout>
              <RequestPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
