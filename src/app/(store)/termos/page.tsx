import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos e Condições",
  description: "Termos e condições de uso da loja Wepink Angola.",
};

export default function TermosPage() {
  return (
    <main className="pt-[140px] pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl text-primary mb-4">
          Termos e Condições
        </h1>
        <p className="text-secondary text-sm mb-12">Última atualização: Abril 2026</p>

        <div className="space-y-8 text-on-surface-variant text-[15px] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">1. Sobre a Wepink Angola</h2>
            <p>
              A Wepink Angola é uma <span className="text-primary font-medium">revendedora independente</span> de produtos de perfumaria e cosméticos adquiridos legalmente no Brasil, por meio de canais oficiais de venda ao consumidor final, e importados para Angola em conformidade com as regras aduaneiras e fiscais aplicáveis.
            </p>
            <p>
              Não possuímos vínculo societário, representação oficial ou qualquer relação comercial direta com a marca Wepink Cosméticos Ltda, sediada no Brasil.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">2. Produtos</h2>
            <p>
              Todos os produtos comercializados são <span className="text-primary font-medium">100% originais</span>, adquiridos em canais oficiais e mantêm as características do fabricante. A empresa não fabrica, altera ou modifica os produtos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">3. Preços e Pagamentos</h2>
            <p>
              Os preços são apresentados em Kwanzas (AOA) e incluem o valor do produto. A taxa de entrega é cobrada separadamente. Os métodos de pagamento aceites são <span className="text-primary font-medium">Referência Bancária (Multicaixa)</span> e <span className="text-primary font-medium">Multicaixa Express (MCX)</span>.
            </p>
            <p>
              As referências bancárias têm validade de 24 horas. Após esse período, a referência expira e o pedido é cancelado automaticamente.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">4. Entregas</h2>
            <p>
              As entregas são realizadas exclusivamente na <span className="text-primary font-medium">província de Luanda</span>, no prazo estimado de 24 horas após a confirmação do pagamento. A taxa de entrega é de 2.500 Kz.
            </p>
            <p>
              O cliente é responsável por fornecer dados de entrega correctos e completos. A Wepink Angola não se responsabiliza por atrasos ou falhas de entrega causados por informações incorrectas.
            </p>
          </section>

          <div className="bg-surface-container-low p-8 rounded-xl space-y-3">
            <h2 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">5. Política de Reembolso e Trocas</h2>
            <p>
              <span className="text-primary font-medium">Após a entrega do produto ao cliente, não são aceites pedidos de reembolso ou devolução.</span> Ao confirmar a compra, o cliente declara estar ciente desta condição.
            </p>
            <p>
              Excepções aplicam-se apenas nos seguintes casos:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Produto entregue com <span className="text-primary font-medium">defeito de fabrico</span> visível e comprovado no acto da entrega;</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Produto entregue <span className="text-primary font-medium">diferente do que foi encomendado</span>.</span>
              </li>
            </ul>
            <p>
              Nestes casos, o cliente deve contactar-nos no prazo de 24 horas após a entrega, apresentando fotografias do produto recebido. A análise será feita caso a caso.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">6. Disponibilidade de Produtos</h2>
            <p>
              Os produtos estão sujeitos à disponibilidade de estoque. Produtos esgotados são sinalizados no site. O cliente pode solicitar notificação quando o produto voltar a estar disponível.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">7. Propriedade Intelectual</h2>
            <p>
              O uso de nomes, imagens e referências aos produtos tem carácter meramente informativo, com o objectivo de identificar os itens revendidos. Não há qualquer intenção de induzir o consumidor a acreditar que se trata de uma loja oficial da marca.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">8. Alterações aos Termos</h2>
            <p>
              A Wepink Angola reserva-se o direito de alterar estes termos a qualquer momento. As alterações entram em vigor imediatamente após a publicação no site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">9. Contacto</h2>
            <p>
              Para questões relacionadas com estes termos, entre em contacto através do nosso Instagram <a href="https://www.instagram.com/wepink.ang" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">@wepink.ang</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
