import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user,loggedin } = useAuth();
  const location = useLocation();
  console.log("from private route",user)

  // If no user is found, redirect to login
  if (!loggedin || !user) {
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export default PrivateRoute;
