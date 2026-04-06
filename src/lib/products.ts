import { supabase } from "./supabase";
import { Product } from "@/types/product";

interface DbProduct {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  image_url: string;
  image_alt: string | null;
  type: string;
  category_id: string | null;
  badge: string | null;
  description: string | null;
  scent_profile: string[];
  duration: string | null;
  ingredients: string | null;
  stock: number;
  product_sizes: { label: string; ml: number; price: number }[];
}

function mapDbToProduct(row: DbProduct): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle,
    price: row.price,
    imageUrl: row.image_url,
    imageAlt: row.image_alt ?? "",
    type: row.type,
    categoryId: row.category_id ?? undefined,
    badge: row.badge ?? undefined,
    description: row.description ?? "",
    scentProfile: row.scent_profile ?? [],
    stock: row.stock ?? 0,
    sizes: (row.product_sizes ?? []).map((s) => ({
      label: s.label,
      ml: s.ml,
      price: s.price,
    })),
    details: {
      duration: row.duration ?? "",
      ingredients: row.ingredients ?? "",
    },
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_sizes(label, ml, price)")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  const products = (data as DbProduct[]).map(mapDbToProduct);
  // In stock first, out of stock last
  return products.sort((a, b) => {
    if (a.stock > 0 && b.stock <= 0) return -1;
    if (a.stock <= 0 && b.stock > 0) return 1;
    return 0;
  });
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_sizes(label, ml, price)")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Error fetching product:", error);
    return null;
  }

  return mapDbToProduct(data as DbProduct);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-AO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace(/\s/g, ".");
}
