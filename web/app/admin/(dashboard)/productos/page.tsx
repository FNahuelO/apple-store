"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Package,
  Star,
  AlertTriangle,
  Pencil,
  X,
  Smartphone,
} from "lucide-react";
import { formatPrice, getConditionColor, getConditionLabel } from "@/lib/constants";
import { mapDbConditionToUi } from "@/lib/store-product";

type ApiProduct = {
  id: string;
  sku: string;
  name: string;
  model: string;
  color: string;
  storage: number;
  condition: string;
  batteryHealth: number | null;
  priceArs: string | { toString(): string };
  stock: number;
  featured: boolean;
  description: string | null;
  images: { url: string; alt?: string | null; order: number }[];
};

/** Valores guardados en DB; deben incluir palabras que `mapDbConditionToUi` reconozca (nuevo / reacond / usado). */
const PRESET_PRODUCT_CONDITIONS: { value: string; label: string }[] = [
  { value: "Nuevo sellado", label: "Nuevo — sellado" },
  { value: "Nuevo sin caja", label: "Nuevo — sin caja" },
  { value: "Reacondicionado premium", label: "Reacondicionado — premium" },
  { value: "Reacondicionado", label: "Reacondicionado" },
  { value: "Usado excelente", label: "Usado — excelente" },
  { value: "Usado muy bueno", label: "Usado — muy bueno" },
  { value: "Usado bueno", label: "Usado — bueno" },
];

function productConditionSelectOptions(current: string) {
  const t = current.trim();
  if (!t || PRESET_PRODUCT_CONDITIONS.some((o) => o.value === t)) {
    return PRESET_PRODUCT_CONDITIONS;
  }
  return [{ value: t, label: `${t} (valor actual)` }, ...PRESET_PRODUCT_CONDITIONS];
}

function priceNum(p: ApiProduct["priceArs"]) {
  return typeof p === "object" && p !== null && "toString" in p ? Number(p.toString()) : Number(p);
}

function AdminProductThumb({ images }: { images: { url: string }[] }) {
  const firstUrl = useMemo(() => {
    for (const im of images) {
      const t = typeof im.url === "string" ? im.url.trim() : "";
      if (t) return t;
    }
    return null;
  }, [images]);

  const [broken, setBroken] = useState(false);
  const showPlaceholder = !firstUrl || broken;

  return (
    <div
      className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-200/80 bg-gradient-to-br from-slate-100 via-zinc-50 to-slate-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800"
      title={showPlaceholder ? "Sin foto" : undefined}
    >
      {showPlaceholder ? (
        <Smartphone className="h-5 w-5 text-zinc-400/90 dark:text-zinc-500" strokeWidth={1.2} aria-hidden />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={firstUrl}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      )}
    </div>
  );
}

