import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, redirectTo }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    const redirectPath =
      redirectTo || (user.role === "admin" ? "/admin/dashboard" : "/");
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  // If user is not logged in, render the public page
  return <>{children}</>;
};
export default PublicRoute;
