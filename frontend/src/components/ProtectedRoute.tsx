import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../types/auth";

interface ProtectedRouteProps {
  allowedRole: UserRole;
  children: ReactNode;
}

export function ProtectedRoute({ allowedRole, children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-md-surface-container-low">
        <div className="flex items-center gap-3 rounded-full bg-md-surface px-6 py-3 shadow-sm border border-md-outline-variant/50">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-md-primary border-t-transparent" />
          <span className="text-sm font-medium text-md-on-surface-variant">
            Carregando sessão...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    const fallback = user.role === "admin" ? "/admin" : "/exams";
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
