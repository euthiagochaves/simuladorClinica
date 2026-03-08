"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { achadosApi } from "@/lib/api";
import type { AchadoFisico } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type FormData = Partial<AchadoFisico>;

const SISTEMAS = [
  "EstadoGeral",
  "Cardiovascular",
  "Digestivo",
  "Respiratorio",
  "Nefrologico",
  "Neurologico",
  "Osteoarticular",
];

export default function AdminAchadosPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AchadoFisico | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const { data: achados, isLoading, error } = useSWR<AchadoFisico[]>(
    "admin-achados",
    () => achadosApi.listar()
  );

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      nomeAchado: "",
      sistemaCategoria: "EstadoGeral",
      ativo: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (item: AchadoFisico) => {
    setEditingItem(item);
    setFormData({ ...item });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingItem) {
        await achadosApi.atualizar(editingItem.id, formData);
      } else {
        await achadosApi.criar(formData);
      }
      mutate("admin-achados");
      setDialogOpen(false);
    } catch (err) {
      console.error("Erro ao salvar:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este achado?")) return;
    setDeleting(id);
    try {
      await achadosApi.excluir(id);
      mutate("admin-achados");
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
            <p className="font-medium">Erro ao carregar achados</p>
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
        <h2 className="text-xl font-semibold">Achados Fisicos</h2>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Novo Achado
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="max-h-[600px]">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 text-left text-sm font-medium">Achado</th>
                  <th className="p-3 text-left text-sm font-medium">Sistema</th>
                  <th className="p-3 text-left text-sm font-medium">Status</th>
                  <th className="p-3 text-right text-sm font-medium">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-3"><Skeleton className="h-5 w-48" /></td>
                      <td className="p-3"><Skeleton className="h-5 w-24" /></td>
                      <td className="p-3"><Skeleton className="h-5 w-16" /></td>
                      <td className="p-3"><Skeleton className="h-8 w-20" /></td>
                    </tr>
                  ))
                ) : achados?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      Nenhum achado cadastrado
                    </td>
                  </tr>
                ) : (
                  achados?.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/30">
                      <td className="p-3">
                        <p>{item.nomeAchado}</p>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{item.sistemaCategoria}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant={item.ativo ? "success" : "secondary"}>
                          {item.ativo ? "Ativo" : "Inativo"}
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
              {editingItem ? "Editar Achado" : "Novo Achado Fisico"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nomeAchado">Nome do Achado</Label>
              <Input
                id="nomeAchado"
                value={formData.nomeAchado || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nomeAchado: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sistemaCategoria">Sistema/Categoria</Label>
              <Select
                value={formData.sistemaCategoria || "EstadoGeral"}
                onValueChange={(v) =>
                  setFormData({ ...formData, sistemaCategoria: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SISTEMAS.map((sistema) => (
                    <SelectItem key={sistema} value={sistema}>
                      {sistema}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="ativo"
                checked={formData.ativo ?? true}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, ativo: checked })
                }
              />
              <Label htmlFor="ativo">Achado ativo</Label>
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
