// Admin mock data and types

export interface TradeInRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deviceModel: string;
  deviceStorage: string;
  deviceCondition: string;
  batteryHealth: number;
  estimatedValue: number;
  interestedIn: string;
  status: "pendiente" | "contactado" | "evaluando" | "aprobado" | "rechazado" | "completado";
  createdAt: string;
  notes: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalPurchases: number;
  lastPurchase: string;
  createdAt: string;
  notes: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  customerId: string;
  customerName: string;
  price: number;
  paymentMethod: "efectivo" | "transferencia" | "cuotas" | "canje";
  status: "pendiente" | "completada" | "cancelada";
  createdAt: string;
}

export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  pendingTradeIns: number;
  lowStockProducts: number;
  monthlyGrowth: number;
  weeklyOrders: number;
}

// Mock trade-in requests
export const MOCK_TRADE_INS: TradeInRequest[] = [
  {
    id: "TI001",
    customerName: "Juan Pérez",
    customerPhone: "+54 9 351 234 5678",
    customerEmail: "juan.perez@email.com",
    deviceModel: "iPhone 12 Pro",
    deviceStorage: "256GB",
    deviceCondition: "Buen estado, pequeños rayones en los bordes",
    batteryHealth: 84,
    estimatedValue: 380000,
    interestedIn: "iPhone 14 Pro",
    status: "pendiente",
    createdAt: "2024-01-15T10:30:00",
    notes: ""
  },
  {
    id: "TI002",
    customerName: "María González",
    customerPhone: "+54 9 351 456 7890",
    customerEmail: "maria.g@email.com",
    deviceModel: "iPhone 11",
    deviceStorage: "128GB",
    deviceCondition: "Excelente estado, sin marcas",
    batteryHealth: 91,
    estimatedValue: 280000,
    interestedIn: "iPhone 13",
    status: "contactado",
    createdAt: "2024-01-14T15:45:00",
    notes: "Llamar después de las 18hs"
  },
  {
    id: "TI003",
    customerName: "Carlos Rodríguez",
    customerPhone: "+54 9 351 789 0123",
    customerEmail: "carlos.r@email.com",
    deviceModel: "iPhone 13 mini",
    deviceStorage: "128GB",
    deviceCondition: "Pantalla rota en esquina inferior",
    batteryHealth: 78,
    estimatedValue: 180000,
    interestedIn: "iPhone 15",
    status: "evaluando",
    createdAt: "2024-01-13T09:15:00",
    notes: "Requiere revisión presencial"
  },
  {
    id: "TI004",
    customerName: "Ana Martínez",
    customerPhone: "+54 9 351 321 6549",
    customerEmail: "ana.m@email.com",
    deviceModel: "iPhone XR",
    deviceStorage: "64GB",
    deviceCondition: "Face ID no funciona",
    batteryHealth: 72,
    estimatedValue: 120000,
    interestedIn: "iPhone 12",
    status: "aprobado",
    createdAt: "2024-01-12T14:20:00",
    notes: "Aprobado con valor de $110.000"
  },
  {
    id: "TI005",
    customerName: "Lucas Fernández",
    customerPhone: "+54 9 351 654 9873",
    customerEmail: "lucas.f@email.com",
    deviceModel: "iPhone 14",
    deviceStorage: "128GB",
    deviceCondition: "Como nuevo, en caja original",
    batteryHealth: 98,
    estimatedValue: 650000,
    interestedIn: "iPhone 15 Pro Max",
    status: "completado",
    createdAt: "2024-01-10T11:00:00",
    notes: "Canje realizado exitosamente"
  }
];

// Mock customers
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "C001",
    name: "Juan Pérez",
    phone: "+54 9 351 234 5678",
    email: "juan.perez@email.com",
    totalPurchases: 2,
    lastPurchase: "2024-01-15",
    createdAt: "2023-06-10",
    notes: "Cliente frecuente"
  },
  {
    id: "C002",
    name: "María González",
    phone: "+54 9 351 456 7890",
    email: "maria.g@email.com",
    totalPurchases: 1,
    lastPurchase: "2024-01-14",
    createdAt: "2024-01-14",
    notes: ""
  },
  {
    id: "C003",
    name: "Carlos Rodríguez",
    phone: "+54 9 351 789 0123",
    email: "carlos.r@email.com",
    totalPurchases: 3,
    lastPurchase: "2024-01-10",
    createdAt: "2023-03-20",
    notes: "Compra para reventa"
  },
  {
    id: "C004",
    name: "Sofía López",
    phone: "+54 9 351 111 2222",
    email: "sofia.l@email.com",
    totalPurchases: 5,
    lastPurchase: "2024-01-08",
    createdAt: "2022-11-15",
    notes: "VIP - Descuento especial"
  },
  {
    id: "C005",
    name: "Martín Sánchez",
    phone: "+54 9 351 333 4444",
    email: "martin.s@email.com",
    totalPurchases: 1,
    lastPurchase: "2024-01-05",
    createdAt: "2024-01-05",
    notes: ""
  }
];