export default function AdminProductosPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCondition, setFilterCondition] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const stockBeforeUnpublishRef = useRef<Map<string, number>>(new Map());
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [form, setForm] = useState({
    sku: "",
    name: "",
    model: "",
    color: "",
    storageGb: "128",
    condition: "Nuevo sellado",
    batteryHealth: "",
    priceArs: "",
    stock: "1",
    featured: false,
    description: "",
  });

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/products");
    if (res.ok) setProducts(await res.json());
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  const filtered = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.model.toLowerCase().includes(q);
    const ui = mapDbConditionToUi(p.condition);
    const matchC = filterCondition === "all" || ui === filterCondition;
    return matchQ && matchC;
  });

  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 2);

  const { conditionSelectOptions, selectConditionValue } = useMemo(() => {
    const options = productConditionSelectOptions(form.condition);
    const t = form.condition.trim();
    const value = options.some((o) => o.value === t)
      ? t
      : (options[0]?.value ?? PRESET_PRODUCT_CONDITIONS[0].value);
    return { conditionSelectOptions: options, selectConditionValue: value };
  }, [form.condition]);

  async function uploadFile(file: File) {
    setUploadError(null);
    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    if (!res.ok) {
      let msg = "No se pudo subir la imagen.";
      try {
        const j = (await res.json()) as { error?: string };
        if (j.error) msg = j.error;
      } catch {
        /* cuerpo no JSON */
      }
      setUploadError(msg);
      return;
    }
    const { url } = (await res.json()) as { url: string };
    setImageUrls((prev) => [...prev, url]);
  }

  function resetCreateForm() {
    setImageUrls([]);
    setSaveError(null);
    setUploadError(null);
    setEditingId(null);
    setDialogMode("create");
    setForm({
      sku: "",
      name: "",
      model: "",
      color: "",
      storageGb: "128",
      condition: "Nuevo sellado",
      batteryHealth: "",
      priceArs: "",
      stock: "1",
      featured: false,
      description: "",
    });
  }

  function openCreateDialog() {
    resetCreateForm();
    setDialogOpen(true);
  }

  function openEditDialog(p: ApiProduct) {
    setSaveError(null);
    setUploadError(null);
    setDialogMode("edit");
    setEditingId(p.id);
    setForm({
      sku: p.sku,
      name: p.name,
      model: p.model,
      color: p.color,
      storageGb: String(p.storage),
      condition: p.condition,
      batteryHealth: p.batteryHealth != null ? String(p.batteryHealth) : "",
      priceArs: String(priceNum(p.priceArs)),
      stock: String(p.stock),
      featured: p.featured,
      description: p.description ?? "",
    });
    setImageUrls(p.images.map((i) => i.url).filter((u) => u.trim().length > 0));
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaveError(null);
    if (!form.sku.trim() || !form.name.trim() || !form.model.trim()) {
      setSaveError("Completá SKU, nombre y modelo.");
      return;
    }
    const price = Number(form.priceArs);
    if (!Number.isFinite(price) || price <= 0) {
      setSaveError("Ingresá un precio válido mayor a 0.");
      return;
    }
    if (imageUrls.length === 0) {
      setSaveError("Debe haber al menos una imagen.");
      return;
    }
    setSaving(true);
    const storage = Number(form.storageGb);
    const payload = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      brand: "Apple",
      model: form.model.trim(),
      color: form.color.trim(),
      storage: Number.isFinite(storage) ? storage : 128,
      batteryHealth:
        form.batteryHealth.trim() === "" ? undefined : Number(form.batteryHealth),
      condition: form.condition.trim() || PRESET_PRODUCT_CONDITIONS[0].value,
      priceArs: Number(form.priceArs),
      stock: Number(form.stock) || 0,
      featured: form.featured,
      description: form.description.trim() || undefined,
      images: imageUrls.map((url, i) => ({ url, alt: form.name.trim() || "Producto", order: i })),
    };

    const isEdit = dialogMode === "edit" && editingId;
    const res = await fetch(isEdit ? `/api/admin/products/${editingId}` : "/api/admin/products", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setDialogOpen(false);
      resetCreateForm();
      await load();
    } else {
      let msg = isEdit ? "No se pudo guardar el producto." : "No se pudo crear el producto.";
      try {
        const j = (await res.json()) as { error?: string; message?: string };
        if (typeof j.error === "string") msg = j.error;
        else if (typeof j.message === "string") msg = j.message;
      } catch {
        /* ignorar */
      }
      setSaveError(msg);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  async function toggleFeatured(p: ApiProduct) {
    const res = await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !p.featured }),
    });
    if (res.ok) await load();
  }

  async function setStockZero(id: string) {
    const p = products.find((x) => x.id === id);
    if (p && p.stock > 0) {
      stockBeforeUnpublishRef.current.set(id, p.stock);
    }
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: 0 }),
    });
    if (res.ok) await load();
  }

  async function restoreStock(id: string) {
    const prev = stockBeforeUnpublishRef.current.get(id) ?? 1;
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: prev }),
    });
    if (res.ok) {
      stockBeforeUnpublishRef.current.delete(id);
      await load();
    }
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Productos</h1>
          <p className="text-sm text-zinc-500">Inventario conectado a la base de datos</p>
        </div>
        <Button className="bg-zinc-900 hover:bg-zinc-800" onClick={() => openCreateDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo producto
        </Button>
      </div>

      {lowStock.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-3 py-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-900">Stock bajo</p>
              <p className="text-sm text-amber-700">
                {lowStock.length} producto(s) con stock entre 1 y 2 unidades
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-zinc-200">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Buscar por nombre o modelo…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCondition} onValueChange={setFilterCondition}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Condición" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="nuevo">Nuevo</SelectItem>
                <SelectItem value="usado">Usado</SelectItem>
                <SelectItem value="reacondicionado">Reacondicionado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5" />
            Inventario ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[52px]">Foto</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Condición</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Destacado</TableHead>
                <TableHead className="text-center">Publicado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const ui = mapDbConditionToUi(p.condition);
                const thumbKey = `${p.id}|${p.images.map((i) => i.url).join("|")}`;
                return (
                  <TableRow key={p.id} className={p.stock <= 0 ? "opacity-50" : ""}>
                    <TableCell>
                      <AdminProductThumb key={thumbKey} images={p.images} />
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-zinc-500">
                        SKU {p.sku} · {p.storage}GB · {p.color}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getConditionColor(ui)}>
                        {getConditionLabel(ui)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{formatPrice(priceNum(p.priceArs))}</TableCell>
                    <TableCell className="text-center">
                      <span className={p.stock > 0 && p.stock <= 2 ? "font-medium text-red-600" : ""}>
                        {p.stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" type="button" onClick={() => void toggleFeatured(p)}>
                        <Star className={`h-4 w-4 ${p.featured ? "fill-amber-400 text-amber-400" : "text-zinc-300"}`} />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={p.stock > 0}
                        onCheckedChange={(on) => void (on ? restoreStock(p.id) : setStockZero(p.id))}
                      />
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
                          <DropdownMenuItem onClick={() => openEditDialog(p)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => void handleDelete(p.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            resetCreateForm();
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogMode === "edit" ? "Editar producto" : "Nuevo producto"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "edit"
                ? "Los cambios se reflejan en el catálogo y en la tienda."
                : "Se guardará en catálogo y API pública"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>Imágenes (Cloudinary)</Label>
              <Input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadFile(f);
                  e.target.value = "";
                }}
              />
              {uploading && <p className="text-xs text-zinc-500">Subiendo…</p>}
              {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
              {imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {imageUrls.map((u, idx) => (
                    <div key={`${u}-${idx}`} className="relative h-16 w-16 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u} alt="" className="h-full w-full rounded-md border object-cover" />
                      <button
                        type="button"
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow hover:bg-zinc-50"
                        aria-label="Quitar imagen"
                        onClick={() => setImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-zinc-500">
                Necesitás al menos una imagen. Podés quitar miniaturas con la X o subir más.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Modelo</Label>
                <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Almacenamiento (GB)</Label>
                <Input
                  type="number"
                  value={form.storageGb}
                  onChange={(e) => setForm({ ...form, storageGb: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-condition">Condición</Label>
                <Select
                  value={selectConditionValue}
                  onValueChange={(v) => setForm({ ...form, condition: v })}
                >
                  <SelectTrigger id="product-condition" className="w-full">
                    <SelectValue placeholder="Elegí condición" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionSelectOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Batería %</Label>
                <Input
                  value={form.batteryHealth}
                  onChange={(e) => setForm({ ...form, batteryHealth: e.target.value })}
                  placeholder="opcional"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Precio ARS</Label>
                <Input
                  type="number"
                  value={form.priceArs}
                  onChange={(e) => setForm({ ...form, priceArs: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="feat" checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
              <Label htmlFor="feat">Destacado en inicio</Label>
            </div>
            {saveError && <p className="text-sm text-red-600">{saveError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              className="bg-zinc-900 hover:bg-zinc-800"
              disabled={saving || imageUrls.length === 0}
              onClick={() => void handleSave()}
            >
              {saving ? "Guardando…" : dialogMode === "edit" ? "Guardar cambios" : "Crear producto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
