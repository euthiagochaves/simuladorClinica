"use client";

import { useState, useEffect } from "react";
import { configuracoesApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface ConfigItem {
  chave: string;
  valor: string;
  label: string;
  descricao: string;
}

const CONFIG_ITEMS: ConfigItem[] = [
  {
    chave: "tempo_maximo_sessao",
    valor: "3600",
    label: "Tempo Maximo de Sessao (segundos)",
    descricao: "Tempo maximo permitido para uma sessao de atendimento",
  },
  {
    chave: "max_diagnosticos_diferenciais",
    valor: "5",
    label: "Numero de Diagnosticos Diferenciais",
    descricao: "Quantidade de diagnosticos diferenciais que o aluno deve preencher",
  },
  {
    chave: "nome_instituicao",
    valor: "Universidade",
    label: "Nome da Instituicao",
    descricao: "Nome da instituicao de ensino para exibicao nos relatorios",
  },
  {
    chave: "email_suporte",
    valor: "suporte@clinicasim.com",
    label: "Email de Suporte",
    descricao: "Email para contato de suporte tecnico",
  },
];

export default function ConfiguracoesPage() {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    setLoading(true);
    try {
      const data = await configuracoesApi.buscar();
      const configMap: Record<string, string> = {};
      if (Array.isArray(data)) {
        data.forEach((c: any) => {
          configMap[c.chave] = c.valor;
        });
      }
      // Merge with defaults
      CONFIG_ITEMS.forEach((item) => {
        if (!configMap[item.chave]) {
          configMap[item.chave] = item.valor;
        }
      });
      setConfigs(configMap);
    } catch (err) {
      // Use defaults on error
      const defaults: Record<string, string> = {};
      CONFIG_ITEMS.forEach((item) => {
        defaults[item.chave] = item.valor;
      });
      setConfigs(defaults);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (chave: string, valor: string) => {
    setConfigs({ ...configs, [chave]: valor });
    setMensagem(null);
  };

  const handleSalvar = async () => {
    setSaving(true);
    setMensagem(null);
    try {
      const configArray = Object.entries(configs).map(([chave, valor]) => ({
        chave,
        valor,
      }));
      await configuracoesApi.salvar(configArray);
      setMensagem({ tipo: "sucesso", texto: "Configuracoes salvas com sucesso!" });
    } catch (err) {
      setMensagem({ tipo: "erro", texto: "Erro ao salvar configuracoes." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Configuracoes do Sistema</h2>
        <Button onClick={handleSalvar} disabled={saving || loading}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Salvando..." : "Salvar Alteracoes"}
        </Button>
      </div>

      {mensagem && (
        <Alert
          variant={mensagem.tipo === "erro" ? "destructive" : "default"}
          className={
            mensagem.tipo === "sucesso"
              ? "border-success bg-success/10 text-success"
              : ""
          }
        >
          {mensagem.tipo === "sucesso" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{mensagem.texto}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {CONFIG_ITEMS.map((item) => (
          <Card key={item.chave}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{item.label}</CardTitle>
              <CardDescription>{item.descricao}</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  value={configs[item.chave] || ""}
                  onChange={(e) => handleChange(item.chave, e.target.value)}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Environment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informacoes do Ambiente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">API URL:</span>
              <code className="rounded bg-muted px-2 py-0.5">
                {process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}
              </code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Versao:</span>
              <code className="rounded bg-muted px-2 py-0.5">1.0.0</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
