"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct, ProductFormData } from "@/lib/admin";

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    const result = await createProduct(data);
    if (result.success) {
      router.push("/admin/produtos");
    } else {
      alert(`Erro ao criar produto: ${result.error}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <a
          href="/admin/produtos"
          className="inline-flex items-center gap-1 text-sm text-secondary hover:text-primary transition-colors mb-4"
        >
          <span className="material-symbols-outlined text-lg">
            arrow_back
          </span>
          Voltar
        </a>
        <h1 className="text-3xl font-[family-name:var(--font-headline)] text-on-surface mb-1">
          Novo Produto
        </h1>
        <p className="text-secondary text-sm">
          Preencha os dados para cadastrar um novo perfume.
        </p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Criar Produto"
      />
    </div>
  );
}
