import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roleID }) => {
  const token = localStorage.getItem("token");
  const userRoleID = localStorage.getItem("roleID");

  if (!token || !userRoleID) {
    return <Navigate to="/login" replace />;
  }

  // Đảm bảo roleID là một mảng
  const allowedRoles = Array.isArray(roleID) ? roleID : [roleID];

  if (allowedRoles.length > 0 && !allowedRoles.includes(Number(userRoleID))) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;