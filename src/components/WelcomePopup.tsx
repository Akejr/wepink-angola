"use client";

import { useState, useEffect } from "react";

export function WelcomePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("wepink-welcome-seen");
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setShow(false);
    localStorage.setItem("wepink-welcome-seen", "true");
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-on-surface/30 backdrop-blur-sm z-[80] animate-fade-in" onClick={close} />
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-6 pointer-events-none">
        <div className="pointer-events-auto bg-surface-container-lowest rounded-2xl max-w-md w-full p-8 md:p-10 text-center space-y-6 animate-scale-in shadow-2xl relative">
          <button onClick={close} className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors p-1">
            <span className="material-symbols-outlined">close</span>
          </button>

          <div className="space-y-1">
            <span className="text-4xl">🎉</span>
            <h2 className="font-[family-name:var(--font-headline)] text-2xl md:text-3xl text-primary">
              Bem-vindo ao Lançamento
            </h2>
          </div>

          <p className="text-on-surface-variant text-sm leading-relaxed">
            A Wepink Angola acaba de abrir as portas. Perfumes, body splash e fragrâncias premium importadas do Brasil, agora disponíveis em Luanda.
          </p>

          <div className="bg-primary/5 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">warning</span>
              <span className="font-bold text-primary text-sm uppercase tracking-wider">Estoque Limitado</span>
            </div>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Os nossos produtos são importados em quantidades reduzidas. Quando esgotarem, a próxima remessa pode demorar semanas. Garanta o seu antes que acabe.
            </p>
          </div>

          <button
            onClick={close}
            className="w-full btn-shine bg-primary text-on-primary py-4 rounded-xl font-bold text-sm tracking-widest uppercase hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
          >
            Explorar Fragrâncias
          </button>
        </div>
      </div>
    </>
  );
}
