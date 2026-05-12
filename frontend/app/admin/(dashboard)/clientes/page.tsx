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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  Users,
  MoreHorizontal,
  Pencil,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Star,
} from "lucide-react";
import { MOCK_CUSTOMERS, type Customer } from "@/lib/admin-data";
import { getWhatsAppLink } from "@/lib/constants";

export default function ClientesPage() {
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
    );
  });

  const totalCustomers = customers.length;
  const vipCustomers = customers.filter(c => c.totalPurchases >= 3).length;
  const newCustomers = customers.filter(c => {
    const createdDate = new Date(c.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate >= thirtyDaysAgo;
  }).length;

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsNewCustomer(false);
    setIsDialogOpen(true);
  };

  const handleNewCustomer = () => {
    setSelectedCustomer(null);
    setIsNewCustomer(true);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Clientes</h1>
          <p className="text-sm text-zinc-500">Gestiona tu base de clientes</p>
        </div>
        <Button onClick={handleNewCustomer} className="bg-zinc-900 hover:bg-zinc-800">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo cliente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-zinc-200">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
              <Users className="h-5 w-5 text-zinc-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">{totalCustomers}</p>
              <p className="text-sm text-zinc-500">Total clientes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <Star className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-900">{vipCustomers}</p>
              <p className="text-sm text-amber-700">Clientes VIP</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <Calendar className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-900">{newCustomers}</p>
              <p className="text-sm text-emerald-700">Nuevos (30 dias)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-zinc-200">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Buscar por nombre, email o telefono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card className="border-zinc-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de clientes ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead className="text-center">Compras</TableHead>
                <TableHead>Ultima compra</TableHead>
                <TableHead>Desde</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium">
                        {customer.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        {customer.totalPurchases >= 3 && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                            VIP
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{customer.phone}</p>
                      <p className="text-zinc-500">{customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{customer.totalPurchases}</span>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {formatDate(customer.lastPurchase)}
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {formatDate(customer.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Ver/Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a
                            href={getWhatsAppLink(`Hola ${customer.name}, te contactamos desde Apple Reseller.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            WhatsApp
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={`tel:${customer.phone}`}>
                            <Phone className="h-4 w-4 mr-2" />
                            Llamar
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={`mailto:${customer.email}`}>
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </a>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isNewCustomer ? "Nuevo cliente" : "Datos del cliente"}
            </DialogTitle>
            <DialogDescription>
              {isNewCustomer
                ? "Completa los datos del nuevo cliente"
                : "Visualiza y edita la informacion del cliente"
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Customer Stats (only for existing) */}
            {!isNewCustomer && selectedCustomer && (
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-zinc-200 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedCustomer.totalPurchases}</p>
                  <p className="text-xs text-zinc-500">Compras totales</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">
                    {formatDate(selectedCustomer.lastPurchase)}
                  </p>
                  <p className="text-xs text-zinc-500">Ultima compra</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                defaultValue={selectedCustomer?.name}
                placeholder="Juan Perez"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefono</Label>
                <Input
                  id="phone"
                  defaultValue={selectedCustomer?.phone}
                  placeholder="+54 9 351 123 4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={selectedCustomer?.email}
                  placeholder="cliente@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                defaultValue={selectedCustomer?.notes}
                placeholder="Notas sobre el cliente..."
                rows={3}
              />
            </div>

            {/* Quick Actions (only for existing) */}
            {!isNewCustomer && selectedCustomer && (
              <div className="flex gap-2 pt-2">
                <a
                  href={getWhatsAppLink(`Hola ${selectedCustomer.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full gap-2">
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp
                  </Button>
                </a>
                <a href={`tel:${selectedCustomer.phone}`} className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <Phone className="h-4 w-4" />
                    Llamar
                  </Button>
                </a>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-zinc-900 hover:bg-zinc-800">
              {isNewCustomer ? "Crear cliente" : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
