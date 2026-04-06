import { supabase } from "./supabase";

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  purchase_price: number;
  image_url: string;
  image_alt: string | null;
  type: string;
  category_id: string | null;
  badge: string | null;
  description: string | null;
  scent_profile: string[];
  duration: string | null;
  ingredients: string | null;
  created_at: string;
  stock: number;
  product_sizes: AdminProductSize[];
  categories?: { id: string; name: string } | null;
}

export interface AdminProductSize {
  id?: string;
  label: string;
  ml: number;
  price: number;
}

export interface ProductFormData {
  name: string;
  slug: string;
  subtitle: string;
  price: number;
  purchase_price: number;
  image_url: string;
  image_alt: string;
  type: string;
  category_id: string;
  badge: string;
  description: string;
  scent_profile: string[];
  stock: number;
  sizes: AdminProductSize[];
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_sizes(id, label, ml, price), categories(id, name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data as AdminProduct[];
}

export async function getAdminProduct(
  id: string
): Promise<AdminProduct | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_sizes(id, label, ml, price), categories(id, name)")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching product:", error);
    return null;
  }
  return data as AdminProduct;
}

export async function createProduct(
  form: ProductFormData
): Promise<{ success: boolean; error?: string }> {
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      name: form.name,
      slug: form.slug,
      subtitle: form.subtitle,
      price: form.price,
      purchase_price: form.purchase_price,
      image_url: form.image_url,
      image_alt: form.image_alt || null,
      type: form.type,
      category_id: form.category_id || null,
      badge: form.badge || null,
      description: form.description || null,
      scent_profile: form.scent_profile,
      stock: form.stock || 0,
    })
    .select("id")
    .single();

  if (productError || !product) {
    return {
      success: false,
      error: productError?.message || "Erro ao criar produto",
    };
  }

  if (form.sizes.length > 0) {
    const sizesData = form.sizes.map((s) => ({
      product_id: product.id,
      label: s.label,
      ml: s.ml,
      price: s.price,
    }));

    const { error: sizesError } = await supabase
      .from("product_sizes")
      .insert(sizesData);

    if (sizesError) {
      return { success: false, error: sizesError.message };
    }
  }

  return { success: true };
}

export async function updateProduct(
  id: string,
  form: ProductFormData
): Promise<{ success: boolean; error?: string }> {
  const { error: productError } = await supabase
    .from("products")
    .update({
      name: form.name,
      slug: form.slug,
      subtitle: form.subtitle,
      price: form.price,
      purchase_price: form.purchase_price,
      image_url: form.image_url,
      image_alt: form.image_alt || null,
      type: form.type,
      category_id: form.category_id || null,
      badge: form.badge || null,
      description: form.description || null,
      scent_profile: form.scent_profile,
      stock: form.stock || 0,
    })
    .eq("id", id);

  if (productError) {
    return { success: false, error: productError.message };
  }

  const { error: deleteError } = await supabase
    .from("product_sizes")
    .delete()
    .eq("product_id", id);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  if (form.sizes.length > 0) {
    const sizesData = form.sizes.map((s) => ({
      product_id: id,
      label: s.label,
      ml: s.ml,
      price: s.price,
    }));

    const { error: sizesError } = await supabase
      .from("product_sizes")
      .insert(sizesData);

    if (sizesError) {
      return { success: false, error: sizesError.message };
    }
  }

  return { success: true };
}

export async function deleteProduct(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  totalSold: number;
  totalExpenses: number;
  balance: number;
  profitMargin: number;
  typeCounts: Record<string, number>;
  recentProducts: AdminProduct[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const products = await getAdminProducts();

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  // Total sold from paid orders
  const { data: orders } = await supabase
    .from("orders")
    .select("subtotal")
    .eq("payment_status", "paid");
  const totalSold = (orders || []).reduce((sum, o) => sum + (o.subtotal || 0), 0);

  // Total expenses from finances
  const { data: expenses } = await supabase
    .from("finances")
    .select("amount")
    .eq("type", "expense");
  const totalExpenses = (expenses || []).reduce((sum, e) => sum + (e.amount || 0), 0);

  const balance = totalSold - totalExpenses;
  const profitMargin = totalSold > 0 ? ((totalSold - totalExpenses) / totalSold) * 100 : 0;

  const typeCounts: Record<string, number> = {};
  products.forEach((p) => {
    typeCounts[p.type] = (typeCounts[p.type] || 0) + 1;
  });

  const recentProducts = products.slice(0, 5);

  return {
    totalProducts,
    totalStock,
    totalSold,
    totalExpenses,
    balance,
    profitMargin,
    typeCounts,
    recentProducts,
  };
}
