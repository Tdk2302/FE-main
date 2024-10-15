import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roleID }) => {
  const token = localStorage.getItem("token");
  const userRoleID = localStorage.getItem("roleID");

  if (!token || !userRoleID) {
    return <Navigate to="/login" replace />;
  }

  if (roleID && !roleID.includes(Number(userRoleID))) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;