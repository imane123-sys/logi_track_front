import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

function RoleGuard({ allowedRoles }) {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRoles = Array.isArray(user.role) ? user.role : [user.role];

  const normalizedRoles = userRoles.map((role) =>
    typeof role === "string" ? role.replace("ROLE_", "").toUpperCase() : "",
  );

  const hasRole = allowedRoles.some((role) =>
    normalizedRoles.includes(role.toUpperCase()),
  );

  if (!hasRole) {
    return <Navigate to="/acces-refuse" replace />;
  }

  return <Outlet />;
}

export default RoleGuard;
