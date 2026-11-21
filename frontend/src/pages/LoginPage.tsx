import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AlertCircle, Eye, EyeOff, GraduationCap, Lock, Mail } from "lucide-react";

import { ApiError } from "../api/client";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/exams"} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Informe seu e-mail e sua senha para continuar.");
      return;
    }

    setSubmitting(true);
    try {
      const loggedUser = await login(email.trim(), password);
      navigate(loggedUser.role === "admin" ? "/admin" : "/exams", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível conectar ao servidor. Verifique se a API está ativa.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-md-surface-container-low flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Card principal — Material Design 3 Elevated Surface */}
        <section className="rounded-[28px] bg-md-surface p-8 sm:p-10 shadow-[0_2px_12px_rgba(11,87,208,0.08)] border border-md-outline-variant/40">
          {/* Cabeçalho / Marca */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-md-primary-container text-md-primary">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-medium tracking-tight text-md-on-surface">
              Entrar no eSimENADE
            </h1>
            <p className="mt-1.5 text-sm text-md-on-surface-variant">
              Acesse com sua conta de administrador ou aluno
            </p>
          </div>

          {/* Alerta de erro — MD3 Error Container */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-2xl bg-md-error-container px-4 py-3.5 text-sm text-md-on-error-container"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-md-error" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Campo E-mail — MD3 Outlined Text Field */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium tracking-wide text-md-on-surface-variant"
              >
                E-mail institucional
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-md-on-surface-variant" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@esimenade.com"
                  className="w-full rounded-xl border border-md-outline bg-md-surface py-3 pl-11 pr-4 text-sm text-md-on-surface placeholder:text-md-on-surface-variant/60 transition focus:border-md-primary focus:outline-none focus:ring-2 focus:ring-md-primary/20"
                />
              </div>
            </div>

            {/* Campo Senha — MD3 Outlined Text Field */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium tracking-wide text-md-on-surface-variant"
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-md-on-surface-variant" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full rounded-xl border border-md-outline bg-md-surface py-3 pl-11 pr-11 text-sm text-md-on-surface placeholder:text-md-on-surface-variant/60 transition focus:border-md-primary focus:outline-none focus:ring-2 focus:ring-md-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-md-on-surface-variant transition hover:bg-md-surface-container cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Botão primário — MD3 Filled Pill Button */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-md-primary px-6 py-3 text-sm font-medium text-md-on-primary shadow-sm transition hover:bg-md-primary-hover focus:outline-none focus:ring-2 focus:ring-md-primary focus:ring-offset-2 disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <span>Entrar</span>
              )}
            </button>
          </form>
        </section>

        <p className="mt-6 text-center text-xs text-md-on-surface-variant">
          Sistema de Simulados ENADE • Acesso exclusivo para usuários cadastrados
        </p>
      </div>
    </main>
  );
}
