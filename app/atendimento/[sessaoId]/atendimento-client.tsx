"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sessoesApi } from "@/lib/api";
import type { Sessao, EventoSessao, Pergunta, AchadoFisico } from "@/lib/types";
import { PageLoading } from "@/components/loading-spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoPaciente } from "@/components/atendimento/info-paciente";
import { ChatClinico } from "@/components/atendimento/chat-clinico";
import { PainelAnamnese } from "@/components/atendimento/painel-anamnese";
import { PainelExameFisico } from "@/components/atendimento/painel-exame-fisico";
import { PainelHistoriaClinica } from "@/components/atendimento/painel-historia-clinica";
import { ArrowLeft, AlertCircle } from "lucide-react";

interface AtendimentoClientProps {
  sessaoId: number;
}

export function AtendimentoClient({ sessaoId }: AtendimentoClientProps) {
  const router = useRouter();
  const [eventos, setEventos] = useState<EventoSessao[]>([]);
  const [processando, setProcessando] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("anamnese");
  const [localIdCounter, setLocalIdCounter] = useState(-1);

  const { data: sessao, error, isLoading } = useSWR<Sessao>(
    `sessao-${sessaoId}`,
    () => sessoesApi.buscarPorId(sessaoId),
    {
      onSuccess: () => {
        // Load events after session loads
        sessoesApi.listarEventos(sessaoId).then(setEventos).catch(() => {});
      },
    }
  );

  const perguntasFeitas = eventos
    .filter((e) => e.tipo === "Pergunta")
    .map((e) => e.id);

  const achadosSelecionados = eventos
    .filter((e) => e.tipo === "Achado")
    .map((e) => e.id);

  const handlePerguntaSelecionada = useCallback(
    async (pergunta: Pergunta) => {
      if (processando) return;
      setProcessando(true);
      try {
        const resposta = await sessoesApi.fazerPergunta(sessaoId, pergunta.id);
        const novoEvento: EventoSessao = {
          id: localIdCounter,
          sessaoId,
          tipo: "Pergunta",
          textoExibido: resposta.textoExibido,
          textoResposta: resposta.textoResposta,
          segundosDesdeInicio: resposta.segundosDesdeInicio,
          dataHora: new Date().toISOString(),
        };
        setLocalIdCounter((c) => c - 1);
        setEventos((prev) => [...prev, novoEvento]);
      } catch (err) {
        console.error("Erro ao fazer pergunta:", err);
      } finally {
        setProcessando(false);
      }
    },
    [sessaoId, processando, localIdCounter]
  );

  const handleAchadoSelecionado = useCallback(
    async (achado: AchadoFisico) => {
      if (processando) return;
      setProcessando(true);
      try {
        const resposta = await sessoesApi.selecionarAchado(sessaoId, achado.id);
        const novoEvento: EventoSessao = {
          id: localIdCounter,
          sessaoId,
          tipo: "Achado",
          textoExibido: resposta.textoExibido,
          textoResposta: resposta.textoResposta,
          segundosDesdeInicio: resposta.segundosDesdeInicio,
          dataHora: new Date().toISOString(),
        };
        setLocalIdCounter((c) => c - 1);
        setEventos((prev) => [...prev, novoEvento]);
      } catch (err) {
        console.error("Erro ao selecionar achado:", err);
      } finally {
        setProcessando(false);
      }
    },
    [sessaoId, processando, localIdCounter]
  );

  const handleFinalizar = useCallback(() => {
    router.push(`/resultado/${sessaoId}`);
  }, [router, sessaoId]);

  if (isLoading) {
    return <PageLoading text="Carregando sessao..." />;
  }

  if (error || !sessao) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-4 p-6">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div className="flex-1">
              <p className="font-medium">Erro ao carregar sessao</p>
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

  return (
    <div className="flex flex-col">
      {/* Top bar */}
      <div className="border-b bg-muted/30 px-4 py-2">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground">
              Sessao: <span className="font-mono font-medium">{sessao.codigo}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Patient Info */}
      <InfoPaciente sessao={sessao} />

      {/* Main content */}
      <div className="container mx-auto flex-1 px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Chat Column */}
          <Card className="flex flex-col">
            <div className="border-b px-4 py-3">
              <h3 className="font-semibold">Chat Clinico</h3>
            </div>
            <CardContent className="flex-1 p-0">
              <ChatClinico eventos={eventos} />
            </CardContent>
          </Card>

          {/* Panels Column */}
          <Card className="flex flex-col">
            <Tabs value={abaAtiva} onValueChange={setAbaAtiva} className="flex flex-1 flex-col">
              <div className="border-b px-4 py-2">
                <TabsList className="w-full">
                  <TabsTrigger value="anamnese" className="flex-1">
                    Anamnese
                  </TabsTrigger>
                  <TabsTrigger value="exame" className="flex-1">
                    Exame Fisico
                  </TabsTrigger>
                  <TabsTrigger value="historia" className="flex-1">
                    Historia Clinica
                  </TabsTrigger>
                </TabsList>
              </div>
              <CardContent className="flex-1 overflow-hidden p-0">
                <TabsContent value="anamnese" className="m-0 h-full">
                  <PainelAnamnese
                    perguntasJaFeitas={perguntasFeitas}
                    onPerguntaSelecionada={handlePerguntaSelecionada}
                    processando={processando}
                  />
                </TabsContent>
                <TabsContent value="exame" className="m-0 h-full">
                  <PainelExameFisico
                    achadosSelecionados={achadosSelecionados}
                    onAchadoSelecionado={handleAchadoSelecionado}
                    processando={processando}
                  />
                </TabsContent>
                <TabsContent value="historia" className="m-0 h-full">
                  <PainelHistoriaClinica
                    sessaoId={sessaoId}
                    onFinalizar={handleFinalizar}
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
