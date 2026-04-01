export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Wepink Angola",
    url: "https://www.wepinkangola.com",
    logo: "https://www.wepinkangola.com/images/logo.png",
    description:
      "Loja oficial Wepink em Angola. Perfumes, body splash e fragrâncias femininas premium com entrega em Luanda.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Luanda",
      addressCountry: "AO",
    },
    sameAs: ["https://www.instagram.com/wepink.ang"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Portuguese",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Wepink Angola",
    url: "https://www.wepinkangola.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.wepinkangola.com/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface ProductJsonLdProps {
  name: string;
  description: string;
  image: string;
  price: number;
  slug: string;
  badge?: string;
}

export function ProductJsonLd({ name, description, image, price, slug, badge }: ProductJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    url: `https://www.wepinkangola.com/produto/${slug}`,
    brand: {
      "@type": "Brand",
      name: "Wepink",
    },
    category: "Perfumes & Fragrâncias",
    ...(badge && { award: badge }),
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: "AOA",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Wepink Angola",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "AO",
          addressRegion: "Luanda",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
        },
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
