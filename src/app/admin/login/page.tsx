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
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4">
      <form action={onSubmit} className="w-full rounded-xl border border-white/20 bg-zinc-900 p-6">
        <h1 className="text-2xl font-bold">Admin Apple La Union</h1>
        <p className="mt-1 text-sm text-zinc-400">Iniciar sesion</p>
        <input
          className="mt-4 w-full rounded-lg bg-zinc-800 p-3"
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        <input
          className="mt-3 w-full rounded-lg bg-zinc-800 p-3"
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-white px-4 py-3 font-semibold text-black disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </form>
    </main>
  );
}
