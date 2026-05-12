"use client";

import { useState } from "react";
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
import {
  Search,
  Plus,
  ShoppingCart,
  DollarSign,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  Banknote,
  RefreshCcw,
  ArrowLeftRight,
} from "lucide-react";
import { 
  MOCK_SALES, 
  getSaleStatusLabel, 
  getSaleStatusColor,
  getPaymentMethodLabel,
  type Sale 
} from "@/lib/admin-data";
import { formatPrice } from "@/lib/constants";

export default function VentasPage() {
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPayment, setFilterPayment] = useState<string>("all");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewSale, setIsNewSale] = useState(false);

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = 
      sale.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || sale.status === filterStatus;
    const matchesPayment = filterPayment === "all" || sale.paymentMethod === filterPayment;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalRevenue = sales
    .filter(s => s.status === "completada")
    .reduce((sum, s) => sum + s.price, 0);
  
  const pendingSales = sales.filter(s => s.status === "pendiente").length;
  const completedSales = sales.filter(s => s.status === "completada").length;

  const handleViewSale = (sale: Sale) => {
    setSelectedSale(sale);
    setIsNewSale(false);
    setIsDialogOpen(true);
  };

  const handleNewSale = () => {
    setSelectedSale(null);
    setIsNewSale(true);
    setIsDialogOpen(true);
  };

  const handleStatusChange = (saleId: string, newStatus: Sale["status"]) => {
    setSales(sales.map(s => 
      s.id === saleId ? { ...s, status: newStatus } : s
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getPaymentIcon = (method: Sale["paymentMethod"]) => {
    switch (method) {
      case "efectivo": return <Banknote className="h-4 w-4" />;
      case "transferencia": return <ArrowLeftRight className="h-4 w-4" />;
      case "cuotas": return <CreditCard className="h-4 w-4" />;
      case "canje": return <RefreshCcw className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Ventas</h1>
          <p className="text-sm text-zinc-500">Registro de todas las transacciones</p>
        </div>
        <Button onClick={handleNewSale} className="bg-zinc-900 hover:bg-zinc-800">
          <Plus className="h-4 w-4 mr-2" />
          Nueva venta
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-emerald-900">{formatPrice(totalRevenue)}</p>
              <p className="text-sm text-emerald-700">Ingresos totales</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-200">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
              <CheckCircle2 className="h-5 w-5 text-zinc-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">{completedSales}</p>
              <p className="text-sm text-zinc-500">Ventas completadas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-900">{pendingSales}</p>
              <p className="text-sm text-yellow-700">Ventas pendientes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-zinc-200">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Buscar por producto, cliente o ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPayment} onValueChange={setFilterPayment}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Metodo pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
                <SelectItem value="cuotas">Cuotas</SelectItem>
                <SelectItem value="canje">Canje</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card className="border-zinc-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Historial de ventas ({filteredSales.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Metodo</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-mono text-sm">{sale.id}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {sale.productName}
                  </TableCell>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPaymentIcon(sale.paymentMethod)}
                      <span className="text-sm">{getPaymentMethodLabel(sale.paymentMethod)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(sale.price)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getSaleStatusColor(sale.status)}>
                      {getSaleStatusLabel(sale.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {formatDate(sale.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewSale(sale)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sale Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isNewSale ? "Nueva venta" : `Venta ${selectedSale?.id}`}
            </DialogTitle>
            <DialogDescription>
              {isNewSale 
                ? "Registra una nueva venta"
                : `Registrada el ${selectedSale && formatDate(selectedSale.createdAt)}`
              }
            </DialogDescription>
          </DialogHeader>

          {isNewSale ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Producto</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un producto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">iPhone 15 Pro Max 256GB</SelectItem>
                    <SelectItem value="2">iPhone 14 Pro 256GB</SelectItem>
                    <SelectItem value="3">iPhone 13 128GB</SelectItem>
                    <SelectItem value="5">iPhone 11 128GB Reacondicionado</SelectItem>
                    <SelectItem value="6">AirPods Pro 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="C001">Juan Perez</SelectItem>
                    <SelectItem value="C002">Maria Gonzalez</SelectItem>
                    <SelectItem value="C003">Carlos Rodriguez</SelectItem>
                    <SelectItem value="C004">Sofia Lopez</SelectItem>
                    <SelectItem value="new">+ Nuevo cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Precio</Label>
                  <Input type="number" placeholder="1500000" />
                </div>
                <div className="space-y-2">
                  <Label>Metodo de pago</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="cuotas">Cuotas</SelectItem>
                      <SelectItem value="canje">Canje</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : selectedSale && (
            <div className="space-y-4 py-4">
              {/* Sale Info */}
              <div className="rounded-lg border border-zinc-200 p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{selectedSale.productName}</p>
                    <p className="text-sm text-zinc-500">Cliente: {selectedSale.customerName}</p>
                  </div>
                  <Badge variant="outline" className={getSaleStatusColor(selectedSale.status)}>
                    {getSaleStatusLabel(selectedSale.status)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    {getPaymentIcon(selectedSale.paymentMethod)}
                    {getPaymentMethodLabel(selectedSale.paymentMethod)}
                  </div>
                  <p className="text-xl font-bold text-emerald-600">
                    {formatPrice(selectedSale.price)}
                  </p>
                </div>
              </div>

              {/* Status Change */}
              {selectedSale.status === "pendiente" && (
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      handleStatusChange(selectedSale.id, "completada");
                      setSelectedSale({ ...selectedSale, status: "completada" });
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Marcar completada
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => {
                      handleStatusChange(selectedSale.id, "cancelada");
                      setSelectedSale({ ...selectedSale, status: "cancelada" });
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {isNewSale ? "Cancelar" : "Cerrar"}
            </Button>
            {isNewSale && (
              <Button className="bg-zinc-900 hover:bg-zinc-800">
                Registrar venta
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
