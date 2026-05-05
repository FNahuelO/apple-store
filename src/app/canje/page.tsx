"use client";

import { useState } from "react";

export default function CanjePage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(formData: FormData) {
    setStatus("loading");
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      city: String(formData.get("city") ?? ""),
      brand: String(formData.get("brand") ?? ""),
      model: String(formData.get("model") ?? ""),
      storage: String(formData.get("storage") ?? ""),
      condition: String(formData.get("condition") ?? ""),
      batteryHealth: formData.get("batteryHealth")
        ? Number(formData.get("batteryHealth"))
        : undefined,
      desiredModel: String(formData.get("desiredModel") ?? ""),
      details: String(formData.get("details") ?? ""),
    };

    const res = await fetch("/api/trade-ins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setStatus(res.ok ? "success" : "error");
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Canjea tu celular</h1>
      <p className="mt-2 text-zinc-300">
        Envia los datos de tu equipo y te respondemos con una cotizacion.
      </p>
      <form
        className="mt-6 grid gap-3 rounded-xl border border-white/15 bg-zinc-900 p-5"
        action={onSubmit}
      >
        <input className="rounded-lg bg-zinc-800 p-3" name="fullName" placeholder="Nombre completo" required />
        <input className="rounded-lg bg-zinc-800 p-3" name="phone" placeholder="Telefono" required />
        <input className="rounded-lg bg-zinc-800 p-3" name="email" placeholder="Email (opcional)" />
        <input className="rounded-lg bg-zinc-800 p-3" name="city" placeholder="Ciudad" />
        <input className="rounded-lg bg-zinc-800 p-3" name="brand" placeholder="Marca" required />
        <input className="rounded-lg bg-zinc-800 p-3" name="model" placeholder="Modelo" required />
        <input className="rounded-lg bg-zinc-800 p-3" name="storage" placeholder="Capacidad (ej: 128GB)" />
        <input className="rounded-lg bg-zinc-800 p-3" name="condition" placeholder="Estado general" required />
        <input className="rounded-lg bg-zinc-800 p-3" name="batteryHealth" placeholder="Bateria (%)" type="number" />
        <input className="rounded-lg bg-zinc-800 p-3" name="desiredModel" placeholder="Equipo que queres comprar" />
        <textarea className="rounded-lg bg-zinc-800 p-3" name="details" placeholder="Detalles extra" rows={4} />
        <button
          type="submit"
          className="rounded-lg bg-white px-4 py-3 font-semibold text-black disabled:opacity-60"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Enviando..." : "Enviar solicitud de canje"}
        </button>
      </form>
      {status === "success" && <p className="mt-3 text-green-400">Solicitud enviada correctamente.</p>}
      {status === "error" && <p className="mt-3 text-red-400">No se pudo enviar. Revisa los datos.</p>}
    </main>
  );
}
