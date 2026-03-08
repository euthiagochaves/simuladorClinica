"use client";

import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { casosApi, sessoesApi } from "@/lib/api";
import type { CasoClinico } from "@/lib/types";
import { getTriagemColor, getTriagemLabel } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Calendar, AlertCircle, Play, Loader2 } from "lucide-react";

export function CasosLista() {
  const router = useRouter();
  const [loadingCasoId, setLoadingCasoId] = useState<number | null>(null);
  
  const { data: casos, error, isLoading } = useSWR<CasoClinico[]>(
    "casos-ativos",
    () => casosApi.listar(true)
  );

  const iniciarAtendimento = async (casoId: number) => {
    setLoadingCasoId(casoId);
    try {
      const sessao = await sessoesApi.criar({ casoClinicoId: casoId });
      router.push(`/atendimento/${sessao.id}`);
    } catch (err) {
      console.error("Erro ao criar sessao:", err);
      setLoadingCasoId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-4">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center gap-4 p-6">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <p className="font-medium">Erro ao carregar casos</p>
            <p className="text-sm text-muted-foreground">
              Verifique se o servidor backend esta em execucao em localhost:5000
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!casos || casos.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">Nenhum caso disponivel</p>
          <p className="text-sm text-muted-foreground">
            Adicione casos clinicos no painel administrativo
          </p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/casos")}>
            Ir para Admin
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {casos.map((caso) => (
        <Card key={caso.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="line-clamp-2 text-lg">{caso.titulo}</CardTitle>
              <Badge className={getTriagemColor(caso.triagem)}>
                {getTriagemLabel(caso.triagem)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>
                  {caso.nomePaciente}, {caso.idadePaciente} anos, {caso.sexoPaciente}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span className="line-clamp-1">{caso.queixaPrincipal}</span>
              </div>
            </div>

            {caso.descricao && (
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {caso.descricao}
              </p>
            )}

            <Button
              className="w-full"
              onClick={() => iniciarAtendimento(caso.id)}
              disabled={loadingCasoId === caso.id}
            >
              {loadingCasoId === caso.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Iniciando...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Iniciar Atendimento
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
