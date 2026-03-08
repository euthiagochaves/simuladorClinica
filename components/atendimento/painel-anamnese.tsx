"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { perguntasApi } from "@/lib/api";
import type { Pergunta } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Search, Loader2 } from "lucide-react";

interface PainelAnamneseProps {
  perguntasJaFeitas: number[];
  onPerguntaSelecionada: (pergunta: Pergunta) => void;
  processando: boolean;
}

export function PainelAnamnese({
  perguntasJaFeitas,
  onPerguntaSelecionada,
  processando,
}: PainelAnamneseProps) {
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");

  const { data: perguntas, isLoading } = useSWR<Pergunta[]>(
    "perguntas-ativas",
    () => perguntasApi.listar(true)
  );

  const categorias = useMemo(() => {
    if (!perguntas) return [];
    const cats = perguntas.map((p) => p.categoria).filter(Boolean);
    return [...new Set(cats)].sort();
  }, [perguntas]);

  const perguntasFiltradas = useMemo(() => {
    if (!perguntas) return [];
    const texto = filtroTexto.toLowerCase();
    return perguntas
      .filter(
        (p) =>
          (!texto || p.textoPergunta.toLowerCase().includes(texto)) &&
          (filtroCategoria === "todas" || p.categoria === filtroCategoria)
      )
      .sort((a, b) => a.textoPergunta.localeCompare(b.textoPergunta));
  }, [perguntas, filtroTexto, filtroCategoria]);

  const jaFoiFeita = (id: number) => perguntasJaFeitas.includes(id);

  return (
    <div className="flex h-full flex-col">
      {/* Filters */}
      <div className="space-y-3 border-b p-4">
        <div className="space-y-1.5">
          <Label htmlFor="busca-pergunta" className="text-xs">
            Buscar pergunta
          </Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="busca-pergunta"
              placeholder="Digite para filtrar..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="categoria" className="text-xs">
            Categoria
          </Label>
          <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
            <SelectTrigger id="categoria">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as categorias</SelectItem>
              {categorias.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Questions List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : perguntasFiltradas.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhuma pergunta encontrada
            </p>
          ) : (
            <div className="space-y-1">
              {perguntasFiltradas.map((pergunta) => {
                const feita = jaFoiFeita(pergunta.id);
                return (
                  <Button
                    key={pergunta.id}
                    variant={feita ? "secondary" : "ghost"}
                    className="h-auto w-full justify-start gap-2 px-3 py-2 text-left"
                    onClick={() => onPerguntaSelecionada(pergunta)}
                    disabled={processando}
                  >
                    {feita && (
                      <Check className="h-4 w-4 shrink-0 text-success" />
                    )}
                    <span className="flex-1 whitespace-normal text-sm">
                      {pergunta.textoPergunta}
                    </span>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t bg-muted/30 px-4 py-2">
        <p className="text-sm text-muted-foreground">
          Perguntas ja feitas:{" "}
          <Badge variant="secondary">{perguntasJaFeitas.length}</Badge>
        </p>
      </div>
    </div>
  );
}
