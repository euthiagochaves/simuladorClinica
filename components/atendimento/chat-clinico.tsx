"use client";

import { useEffect, useRef } from "react";
import type { EventoSessao } from "@/lib/types";
import { formatarTempo } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Stethoscope, User } from "lucide-react";

interface ChatClinicoProps {
  eventos: EventoSessao[];
}

export function ChatClinico({ eventos }: ChatClinicoProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [eventos]);

  if (eventos.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center p-6 text-center">
        <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <p className="font-medium">Inicio do Atendimento</p>
        <p className="text-sm text-muted-foreground">
          Selecione perguntas ou achados para comecar a consulta
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 p-4">
        {eventos.map((evento) => (
          <div key={evento.id} className="space-y-2">
            <span className="text-xs font-mono text-muted-foreground">
              {formatarTempo(evento.segundosDesdeInicio)}
            </span>
            
            {evento.tipo === "Pergunta" ? (
              <>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Stethoscope className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 rounded-lg rounded-tl-none bg-primary/10 p-3">
                    <p className="text-xs font-medium text-primary mb-1">Medico</p>
                    <p className="text-sm">{evento.textoExibido}</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="flex-1 rounded-lg rounded-tr-none bg-muted p-3 max-w-[85%]">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Paciente</p>
                    <p className="text-sm">{evento.textoResposta}</p>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20">
                  <Stethoscope className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1 rounded-lg rounded-tl-none border border-accent/30 bg-accent/5 p-3">
                  <p className="text-xs font-medium text-accent mb-1">Exame Fisico</p>
                  <p className="text-sm">
                    <span className="font-medium">{evento.textoExibido}:</span>{" "}
                    {evento.textoResposta}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
