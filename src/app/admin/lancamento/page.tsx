"use client";

import { useEffect, useState } from "react";
import { getLaunchSubscribers, LaunchSubscriber } from "@/lib/launch";

export default function AdminLancamentoPage() {
  const [subscribers, setSubscribers] = useState<LaunchSubscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLaunchSubscribers().then((data) => {
      setSubscribers(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-[family-name:var(--font-headline)] text-on-surface mb-1">
          Lançamento
        </h1>
        <p className="text-secondary text-sm">
          {subscribers.length} pessoa{subscribers.length !== 1 && "s"} quer{subscribers.length !== 1 && "em"} ser avisada{subscribers.length !== 1 && "s"}
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-surface-container-low rounded-lg animate-pulse" />
            ))}
          </div>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">notifications</span>
            <p className="text-secondary">Nenhum inscrito ainda.</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-container-high/30">
            {subscribers.map((sub, index) => (
              <div key={sub.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container-low/50 transition-colors">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-on-surface text-sm">{sub.name}</p>
                  <p className="text-xs text-secondary">{sub.whatsapp}</p>
                </div>
                <span className="text-xs text-secondary flex-shrink-0">
                  {new Date(sub.created_at).toLocaleDateString("pt-AO", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
