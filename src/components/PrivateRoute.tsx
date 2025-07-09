import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole: "user" | "admin";
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user } = useAuth();

  const location = useLocation();

  // If no user is found, redirect to login
  if (user === null) {
    return (
      <Navigate
        to={requiredRole === "admin" ? "/admin/login" : "/user/login"}
        state={{ from: location }}
        replace
      />
    );
  }
  return <>{children}</>;
};

export default PrivateRoute;
