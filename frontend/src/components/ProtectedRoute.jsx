import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import { hasRequiredRole } from "../utils/roleHelper";

const ProtectedRoute = ({ element, requiredRoles = [] }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f2f5",
        }}
      >
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0) {
    const userRoles = user?.roles || [];
    if (!hasRequiredRole(userRoles, requiredRoles)) {
      console.warn('Access denied. User roles:', userRoles, 'Required:', requiredRoles);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return element;
};

export default ProtectedRoute;
