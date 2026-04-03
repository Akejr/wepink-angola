import { supabase } from "./supabase";

export interface LaunchSubscriber {
  id: string;
  name: string;
  whatsapp: string;
  created_at: string;
}

export async function subscribeLaunch(
  name: string,
  whatsapp: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("launch_subscribers")
    .insert({ name, whatsapp });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getLaunchSubscribers(): Promise<LaunchSubscriber[]> {
  const { data, error } = await supabase
    .from("launch_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching subscribers:", error);
    return [];
  }
  return data as LaunchSubscriber[];
}