// Mock sales
export const MOCK_SALES: Sale[] = [
  {
    id: "V001",
    productId: "1",
    productName: "iPhone 15 Pro Max 256GB",
    customerId: "C001",
    customerName: "Juan Pérez",
    price: 2150000,
    paymentMethod: "cuotas",
    status: "completada",
    createdAt: "2024-01-15T10:30:00"
  },
  {
    id: "V002",
    productId: "2",
    productName: "iPhone 14 Pro 256GB",
    customerId: "C002",
    customerName: "María González",
    price: 1450000,
    paymentMethod: "transferencia",
    status: "completada",
    createdAt: "2024-01-14T15:45:00"
  },
  {
    id: "V003",
    productId: "6",
    productName: "AirPods Pro 2",
    customerId: "C003",
    customerName: "Carlos Rodríguez",
    price: 380000,
    paymentMethod: "efectivo",
    status: "completada",
    createdAt: "2024-01-13T12:00:00"
  },
  {
    id: "V004",
    productId: "5",
    productName: "iPhone 11 128GB Reacondicionado",
    customerId: "C004",
    customerName: "Sofía López",
    price: 420000,
    paymentMethod: "canje",
    status: "pendiente",
    createdAt: "2024-01-12T16:30:00"
  },
  {
    id: "V005",
    productId: "3",
    productName: "iPhone 13 128GB",
    customerId: "C005",
    customerName: "Martín Sánchez",
    price: 780000,
    paymentMethod: "efectivo",
    status: "completada",
    createdAt: "2024-01-11T11:15:00"
  }
];

// Dashboard stats
export const MOCK_STATS: DashboardStats = {
  totalSales: 47,
  totalRevenue: 28500000,
  pendingTradeIns: 3,
  lowStockProducts: 2,
  monthlyGrowth: 12.5,
  weeklyOrders: 8
};

// Helper functions
export function getTradeInStatusLabel(status: TradeInRequest["status"]): string {
  const labels: Record<TradeInRequest["status"], string> = {
    pendiente: "Pendiente",
    contactado: "Contactado",
    evaluando: "En evaluación",
    aprobado: "Aprobado",
    rechazado: "Rechazado",
    completado: "Completado"
  };
  return labels[status];
}

export function getTradeInStatusColor(status: TradeInRequest["status"]): string {
  const colors: Record<TradeInRequest["status"], string> = {
    pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
    contactado: "bg-blue-100 text-blue-800 border-blue-200",
    evaluando: "bg-purple-100 text-purple-800 border-purple-200",
    aprobado: "bg-green-100 text-green-800 border-green-200",
    rechazado: "bg-red-100 text-red-800 border-red-200",
    completado: "bg-gray-100 text-gray-800 border-gray-200"
  };
  return colors[status];
}

export function getSaleStatusLabel(status: Sale["status"]): string {
  const labels: Record<Sale["status"], string> = {
    pendiente: "Pendiente",
    completada: "Completada",
    cancelada: "Cancelada"
  };
  return labels[status];
}

export function getSaleStatusColor(status: Sale["status"]): string {
  const colors: Record<Sale["status"], string> = {
    pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
    completada: "bg-green-100 text-green-800 border-green-200",
    cancelada: "bg-red-100 text-red-800 border-red-200"
  };
  return colors[status];
}

export function getPaymentMethodLabel(method: Sale["paymentMethod"]): string {
  const labels: Record<Sale["paymentMethod"], string> = {
    efectivo: "Efectivo",
    transferencia: "Transferencia",
    cuotas: "Cuotas",
    canje: "Canje"
  };
  return labels[method];
}

/** Estados persistidos (Prisma `TradeInStatus`) — panel canjes con datos reales */
export type DbTradeInStatus = "PENDING" | "REVIEWED" | "REJECTED" | "ACCEPTED";

export function getDbTradeInStatusLabel(status: string): string {
  const labels: Record<DbTradeInStatus, string> = {
    PENDING: "Pendiente",
    REVIEWED: "Revisado",
    REJECTED: "Rechazado",
    ACCEPTED: "Aceptado",
  };
  return labels[status as DbTradeInStatus] ?? status;
}

export function getDbTradeInStatusColor(status: string): string {
  const colors: Record<DbTradeInStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    REVIEWED: "bg-blue-100 text-blue-800 border-blue-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
    ACCEPTED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };
  return colors[status as DbTradeInStatus] ?? "bg-zinc-100 text-zinc-800 border-zinc-200";
}

