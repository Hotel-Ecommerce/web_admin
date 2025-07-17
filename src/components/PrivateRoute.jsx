// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// PrivateRoute: kiểm tra quyền truy cập dựa trên role
// Sử dụng: <PrivateRoute roles={["Manager", "Admin"]}>...</PrivateRoute>
const PrivateRoute = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
};

export default PrivateRoute;
