import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const { data } = await supabase
    .from("products")
    .select("name, subtitle, description, image_url, price, type")
    .eq("slug", slug)
    .single();

  if (!data) {
    return { title: "Produto não encontrado" };
  }

  const title = `${data.name} - ${data.subtitle}`;
  const description = `Compre ${data.name} (${data.subtitle}) na Wepink Angola. ${(data.description || "").slice(0, 120)}. Entrega em Luanda via Multicaixa.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Wepink Angola`,
      description,
      url: `https://www.wepinkangola.com/produto/${slug}`,
      images: [{ url: data.image_url, width: 800, height: 1000, alt: data.name }],
      type: "website",
      siteName: "Wepink Angola",
      locale: "pt_AO",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Wepink Angola`,
      description,
      images: [data.image_url],
    },
    alternates: {
      canonical: `https://www.wepinkangola.com/produto/${slug}`,
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
