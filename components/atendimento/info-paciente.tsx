"use client";

import type { Sessao } from "@/lib/types";
import { getTriagemColor, getTriagemLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, AlertCircle } from "lucide-react";

interface InfoPacienteProps {
  sessao: Sessao;
}

export function InfoPaciente({ sessao }: InfoPacienteProps) {
  const caso = sessao.casoClinico;

  if (!caso) return null;

  return (
    <div className="border-b bg-card px-4 py-4">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{caso.nomePaciente}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{caso.idadePaciente} anos</span>
            <span>-</span>
            <span>{caso.sexoPaciente}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Queixa:</span>
            <span className="font-medium">{caso.queixaPrincipal}</span>
          </div>
          <Badge className={getTriagemColor(caso.triagem)}>
            {getTriagemLabel(caso.triagem)}
          </Badge>
        </div>
      </div>
    </div>
  );
}
