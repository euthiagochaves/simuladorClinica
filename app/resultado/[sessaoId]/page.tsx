"use client";

import { use, useState, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import { sessoesApi } from "@/lib/api";
import type { Sessao, EventoSessao, NotaClinica } from "@/lib/types";
import { formatarTempo, formatarData, getTriagemColor, getTriagemLabel } from "@/lib/utils";
import { PageLoading } from "@/components/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle,
  AlertCircle,
  Home,
  FileText,
  User,
  Clock,
  Stethoscope,
  ClipboardList,
} from "lucide-react";

interface PageProps {
  params: Promise<{ sessaoId: string }>;
}

export default function ResultadoPage({ params }: PageProps) {
  const { sessaoId } = use(params);
  const sessaoIdNum = parseInt(sessaoId, 10);

  const [eventos, setEventos] = useState<EventoSessao[]>([]);
  const [nota, setNota] = useState<NotaClinica | null>(null);

  const {
    data: sessao,
    error,
    isLoading,
  } = useSWR<Sessao>(`resultado-sessao-${sessaoIdNum}`, () =>
    sessoesApi.buscarPorId(sessaoIdNum)
  );

  useEffect(() => {
    if (sessao) {
      sessoesApi.listarEventos(sessaoIdNum).then(setEventos).catch(() => {});
      sessoesApi.buscarNotaClinica(sessaoIdNum).then(setNota).catch(() => {});
    }
  }, [sessao, sessaoIdNum]);

  const gerarPdf = () => {
    window.print();
  };

  if (isLoading) {
    return <PageLoading text="Carregando resultado..." />;
  }

  if (error || !sessao) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-4 p-6">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div className="flex-1">
              <p className="font-medium">Erro ao carregar resultado</p>
              <p className="text-sm text-muted-foreground">
                Verifique se o servidor backend esta em execucao
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">Voltar ao inicio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const caso = sessao.casoClinico;

  return (
    <div className="container mx-auto px-4 py-8 print:p-0">
      {/* Success Header */}
      <Card className="mb-6 border-success bg-success/5">
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <div>
            <h1 className="mb-2 text-2xl font-bold">Atendimento Finalizado com Sucesso</h1>
            <p className="text-muted-foreground">
              Codigo da sessao:{" "}
              <span className="font-mono font-medium">{sessao.codigo}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Patient Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados do Paciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {caso && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Paciente</p>
                  <p className="font-medium">{caso.nomePaciente}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Idade</p>
                  <p className="font-medium">{caso.idadePaciente} anos</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sexo</p>
                  <p className="font-medium">{caso.sexoPaciente}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Triagem</p>
                  <Badge className={getTriagemColor(caso.triagem)}>
                    {getTriagemLabel(caso.triagem)}
                  </Badge>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-muted-foreground">Queixa Principal</p>
                  <p className="font-medium">{caso.queixaPrincipal}</p>
                </div>
              </div>
            )}
            <Separator className="my-4" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Inicio</p>
                <p className="font-medium">{formatarData(sessao.dataInicio)}</p>
              </div>
              {sessao.dataFim && (
                <div>
                  <p className="text-sm text-muted-foreground">Fim</p>
                  <p className="font-medium">{formatarData(sessao.dataFim)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Clinical History */}
        {nota && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Historia Clinica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resumo</p>
                <p className="mt-1">{nota.textoResumo}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Diagnostico Provavel
                </p>
                <p className="mt-1 font-medium">{nota.textoDiagnosticoProvavel}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Diagnosticos Diferenciais
                </p>
                <ol className="mt-2 list-inside list-decimal space-y-1">
                  {nota.diagnosticosDiferenciais.map((dd) => (
                    <li key={dd.ordemPrioridade}>{dd.textoDiagnostico}</li>
                  ))}
                </ol>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conduta</p>
                <p className="mt-1">{nota.textoConduta}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Interactions Log */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Registro de Interacoes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {eventos.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhuma interacao registrada
            </p>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {eventos.map((evento) => (
                  <div
                    key={evento.id}
                    className="rounded-lg border bg-muted/30 p-3"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatarTempo(evento.segundosDesdeInicio)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {evento.tipo === "Pergunta" ? "Anamnese" : "Exame Fisico"}
                      </Badge>
                    </div>
                    {evento.tipo === "Pergunta" ? (
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Medico:</span>{" "}
                          {evento.textoExibido}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="font-medium">Paciente:</span>{" "}
                          {evento.textoResposta}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm">
                        <span className="font-medium">{evento.textoExibido}:</span>{" "}
                        {evento.textoResposta}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 print:hidden">
        <Button variant="outline" onClick={gerarPdf}>
          <FileText className="h-4 w-4" />
          Gerar PDF
        </Button>
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4" />
            Voltar ao Inicio
          </Link>
        </Button>
      </div>
    </div>
  );
}
