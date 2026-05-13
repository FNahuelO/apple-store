// WhatsApp configuration (NEXT_PUBLIC_* se inyecta en build; fallback para desarrollo)
export const WHATSAPP_NUMBER =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "")) ||
  "5493516123456";
export const STORE_NAME = "Apple Reseller";
export const STORE_ADDRESS = "Av. Colón 123, Córdoba";
export const STORE_HOURS = {
  weekdays: "10:00 a 13:00 - 16:00 a 20:00",
  saturday: "10:00 a 13:30",
  sunday: "Cerrado"
};
export const INSTAGRAM_URL = "https://instagram.com/applereseller.ok";

// Helper function to generate WhatsApp link
export function getWhatsAppLink(message?: string): string {
  const encodedMessage = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${WHATSAPP_NUMBER}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
}

export function getGoogleMapsLink(address: string = STORE_ADDRESS): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

// Product types
export type ProductCondition = "nuevo" | "usado" | "reacondicionado";
export type ProductStorage = "64GB" | "128GB" | "256GB" | "512GB" | "1TB";

export interface Product {
  id: string;
  name: string;
  model: string;
  storage: string;
  color: string;
  condition: ProductCondition;
  batteryHealth?: number;
  price: number;
  oldPrice?: number;
  description: string;
  warranty: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  images: string[];
}

// Mock products
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    model: "iPhone 15 Pro Max",
    storage: "256GB",
    color: "Titanio Natural",
    condition: "nuevo",
    price: 2150000,
    description: "El iPhone más avanzado. Chip A17 Pro, cámara de 48MP con zoom óptico 5x, cuerpo de titanio y USB-C.",
    warranty: "12 meses de garantía oficial",
    stock: 3,
    isActive: true,
    isFeatured: true,
    isOnSale: false,
    images: ["/products/iphone-15-pro-max.jpg"]
  },
  {
    id: "2",
    name: "iPhone 14 Pro",
    model: "iPhone 14 Pro",
    storage: "256GB",
    color: "Morado Oscuro",
    condition: "usado",
    batteryHealth: 92,
    price: 1450000,
    oldPrice: 1650000,
    description: "iPhone 14 Pro en excelente estado. Dynamic Island, cámara de 48MP y pantalla always-on.",
    warranty: "6 meses de garantía",
    stock: 2,
    isActive: true,
    isFeatured: true,
    isOnSale: true,
    images: ["/products/iphone-14-pro.jpg"]
  },
  {
    id: "3",
    name: "iPhone 13",
    model: "iPhone 13",
    storage: "128GB",
    color: "Medianoche",
    condition: "usado",
    batteryHealth: 88,
    price: 780000,
    description: "iPhone 13 en muy buen estado. Chip A15 Bionic, sistema de cámaras duales y pantalla Super Retina XDR.",
    warranty: "3 meses de garantía",
    stock: 4,
    isActive: true,
    isFeatured: false,
    isOnSale: false,
    images: ["/products/iphone-13.jpg"]
  },
  {
    id: "4",
    name: "iPhone 12",
    model: "iPhone 12",
    storage: "128GB",
    color: "Azul",
    condition: "usado",
    batteryHealth: 85,
    price: 580000,
    oldPrice: 650000,
    description: "iPhone 12 con batería al 85%. Diseño con bordes planos, 5G y pantalla OLED.",
    warranty: "3 meses de garantía",
    stock: 3,
    isActive: true,
    isFeatured: false,
    isOnSale: true,
    images: ["/products/iphone-12.jpg"]
  },
  {
    id: "5",
    name: "iPhone 11",
    model: "iPhone 11",
    storage: "128GB",
    color: "Negro",
    condition: "reacondicionado",
    batteryHealth: 100,
    price: 420000,
    description: "iPhone 11 reacondicionado con batería nueva. Cámara dual y chip A13 Bionic.",
    warranty: "6 meses de garantía",
    stock: 5,
    isActive: true,
    isFeatured: true,
    isOnSale: false,
    images: ["/products/iphone-11.jpg"]
  },
  {
    id: "6",
    name: "AirPods Pro 2",
    model: "AirPods Pro",
    storage: "64GB",
    color: "Blanco",
    condition: "nuevo",
    price: 380000,
    description: "AirPods Pro de segunda generación con cancelación activa de ruido y audio espacial personalizado.",
    warranty: "12 meses de garantía",
    stock: 8,
    isActive: true,
    isFeatured: true,
    isOnSale: false,
    images: ["/products/airpods-pro.jpg"]
  },
  {
    id: "7",
    name: "Cargador USB-C 20W",
    model: "USB-C Charger",
    storage: "64GB",
    color: "Blanco",
    condition: "nuevo",
    price: 35000,
    description: "Cargador USB-C de 20W original Apple. Carga rápida para iPhone y iPad.",
    warranty: "12 meses de garantía",
    stock: 15,
    isActive: true,
    isFeatured: false,
    isOnSale: false,
    images: ["/products/charger.jpg"]
  },
  {
    id: "8",
    name: "iPhone 15",
    model: "iPhone 15",
    storage: "128GB",
    color: "Rosa",
    condition: "nuevo",
    price: 1550000,
    description: "iPhone 15 con Dynamic Island, cámara de 48MP y USB-C. El iPhone perfecto para todos.",
    warranty: "12 meses de garantía oficial",
    stock: 4,
    isActive: true,
    isFeatured: true,
    isOnSale: false,
    images: ["/products/iphone-15.jpg"]
  }
];

// Format price to ARS
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

// Get condition label
export function getConditionLabel(condition: ProductCondition): string {
  const labels: Record<ProductCondition, string> = {
    nuevo: "Nuevo",
    usado: "Usado",
    reacondicionado: "Reacondicionado"
  };
  return labels[condition];
}

// Get condition color
export function getConditionColor(condition: ProductCondition): string {
  const colors: Record<ProductCondition, string> = {
    nuevo: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
    usado: "bg-amber-500/10 text-amber-700 border-amber-200",
    reacondicionado: "bg-sky-500/10 text-sky-700 border-sky-200"
  };
  return colors[condition];
}
