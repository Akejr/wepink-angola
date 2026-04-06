import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assuntos Legais",
  description: "Informações legais sobre a atuação da Wepink Angola como revendedora independente de produtos importados do Brasil.",
};

export default function AssuntosLegaisPage() {
  return (
    <main className="pt-[140px] pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl text-primary mb-4">
          Assuntos Legais
        </h1>
        <p className="text-secondary text-sm mb-12">Última atualização: Abril 2026</p>

        <div className="space-y-8 text-on-surface-variant text-[15px] leading-relaxed">
          <p>
            A presente página tem como objetivo esclarecer, de forma transparente, a atuação da empresa no que diz respeito à{" "}
            <span className="text-primary font-medium">comercialização de produtos adquiridos no exterior para revenda em Angola</span>.
          </p>

          <p>
            A empresa atua de acordo com os princípios da{" "}
            <span className="text-primary font-medium">legalidade, boa-fé e livre iniciativa</span>,
            respeitando as normas aplicáveis ao comércio internacional e à revenda de produtos adquiridos de forma legítima.
          </p>

          <p>
            Todos os produtos comercializados são{" "}
            <span className="text-primary font-medium">adquiridos legalmente no Brasil</span>,
            por meio de canais oficiais de venda ao consumidor final, sendo posteriormente{" "}
            <span className="text-primary font-medium">importados para Angola em conformidade com as regras aduaneiras e fiscais aplicáveis</span>.
            Após a importação, os produtos são disponibilizados para revenda no mercado angolano.
          </p>

          <p>
            Nos termos das práticas comerciais internacionalmente aceitas, a{" "}
            <span className="text-primary font-medium">revenda de produtos originais adquiridos de forma legítima é permitida</span>,
            desde que não haja violação de direitos de propriedade intelectual, como falsificação, adulteração de marca, ou indução do consumidor a erro quanto à origem empresarial do produto.
          </p>

          <p>
            A empresa{" "}
            <span className="text-primary font-medium">não fabrica, altera ou modifica os produtos comercializados</span>,
            garantindo que todos são originais e mantêm as características do fabricante.
          </p>

          <div className="bg-surface-container-low p-8 rounded-xl space-y-4">
            <h2 className="font-[family-name:var(--font-headline)] text-xl text-on-surface">
              Importante ressaltar que:
            </h2>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>A empresa atua como <span className="text-primary font-medium">revendedora independente</span>;</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span><span className="text-primary font-medium">Não há vínculo societário, representação oficial, distribuição autorizada</span> ou qualquer relação comercial direta com a marca original;</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>O uso de nomes e referências aos produtos tem <span className="text-primary font-medium">caráter meramente informativo</span>, com o objetivo de identificar os itens revendidos;</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Não há qualquer intenção de induzir o consumidor a acreditar que se trata de uma <span className="text-primary font-medium">loja oficial da marca</span>.</span>
              </li>
            </ul>
          </div>

          <p>
            Dessa forma, a atividade exercida está alinhada com o{" "}
            <span className="text-primary font-medium">direito à livre concorrência e à livre circulação de bens</span>,
            respeitando os limites legais e os direitos dos titulares de marcas.
          </p>

          <p>
            A empresa permanece comprometida com a{" "}
            <span className="text-primary font-medium">transparência, a legalidade e a proteção dos direitos do consumidor</span>,
            estando à disposição para quaisquer esclarecimentos adicionais.
          </p>
        </div>
      </div>
    </main>
  );
}
