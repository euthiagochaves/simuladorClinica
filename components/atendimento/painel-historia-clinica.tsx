"use client";

import { useState, useEffect, useCallback } from "react";
import { sessoesApi } from "@/lib/api";
import type { NotaClinicaRequest } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface PainelHistoriaClinicaProps {
  sessaoId: number;
  onFinalizar: () => void;
}

export function PainelHistoriaClinica({
  sessaoId,
  onFinalizar,
}: PainelHistoriaClinicaProps) {
  const [resumo, setResumo] = useState("");
  const [diagnosticoProvavel, setDiagnosticoProvavel] = useState("");
  const [diagnosticosDiferenciais, setDiagnosticosDiferenciais] = useState([
    "",
    "",
    "",
    "",
    "",
  ]);
  const [conduta, setConduta] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [finalizando, setFinalizando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  const todosCamposPreenchidos =
    resumo.trim() !== "" &&
    diagnosticoProvavel.trim() !== "" &&
    conduta.trim() !== "" &&
    diagnosticosDiferenciais.every((d) => d.trim() !== "");

  useEffect(() => {
    sessoesApi
      .buscarNotaClinica(sessaoId)
      .then((nota) => {
        if (nota) {
          setResumo(nota.textoResumo || "");
          setDiagnosticoProvavel(nota.textoDiagnosticoProvavel || "");
          setConduta(nota.textoConduta || "");
          if (nota.diagnosticosDiferenciais?.length) {
            const dds = ["", "", "", "", ""];
            nota.diagnosticosDiferenciais.forEach((dd) => {
              if (dd.ordemPrioridade >= 1 && dd.ordemPrioridade <= 5) {
                dds[dd.ordemPrioridade - 1] = dd.textoDiagnostico;
              }
            });
            setDiagnosticosDiferenciais(dds);
          }
        }
      })
      .catch(() => {});
  }, [sessaoId]);

  const atualizarDiferencial = (index: number, valor: string) => {
    const novos = [...diagnosticosDiferenciais];
    novos[index] = valor;
    setDiagnosticosDiferenciais(novos);
  };

  const construirRequest = useCallback((): NotaClinicaRequest => {
    return {
      textoResumo: resumo,
      textoDiagnosticoProvavel: diagnosticoProvavel,
      textoConduta: conduta,
      diagnosticosDiferenciais: diagnosticosDiferenciais.map((texto, i) => ({
        ordemPrioridade: i + 1,
        textoDiagnostico: texto,
      })),
    };
  }, [resumo, diagnosticoProvavel, conduta, diagnosticosDiferenciais]);

  const guardarRascunho = async () => {
    setSalvando(true);
    setMensagemErro(null);
    try {
      await sessoesApi.salvarNotaClinica(sessaoId, construirRequest());
      setMensagemSucesso("Rascunho salvo com sucesso!");
      setTimeout(() => setMensagemSucesso(null), 3000);
    } catch (err) {
      setMensagemErro("Erro ao salvar o rascunho.");
    } finally {
      setSalvando(false);
    }
  };

  const finalizar = async () => {
    if (!todosCamposPreenchidos) {
      setMensagemErro("Todos os campos sao obrigatorios para finalizar.");
      return;
    }
    setFinalizando(true);
    setMensagemErro(null);
    try {
      await sessoesApi.salvarNotaClinica(sessaoId, construirRequest());
      await sessoesApi.finalizar(sessaoId);
      onFinalizar();
    } catch (err) {
      setMensagemErro("Erro ao finalizar o atendimento.");
      setFinalizando(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {mensagemErro && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{mensagemErro}</AlertDescription>
            </Alert>
          )}
          {mensagemSucesso && (
            <Alert className="border-success bg-success/10 text-success">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{mensagemSucesso}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="resumo">Resumo</Label>
            <Textarea
              id="resumo"
              placeholder="Resumo do caso..."
              rows={3}
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnostico">Diagnostico Provavel</Label>
            <Input
              id="diagnostico"
              placeholder="Diagnostico principal..."
              value={diagnosticoProvavel}
              onChange={(e) => setDiagnosticoProvavel(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Diagnosticos Diferenciais</Label>
            <div className="space-y-2">
              {diagnosticosDiferenciais.map((dd, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-6 text-sm text-muted-foreground">
                    {index + 1}.
                  </span>
                  <Input
                    placeholder={`Diagnostico diferencial ${index + 1}`}
                    value={dd}
                    onChange={(e) => atualizarDiferencial(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="conduta">Conduta</Label>
            <Textarea
              id="conduta"
              placeholder="Plano de manejo..."
              rows={3}
              value={conduta}
              onChange={(e) => setConduta(e.target.value)}
            />
          </div>
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="flex gap-2 border-t bg-muted/30 p-4">
        <Button
          variant="outline"
          onClick={guardarRascunho}
          disabled={salvando || finalizando}
          className="flex-1"
        >
          {salvando ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {salvando ? "Salvando..." : "Salvar Rascunho"}
        </Button>
        <Button
          onClick={finalizar}
          disabled={!todosCamposPreenchidos || finalizando || salvando}
          className="flex-1"
        >
          {finalizando ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          {finalizando ? "Finalizando..." : "Finalizar Atendimento"}
        </Button>
      </div>
    </div>
  );
}
