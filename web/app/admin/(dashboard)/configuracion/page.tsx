"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Store,
  Clock,
  MessageSquare,
  Instagram,
  MapPin,
  Bell,
  Shield,
  Palette,
  Save,
  ExternalLink,
} from "lucide-react";
import type { SiteSettingsData } from "@/lib/site-settings";
import { getDefaultSiteSettings } from "@/lib/site-settings";

const HEX_6 = /^#[\da-f]{6}$/i;

function ColorField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  const [committedHex, setCommittedHex] = useState(() => (HEX_6.test(value) ? value.toLowerCase() : "#000000"));

  useEffect(() => {
    if (HEX_6.test(value)) setCommittedHex(value.toLowerCase());
  }, [value]);

  const pickerValue = HEX_6.test(value) ? value : committedHex;

  return (
    <div className="space-y-2">
      <Label htmlFor={`${id}-hex`}>{label}</Label>
      <div className="flex gap-2">
        <input
          id={`${id}-picker`}
          type="color"
          value={pickerValue}
          onChange={(e) => {
            const v = e.target.value.toLowerCase();
            setCommittedHex(v);
            onChange(v);
          }}
          className="h-9 w-11 shrink-0 cursor-pointer rounded-md border border-zinc-300 bg-white p-0.5 shadow-xs [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-[4px] [&::-webkit-color-swatch]:border-0 [&::-moz-color-swatch]:rounded-[4px]"
          aria-label={`Selector de ${label}`}
        />
        <Input
          id={`${id}-hex`}
          value={value}
          onChange={(e) => {
            let v = e.target.value.replace(/[^#0-9A-Fa-f]/g, "");
            if (!v.startsWith("#")) v = `#${v.replace(/#/g, "")}`;
            else v = `#${v.slice(1).replace(/#/g, "").slice(0, 6)}`;
            onChange(v.toLowerCase());
          }}
          onBlur={() => {
            if (!HEX_6.test(value)) onChange(committedHex);
            else {
              const v = value.toLowerCase();
              setCommittedHex(v);
              onChange(v);
            }
          }}
          className="min-w-0 flex-1 font-mono"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}

export default function ConfiguracionPage() {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [loadError, setLoadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    void (async () => {
      setLoadError("");
      const res = await fetch("/api/admin/site-settings", { credentials: "same-origin" });
      if (!res.ok) {
        setLoadError(res.status === 401 ? "Sesión expirada o no autorizado." : "No se pudo cargar la configuración.");
        setSettings(getDefaultSiteSettings());
        return;
      }
      const data = (await res.json()) as SiteSettingsData;
      setSettings(data);
    })();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    setSaveFeedback(null);
    const res = await fetch("/api/admin/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(settings),
    });
    setIsSaving(false);
    if (!res.ok) {
      setSaveFeedback({
        ok: false,
        text: res.status === 400 ? "Revisá los datos (por ejemplo colores en formato #RRGGBB)." : "No se pudieron guardar los cambios.",
      });
      return;
    }
    setSaveFeedback({ ok: true, text: "Cambios guardados correctamente." });
  };

  const loading = settings === null;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Configuracion</h1>
          <p className="text-sm text-zinc-500">Administra la configuracion de tu tienda</p>
          {loadError && <p className="mt-1 text-sm text-amber-700">{loadError}</p>}
          {saveFeedback && (
            <p className={`mt-1 text-sm ${saveFeedback.ok ? "text-emerald-700" : "text-red-600"}`}>{saveFeedback.text}</p>
          )}
        </div>
        <Button
          onClick={() => void handleSave()}
          disabled={isSaving || loading}
          className="bg-zinc-900 hover:bg-zinc-800"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Guardando..." : loading ? "Cargando..." : "Guardar cambios"}
        </Button>
      </div>

      {!settings ? (
        <p className="text-sm text-zinc-500">Cargando configuración…</p>
      ) : (
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-zinc-100">
            <TabsTrigger value="general" className="gap-2">
              <Store className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="horarios" className="gap-2">
              <Clock className="h-4 w-4" />
              Horarios
            </TabsTrigger>
            <TabsTrigger value="redes" className="gap-2">
              <Instagram className="h-4 w-4" />
              Redes
            </TabsTrigger>
            <TabsTrigger value="notificaciones" className="gap-2">
              <Bell className="h-4 w-4" />
              Notificaciones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="border-zinc-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Informacion de la tienda
                </CardTitle>
                <CardDescription>Datos basicos que aparecen en tu sitio web</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Nombre de la tienda</Label>
                    <Input
                      id="storeName"
                      value={settings.storeName}
                      onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeSlogan">Slogan</Label>
                    <Input
                      id="storeSlogan"
                      value={settings.storeSlogan}
                      onChange={(e) => setSettings({ ...settings, storeSlogan: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeDescription">Descripcion</Label>
                  <Textarea
                    id="storeDescription"
                    value={settings.storeDescription}
                    onChange={(e) => setSettings({ ...settings, storeDescription: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Direccion
                  </Label>
                  <Input
                    id="storeAddress"
                    value={settings.storeAddress}
                    onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Apariencia
                </CardTitle>
                <CardDescription>Personaliza los colores de tu sitio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <ColorField
                    id="theme-primary"
                    label="Color primario"
                    value={settings.themePrimary}
                    onChange={(themePrimary) => setSettings({ ...settings, themePrimary })}
                  />
                  <ColorField
                    id="theme-accent"
                    label="Color de acento"
                    value={settings.themeAccent}
                    onChange={(themeAccent) => setSettings({ ...settings, themeAccent })}
                  />
                  <ColorField
                    id="theme-background"
                    label="Color de fondo"
                    value={settings.themeBackground}
                    onChange={(themeBackground) => setSettings({ ...settings, themeBackground })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="horarios" className="space-y-6">
            <Card className="border-zinc-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horarios de atencion
                </CardTitle>
                <CardDescription>
                  Valores guardados: lun–vie {settings.weekdayMorningStart} a {settings.weekdayMorningEnd} y{" "}
                  {settings.weekdayAfternoonStart} a {settings.weekdayAfternoonEnd}; sábados {settings.saturdayStart} a{" "}
                  {settings.saturdayEnd}; domingos {settings.sundayClosed ? "cerrado" : "abierto"}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">Lunes a Viernes</p>
                      <p className="text-sm text-zinc-500">Dias laborales</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Input
                        type="time"
                        className="w-28"
                        value={settings.weekdayMorningStart}
                        onChange={(e) => setSettings({ ...settings, weekdayMorningStart: e.target.value })}
                      />
                      <span className="text-zinc-400">a</span>
                      <Input
                        type="time"
                        className="w-28"
                        value={settings.weekdayMorningEnd}
                        onChange={(e) => setSettings({ ...settings, weekdayMorningEnd: e.target.value })}
                      />
                      <span className="text-zinc-400">|</span>
                      <Input
                        type="time"
                        className="w-28"
                        value={settings.weekdayAfternoonStart}
                        onChange={(e) => setSettings({ ...settings, weekdayAfternoonStart: e.target.value })}
                      />
                      <span className="text-zinc-400">a</span>
                      <Input
                        type="time"
                        className="w-28"
                        value={settings.weekdayAfternoonEnd}
                        onChange={(e) => setSettings({ ...settings, weekdayAfternoonEnd: e.target.value })}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">Sabados</p>
                      <p className="text-sm text-zinc-500">Fin de semana</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Input
                        type="time"
                        className="w-28"
                        value={settings.saturdayStart}
                        onChange={(e) => setSettings({ ...settings, saturdayStart: e.target.value })}
                      />
                      <span className="text-zinc-400">a</span>
                      <Input
                        type="time"
                        className="w-28"
                        value={settings.saturdayEnd}
                        onChange={(e) => setSettings({ ...settings, saturdayEnd: e.target.value })}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Domingos</p>
                      <p className="text-sm text-zinc-500">Descanso semanal</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={settings.sundayClosed}
                        onCheckedChange={(sundayClosed) => setSettings({ ...settings, sundayClosed })}
                      />
                      <span className="text-sm text-zinc-500">Cerrado</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200">
              <CardHeader>
                <CardTitle className="text-lg">Dias especiales</CardTitle>
                <CardDescription>Feriados y cierres temporales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
                  <div>
                    <p className="font-medium">Mostrar cartel de vacaciones</p>
                    <p className="text-sm text-zinc-500">Muestra un aviso cuando la tienda este cerrada</p>
                  </div>
                  <Switch
                    checked={settings.vacationBannerEnabled}
                    onCheckedChange={(vacationBannerEnabled) => setSettings({ ...settings, vacationBannerEnabled })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="redes" className="space-y-6">
            <Card className="border-zinc-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  WhatsApp Business
                </CardTitle>
                <CardDescription>Configuracion del canal de WhatsApp</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">Numero de WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={settings.whatsappNumber}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        whatsappNumber: e.target.value.replace(/\D/g, "").slice(0, 20),
                      })
                    }
                    placeholder="5493516123456"
                  />
                  <p className="text-xs text-zinc-500">Sin espacios ni guiones. Incluir codigo de pais.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsappMessage">Mensaje predeterminado</Label>
                  <Textarea
                    id="whatsappMessage"
                    value={settings.whatsappDefaultMessage}
                    onChange={(e) => setSettings({ ...settings, whatsappDefaultMessage: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
                  <div>
                    <p className="font-medium">Boton flotante de WhatsApp</p>
                    <p className="text-sm text-zinc-500">Mostrar boton en todas las paginas</p>
                  </div>
                  <Switch
                    checked={settings.whatsappFloatingButton}
                    onCheckedChange={(whatsappFloatingButton) => setSettings({ ...settings, whatsappFloatingButton })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Instagram className="h-5 w-5" />
                  Redes sociales
                </CardTitle>
                <CardDescription>Enlaces a tus perfiles sociales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="flex gap-2">
                    <Input
                      id="instagram"
                      value={settings.instagramUrl}
                      onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      disabled={!settings.instagramUrl.trim()}
                      aria-label="Abrir Instagram en nueva pestaña"
                      onClick={() => {
                        const u = settings.instagramUrl.trim();
                        if (u) window.open(u, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={settings.facebookUrl}
                    onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/tu-pagina"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiktok">TikTok</Label>
                  <Input
                    id="tiktok"
                    value={settings.tiktokUrl}
                    onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value })}
                    placeholder="https://tiktok.com/@tu-usuario"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notificaciones" className="space-y-6">
            <Card className="border-zinc-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificaciones
                </CardTitle>
                <CardDescription>Configura como recibir alertas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
                  <div>
                    <p className="font-medium">Nueva solicitud de canje</p>
                    <p className="text-sm text-zinc-500">Recibir alerta cuando alguien envie un formulario</p>
                  </div>
                  <Switch
                    checked={settings.notifyNewTradeIn}
                    onCheckedChange={(notifyNewTradeIn) => setSettings({ ...settings, notifyNewTradeIn })}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
                  <div>
                    <p className="font-medium">Stock bajo</p>
                    <p className="text-sm text-zinc-500">Alertar cuando un producto tenga menos de 3 unidades</p>
                  </div>
                  <Switch
                    checked={settings.notifyLowStock}
                    onCheckedChange={(notifyLowStock) => setSettings({ ...settings, notifyLowStock })}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
                  <div>
                    <p className="font-medium">Resumen diario</p>
                    <p className="text-sm text-zinc-500">Recibir un email con el resumen del dia</p>
                  </div>
                  <Switch
                    checked={settings.notifyDailySummary}
                    onCheckedChange={(notifyDailySummary) => setSettings({ ...settings, notifyDailySummary })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Seguridad
                </CardTitle>
                <CardDescription>Opciones de seguridad de la cuenta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email del administrador</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" type="button">
                    Cambiar contrasena
                  </Button>
                  <Button variant="outline" type="button">
                    Activar 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
