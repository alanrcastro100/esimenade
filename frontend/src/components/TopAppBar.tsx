import { GraduationCap, LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export function TopAppBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-20 bg-md-surface/95 backdrop-blur border-b border-md-outline-variant/40">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-md-primary-container text-md-primary">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="leading-tight">
            <span className="block text-base font-bold tracking-tight text-md-on-surface">
              eSimENADE
            </span>
            <span className="block text-xs text-md-on-surface-variant">
              {isAdmin ? "Painel do Administrador" : "Área do Aluno"}
            </span>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-md-surface-container px-3.5 py-1.5">
              {isAdmin ? (
                <ShieldCheck className="h-4 w-4 text-md-primary" />
              ) : (
                <GraduationCap className="h-4 w-4 text-md-primary" />
              )}
              <span className="text-sm font-medium text-md-on-surface">
                {user.name}
              </span>
              <span className="rounded-full bg-md-primary-container px-2 py-0.5 text-[11px] font-medium text-md-on-primary-container">
                {isAdmin ? "Administrador" : "Aluno"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-md-outline-variant px-4 py-2 text-sm font-medium text-md-primary transition hover:bg-md-primary-container/40 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
