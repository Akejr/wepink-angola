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
            href="/contacto"
            className="text-secondary hover:text-primary hover:translate-x-1 transition-all duration-300 font-[family-name:var(--font-body)] text-sm inline-block"
          >
            Contacto
          </Link>
          <Link
            href="/assuntos-legais"
            className="text-secondary hover:text-primary hover:translate-x-1 transition-all duration-300 font-[family-name:var(--font-body)] text-sm inline-block"
          >
            Assuntos Legais
          </Link>
          <Link
            href="/termos"
            className="text-secondary hover:text-primary hover:translate-x-1 transition-all duration-300 font-[family-name:var(--font-body)] text-sm inline-block"
          >
            Termos e Condições
          </Link>
          <Link
            href="/privacidade"
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
              href="https://www.instagram.com/wepink.ang"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-primary hover:scale-110 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </Link>
          </div>
          <div className="mt-4 p-5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors duration-300">
            <span className="text-[10px] block font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary mb-4">
              Formas de Pagamento
            </span>
            <div className="flex items-center gap-3">
              <div className="rounded-md overflow-hidden">
                <Image
                  src="/images/mcx.png"
                  alt="Multicaixa Express"
                  width={64}
                  height={40}
                  className="h-10 w-auto object-cover"
                />
              </div>
              <div className="rounded-md overflow-hidden">
                <Image
                  src="/images/multicaixa.png"
                  alt="Multicaixa"
                  width={64}
                  height={40}
                  className="h-10 w-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-10 pt-6 text-center">
        <p className="text-secondary text-xs font-[family-name:var(--font-label)] tracking-wide">
          © 2026 Wepink Angola. Todos os direitos reservados.
        </p>
        <p className="text-primary text-[10px] font-[family-name:var(--font-label)] mt-3 max-w-xl mx-auto leading-relaxed">
          A Wepink Angola não possui relação comercial direta com a empresa Wepink Cosméticos Ltda, sediada no Brasil. Importamos produtos adquiridos diretamente na loja oficial para revenda em solo angolano.
        </p>
      </div>
    </footer>
  );
}
