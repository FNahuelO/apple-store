import { z } from "zod";
import {
  INSTAGRAM_URL,
  STORE_ADDRESS,
  STORE_NAME,
  WHATSAPP_NUMBER,
} from "./constants";

export const siteSettingsSchema = z.object({
  storeName: z.string().min(1).max(200),
  storeSlogan: z.string().max(300),
  storeDescription: z.string().max(5000),
  storeAddress: z.string().max(500),
  themePrimary: z.string().regex(/^#[\da-f]{6}$/i),
  themeAccent: z.string().regex(/^#[\da-f]{6}$/i),
  themeBackground: z.string().regex(/^#[\da-f]{6}$/i),
  weekdayMorningStart: z.string().max(16),
  weekdayMorningEnd: z.string().max(16),
  weekdayAfternoonStart: z.string().max(16),
  weekdayAfternoonEnd: z.string().max(16),
  saturdayStart: z.string().max(16),
  saturdayEnd: z.string().max(16),
  sundayClosed: z.boolean(),
  vacationBannerEnabled: z.boolean(),
  whatsappNumber: z.string().max(32),
  whatsappDefaultMessage: z.string().max(2000),
  whatsappFloatingButton: z.boolean(),
  instagramUrl: z.string().max(500),
  facebookUrl: z.string().max(500),
  tiktokUrl: z.string().max(500),
  notifyNewTradeIn: z.boolean(),
  notifyLowStock: z.boolean(),
  notifyDailySummary: z.boolean(),
  adminEmail: z.string().email(),
});

export type SiteSettingsData = z.infer<typeof siteSettingsSchema>;

export function getDefaultSiteSettings(): SiteSettingsData {
  return {
    storeName: STORE_NAME,
    storeSlogan: "Tu tienda Apple de confianza",
    storeDescription:
      "Venta de iPhones nuevos, usados y reacondicionados. Plan de canje y financiacion en cuotas.",
    storeAddress: STORE_ADDRESS,
    themePrimary: "#18181b",
    themeAccent: "#10b981",
    themeBackground: "#ffffff",
    weekdayMorningStart: "10:00",
    weekdayMorningEnd: "13:00",
    weekdayAfternoonStart: "16:00",
    weekdayAfternoonEnd: "20:00",
    saturdayStart: "10:00",
    saturdayEnd: "13:30",
    sundayClosed: true,
    vacationBannerEnabled: false,
    whatsappNumber: WHATSAPP_NUMBER,
    whatsappDefaultMessage: "Hola! Me interesa conocer mas sobre sus productos.",
    whatsappFloatingButton: true,
    instagramUrl: INSTAGRAM_URL,
    facebookUrl: "",
    tiktokUrl: "",
    notifyNewTradeIn: true,
    notifyLowStock: true,
    notifyDailySummary: false,
    adminEmail: "admin@applereseller.com",
  };
}

export function mergeSiteSettings(stored: unknown): SiteSettingsData {
  const base = getDefaultSiteSettings();
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
    return base;
  }
  const merged = { ...base, ...(stored as Record<string, unknown>) };
  const parsed = siteSettingsSchema.safeParse(merged);
  return parsed.success ? parsed.data : base;
}
