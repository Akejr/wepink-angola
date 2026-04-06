import { supabase } from "./supabase";

export interface StockAlert {
  id: string;
  product_id: string;
  product_name: string;
  name: string;
  whatsapp: string;
  notified: boolean;
  created_at: string;
}

export async function createStockAlert(
  productId: string,
  productName: string,
  name: string,
  whatsapp: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("stock_alerts").insert({
    product_id: productId,
    product_name: productName,
    name,
    whatsapp,
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getStockAlerts(): Promise<StockAlert[]> {
  const { data, error } = await supabase
    .from("stock_alerts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching stock alerts:", error);
    return [];
  }
  return data as StockAlert[];
}

export async function markAlertNotified(id: string): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from("stock_alerts")
    .update({ notified: true })
    .eq("id", id);
  return { success: !error };
}

export async function deleteStockAlert(id: string): Promise<{ success: boolean }> {
  const { error } = await supabase.from("stock_alerts").delete().eq("id", id);
  return { success: !error };
}
