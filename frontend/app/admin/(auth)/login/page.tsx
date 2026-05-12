"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      }),
    });
    setLoading(false);

    if (!res.ok) {
      setError("Credenciales inválidas");
      return;
    }
    router.push("/admin");
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-16">
      <form action={onSubmit} className="w-full rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Admin Apple Reseller</h1>
        <p className="mt-1 text-sm text-muted-foreground">Iniciar sesión</p>
        <input
          className="mt-4 w-full rounded-lg border border-input bg-background p-3"
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        <input
          className="mt-3 w-full rounded-lg border border-input bg-background p-3"
          name="password"
          type="password"
          placeholder="Contraseña"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </form>
    </main>
  );
}
