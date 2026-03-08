"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { casosApi } from "@/lib/api";
import type { CasoClinico } from "@/lib/types";
import { getTriagemColor, getTriagemLabel } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Loader2, AlertCircle } from "lucide-react";

type FormData = Partial<CasoClinico>;

const TRIAGEM_OPTIONS = [
  { value: "verde", label: "Verde - Pouco Urgente" },
  { value: "amarelo", label: "Amarelo - Urgente" },
  { value: "laranja", label: "Laranja - Muito Urgente" },
  { value: "vermelho", label: "Vermelho - Emergencia" },
  { value: "azul", label: "Azul - Nao Urgente" },
];

export default function AdminCasosPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCaso, setEditingCaso] = useState<CasoClinico | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const { data: casos, isLoading, error } = useSWR<CasoClinico[]>(
    "admin-casos",
    () => casosApi.listar()
  );

  const openCreate = () => {
    setEditingCaso(null);
    setFormData({
      titulo: "",
      nomePaciente: "",
      idadePaciente: 30,
      sexoPaciente: "Masculino",
      queixaPrincipal: "",
      triagem: "verde",
      ativo: true,
      descricao: "",
      historiaDoenca: "",
      antecedentesPatologicos: "",
      diagnosticoFinal: "",
    });
    setDialogOpen(true);
  };

  const openEdit = (caso: CasoClinico) => {
    setEditingCaso(caso);
    setFormData({ ...caso });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingCaso) {
        await casosApi.atualizar(editingCaso.id, formData);
      } else {
        await casosApi.criar(formData);
      }
      mutate("admin-casos");
      setDialogOpen(false);
    } catch (err) {
      console.error("Erro ao salvar:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este caso?")) return;
    setDeleting(id);
    try {
      await casosApi.excluir(id);
      mutate("admin-casos");
    } catch (err) {
      console.error("Erro ao excluir:", err);
    } finally {
      setDeleting(null);
    }
  };

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center gap-4 p-6">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <p className="font-medium">Erro ao carregar casos</p>
            <p className="text-sm text-muted-foreground">
              Verifique se o servidor backend esta em execucao
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Casos Clinicos</h2>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Novo Caso
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="max-h-[600px]">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 text-left text-sm font-medium">Titulo</th>
                  <th className="p-3 text-left text-sm font-medium">Paciente</th>
                  <th className="p-3 text-left text-sm font-medium">Triagem</th>
                  <th className="p-3 text-left text-sm font-medium">Status</th>
                  <th className="p-3 text-right text-sm font-medium">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-3"><Skeleton className="h-5 w-40" /></td>
                      <td className="p-3"><Skeleton className="h-5 w-32" /></td>
                      <td className="p-3"><Skeleton className="h-5 w-20" /></td>
                      <td className="p-3"><Skeleton className="h-5 w-16" /></td>
                      <td className="p-3"><Skeleton className="h-8 w-20" /></td>
                    </tr>
                  ))
                ) : casos?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      Nenhum caso cadastrado
                    </td>
                  </tr>
                ) : (
                  casos?.map((caso) => (
                    <tr key={caso.id} className="border-b hover:bg-muted/30">
                      <td className="p-3">
                        <p className="font-medium">{caso.titulo}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {caso.queixaPrincipal}
                        </p>
                      </td>
                      <td className="p-3">
                        <p>{caso.nomePaciente}</p>
                        <p className="text-sm text-muted-foreground">
                          {caso.idadePaciente} anos, {caso.sexoPaciente}
                        </p>
                      </td>
                      <td className="p-3">
                        <Badge className={getTriagemColor(caso.triagem)}>
                          {getTriagemLabel(caso.triagem)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant={caso.ativo ? "success" : "secondary"}>
                          {caso.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(caso)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(caso.id)}
                            disabled={deleting === caso.id}
                          >
                            {deleting === caso.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCaso ? "Editar Caso" : "Novo Caso Clinico"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="titulo">Titulo</Label>
              <Input
                id="titulo"
                value={formData.titulo || ""}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nomePaciente">Nome do Paciente</Label>
                <Input
                  id="nomePaciente"
                  value={formData.nomePaciente || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nomePaciente: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="idadePaciente">Idade</Label>
                <Input
                  id="idadePaciente"
                  type="number"
                  value={formData.idadePaciente || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, idadePaciente: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sexoPaciente">Sexo</Label>
                <Select
                  value={formData.sexoPaciente || "Masculino"}
                  onValueChange={(v) => setFormData({ ...formData, sexoPaciente: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="triagem">Triagem</Label>
                <Select
                  value={formData.triagem || "verde"}
                  onValueChange={(v) => setFormData({ ...formData, triagem: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIAGEM_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="queixaPrincipal">Queixa Principal</Label>
              <Input
                id="queixaPrincipal"
                value={formData.queixaPrincipal || ""}
                onChange={(e) =>
                  setFormData({ ...formData, queixaPrincipal: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descricao</Label>
              <Textarea
                id="descricao"
                rows={2}
                value={formData.descricao || ""}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="historiaDoenca">Historia da Doenca</Label>
              <Textarea
                id="historiaDoenca"
                rows={2}
                value={formData.historiaDoenca || ""}
                onChange={(e) =>
                  setFormData({ ...formData, historiaDoenca: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="antecedentes">Antecedentes Patologicos</Label>
              <Textarea
                id="antecedentes"
                rows={2}
                value={formData.antecedentesPatologicos || ""}
                onChange={(e) =>
                  setFormData({ ...formData, antecedentesPatologicos: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="diagnosticoFinal">Diagnostico Final</Label>
              <Input
                id="diagnosticoFinal"
                value={formData.diagnosticoFinal || ""}
                onChange={(e) =>
                  setFormData({ ...formData, diagnosticoFinal: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="ativo"
                checked={formData.ativo ?? true}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, ativo: checked })
                }
              />
              <Label htmlFor="ativo">Caso ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
