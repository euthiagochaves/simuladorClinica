"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { perguntasApi } from "@/lib/api";
import type { Pergunta } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

type FormData = Partial<Pergunta>;

export default function AdminPerguntasPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Pergunta | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const { data: perguntas, isLoading, error } = useSWR<Pergunta[]>(
    "admin-perguntas",
    () => perguntasApi.listar()
  );

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      textoPergunta: "",
      categoria: "",
      ativa: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (item: Pergunta) => {
    setEditingItem(item);
    setFormData({ ...item });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingItem) {
        await perguntasApi.atualizar(editingItem.id, formData);
      } else {
        await perguntasApi.criar(formData);
      }
      mutate("admin-perguntas");
      setDialogOpen(false);
    } catch (err) {
      console.error("Erro ao salvar:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta pergunta?")) return;
    setDeleting(id);
    try {
      await perguntasApi.excluir(id);
      mutate("admin-perguntas");
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
            <p className="font-medium">Erro ao carregar perguntas</p>
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
        <h2 className="text-xl font-semibold">Perguntas de Anamnese</h2>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Nova Pergunta
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="max-h-[600px]">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 text-left text-sm font-medium">Pergunta</th>
                  <th className="p-3 text-left text-sm font-medium">Categoria</th>
                  <th className="p-3 text-left text-sm font-medium">Status</th>
                  <th className="p-3 text-right text-sm font-medium">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-3"><Skeleton className="h-5 w-64" /></td>
                      <td className="p-3"><Skeleton className="h-5 w-24" /></td>
                      <td className="p-3"><Skeleton className="h-5 w-16" /></td>
                      <td className="p-3"><Skeleton className="h-8 w-20" /></td>
                    </tr>
                  ))
                ) : perguntas?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      Nenhuma pergunta cadastrada
                    </td>
                  </tr>
                ) : (
                  perguntas?.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/30">
                      <td className="p-3 max-w-md">
                        <p className="line-clamp-2">{item.textoPergunta}</p>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{item.categoria || "Sem categoria"}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant={item.ativa ? "success" : "secondary"}>
                          {item.ativa ? "Ativa" : "Inativa"}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                            disabled={deleting === item.id}
                          >
                            {deleting === item.id ? (
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Editar Pergunta" : "Nova Pergunta"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="textoPergunta">Texto da Pergunta</Label>
              <Input
                id="textoPergunta"
                value={formData.textoPergunta || ""}
                onChange={(e) =>
                  setFormData({ ...formData, textoPergunta: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                id="categoria"
                placeholder="Ex: Historia Familiar, Queixa Principal..."
                value={formData.categoria || ""}
                onChange={(e) =>
                  setFormData({ ...formData, categoria: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="ativa"
                checked={formData.ativa ?? true}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, ativa: checked })
                }
              />
              <Label htmlFor="ativa">Pergunta ativa</Label>
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
