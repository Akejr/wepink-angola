"use client";

import { useEffect, useState } from "react";
import { getLaunchSubscribers, LaunchSubscriber } from "@/lib/launch";

function formatWhatsappNumber(raw: string): string {
  let cleaned = raw.replace(/[\s\-\(\)\+]/g, "");
  // Already has a country code (starts with 2xx, 3xx, etc and is long enough)
  if (cleaned.length >= 12 && /^[1-9]/.test(cleaned)) {
    return cleaned;
  }
  // Starts with 9 and is 9 digits = Angola without code
  if (/^9\d{8}$/.test(cleaned)) {
    return "244" + cleaned;
  }
  // Starts with 244 already
  if (cleaned.startsWith("244")) {
    return cleaned;
  }
  // Fallback: assume Angola
  return "244" + cleaned;
}

function buildWhatsappUrl(phone: string, name: string): string {
  const number = formatWhatsappNumber(phone);
  const firstName = name.split(" ")[0];
  const message = encodeURIComponent(
    `Olá ${firstName}! 🎉\n\nA Wepink Angola acaba de lançar! O nosso site já está no ar com perfumes, body splash e fragrâncias premium.\n\n⚠️ Estoque limitado — corra para garantir o seu produto antes que esgote!\n\n🛒 Compre agora: https://www.wepinkangola.com\n\nWepink Angola 💖`
  );
  return `https://wa.me/${number}?text=${message}`;
}

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
                <a
                  href={buildWhatsappUrl(sub.whatsapp, sub.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-all flex items-center gap-1 flex-shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.607-.798-6.382-2.147l-.446-.334-2.645.887.887-2.645-.334-.446A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                  </svg>
                  Avisar
                </a>
                <span className="text-xs text-secondary flex-shrink-0 hidden sm:block">
                  {new Date(sub.created_at).toLocaleDateString("pt-AO", {
                    day: "2-digit",
                    month: "short",
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
