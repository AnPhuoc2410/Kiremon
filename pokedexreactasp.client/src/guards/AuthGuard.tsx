import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Role, RoleName } from "@/types/roles.type";

interface Props {
  allowedRoles?: Role[]; // Array of allowed roles
  children?: React.ReactNode; // Child components to render
  redirectPath?: string; // Customizable redirect path
}

export const ProtectedRoute: React.FC<Props> = ({
  allowedRoles = [Role.Member, Role.User, Role.Admin], // Default to all roles
  children,
  redirectPath = "/",
}) => {
  const { isAuthenticated, user, isInitialized } = useAuth();
  const location = useLocation();

  // Wait for authentication state to initialize from cookies/refresh token
  if (!isInitialized) {
    return null;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRoles = (user.roles || []).map((r) => r.toUpperCase());

  // User has access if no specific roles required, OR they have an allowed role, OR they are an Admin
  const hasAccess =
    allowedRoles.length === 0 ||
    allowedRoles.some((role) => userRoles.includes(role)) ||
    userRoles.includes(RoleName.ADMIN);

  // If user doesn't have access, redirect
  if (!hasAccess) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children ?? <Outlet />}</>;
};

export const RejectedRoute = () => {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation(); // Get current location information

  // Wait for authentication state to initialize
  if (!isInitialized) {
    return null;
  }

  return !isAuthenticated ? (
    // If NOT authenticated, render child routes (login/signup pages)
    <Outlet />
  ) : (
    // If ALREADY authenticated, redirect to:
    // 1. The page user was trying to access before login (if exists)
    // 2. Home page (if no previous location)
    <Navigate to={location.state?.from ?? "/"} replace />
  );
};
