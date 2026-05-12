"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  Package,
  RefreshCcw,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Users,
  Eye,
} from "lucide-react";
import {
  MOCK_STATS,
  MOCK_SALES,
  getDbTradeInStatusColor,
  getDbTradeInStatusLabel,
  getSaleStatusColor,
  getSaleStatusLabel,
} from "@/lib/admin-data";
import { formatPrice } from "@/lib/constants";
import Link from "next/link";

type ApiTradeIn = {
  id: string;
  fullName: string;
  phone: string;
  brand: string;
  model: string;
  storage: string | null;
  desiredModel: string | null;
  status: string;
  createdAt: string;
};

type ApiProduct = {
  id: string;
  stock: number;
};

export default function AdminDashboard() {
  const [pendingCount, setPendingCount] = useState(MOCK_STATS.pendingTradeIns);
  const [lowStockCount, setLowStockCount] = useState(MOCK_STATS.lowStockProducts);
  const [recentTradeRows, setRecentTradeRows] = useState<ApiTradeIn[]>([]);

  useEffect(() => {
    async function load() {
      const [pr, tr] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/trade-ins"),
      ]);
      if (pr.ok) {
        const products: ApiProduct[] = await pr.json();
        setLowStockCount(products.filter((p) => p.stock > 0 && p.stock <= 2).length);
      }
      if (tr.ok) {
        const rows: ApiTradeIn[] = await tr.json();
        setPendingCount(rows.filter((r) => r.status === "PENDING").length);
        setRecentTradeRows(
          rows.filter((r) => r.status === "PENDING" || r.status === "REVIEWED").slice(0, 5),
        );
      }
    }
    void load();
  }, []);

  const recentSales = MOCK_SALES.slice(0, 5);

  const stats = useMemo(
    () => [
      {
        title: "Ventas del mes (demo)",
        value: MOCK_STATS.totalSales,
        change: "+12%",
        changeType: "positive" as const,
        icon: ShoppingCart,
        description: "vs. mes anterior",
      },
      {
        title: "Ingresos totales (demo)",
        value: formatPrice(MOCK_STATS.totalRevenue),
        change: `+${MOCK_STATS.monthlyGrowth}%`,
        changeType: "positive" as const,
        icon: DollarSign,
        description: "vs. mes anterior",
      },
      {
        title: "Canjes pendientes",
        value: pendingCount,
        change: "en base de datos",
        changeType: "neutral" as const,
        icon: RefreshCcw,
        description: "estado Pendiente",
      },
      {
        title: "Stock bajo",
        value: lowStockCount,
        change: "≤ 2 uds.",
        changeType: lowStockCount > 0 ? ("negative" as const) : ("neutral" as const),
        icon: Package,
        description: "con stock publicable",
      },
    ],
    [pendingCount, lowStockCount],
  );

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
          <p className="text-sm text-zinc-500">
            Panel de administración — canjes y stock conectados a la base de datos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Exportar reporte
          </Button>
          <Button size="sm" className="bg-zinc-900 hover:bg-zinc-800" asChild>
            <Link href="/admin/ventas">Ventas</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-zinc-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs">
                {stat.changeType === "positive" && <ArrowUpRight className="h-3 w-3 text-emerald-500" />}
                {stat.changeType === "negative" && <ArrowDownRight className="h-3 w-3 text-red-500" />}
                <span
                  className={
                    stat.changeType === "positive"
                      ? "text-emerald-600"
                      : stat.changeType === "negative"
                        ? "text-red-600"
                        : "text-zinc-500"
                  }
                >
                  {stat.change}
                </span>
                <span className="text-zinc-400">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-zinc-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Ventas recientes (demo)</CardTitle>
              <CardDescription>Datos de ejemplo — el módulo ventas sigue en mock</CardDescription>
            </div>
            <Link href="/admin/ventas">
              <Button variant="ghost" size="sm" className="gap-1">
                Ver todas
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="text-sm font-medium">
                      {sale.productName.length > 22 ? `${sale.productName.slice(0, 22)}…` : sale.productName}
                    </TableCell>
                    <TableCell className="text-sm text-zinc-500">{sale.customerName}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{formatPrice(sale.price)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getSaleStatusColor(sale.status)}>
                        {getSaleStatusLabel(sale.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-zinc-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Canjes recientes</CardTitle>
              <CardDescription>Pendientes y en revisión desde la base de datos</CardDescription>
            </div>
            <Link href="/admin/canjes">
              <Button variant="ghost" size="sm" className="gap-1">
                Ver todos
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTradeRows.length === 0 ? (
              <p className="py-8 text-center text-sm text-zinc-500">No hay solicitudes recientes</p>
            ) : (
              recentTradeRows.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 p-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{t.fullName}</p>
                    <p className="text-xs text-zinc-500">
                      {t.brand} {t.model} {t.storage ? `· ${t.storage}` : ""}
                    </p>
                    {t.desiredModel && (
                      <p className="text-xs text-zinc-400">Interés: {t.desiredModel}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className={getDbTradeInStatusColor(t.status)}>
                      {getDbTradeInStatusLabel(t.status)}
                    </Badge>
                    <span className="text-xs text-zinc-400">{t.phone}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-zinc-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-500">
              <TrendingUp className="h-4 w-4" />
              Catálogo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">Productos</p>
            <Button variant="link" className="h-auto p-0 text-sm text-zinc-500" asChild>
              <Link href="/admin/productos">Gestionar inventario</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-zinc-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-500">
              <Users className="h-4 w-4" />
              Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">CRM (demo)</p>
            <Button variant="link" className="h-auto p-0 text-sm text-zinc-500" asChild>
              <Link href="/admin/clientes">Ver clientes</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-zinc-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-500">
              <Eye className="h-4 w-4" />
              Sitio público
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" asChild>
              <Link href="/" target="_blank" rel="noopener noreferrer">
                Abrir tienda
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
