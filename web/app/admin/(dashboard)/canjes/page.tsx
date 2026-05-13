"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, RefreshCcw, Phone, Mail, MessageSquare, CheckCircle2, XCircle, Clock, Eye } from "lucide-react";
import {
  getDbTradeInStatusColor,
  getDbTradeInStatusLabel,
  type DbTradeInStatus,
} from "@/lib/admin-data";
import { getWhatsAppLink } from "@/lib/constants";

type TradeInRow = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  city: string | null;
  brand: string;
  model: string;
  storage: string | null;
  condition: string;
  batteryHealth: number | null;
  details: string | null;
  desiredModel: string | null;
  status: string;
  createdAt: string;
};

const STATUS_VALUES: DbTradeInStatus[] = ["PENDING", "REVIEWED", "REJECTED", "ACCEPTED"];

export default function AdminCanjesPage() {
  const [rows, setRows] = useState<TradeInRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selected, setSelected] = useState<TradeInRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/trade-ins");
    if (res.ok) setRows(await res.json());
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  const filtered = rows.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchQ =
      !q ||
      t.fullName.toLowerCase().includes(q) ||
      t.model.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q);
    const matchS = filterStatus === "all" || t.status === filterStatus;
    return matchQ && matchS;
  });

  const pendingCount = rows.filter((t) => t.status === "PENDING").length;
  const reviewedCount = rows.filter((t) => t.status === "REVIEWED").length;
  const acceptedCount = rows.filter((t) => t.status === "ACCEPTED").length;

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function patchStatus(id: string, status: DbTradeInStatus) {
    const res = await fetch(`/api/admin/trade-ins/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      await load();
      setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    }
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Solicitudes de canje</h1>
        <p className="text-sm text-zinc-500">Datos reales del formulario web</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
              <p className="text-sm text-yellow-700">Pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Phone className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{reviewedCount}</p>
              <p className="text-sm text-blue-700">Revisados</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-900">{acceptedCount}</p>
              <p className="text-sm text-emerald-700">Aceptados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-200">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Buscar por nombre, modelo o ID…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {STATUS_VALUES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {getDbTradeInStatusLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <RefreshCcw className="h-5 w-5" />
            Solicitudes ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Interés</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="max-w-[100px] truncate font-mono text-xs">{t.id}</TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{t.fullName}</p>
                    <p className="text-xs text-zinc-500">{t.phone}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">
                      {t.brand} {t.model}
                    </p>
                    <p className="text-xs text-zinc-500">{t.storage ?? "—"}</p>
                  </TableCell>
                  <TableCell className="max-w-[140px] truncate text-sm">{t.desiredModel ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getDbTradeInStatusColor(t.status)}>
                      {getDbTradeInStatusLabel(t.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">{formatDate(t.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={() => {
                          setSelected(t);
                          setDetailOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <a
                        href={getWhatsAppLink(
                          `Hola ${t.fullName}, te escribimos desde Apple Reseller por tu solicitud de canje.`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm" className="text-green-600" type="button">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex flex-wrap items-center gap-2">
              Solicitud
              {selected && (
                <Badge variant="outline" className={getDbTradeInStatusColor(selected.status)}>
                  {getDbTradeInStatusLabel(selected.status)}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {selected && <>Recibida el {formatDate(selected.createdAt)}</>}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="actions">Acciones</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4 pt-4">
                <div className="rounded-lg border border-zinc-200 p-4">
                  <h4 className="mb-3 font-medium">Datos del cliente</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-zinc-500">Nombre:</span>
                      <p className="font-medium">{selected.fullName}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">Teléfono:</span>
                      <p className="font-medium">{selected.phone}</p>
                    </div>
                    {selected.email && (
                      <div className="col-span-2">
                        <span className="text-zinc-500">Email:</span>
                        <p className="font-medium">{selected.email}</p>
                      </div>
                    )}
                    {selected.city && (
                      <div className="col-span-2">
                        <span className="text-zinc-500">Ciudad:</span>
                        <p className="font-medium">{selected.city}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-200 p-4">
                  <h4 className="mb-3 font-medium">Equipo ofrecido</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-zinc-500">Marca / modelo:</span>
                      <p className="font-medium">
                        {selected.brand} {selected.model}
                      </p>
                    </div>
                    <div>
                      <span className="text-zinc-500">Capacidad:</span>
                      <p className="font-medium">{selected.storage ?? "—"}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">Estado:</span>
                      <p className="font-medium">{selected.condition}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">Batería %:</span>
                      <p className="font-medium">{selected.batteryHealth ?? "—"}</p>
                    </div>
                    {selected.details && (
                      <div className="col-span-2">
                        <span className="text-zinc-500">Detalle:</span>
                        <p className="whitespace-pre-wrap text-zinc-700">{selected.details}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selected.desiredModel && (
                  <div className="rounded-lg border border-zinc-200 p-4">
                    <h4 className="mb-2 font-medium">Equipo deseado</h4>
                    <p className="text-lg font-semibold">{selected.desiredModel}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="actions" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <a href={`tel:${selected.phone}`} className="block">
                    <Button variant="outline" className="w-full gap-2" type="button">
                      <Phone className="h-4 w-4" />
                      Llamar
                    </Button>
                  </a>
                  <a
                    href={getWhatsAppLink(
                      `Hola ${selected.fullName}, te escribimos desde Apple Reseller por tu solicitud de canje.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full gap-2 bg-green-600 hover:bg-green-700" type="button">
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </Button>
                  </a>
                  {selected.email && (
                    <a href={`mailto:${selected.email}`} className="col-span-2 block">
                      <Button variant="outline" className="w-full gap-2" type="button">
                        <Mail className="h-4 w-4" />
                        Email
                      </Button>
                    </a>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Estado en sistema</Label>
                  <Select
                    value={selected.status}
                    onValueChange={(v) => void patchStatus(selected.id, v as DbTradeInStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_VALUES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {getDbTradeInStatusLabel(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Detalle enviado</Label>
                  <Textarea rows={3} readOnly value={selected.details ?? ""} placeholder="Sin detalle" />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 border-green-200 text-green-700 hover:bg-green-50"
                    type="button"
                    onClick={() => void patchStatus(selected.id, "ACCEPTED")}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Aceptar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 border-red-200 text-red-700 hover:bg-red-50"
                    type="button"
                    onClick={() => void patchStatus(selected.id, "REJECTED")}
                  >
                    <XCircle className="h-4 w-4" />
                    Rechazar
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setDetailOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
