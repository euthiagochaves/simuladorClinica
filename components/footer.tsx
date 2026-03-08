import { Stethoscope } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Stethoscope className="h-4 w-4" />
          <span>ClinicaSim - Simulador de Atendimento Clinico</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Plataforma educacional para treinamento medico
        </p>
      </div>
    </footer>
  );
}
