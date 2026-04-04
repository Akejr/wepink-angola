"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { subscribeLaunch, getLaunchSubscribers, LaunchSubscriber } from "@/lib/launch";

const LAUNCH_DATE = new Date("2026-04-12T00:00:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, LAUNCH_DATE - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function LaunchPage() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [subscribers, setSubscribers] = useState<LaunchSubscriber[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch subscribers
  useEffect(() => {
    getLaunchSubscribers().then(setSubscribers);
  }, [submitted]);

  // Auto-scroll names
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || subscribers.length === 0) return;
    const interval = setInterval(() => {
      if (el.scrollTop >= el.scrollHeight - el.clientHeight - 2) {
        el.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ top: 32, behavior: "smooth" });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [subscribers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim()) {
      setError("Preencha o nome e o WhatsApp.");
      return;
    }
    setError("");
    setSubmitting(true);
    const result = await subscribeLaunch(name.trim(), whatsapp.trim());
    if (result.success) {
      setSubmitted(true);
    } else {
      setError("Erro ao registar. Tente novamente.");
    }
    setSubmitting(false);
  };

  const countdownBlocks = timeLeft
    ? [
        { value: timeLeft.days, label: "Dias" },
        { value: timeLeft.hours, label: "Horas" },
        { value: timeLeft.minutes, label: "Min" },
        { value: timeLeft.seconds, label: "Seg" },
      ]
    : [
        { value: 0, label: "Dias" },
        { value: 0, label: "Horas" },
        { value: 0, label: "Min" },
        { value: 0, label: "Seg" },
      ];

  return (
    <main className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-12">
        {/* Logo */}
        <div className="animate-fade-up">
          <Image
            src="/images/logo.png"
            alt="Wepink Angola"
            width={160}
            height={54}
            className="h-12 w-auto object-contain mx-auto mb-4"
            priority
          />
          <p className="text-[10px] font-[family-name:var(--font-label)] uppercase tracking-[0.4em] text-secondary">
            O seu mundo rosa em Angola
          </p>
        </div>

        {/* Headline */}
        <div className="animate-fade-up delay-100 space-y-4">
          <h1 className="font-[family-name:var(--font-headline)] text-4xl md:text-6xl text-on-surface leading-tight">
            Algo <span className="text-primary">incrível</span> está a chegar
          </h1>
          <p className="text-secondary text-lg max-w-md mx-auto leading-relaxed">
            Perfumes, body splash e fragrâncias premium. Em breve disponíveis em Luanda.
          </p>
        </div>

        {/* Countdown */}
        <div className="animate-fade-up delay-200 flex justify-center gap-3 md:gap-6">
          {countdownBlocks.map((block) => (
            <div key={block.label} className="flex flex-col items-center">
              <div className="w-[72px] h-[72px] md:w-24 md:h-24 bg-surface-container-lowest rounded-2xl flex items-center justify-center shadow-[0_0_32px_rgba(254,75,142,0.08)] border border-primary/10">
                <span className="font-[family-name:var(--font-headline)] text-2xl md:text-4xl text-primary font-bold tabular-nums">
                  {String(block.value).padStart(2, "0")}
                </span>
              </div>
              <span className="text-[9px] md:text-[10px] font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary mt-2 md:mt-3">
                {block.label}
              </span>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        {subscribers.length > 0 && (
          <div className="animate-fade-up delay-200 space-y-4">
            <p className="text-secondary text-sm">
              Junte-se a <span className="text-primary font-bold">{subscribers.length}</span> pessoa{subscribers.length !== 1 && "s"} na lista de espera
            </p>
            <div className="relative overflow-hidden h-10 max-w-sm mx-auto">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-surface to-transparent z-10" />
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-surface to-transparent z-10" />
              <div
                ref={scrollRef}
                className="flex flex-col items-center"
                style={{
                  animation: `marquee-up ${Math.max(subscribers.length * 2.5, 8)}s linear infinite`,
                }}
              >
                {[...subscribers, ...subscribers].map((sub, i) => (
                  <div key={`${sub.id}-${i}`} className="flex items-center gap-2 h-10 shrink-0">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                      {sub.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm text-on-surface-variant">
                      {(() => {
                        const parts = sub.name.trim().split(/\s+/);
                        return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1]}` : parts[0];
                      })()}
                    </span>
                    <span className="text-[10px] text-secondary">entrou na lista</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Subscribe Form */}
        <div className="animate-fade-up delay-300">
          {submitted ? (
            <div className="bg-surface-container-lowest p-8 rounded-2xl space-y-3 animate-scale-in">
              <span className="material-symbols-outlined text-4xl text-primary">favorite</span>
              <h3 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">
                Estás na lista, {name.split(" ")[0]}!
              </h3>
              <p className="text-secondary text-sm">
                Vamos te avisar pelo WhatsApp assim que lançarmos.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-8 rounded-2xl space-y-5 shadow-[0_0_48px_rgba(254,75,142,0.06)]">
              <h3 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">
                Quero ser avisado(a) no lançamento
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder=" "
                    id="launch-name"
                    className="peer w-full bg-surface-container-low rounded-xl px-4 pt-6 pb-2 text-sm text-on-surface border border-transparent focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(254,75,142,0.15)] focus:ring-0 transition-all placeholder-transparent"
                  />
                  <label
                    htmlFor="launch-name"
                    className="absolute left-4 top-2 text-[10px] font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-primary"
                  >
                    Seu nome
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder=" "
                    id="launch-whatsapp"
                    className="peer w-full bg-surface-container-low rounded-xl px-4 pt-6 pb-2 text-sm text-on-surface border border-transparent focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(254,75,142,0.15)] focus:ring-0 transition-all placeholder-transparent"
                  />
                  <label
                    htmlFor="launch-whatsapp"
                    className="absolute left-4 top-2 text-[10px] font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-primary"
                  >
                    WhatsApp
                  </label>
                </div>
              </div>
              {error && (
                <p className="text-error text-xs">{error}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-shine bg-primary text-on-primary py-4 rounded-xl font-bold text-sm tracking-widest uppercase hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    A registar...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">notifications_active</span>
                    Me avise quando lançar
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Social */}
        <div className="animate-fade-up delay-400 flex items-center justify-center gap-4">
          <a
            href="https://www.instagram.com/wepink.ang"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:text-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <span className="text-outline-variant text-xs">@wepink.ang</span>
        </div>
      </div>
    </main>
  );
}
