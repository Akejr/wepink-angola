import { supabase } from "./supabase";

export interface FinanceEntry {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  category: string | null;
  date: string;
  created_at: string;
}

export interface FinanceFormData {
  type: "income" | "expense";
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface FinanceStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  entries: FinanceEntry[];
  monthlyData: { month: string; income: number; expense: number }[];
}

export async function getFinances(): Promise<FinanceEntry[]> {
  const { data, error } = await supabase
    .from("finances")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching finances:", error);
    return [];
  }
  return data as FinanceEntry[];
}

export async function getFinanceStats(): Promise<FinanceStats> {
  const entries = await getFinances();

  const totalIncome = entries
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = entries
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);

  const monthlyMap = new Map<string, { income: number; expense: number }>();
  entries.forEach((e) => {
    const month = e.date.substring(0, 7);
    const current = monthlyMap.get(month) || { income: 0, expense: 0 };
    if (e.type === "income") current.income += e.amount;
    else current.expense += e.amount;
    monthlyMap.set(month, current);
  });

  const monthlyData = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    entries,
    monthlyData,
  };
}

export async function createFinance(
  form: FinanceFormData
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("finances").insert({
    type: form.type,
    description: form.description,
    amount: form.amount,
    category: form.category || null,
    date: form.date,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteFinance(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("finances").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
