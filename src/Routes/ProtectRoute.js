import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const user = JSON.parse(localStorage.getItem("user"));

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.roleID !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;