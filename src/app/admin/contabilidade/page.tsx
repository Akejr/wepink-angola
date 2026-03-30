"use client";

import { useEffect, useState } from "react";
import {
  getFinanceStats,
  createFinance,
  deleteFinance,
  FinanceStats,
  FinanceFormData,
} from "@/lib/finances";
import { formatPrice } from "@/lib/products";

const expenseCategories = [
  "Compra de Produtos",
  "Transporte",
  "Embalagem",
  "Marketing",
  "Aluguel",
  "Funcionários",
  "Outro",
];

export default function ContabilidadePage() {
  const [stats, setStats] = useState<FinanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [form, setForm] = useState<FinanceFormData>({
    type: "income",
    description: "",
    amount: 0,
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const loadData = () => {
    setLoading(true);
    getFinanceStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await createFinance(form);
    if (result.success) {
      setForm({
        type: "income",
        description: "",
        amount: 0,
        category: "",
        date: new Date().toISOString().split("T")[0],
      });
      setShowForm(false);
      loadData();
    } else {
      alert(`Erro: ${result.error}`);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este lançamento?")) return;
    const result = await deleteFinance(id);
    if (result.success) loadData();
    else alert(`Erro: ${result.error}`);
  };

  if (loading || !stats) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-[family-name:var(--font-headline)] text-on-surface">
          Contabilidade
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface-container-lowest p-6 rounded-xl h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const filteredEntries =
    filter === "all"
      ? stats.entries
      : stats.entries.filter((e) => e.type === filter);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-[family-name:var(--font-headline)] text-on-surface mb-1">
            Contabilidade
          </h1>
          <p className="text-secondary text-sm">Controle de receitas e gastos</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-xl">
            {showForm ? "close" : "add"}
          </span>
          {showForm ? "Cancelar" : "Novo Lançamento"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
              Total Receitas
            </span>
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-700">
                trending_up
              </span>
            </div>
          </div>
          <p className="text-2xl font-[family-name:var(--font-headline)] text-green-700">
            {formatPrice(stats.totalIncome)} Kz
          </p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
              Total Gastos
            </span>
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-red-700">
                trending_down
              </span>
            </div>
          </div>
          <p className="text-2xl font-[family-name:var(--font-headline)] text-red-700">
            {formatPrice(stats.totalExpense)} Kz
          </p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
              Saldo
            </span>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stats.balance >= 0 ? "bg-blue-50" : "bg-red-50"}`}>
              <span className={`material-symbols-outlined ${stats.balance >= 0 ? "text-blue-700" : "text-red-700"}`}>
                account_balance_wallet
              </span>
            </div>
          </div>
          <p className={`text-2xl font-[family-name:var(--font-headline)] ${stats.balance >= 0 ? "text-blue-700" : "text-red-700"}`}>
            {stats.balance < 0 && "-"}{formatPrice(Math.abs(stats.balance))} Kz
          </p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-surface-container-lowest p-8 rounded-xl space-y-6"
        >
          <h2 className="text-lg font-[family-name:var(--font-headline)] text-on-surface">
            Novo Lançamento
          </h2>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, type: "income" }))}
              className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all ${
                form.type === "income"
                  ? "bg-green-600 text-white"
                  : "bg-surface-container-low text-secondary hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-lg align-middle mr-1">
                arrow_upward
              </span>
              Receita
            </button>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, type: "expense" }))}
              className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all ${
                form.type === "expense"
                  ? "bg-red-600 text-white"
                  : "bg-surface-container-low text-secondary hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-lg align-middle mr-1">
                arrow_downward
              </span>
              Gasto
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
                Descrição *
              </label>
              <input
                type="text"
                required
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Ex: Venda Pink Diamond 100ml"
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
                Valor (AOA) *
              </label>
              <input
                type="number"
                required
                min={1}
                value={form.amount || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    amount: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="45000"
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
                Categoria
              </label>
              {form.type === "expense" ? (
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Selecionar...</option>
                  {expenseCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  placeholder="Ex: Venda Online"
                  className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant"
                />
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
                Data *
              </label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`px-8 py-3 rounded-lg font-bold text-sm text-white flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 ${
                form.type === "income" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {submitting ? "Salvando..." : "Registrar Lançamento"}
            </button>
          </div>
        </form>
      )}

      {/* Filter + List */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b border-surface-container-high/50">
          {(["all", "income", "expense"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === f
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-secondary hover:bg-surface-container"
              }`}
            >
              {f === "all" ? "Todos" : f === "income" ? "Receitas" : "Gastos"}
            </button>
          ))}
          <span className="ml-auto text-xs text-secondary">
            {filteredEntries.length} lançamento{filteredEntries.length !== 1 && "s"}
          </span>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">
              receipt_long
            </span>
            <p className="text-secondary">Nenhum lançamento registrado.</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-container-high/30">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container-low/50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    entry.type === "income" ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined ${
                      entry.type === "income"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {entry.type === "income"
                      ? "arrow_upward"
                      : "arrow_downward"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-on-surface text-sm truncate">
                    {entry.description}
                  </p>
                  <p className="text-xs text-secondary">
                    {entry.category && `${entry.category} · `}
                    {new Date(entry.date + "T12:00:00").toLocaleDateString("pt-AO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`font-[family-name:var(--font-headline)] text-sm flex-shrink-0 ${
                    entry.type === "income"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {entry.type === "income" ? "+" : "-"}
                  {formatPrice(entry.amount)} Kz
                </span>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 text-secondary hover:text-error transition-colors flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-lg">
                    delete
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
