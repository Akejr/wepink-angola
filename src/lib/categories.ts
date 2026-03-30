import { supabase } from "./supabase";

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  sort_order: number;
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data as Category[];
}

export async function createCategory(
  form: CategoryFormData
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("categories").insert({
    name: form.name,
    slug: form.slug,
    sort_order: form.sort_order,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateCategory(
  id: string,
  form: CategoryFormData
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("categories")
    .update({
      name: form.name,
      slug: form.slug,
      sort_order: form.sort_order,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteCategory(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
