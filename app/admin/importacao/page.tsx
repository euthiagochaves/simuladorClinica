"use client";

import { useState, useRef } from "react";
import { importacaoApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ImportacaoPage() {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [importando, setImportando] = useState(false);
  const [resultado, setResultado] = useState<{
    sucesso: boolean;
    mensagem: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArquivo(file);
      setResultado(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith(".yaml") || file.name.endsWith(".yml"))) {
      setArquivo(file);
      setResultado(null);
    }
  };

  const handleImportar = async () => {
    if (!arquivo) return;
    setImportando(true);
    setResultado(null);
    try {
      const response = await importacaoApi.importarYaml(arquivo);
      setResultado({
        sucesso: true,
        mensagem: response.mensagem || "Importacao realizada com sucesso!",
      });
      setArquivo(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      setResultado({
        sucesso: false,
        mensagem: err.message || "Erro ao importar arquivo.",
      });
    } finally {
      setImportando(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Importacao de Casos via YAML</h2>

      <Card>
        <CardHeader>
          <CardTitle>Upload de Arquivo</CardTitle>
          <CardDescription>
            Importe casos clinicos, perguntas e achados em massa atraves de um arquivo YAML
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-12 transition-colors hover:border-primary/50 hover:bg-muted/50"
          >
            <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              Arraste um arquivo YAML aqui ou
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".yaml,.yml"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <Button variant="outline" asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Selecionar Arquivo
              </label>
            </Button>
          </div>

          {/* Selected File */}
          {arquivo && (
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
              <FileText className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{arquivo.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(arquivo.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button onClick={handleImportar} disabled={importando}>
                {importando ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Importar
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Result */}
          {resultado && (
            <Alert variant={resultado.sucesso ? "default" : "destructive"}>
              {resultado.sucesso ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {resultado.sucesso ? "Sucesso" : "Erro na importacao"}
              </AlertTitle>
              <AlertDescription>{resultado.mensagem}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Formato do Arquivo YAML</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-auto rounded-lg bg-muted p-4 text-sm">
{`# Exemplo de estrutura YAML
casos:
  - titulo: "Caso de Pneumonia"
    nomePaciente: "Joao Silva"
    idadePaciente: 45
    sexoPaciente: "Masculino"
    queixaPrincipal: "Tosse e febre ha 3 dias"
    triagem: "amarelo"
    ativo: true
    descricao: "Paciente refere..."
    diagnosticoFinal: "Pneumonia bacteriana"

perguntas:
  - textoPergunta: "Ha quanto tempo esta com tosse?"
    categoria: "Historia da Doenca Atual"
    ativa: true

achados:
  - nomeAchado: "Crepitacoes pulmonares"
    sistemaCategoria: "Respiratorio"
    ativo: true`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
