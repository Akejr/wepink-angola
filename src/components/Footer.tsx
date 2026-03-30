"use client";

import Link from "next/link";
import Image from "next/image";
import { useScrollRevealAll } from "@/hooks/useScrollReveal";

export function Footer() {
  useScrollRevealAll(".footer-reveal", 0.1);

  return (
    <footer className="bg-surface-container-low w-full pt-16 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-8 max-w-7xl mx-auto">
        <div className="footer-reveal" data-reveal-delay="0">
          <Image
            src="/images/logo.png"
            alt="Wepink"
            width={100}
            height={34}
            className="h-7 w-auto object-contain mb-6"
          />
          <p className="text-secondary font-[family-name:var(--font-body)] text-sm leading-relaxed max-w-xs">
            Transformando a perfumaria em Angola com fragrâncias que elevam a
            auto-estima e celebram a beleza feminina.
          </p>
        </div>

        <div className="flex flex-col gap-4 footer-reveal" data-reveal-delay="100">
          <h4 className="font-[family-name:var(--font-headline)] text-primary font-bold mb-2">
            Informação
          </h4>
          <Link
            href="#"
            className="text-secondary hover:text-primary hover:translate-x-1 transition-all duration-300 font-[family-name:var(--font-body)] text-sm inline-block"
          >
            Contactos Luanda
          </Link>
          <Link
            href="#"
            className="text-secondary hover:text-primary hover:translate-x-1 transition-all duration-300 font-[family-name:var(--font-body)] text-sm inline-block"
          >
            Pagamentos Multicaixa
          </Link>
          <Link
            href="#"
            className="text-secondary hover:text-primary hover:translate-x-1 transition-all duration-300 font-[family-name:var(--font-body)] text-sm inline-block"
          >
            Termos e Condições
          </Link>
          <Link
            href="#"
            className="text-secondary hover:text-primary hover:translate-x-1 transition-all duration-300 font-[family-name:var(--font-body)] text-sm inline-block"
          >
            Privacidade
          </Link>
        </div>

        <div className="flex flex-col gap-6 footer-reveal" data-reveal-delay="200">
          <h4 className="font-[family-name:var(--font-headline)] text-primary font-bold">
            Acompanhe-nos
          </h4>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-secondary hover:text-primary hover:scale-110 transition-all duration-300"
            >
              <span className="material-symbols-outlined">language</span>
            </Link>
            <Link
              href="#"
              className="text-secondary hover:text-primary hover:scale-110 transition-all duration-300"
            >
              <span className="material-symbols-outlined">photo_camera</span>
            </Link>
          </div>
          <div className="mt-4 p-4 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors duration-300">
            <span className="text-[10px] block font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary mb-1">
              Método Preferencial
            </span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">
                payments
              </span>
              <span className="text-xs font-bold text-on-surface">
                Multicaixa Angola
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-16 pt-8 text-center">
        <p className="text-secondary text-xs font-[family-name:var(--font-label)] tracking-wide">
          © 2026 Wepink Angola. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
