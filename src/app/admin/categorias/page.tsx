"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category,
  CategoryFormData,
} from "@/lib/categories";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CategoryFormData>({
    name: "",
    slug: "",
    sort_order: 0,
  });

  const loadData = () => {
    setLoading(true);
    getCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({ name: "", slug: "", sort_order: categories.length + 1 });
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, sort_order: cat.sort_order });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const data: CategoryFormData = {
      ...form,
      slug: form.slug || generateSlug(form.name),
    };

    const result = editing
      ? await updateCategory(editing.id, data)
      : await createCategory(data);

    if (result.success) {
      resetForm();
      loadData();
    } else {
      alert(`Erro: ${result.error}`);
    }
    setSubmitting(false);
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Excluir a categoria "${cat.name}"?`)) return;
    const result = await deleteCategory(cat.id);
    if (result.success) loadData();
    else alert(`Erro: ${result.error}`);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-[family-name:var(--font-headline)] text-on-surface mb-1">
            Categorias
          </h1>
          <p className="text-secondary text-sm">
            Gerencia as categorias que aparecem no menu da loja
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setForm({ name: "", slug: "", sort_order: categories.length + 1 });
              setShowForm(true);
            }
          }}
          className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-xl">
            {showForm ? "close" : "add"}
          </span>
          {showForm ? "Cancelar" : "Nova Categoria"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-surface-container-lowest p-8 rounded-xl space-y-6"
        >
          <h2 className="text-lg font-[family-name:var(--font-headline)] text-on-surface">
            {editing ? `Editar: ${editing.name}` : "Nova Categoria"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
                Nome *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({
                    ...f,
                    name,
                    slug: editing ? f.slug : generateSlug(name),
                  }));
                }}
                placeholder="Ex: Feminino"
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
                Slug
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder="feminino"
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
                Ordem
              </label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    sort_order: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting
                ? "Salvando..."
                : editing
                ? "Salvar Alterações"
                : "Criar Categoria"}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 bg-surface-container-low rounded-lg animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">
              category
            </span>
            <p className="text-secondary">Nenhuma categoria cadastrada.</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-container-high/30">
            {categories.map((cat, index) => (
              <div
                key={cat.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container-low/50 transition-colors"
              >
                <span className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-on-surface text-sm">
                    {cat.name}
                  </p>
                  <p className="text-xs text-secondary">/{cat.slug}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <span className="material-symbols-outlined text-xl">
                      edit
                    </span>
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-2 rounded-lg text-secondary hover:text-error hover:bg-error/5 transition-all"
                  >
                    <span className="material-symbols-outlined text-xl">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-surface-container rounded-lg">
        <p className="text-xs text-secondary leading-relaxed">
          <span className="material-symbols-outlined text-sm align-middle mr-1">
            info
          </span>
          As categorias criadas aqui aparecem automaticamente no menu de
          navegação da loja. A ordem define a posição no menu.
        </p>
      </div>
    </div>
  );
}
