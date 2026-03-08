"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { achadosApi } from "@/lib/api";
import type { AchadoFisico } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface PainelExameFisicoProps {
  achadosSelecionados: number[];
  onAchadoSelecionado: (achado: AchadoFisico) => void;
  processando: boolean;
}

interface GrupoAchados {
  sistema: string;
  achados: AchadoFisico[];
}

const ORDEM_SISTEMAS: Record<string, string> = {
  EstadoGeral: "Estado Geral",
  Cardiovascular: "Aparelho Cardiovascular",
  Digestivo: "Aparelho Digestivo",
  Respiratorio: "Sistema Respiratorio",
  Nefrologico: "Sistema Nefro-urologico",
  Neurologico: "Sistema Neurologico",
  Osteoarticular: "Sistema Osteoartromuscular",
};

export function PainelExameFisico({
  achadosSelecionados,
  onAchadoSelecionado,
  processando,
}: PainelExameFisicoProps) {
  const { data: achados, isLoading } = useSWR<AchadoFisico[]>(
    "achados-ativos",
    () => achadosApi.listar(true)
  );

  const grupos = useMemo(() => {
    if (!achados) return [];
    
    const gruposMap = new Map<string, AchadoFisico[]>();
    achados.forEach((a) => {
      const lista = gruposMap.get(a.sistemaCategoria) ?? [];
      lista.push(a);
      gruposMap.set(a.sistemaCategoria, lista);
    });

    const gruposOrdenados: GrupoAchados[] = [];
    
    // Add systems in defined order
    Object.keys(ORDEM_SISTEMAS).forEach((chave) => {
      const achadosGrupo = gruposMap.get(chave) ?? [];
      if (achadosGrupo.length > 0) {
        gruposOrdenados.push({
          sistema: ORDEM_SISTEMAS[chave] || chave,
          achados: achadosGrupo,
        });
      }
      gruposMap.delete(chave);
    });

    // Add remaining systems
    gruposMap.forEach((achadosGrupo, chave) => {
      gruposOrdenados.push({ sistema: chave, achados: achadosGrupo });
    });

    return gruposOrdenados;
  }, [achados]);

  const jaFoiSelecionado = (id: number) => achadosSelecionados.includes(id);

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : grupos.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhum achado disponivel
            </p>
          ) : (
            <Accordion type="multiple" className="w-full">
              {grupos.map((grupo) => (
                <AccordionItem key={grupo.sistema} value={grupo.sistema}>
                  <AccordionTrigger className="text-sm hover:no-underline">
                    <span className="flex items-center gap-2">
                      {grupo.sistema}
                      <Badge variant="outline" className="ml-2 font-normal">
                        {grupo.achados.length}
                      </Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pl-1">
                      {grupo.achados.map((achado) => {
                        const selecionado = jaFoiSelecionado(achado.id);
                        return (
                          <label
                            key={achado.id}
                            className={`flex cursor-pointer items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted ${
                              selecionado ? "bg-success/10" : ""
                            }`}
                          >
                            <Checkbox
                              checked={selecionado}
                              onCheckedChange={() => onAchadoSelecionado(achado)}
                              disabled={processando}
                            />
                            <span className="text-sm">{achado.nomeAchado}</span>
                          </label>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t bg-muted/30 px-4 py-2">
        <p className="text-sm text-muted-foreground">
          Achados selecionados:{" "}
          <Badge variant="secondary">{achadosSelecionados.length}</Badge>
        </p>
      </div>
    </div>
  );
}
