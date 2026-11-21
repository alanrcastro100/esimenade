import { useEffect, useState } from "react";
import { CheckCircle2, FileUp, ListChecks, ShieldCheck } from "lucide-react";

import { authApi } from "../api/client";
import { TopAppBar } from "../components/TopAppBar";
import { useAuth } from "../contexts/AuthContext";

export function AdminHomePage() {
  const { user } = useAuth();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    authApi
      .adminOverview()
      .then((res) => setStatusMessage(res.message))
      .catch(() => setStatusMessage(null));
  }, []);

  const upcomingModules = [
    {
      title: "Upload de Provas (PDF)",
      pb: "PB03 • Próxima sprint",
      description:
        "Envie arquivos PDF de edições anteriores do ENADE com validação de camada de texto.",
      icon: FileUp,
    },
    {
      title: "Extração e Conferência",
      pb: "PB04 / PB05 • Próxima sprint",
      description:
        "Revise enunciados, alternativas e imagens extraídas, cadastre o gabarito e libere a prova.",
      icon: ListChecks,
    },
  ];

  return (
    <div className="min-h-screen bg-md-surface-container-low">
      <TopAppBar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Banner de boas-vindas — MD3 Primary Tonal Card */}
        <section className="rounded-3xl bg-md-primary-container/60 p-6 sm:p-8 border border-md-primary/15">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-md-surface px-3 py-1 text-xs font-medium text-md-primary shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Perfil Administrador ativo</span>
              </div>
              <h1 className="mt-3 text-2xl font-medium text-md-on-primary-container">
                {statusMessage ?? `Bem-vindo(a), ${user?.name}`}
              </h1>
              <p className="mt-1 text-sm text-md-on-primary-container/80">
                Você tem acesso total às funcionalidades administrativas da plataforma eSimENADE.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-2xl bg-md-surface px-4 py-2.5 text-xs font-medium text-md-on-surface border border-md-outline-variant/40">
              <CheckCircle2 className="h-4 w-4 text-md-primary" />
              <span>Autenticação verificada (PB01)</span>
            </div>
          </div>
        </section>

        {/* Módulos administrativos */}
        <section className="mt-8">
          <h2 className="text-base font-medium text-md-on-surface mb-4">
            Funcionalidades do Administrador
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {upcomingModules.map((mod) => {
              const Icon = mod.icon;
              return (
                <article
                  key={mod.title}
                  className="rounded-3xl bg-md-surface p-6 border border-md-outline-variant/40 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-md-primary-container text-md-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-md-surface-container px-3 py-1 text-xs font-medium text-md-on-surface-variant">
                      {mod.pb}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-md-on-surface">
                    {mod.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-md-on-surface-variant">
                    {mod.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
