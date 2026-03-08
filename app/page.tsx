import { CasosLista } from "@/components/casos-lista";
import { Stethoscope, BookOpen, Activity } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Simulador de Atendimento Clinico
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
          Pratique suas habilidades clinicas com casos simulados. Realize anamnese,
          exame fisico e chegue ao diagnostico correto.
        </p>
      </section>

      {/* Features */}
      <section className="mb-12 grid gap-6 sm:grid-cols-3">
        <div className="flex flex-col items-center rounded-xl border bg-card p-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 font-semibold">Anamnese Estruturada</h3>
          <p className="text-sm text-muted-foreground">
            Perguntas organizadas por categoria para coleta completa da historia clinica
          </p>
        </div>
        <div className="flex flex-col items-center rounded-xl border bg-card p-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Stethoscope className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 font-semibold">Exame Fisico</h3>
          <p className="text-sm text-muted-foreground">
            Selecione achados por sistema corporal e receba feedback imediato
          </p>
        </div>
        <div className="flex flex-col items-center rounded-xl border bg-card p-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 font-semibold">Diagnostico e Conduta</h3>
          <p className="text-sm text-muted-foreground">
            Formule diagnosticos diferenciais e defina a conduta adequada
          </p>
        </div>
      </section>

      {/* Cases List */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Casos Disponiveis</h2>
        <CasosLista />
      </section>
    </div>
  );
}
