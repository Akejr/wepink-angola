import { supabase } from "./supabase";

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export async function sendMessage(
  name: string,
  phone: string,
  subject: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("contact_messages")
    .insert({ name, phone, subject, message });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data as ContactMessage[];
}

export async function markMessageRead(id: string): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from("contact_messages")
    .update({ read: true })
    .eq("id", id);
  return { success: !error };
}

export async function deleteMessage(id: string): Promise<{ success: boolean }> {
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  return { success: !error };
}
