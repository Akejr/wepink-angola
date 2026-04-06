import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.wepinkangola.com";

  // Fetch all product slugs
  const { data: products } = await supabase
    .from("products")
    .select("slug, created_at")
    .order("created_at", { ascending: false });

  const productUrls = (products || []).map((p) => ({
    url: `${baseUrl}/produto/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/assuntos-legais`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/termos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacidade`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...productUrls,
  ];
}
