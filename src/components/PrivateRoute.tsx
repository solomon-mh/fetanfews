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
  const { user, loading } = useAuth();

  const location = useLocation();
  if (loading) {
    return <div className="py-44 text-5xl">Loading...</div>;
  }
  // If no user is found, redirect to login
  if (!user) {
    return (
      <Navigate
        to={requiredRole === "admin" ? "/admin" : "/user/login"}
        state={{ from: location }}
        replace
      />
    );
  }
  return <>{children}</>;
};

export default PrivateRoute;
