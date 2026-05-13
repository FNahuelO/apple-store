"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Package,
  RefreshCcw,
  Users,
  ShoppingCart,
  Settings,
  Menu,
  LogOut,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Productos", href: "/admin/productos", icon: Package },
  { name: "Solicitudes de canje", href: "/admin/canjes", icon: RefreshCcw },
  { name: "Clientes", href: "/admin/clientes", icon: Users },
  { name: "Ventas", href: "/admin/ventas", icon: ShoppingCart },
  { name: "Configuración", href: "/admin/configuracion", icon: Settings },
];

function Sidebar({
  className,
  onNavigate,
  pendingTradeIns,
}: {
  className?: string;
  onNavigate?: () => void;
  pendingTradeIns: number;
}) {
  const pathname = usePathname();

  return (
    <div className={cn("flex h-full flex-col bg-zinc-950 text-white", className)}>
      <div className="flex h-16 items-center gap-2 border-b border-zinc-800 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
          <span className="text-lg font-bold text-zinc-950"></span>
        </div>
        <div>
          <span className="text-sm font-semibold">Apple Reseller</span>
          <span className="block text-xs text-zinc-400">Backoffice</span>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onNavigate?.()}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white text-zinc-950"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="flex-1 truncate">{item.name}</span>
                {item.href === "/admin/canjes" && pendingTradeIns > 0 && (
                  <Badge className="shrink-0 bg-red-500 text-white hover:bg-red-500">{pendingTradeIns}</Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="border-t border-zinc-800 p-4">
        <LogoutButton onNavigate={onNavigate} />
      </div>
    </div>
  );
}

function LogoutButton({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    onNavigate?.();
    router.push("/admin/login");
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className="w-full justify-start gap-3 text-zinc-400 hover:bg-zinc-800 hover:text-white"
      onClick={() => void handleLogout()}
    >
      <LogOut className="h-5 w-5" />
      Cerrar sesión
    </Button>
  );
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingTradeIns, setPendingTradeIns] = useState(0);

  useEffect(() => {
    queueMicrotask(() => {
      void (async () => {
        const res = await fetch("/api/admin/trade-ins");
        if (!res.ok) return;
        const rows: { status: string }[] = await res.json();
        setPendingTradeIns(rows.filter((r) => r.status === "PENDING").length);
      })();
    });
  }, []);

  async function handleHeaderLogout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    router.push("/admin/login");
  }

  return (
    <div className="flex h-screen bg-zinc-100">
      <div className="hidden w-64 lg:block">
        <Sidebar pendingTradeIns={pendingTradeIns} />
      </div>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 border-zinc-800 bg-zinc-950 p-0 lg:hidden">
          <Sidebar
            pendingTradeIns={pendingTradeIns}
            onNavigate={() => setSidebarOpen(false)}
            className="border-0"
          />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Abrir menú"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Buscar en el panel…"
                className="border-zinc-200 bg-zinc-50 pl-10"
                disabled
              />
            </div>
          </div>

          <Button variant="ghost" size="icon" className="relative" type="button" disabled>
            <Bell className="h-5 w-5" />
            {pendingTradeIns > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] text-white">
                {pendingTradeIns > 9 ? "9+" : pendingTradeIns}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-zinc-900 text-sm text-white">AD</AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium md:inline-block">Admin</span>
                <ChevronDown className="h-4 w-4 text-zinc-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/configuracion">Configuración</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={() => void handleHeaderLogout()}>
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
