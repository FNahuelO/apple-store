"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  sku: string;
  priceArs: string;
  stock: number;
};

type TradeIn = {
  id: string;
  fullName: string;
  phone: string;
  brand: string;
  model: string;
  status: string;
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [tradeIns, setTradeIns] = useState<TradeIn[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("");

  async function loadProducts() {
    const res = await fetch("/api/admin/products");
    if (res.ok) {
      setProducts(await res.json());
    }
  }

  async function loadTradeIns() {
    const res = await fetch("/api/admin/trade-ins");
    if (res.ok) {
      setTradeIns(await res.json());
    }
  }

  useEffect(() => {
    async function init() {
      await Promise.all([loadProducts(), loadTradeIns()]);
    }
    void init();
  }, []);

  async function onUpload(formData: FormData) {
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return;
    }
    const payload = new FormData();
    payload.set("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: payload });
    const data = await res.json();
    if (res.ok) {
      setImageUrl(data.url);
      setStatus("Imagen subida");
    } else {
      setStatus("Error al subir imagen");
    }
  }

  async function onCreateProduct(formData: FormData) {
    const payload = {
      sku: String(formData.get("sku")),
      name: String(formData.get("name")),
      brand: "Apple",
      model: String(formData.get("model")),
      color: String(formData.get("color")),
      storage: Number(formData.get("storage")),
      batteryHealth: formData.get("batteryHealth")
        ? Number(formData.get("batteryHealth"))
        : undefined,
      condition: String(formData.get("condition")),
      priceArs: Number(formData.get("priceArs")),
      stock: Number(formData.get("stock")),
      featured: formData.get("featured") === "on",
      description: String(formData.get("description") ?? ""),
      images: imageUrl ? [{ url: imageUrl, alt: String(formData.get("name")), order: 0 }] : [],
    };

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setStatus(res.ok ? "Producto creado" : "Error al crear producto");
    if (res.ok) {
      await loadProducts();
    }
  }

  async function onDelete(id: string) {
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      await loadProducts();
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Panel de administracion</h1>
      <p className="text-zinc-400">Carga de stock real y gestion de catalogo.</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-white/15 bg-zinc-900 p-5">
          <h2 className="text-xl font-semibold">Subir imagen</h2>
          <form action={onUpload} className="mt-3 space-y-2">
            <input type="file" name="file" accept="image/*" required className="w-full text-sm" />
            <button className="rounded-lg bg-white px-4 py-2 font-semibold text-black">Subir foto</button>
          </form>
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="preview" className="mt-3 h-40 w-40 rounded-lg object-cover" />
          )}
        </section>

        <section className="rounded-xl border border-white/15 bg-zinc-900 p-5">
          <h2 className="text-xl font-semibold">Nuevo producto</h2>
          <form action={onCreateProduct} className="mt-3 grid gap-2">
            <input className="rounded-lg bg-zinc-800 p-2" name="sku" placeholder="SKU" required />
            <input className="rounded-lg bg-zinc-800 p-2" name="name" placeholder="Nombre" required />
            <input className="rounded-lg bg-zinc-800 p-2" name="model" placeholder="Modelo" required />
            <input className="rounded-lg bg-zinc-800 p-2" name="color" placeholder="Color" required />
            <input className="rounded-lg bg-zinc-800 p-2" name="storage" type="number" placeholder="Storage" required />
            <input className="rounded-lg bg-zinc-800 p-2" name="batteryHealth" type="number" placeholder="Bateria %" />
            <input className="rounded-lg bg-zinc-800 p-2" name="condition" placeholder="Estado" required />
            <input className="rounded-lg bg-zinc-800 p-2" name="priceArs" type="number" placeholder="Precio ARS" required />
            <input className="rounded-lg bg-zinc-800 p-2" name="stock" type="number" placeholder="Stock" required />
            <textarea className="rounded-lg bg-zinc-800 p-2" name="description" placeholder="Descripcion" />
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" />
              Destacado
            </label>
            <button className="rounded-lg bg-white px-4 py-2 font-semibold text-black">
              Guardar producto
            </button>
          </form>
          {status && <p className="mt-2 text-sm text-zinc-300">{status}</p>}
        </section>
      </div>

      <section className="mt-8 rounded-xl border border-white/15 bg-zinc-900 p-5">
        <h2 className="text-xl font-semibold">Productos cargados</h2>
        <div className="mt-3 space-y-2">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between rounded-lg bg-zinc-800 px-3 py-2">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-xs text-zinc-400">
                  SKU {product.sku} - Stock {product.stock}
                </p>
              </div>
              <button onClick={() => onDelete(product.id)} className="text-sm text-red-400 hover:text-red-300">
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-white/15 bg-zinc-900 p-5">
        <h2 className="text-xl font-semibold">Solicitudes de canje</h2>
        <div className="mt-3 space-y-2">
          {tradeIns.map((item) => (
            <div key={item.id} className="rounded-lg bg-zinc-800 px-3 py-2 text-sm">
              <p className="font-medium">
                {item.fullName} - {item.brand} {item.model}
              </p>
              <p className="text-zinc-400">
                {item.phone} - Estado: {item.status}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
