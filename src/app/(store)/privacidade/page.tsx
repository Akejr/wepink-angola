import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de privacidade da loja Wepink Angola.",
};

export default function PrivacidadePage() {
  return (
    <main className="pt-[140px] pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl text-primary mb-4">
          Política de Privacidade
        </h1>
        <p className="text-secondary text-sm mb-12">Última atualização: Abril 2026</p>

        <div className="space-y-8 text-on-surface-variant text-[15px] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">1. Dados que Recolhemos</h2>
            <p>
              Ao utilizar o nosso site e realizar compras, recolhemos os seguintes dados pessoais:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex gap-2"><span className="text-primary font-bold">•</span><span>Nome completo</span></li>
              <li className="flex gap-2"><span className="text-primary font-bold">•</span><span>Número de telemóvel / WhatsApp</span></li>
              <li className="flex gap-2"><span className="text-primary font-bold">•</span><span>Endereço de entrega (município e morada)</span></li>
              <li className="flex gap-2"><span className="text-primary font-bold">•</span><span>Email (quando fornecido voluntariamente)</span></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">2. Como Utilizamos os Dados</h2>
            <p>Os dados recolhidos são utilizados exclusivamente para:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex gap-2"><span className="text-primary font-bold">•</span><span><span className="text-primary font-medium">Processar e entregar encomendas</span></span></li>
              <li className="flex gap-2"><span className="text-primary font-bold">•</span><span>Comunicar o estado do pedido e coordenar a entrega</span></li>
              <li className="flex gap-2"><span className="text-primary font-bold">•</span><span>Enviar notificações de disponibilidade de produtos (quando solicitado)</span></li>
              <li className="flex gap-2"><span className="text-primary font-bold">•</span><span>Notificar sobre o lançamento do site (quando inscrito na lista de espera)</span></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">3. Partilha de Dados</h2>
            <p>
              <span className="text-primary font-medium">Não vendemos, alugamos ou partilhamos os seus dados pessoais com terceiros</span>, excepto quando necessário para:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex gap-2"><span className="text-primary font-bold">•</span><span>Processar pagamentos através do gateway MoMenu (Multicaixa / MCX)</span></li>
              <li className="flex gap-2"><span className="text-primary font-bold">•</span><span>Cumprir obrigações legais ou regulatórias</span></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">4. Segurança dos Dados</h2>
            <p>
              Adoptamos medidas técnicas e organizacionais para proteger os seus dados contra acesso não autorizado, perda ou destruição. Os pagamentos são processados de forma segura através de infraestrutura certificada pela EMIS Angola.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">5. Retenção de Dados</h2>
            <p>
              Os dados pessoais são mantidos pelo tempo necessário para cumprir as finalidades descritas nesta política, ou conforme exigido por lei. Dados de encomendas são mantidos para fins de registo contabilístico.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">6. Os Seus Direitos</h2>
            <p>Tem o direito de:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex gap-2"><span className="text-primary font-bold">•</span><span>Solicitar acesso aos seus dados pessoais</span></li>
              <li className="flex gap-2"><span className="text-primary font-bold">•</span><span>Solicitar a correcção de dados incorrectos</span></li>
              <li className="flex gap-2"><span className="text-primary font-bold">•</span><span>Solicitar a eliminação dos seus dados (quando aplicável)</span></li>
            </ul>
            <p>
              Para exercer estes direitos, contacte-nos através do Instagram <a href="https://www.instagram.com/wepink.ang" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">@wepink.ang</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">7. Cookies</h2>
            <p>
              O nosso site utiliza armazenamento local (localStorage) apenas para manter o carrinho de compras durante a sessão. Não utilizamos cookies de rastreamento ou publicidade.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">8. Alterações a esta Política</h2>
            <p>
              Esta política pode ser atualizada periodicamente. Quaisquer alterações serão publicadas nesta página com a data de atualização.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
