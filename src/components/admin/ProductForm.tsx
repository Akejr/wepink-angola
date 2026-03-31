"use client";

import { useState, useEffect } from "react";
import { ProductFormData, AdminProductSize } from "@/lib/admin";
import { getCategories, Category } from "@/lib/categories";

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
}

const types = [
  { value: "floral", label: "Floral" },
  { value: "woody", label: "Amadeirado" },
  { value: "citrus", label: "Cítrico" },
  { value: "oriental", label: "Oriental" },
  { value: "fresh", label: "Fresh" },
  { value: "gourmand", label: "Gourmand" },
];

const emptyForm: ProductFormData = {
  name: "",
  slug: "",
  subtitle: "",
  price: 0,
  purchase_price: 0,
  image_url: "",
  image_alt: "",
  type: "floral",
  category_id: "",
  badge: "",
  description: "",
  scent_profile: [],
  sizes: [],
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(initialData || emptyForm);
  const [scentInput, setScentInput] = useState("");
  const [autoSlug, setAutoSlug] = useState(!initialData);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const update = <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K]
  ) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && autoSlug) {
        next.slug = generateSlug(value as string);
      }
      return next;
    });
  };

  const addScent = () => {
    const trimmed = scentInput.trim();
    if (trimmed && !form.scent_profile.includes(trimmed)) {
      update("scent_profile", [...form.scent_profile, trimmed]);
      setScentInput("");
    }
  };

  const removeScent = (scent: string) => {
    update(
      "scent_profile",
      form.scent_profile.filter((s) => s !== scent)
    );
  };

  const addSize = () => {
    update("sizes", [...form.sizes, { label: "", ml: 0, price: 0 }]);
  };

  const updateSize = (
    index: number,
    key: keyof AdminProductSize,
    value: string | number
  ) => {
    const updated = [...form.sizes];
    updated[index] = { ...updated[index], [key]: value };
    update("sizes", updated);
  };

  const removeSize = (index: number) => {
    update(
      "sizes",
      form.sizes.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPrice =
      form.sizes.length > 0
        ? Math.max(...form.sizes.map((s) => s.price))
        : form.price;
    onSubmit({ ...form, price: finalPrice || form.price });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <section className="bg-surface-container-lowest p-5 lg:p-8 rounded-xl space-y-6">
        <h2 className="text-lg font-[family-name:var(--font-headline)] text-on-surface">
          Informações Básicas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
              Nome do Produto *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Ex: Pink Diamond"
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary flex items-center gap-2">
              Slug (URL)
              {autoSlug && (
                <span className="text-[9px] normal-case tracking-normal text-primary bg-primary/10 px-2 py-0.5 rounded">
                  auto
                </span>
              )}
            </label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => {
                setAutoSlug(false);
                update("slug", e.target.value);
              }}
              placeholder="pink-diamond"
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
              Subtítulo *
            </label>
            <input
              type="text"
              required
              value={form.subtitle}
              onChange={(e) => update("subtitle", e.target.value)}
              placeholder="Ex: Eau de Parfum"
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
              Tipo *
            </label>
            <select
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20 transition-all"
            >
              {types.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
              Categoria
            </label>
            <select
              value={form.category_id}
              onChange={(e) => update("category_id", e.target.value)}
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="">Sem categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
              Badge (opcional)
            </label>
            <input
              type="text"
              value={form.badge}
              onChange={(e) => update("badge", e.target.value)}
              placeholder="Ex: NEW, BEST SELLER"
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
              Preço de Compra (AOA) *
            </label>
            <input
              type="number"
              required
              min={0}
              value={form.purchase_price || ""}
              onChange={(e) =>
                update("purchase_price", parseInt(e.target.value) || 0)
              }
              placeholder="18000"
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
            Descrição
          </label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
            placeholder="Descreva a fragrância..."
            className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20 transition-all resize-none placeholder:text-outline-variant"
          />
        </div>
      </section>

      {/* Image */}
      <section className="bg-surface-container-lowest p-5 lg:p-8 rounded-xl space-y-6">
        <h2 className="text-lg font-[family-name:var(--font-headline)] text-on-surface">
          Imagem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
              URL da Imagem *
            </label>
            <input
              type="url"
              required
              value={form.image_url}
              onChange={(e) => update("image_url", e.target.value)}
              placeholder="https://..."
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
              Alt Text da Imagem
            </label>
            <input
              type="text"
              value={form.image_alt}
              onChange={(e) => update("image_alt", e.target.value)}
              placeholder="Descrição da imagem"
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
            />
          </div>
        </div>
        {form.image_url && (
          <div
            className="w-32 h-40 rounded-lg bg-surface-container-low bg-cover bg-center"
            style={{ backgroundImage: `url(${form.image_url})` }}
          />
        )}
      </section>

      {/* Sizes & Pricing */}
      <section className="bg-surface-container-lowest p-5 lg:p-8 rounded-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-[family-name:var(--font-headline)] text-on-surface">
            Tamanhos e Preços de Venda
          </h2>
          <button
            type="button"
            onClick={addSize}
            className="text-primary text-sm font-medium flex items-center gap-1 hover:underline underline-offset-4"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Adicionar Tamanho
          </button>
        </div>

        {form.sizes.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-4xl text-outline-variant mb-2 block">
              straighten
            </span>
            <p className="text-sm text-secondary mb-3">
              Nenhum tamanho adicionado
            </p>
            <button
              type="button"
              onClick={addSize}
              className="text-primary text-sm font-bold hover:underline"
            >
              Adicionar primeiro tamanho
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {form.sizes.map((size, index) => (
              <div
                key={index}
                className="p-4 bg-surface-container-low rounded-lg"
              >
                <div className="flex items-center justify-between mb-3 lg:hidden">
                  <span className="text-xs font-bold text-secondary">Tamanho {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="p-1 text-secondary hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3 lg:flex lg:items-center lg:gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-secondary">
                      Label
                    </label>
                    <input
                      type="text"
                      required
                      value={size.label}
                      onChange={(e) => updateSize(index, "label", e.target.value)}
                      placeholder="100ml"
                      className="w-full bg-surface-container-lowest rounded px-3 py-2 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-secondary">
                      ML
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={size.ml || ""}
                      onChange={(e) =>
                        updateSize(index, "ml", parseInt(e.target.value) || 0)
                      }
                      placeholder="100"
                      className="w-full bg-surface-container-lowest rounded px-3 py-2 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-secondary">
                      Preço (AOA)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={size.price || ""}
                      onChange={(e) =>
                        updateSize(index, "price", parseInt(e.target.value) || 0)
                      }
                      placeholder="45000"
                      className="w-full bg-surface-container-lowest rounded px-3 py-2 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="hidden lg:block p-2 text-secondary hover:text-error transition-colors mt-5"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Scent Profile */}
      <section className="bg-surface-container-lowest p-5 lg:p-8 rounded-xl space-y-6">
        <h2 className="text-lg font-[family-name:var(--font-headline)] text-on-surface">
          Perfil Olfativo
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={scentInput}
            onChange={(e) => setScentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addScent();
              }
            }}
            placeholder="Ex: Floral, Jasmim, Rosa..."
            className="flex-1 bg-surface-container-low rounded-lg px-4 py-3 text-sm text-on-surface border-0 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant"
          />
          <button
            type="button"
            onClick={addScent}
            className="px-4 py-3 bg-secondary-container text-on-secondary-container rounded-lg text-sm font-medium hover:bg-primary hover:text-on-primary transition-all"
          >
            Adicionar
          </button>
        </div>
        {form.scent_profile.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.scent_profile.map((scent) => (
              <span
                key={scent}
                className="bg-secondary-fixed text-on-secondary-fixed pl-3 pr-1.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1"
              >
                {scent}
                <button
                  type="button"
                  onClick={() => removeScent(scent)}
                  className="hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">
                    close
                  </span>
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <a
          href="/admin/produtos"
          className="px-6 py-3 text-sm font-medium text-secondary hover:text-on-surface transition-colors"
        >
          Cancelar
        </a>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined text-xl animate-spin">
                progress_activity
              </span>
              Salvando...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-xl">save</span>
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
