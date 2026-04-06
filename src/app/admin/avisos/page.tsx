"use client";

import { useEffect, useState } from "react";
import { getStockAlerts, markAlertNotified, deleteStockAlert, StockAlert } from "@/lib/stockAlerts";

export default function AdminAvisosPage() {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "notified">("all");

  useEffect(() => {
    getStockAlerts().then((data) => {
      setAlerts(data);
      setLoading(false);
    });
  }, []);

  const handleMarkNotified = async (id: string) => {
    const result = await markAlertNotified(id);
    if (result.success) {
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, notified: true } : a)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apagar este aviso?")) return;
    const result = await deleteStockAlert(id);
    if (result.success) {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const filtered = filter === "all" ? alerts
    : filter === "pending" ? alerts.filter((a) => !a.notified)
    : alerts.filter((a) => a.notified);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-[family-name:var(--font-headline)] text-on-surface mb-1">
          Avisos de Estoque
        </h1>
        <p className="text-secondary text-sm">
          {alerts.filter((a) => !a.notified).length} pendente{alerts.filter((a) => !a.notified).length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex gap-2">
        {(["all", "pending", "notified"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === f ? "bg-primary text-on-primary" : "bg-surface-container-lowest text-secondary hover:bg-surface-container-low"
            }`}>
            {f === "all" ? "Todos" : f === "pending" ? "Pendentes" : "Notificados"}
          </button>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-surface-container-low rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">notifications</span>
            <p className="text-secondary">Nenhum aviso encontrado.</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-container-high/30">
            {filtered.map((alert) => (
              <div key={alert.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container-low/50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${alert.notified ? "bg-green-50" : "bg-amber-50"}`}>
                  <span className={`material-symbols-outlined text-lg ${alert.notified ? "text-green-700" : "text-amber-700"}`}>
                    {alert.notified ? "check" : "notifications_active"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-on-surface text-sm">{alert.name}</p>
                  <p className="text-xs text-secondary">{alert.whatsapp} · {alert.product_name}</p>
                </div>
                <span className="text-xs text-secondary flex-shrink-0">
                  {new Date(alert.created_at).toLocaleDateString("pt-AO", { day: "2-digit", month: "short" })}
                </span>
                {!alert.notified && (
                  <button onClick={() => handleMarkNotified(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-all flex-shrink-0">
                    Notificado
                  </button>
                )}
                <button onClick={() => handleDelete(alert.id)}
                  className="p-2 rounded-lg text-secondary hover:text-error hover:bg-error/5 transition-all flex-shrink-0">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
