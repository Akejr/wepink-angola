"use client";

import { useState, useEffect, ReactNode } from "react";
import Image from "next/image";

const AUTH_KEY = "wepink-admin-auth";
const AUTH_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function AdminAuth({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      const { expiry } = JSON.parse(stored);
      if (Date.now() < expiry) {
        setAuthenticated(true);
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setChecking(false);

    // Register admin service worker for PWA
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/admin-sw.js").catch(() => {});
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ expiry: Date.now() + AUTH_DURATION }));
        setAuthenticated(true);
      } else {
        setError("Senha incorrecta");
      }
    } catch {
      setError("Erro de conexão");
    }
    setLoading(false);
  };

  if (checking) return null;

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#1c1b1b] flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 text-center">
          <Image
            src="/images/logo.png"
            alt="Wepink"
            width={100}
            height={34}
            className="h-8 w-auto object-contain mx-auto brightness-0 invert opacity-80"
          />
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha de acesso"
              autoFocus
              className="w-full bg-white/10 text-white rounded-lg px-4 py-3 text-sm border border-white/10 focus:border-primary/50 focus:ring-0 placeholder:text-white/30 transition-all"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Verificando..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
