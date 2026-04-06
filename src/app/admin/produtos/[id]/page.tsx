"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import {
  getAdminProduct,
  updateProduct,
  AdminProduct,
  ProductFormData,
} from "@/lib/admin";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      getAdminProduct(id).then((data) => {
        setProduct(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    const result = await updateProduct(id, data);
    if (result.success) {
      router.push("/admin/produtos");
    } else {
      alert(`Erro ao atualizar produto: ${result.error}`);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl space-y-6">
        <div className="h-8 bg-surface-container-low rounded w-48 animate-pulse" />
        <div className="h-6 bg-surface-container-low rounded w-32 animate-pulse" />
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-surface-container-lowest p-8 rounded-xl h-48 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">
          error
        </span>
        <h1 className="text-2xl font-[family-name:var(--font-headline)] text-on-surface mb-2">
          Produto não encontrado
        </h1>
        <a
          href="/admin/produtos"
          className="text-primary text-sm hover:underline"
        >
          Voltar à lista
        </a>
      </div>
    );
  }

  const initialData: ProductFormData = {
    name: product.name,
    slug: product.slug,
    subtitle: product.subtitle,
    price: product.price,
    purchase_price: product.purchase_price || 0,
    image_url: product.image_url,
    image_alt: product.image_alt || "",
    type: product.type,
    category_id: product.category_id || "",
    badge: product.badge || "",
    description: product.description || "",
    scent_profile: product.scent_profile || [],
    stock: product.stock || 0,
    sizes: (product.product_sizes || []).map((s) => ({
      label: s.label,
      ml: s.ml,
      price: s.price,
    })),
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
          Editar: {product.name}
        </h1>
        <p className="text-secondary text-sm">
          Atualize as informações do produto.
        </p>
      </div>

      <ProductForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Salvar Alterações"
      />
    </div>
  );
}
