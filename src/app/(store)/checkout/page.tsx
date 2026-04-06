"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import { deliveryAreas, getDeliveryFee } from "@/lib/deliveryAreas";
import { useState, useEffect, useRef } from "react";

type PaymentMethod = "reference" | "mcx";
type CheckoutStep = "form" | "processing" | "reference-created" | "success" | "error";

interface ReferenceData {
  entity: string;
  referenceNumber: string;
  dueDate: string;
  operationId: string;
  transactionId: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("reference");
  const [step, setStep] = useState<CheckoutStep>("form");
  const [error, setError] = useState("");
  const [referenceData, setReferenceData] = useState<ReferenceData | null>(null);
  const [referenceStatus, setReferenceStatus] = useState<string>("pending");
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "Cidade",
    address: "",
    email: "",
    deliveryNotes: "",
  });

  const deliveryFee = getDeliveryFee(form.area);
  const total = totalPrice + deliveryFee;

  const updateForm = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const buildProducts = () => {
    const productItems = items.map((item) => ({
      id: item.product.id,
      productName: `${item.product.name} - ${item.selectedSize.label}`,
      productPrice: item.selectedSize.price * item.quantity,
      productQuantity: item.quantity,
      iva: 0,
    }));
    productItems.push({
      id: "delivery-fee",
      productName: "Taxa de Entrega (Luanda)",
      productPrice: deliveryFee,
      productQuantity: 1,
      iva: 0,
    });
    return productItems;
  };

  // Polling for reference status
  useEffect(() => {
    if (step === "reference-created" && referenceData) {
      pollingRef.current = setInterval(async () => {
        try {
          const res = await fetch(
            `/api/payment/reference/status?operationId=${referenceData.operationId}&merchantTransactionId=${referenceData.transactionId}`
          );
          const data = await res.json();
          if (data.success && data.status === "paid") {
            setReferenceStatus("paid");
            setStep("success");
            clearCart();
            if (pollingRef.current) clearInterval(pollingRef.current);
          } else if (data.status === "failed" || data.status === "expired") {
            setReferenceStatus(data.status);
            if (pollingRef.current) clearInterval(pollingRef.current);
          }
        } catch {
          // silently retry
        }
      }, 15000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [step, referenceData, clearCart]);

  const buildOrderData = () => ({
    customer_name: form.name,
    customer_phone: form.phone,
    customer_email: form.email || undefined,
    customer_municipality: form.area,
    customer_address: form.address,
    delivery_notes: form.deliveryNotes || undefined,
    payment_method: paymentMethod,
    total_amount: total,
    delivery_fee: deliveryFee,
    subtotal: totalPrice,
    items: items.map((item) => ({
      product_id: item.product.id,
      product_name: item.product.name,
      product_subtitle: item.product.subtitle,
      product_image_url: item.product.imageUrl,
      size_label: item.selectedSize.label,
      size_ml: item.selectedSize.ml,
      unit_price: item.selectedSize.price,
      quantity: item.quantity,
    })),
  });

  const saveOrder = async (paymentResult: Record<string, unknown>) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderData: buildOrderData(),
          paymentResult,
          paymentMethod,
        }),
      });
      const data = await res.json();
      return data.orderId as string | null;
    } catch {
      return null;
    }
  };

  const updateOrder = async (orderId: string, paymentData: Record<string, unknown>) => {
    try {
      await fetch("/api/orders/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentData }),
      });
    } catch {
      // silent
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.address) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    setError("");
    setStep("processing");

    // Save order first as pending
    const orderId = await saveOrder({ success: false });

    try {
      if (paymentMethod === "mcx") {
        const res = await fetch("/api/payment/mcx", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            phoneNumber: form.phone,
            products: buildProducts(),
            customerName: form.name,
            customerEmail: form.email,
          }),
        });
        const data = await res.json();
        if (orderId) {
          await updateOrder(orderId, {
            payment_status: data.success ? "paid" : "failed",
            transaction_id: data.transactionId,
            invoice_url: data.invoiceUrl,
          });
        }
        if (data.success) {
          setStep("success");
          clearCart();
        } else {
          setError(data.error || "Pagamento não confirmado. Tente novamente.");
          setStep("error");
        }
      } else {
        const res = await fetch("/api/payment/reference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            products: buildProducts(),
            customerName: form.name,
            customerEmail: form.email,
          }),
        });
        const data = await res.json();
        if (data.success) {
          if (orderId) {
            await updateOrder(orderId, {
              payment_status: "pending",
              operation_id: data.operationId,
              transaction_id: data.transactionId,
              reference_number: data.referenceNumber,
              reference_entity: data.entity,
              reference_due_date: data.dueDate,
            });
          }
          setReferenceData({
            entity: data.entity,
            referenceNumber: data.referenceNumber,
            dueDate: data.dueDate,
            operationId: data.operationId,
            transactionId: data.transactionId,
          });
          setStep("reference-created");
        } else {
          if (orderId) {
            await updateOrder(orderId, { payment_status: "failed" });
          }
          setError(data.error || "Erro ao gerar referência. Tente novamente.");
          setStep("error");
        }
      }
    } catch {
      setError("Erro de conexão. Verifique a sua internet.");
      setStep("error");
    }
  };

  if (items.length === 0 && step !== "success") {
    return (
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <span className="material-symbols-outlined text-7xl text-outline-variant mb-6 block">shopping_cart</span>
        <h1 className="text-4xl font-[family-name:var(--font-headline)] text-primary mb-4">Carrinho Vazio</h1>
        <p className="text-secondary mb-8">Adicione produtos ao carrinho antes de finalizar a compra.</p>
        <Link href="/" className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all">
          Explorar Fragrâncias
        </Link>
      </main>
    );
  }

  // Success screen
  if (step === "success") {
    return (
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center animate-fade-up">
        <span className="material-symbols-outlined text-8xl text-green-600 mb-6 block">check_circle</span>
        <h1 className="text-4xl font-[family-name:var(--font-headline)] text-primary mb-4">Pagamento Confirmado</h1>
        <p className="text-secondary mb-2 text-lg">Obrigado pela sua compra, {form.name.split(" ")[0]}!</p>
        <p className="text-secondary mb-10">Entraremos em contacto pelo número {form.phone} para coordenar a entrega.</p>
        <Link href="/" className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold hover:opacity-90 transition-all">
          Voltar à Loja
        </Link>
      </main>
    );
  }

  // Reference created screen
  if (step === "reference-created" && referenceData) {
    return (
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto animate-fade-up">
        <div className="text-center mb-12">
          <span className="material-symbols-outlined text-6xl text-primary mb-4 block">receipt_long</span>
          <h1 className="text-3xl font-[family-name:var(--font-headline)] text-primary mb-2">Referência Gerada</h1>
          <p className="text-secondary">Use os dados abaixo para pagar no ATM ou App Bancária.</p>
        </div>

        <div className="bg-surface-container-lowest p-8 md:p-12 rounded-xl max-w-lg mx-auto space-y-6">
          <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
            <span className="text-secondary text-sm">Entidade</span>
            <span className="font-[family-name:var(--font-headline)] text-xl text-on-surface font-bold">{referenceData.entity}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
            <span className="text-secondary text-sm">Referência</span>
            <span className="font-[family-name:var(--font-headline)] text-xl text-on-surface font-bold tracking-wider">{referenceData.referenceNumber}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
            <span className="text-secondary text-sm">Valor</span>
            <span className="font-[family-name:var(--font-headline)] text-xl text-primary font-bold">{formatPrice(total)} Kz</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-secondary text-sm">Validade</span>
            <span className="text-sm text-on-surface">
              {new Date(referenceData.dueDate).toLocaleDateString("pt-AO", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

        <div className="max-w-lg mx-auto mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-secondary mb-6">
            {referenceStatus === "pending" && (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                A aguardar pagamento...
              </>
            )}
            {referenceStatus === "expired" && (
              <>
                <span className="material-symbols-outlined text-lg text-error">error</span>
                Referência expirada
              </>
            )}
          </div>
          <Link href="/" className="text-primary text-sm font-medium hover:underline underline-offset-4">
            Voltar à Loja
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left: Order Summary (desktop only) */}
        <div className="hidden lg:block lg:col-span-5 space-y-12">
          <section>
            <h2 className="text-3xl font-[family-name:var(--font-headline)] text-primary mb-10">Resumo do Pedido</h2>
            <div className="bg-surface-container-lowest p-8 rounded-lg space-y-8">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize.label}`} className="flex gap-6">
                  <div className="w-32 h-40 bg-surface-container-low rounded overflow-hidden flex-shrink-0 relative">
                    <Image src={item.product.imageUrl} alt={item.product.name} fill sizes="128px" className="object-cover" />
                  </div>
                  <div className="flex flex-col justify-between py-2">
                    <div>
                      <h3 className="text-xl font-[family-name:var(--font-headline)] text-on-surface">{item.product.name}</h3>
                      <p className="text-secondary font-[family-name:var(--font-label)] text-sm tracking-wide mt-1">
                        {item.product.subtitle} | {item.selectedSize.label}
                      </p>
                      {item.quantity > 1 && <p className="text-xs text-secondary mt-1">Qtd: {item.quantity}</p>}
                    </div>
                    <div className="font-[family-name:var(--font-headline)] text-lg text-primary">
                      {formatPrice(item.selectedSize.price * item.quantity)} Kz
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-8 space-y-4" style={{ borderTop: "1px solid rgba(214, 194, 196, 0.15)" }}>
                <div className="flex justify-between text-secondary font-[family-name:var(--font-label)]">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)} Kz</span>
                </div>
                <div className="flex justify-between text-secondary font-[family-name:var(--font-label)]">
                  <span>Entrega ({form.area})</span>
                  <span>{formatPrice(deliveryFee)} Kz</span>
                </div>
                <div className="flex justify-between text-on-surface font-bold text-xl pt-4">
                  <span className="font-[family-name:var(--font-headline)]">Total</span>
                  <span className="font-[family-name:var(--font-headline)] text-primary">{formatPrice(total)} Kz</span>
                </div>
              </div>
            </div>
          </section>
          <div className="p-6 bg-secondary-container/30 rounded-lg flex items-start gap-4">
            <span className="material-symbols-outlined text-primary">verified</span>
            <div>
              <p className="font-bold text-on-secondary-container text-sm">Garantia Wepink Angola</p>
              <p className="text-on-secondary-container/80 text-xs mt-1 leading-relaxed">
                Produtos 100% originais com entrega expressa em toda a província de Luanda.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Checkout Form */}
        <div className="lg:col-span-7 space-y-12">
          {/* Delivery Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">1</span>
              <h2 className="text-2xl font-[family-name:var(--font-headline)] text-on-surface">Dados de Entrega</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="col-span-2 group">
                <div className="relative bg-surface-container-lowest rounded-xl overflow-hidden border border-transparent focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(183,22,86,0.15)] transition-all duration-300">
                  <input type="text" value={form.name} onChange={(e) => updateForm("name", e.target.value)}
                    placeholder=" " id="field-name"
                    className="peer w-full bg-transparent px-4 pt-6 pb-2 text-sm text-on-surface border-0 focus:ring-0 placeholder-transparent" />
                  <label htmlFor="field-name"
                    className="absolute left-4 top-2 text-[10px] font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-primary">
                    Nome Completo *
                  </label>
                </div>
              </div>
              <div className="group">
                <div className="relative bg-surface-container-lowest rounded-xl overflow-hidden border border-transparent focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(183,22,86,0.15)] transition-all duration-300">
                  <input type="tel" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)}
                    placeholder=" " id="field-phone"
                    className="peer w-full bg-transparent px-4 pt-6 pb-2 text-sm text-on-surface border-0 focus:ring-0 placeholder-transparent" />
                  <label htmlFor="field-phone"
                    className="absolute left-4 top-2 text-[10px] font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-primary">
                    Telemóvel *
                  </label>
                </div>
              </div>
              <div className="group">
                <div className="relative bg-surface-container-lowest rounded-xl overflow-hidden border border-transparent focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(183,22,86,0.15)] transition-all duration-300">
                  <select value={form.area} onChange={(e) => updateForm("area", e.target.value)}
                    id="field-area"
                    className="w-full bg-transparent px-4 pt-6 pb-2 text-sm text-on-surface border-0 focus:ring-0 appearance-none cursor-pointer">
                    {deliveryAreas.map((area) => (
                      <option key={area.name} value={area.name}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="field-area"
                    className="absolute left-4 top-2 text-[10px] font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
                    Área de Entrega
                  </label>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary text-lg pointer-events-none">expand_more</span>
                </div>
              </div>
              <div className="col-span-2 group">
                <div className="relative bg-surface-container-lowest rounded-xl overflow-hidden border border-transparent focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(183,22,86,0.15)] transition-all duration-300">
                  <input type="text" value={form.address} onChange={(e) => updateForm("address", e.target.value)}
                    placeholder=" " id="field-address"
                    className="peer w-full bg-transparent px-4 pt-6 pb-2 text-sm text-on-surface border-0 focus:ring-0 placeholder-transparent" />
                  <label htmlFor="field-address"
                    className="absolute left-4 top-2 text-[10px] font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-primary">
                    Endereço Detalhado *
                  </label>
                </div>
              </div>
              <div className="group">
                <div className="relative bg-surface-container-lowest rounded-xl overflow-hidden border border-transparent focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(183,22,86,0.15)] transition-all duration-300">
                  <input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)}
                    placeholder=" " id="field-email"
                    className="peer w-full bg-transparent px-4 pt-6 pb-2 text-sm text-on-surface border-0 focus:ring-0 placeholder-transparent" />
                  <label htmlFor="field-email"
                    className="absolute left-4 top-2 text-[10px] font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-primary">
                    Email (opcional)
                  </label>
                </div>
              </div>
              <div className="col-span-2 group">
                <div className="relative bg-surface-container-lowest rounded-xl overflow-hidden border border-transparent focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(183,22,86,0.15)] transition-all duration-300">
                  <textarea value={form.deliveryNotes} onChange={(e) => updateForm("deliveryNotes", e.target.value)}
                    placeholder=" " id="field-notes" rows={3}
                    className="peer w-full bg-transparent px-4 pt-6 pb-2 text-sm text-on-surface border-0 focus:ring-0 placeholder-transparent resize-none" />
                  <label htmlFor="field-notes"
                    className="absolute left-4 top-2 text-[10px] font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-primary">
                    Orientação extra para entrega
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Mobile Order Summary */}
          <div className="lg:hidden bg-surface-container-lowest p-6 rounded-lg space-y-4">
            <h3 className="font-[family-name:var(--font-headline)] text-lg text-primary">Resumo</h3>
            {items.map((item) => (
              <div key={`m-${item.product.id}-${item.selectedSize.label}`} className="flex items-center gap-3">
                <div className="w-10 h-12 rounded overflow-hidden flex-shrink-0 relative">
                  <Image src={item.product.imageUrl} alt={item.product.name} fill sizes="40px" className="object-cover" />
                </div>
                <span className="text-sm text-on-surface truncate flex-1">{item.product.name} · {item.selectedSize.label} {item.quantity > 1 ? `x${item.quantity}` : ""}</span>
                <span className="text-sm text-on-surface font-medium flex-shrink-0">{formatPrice(item.selectedSize.price * item.quantity)} Kz</span>
              </div>
            ))}
            <div className="pt-3 space-y-2" style={{ borderTop: "1px solid rgba(214, 194, 196, 0.15)" }}>
              <div className="flex justify-between text-sm text-secondary">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)} Kz</span>
              </div>
              <div className="flex justify-between text-sm text-secondary">
                <span>Entrega ({form.area})</span>
                <span>{formatPrice(deliveryFee)} Kz</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2">
                <span className="font-[family-name:var(--font-headline)]">Total</span>
                <span className="font-[family-name:var(--font-headline)] text-primary">{formatPrice(total)} Kz</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">2</span>
              <h2 className="text-2xl font-[family-name:var(--font-headline)] text-on-surface">Método de Pagamento</h2>
            </div>
            <div className="space-y-4">
              {/* Reference Option */}
              <button onClick={() => setPaymentMethod("reference")}
                className={`w-full p-6 rounded-xl flex items-center justify-between text-left transition-all ${
                  paymentMethod === "reference"
                    ? "bg-surface-container-lowest border border-primary/20"
                    : "bg-surface-container-low/50 border border-transparent opacity-60"
                }`}>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src="/images/multicaixa.png" alt="Multicaixa" width={48} height={48} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Referência Bancária</p>
                    <p className="text-secondary text-xs">Pague em qualquer ATM ou App Bancária</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "reference" ? "border-primary" : "border-outline-variant"}`}>
                  {paymentMethod === "reference" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
              </button>

              {/* MCX Option */}
              <button onClick={() => setPaymentMethod("mcx")}
                className={`w-full p-6 rounded-xl flex items-center justify-between text-left transition-all ${
                  paymentMethod === "mcx"
                    ? "bg-surface-container-lowest border border-primary/20"
                    : "bg-surface-container-low/50 border border-transparent opacity-60"
                }`}>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src="/images/mcx.png" alt="Multicaixa Express" width={48} height={48} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Multicaixa Express</p>
                    <p className="text-secondary text-xs">Pagamento instantâneo via telemóvel</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "mcx" ? "border-primary" : "border-outline-variant"}`}>
                  {paymentMethod === "mcx" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
              </button>
            </div>

            {paymentMethod === "reference" && (
              <div className="p-5 border border-dashed border-outline-variant rounded-lg">
                <p className="text-sm text-secondary leading-relaxed italic">
                  Será gerada uma referência exclusiva para o seu pedido. A validade é de 24 horas. O processamento inicia após a confirmação do pagamento.
                </p>
              </div>
            )}
            {paymentMethod === "mcx" && (
              <div className="p-5 border border-dashed border-outline-variant rounded-lg">
                <p className="text-sm text-secondary leading-relaxed italic">
                  Receberá uma notificação no telemóvel para confirmar o pagamento. Certifique-se de que o número está correcto e tem saldo suficiente.
                </p>
              </div>
            )}
          </section>

          {/* Error */}
          {error && (
            <div className="p-4 bg-error-container rounded-lg flex items-start gap-3">
              <span className="material-symbols-outlined text-error">error</span>
              <p className="text-sm text-on-error-container">{error}</p>
            </div>
          )}

          {/* Confirm Button */}
          <div className="pt-6">
            <button onClick={handleSubmit} disabled={step === "processing"}
              className="w-full bg-primary text-on-primary py-5 rounded-lg font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-60">
              {step === "processing" ? (
                <>
                  <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                  {paymentMethod === "mcx" ? "A aguardar confirmação..." : "A gerar referência..."}
                </>
              ) : (
                <>
                  Confirmar Pedido
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-secondary mt-6 font-[family-name:var(--font-label)] tracking-wide">
              Pagamento processado de forma segura por MoMenu Angola.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
