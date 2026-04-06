"use client";

import { useEffect, useState } from "react";
import { getOrders, updateDeliveryStatus, deleteOrder, Order } from "@/lib/orders";
import { formatPrice } from "@/lib/products";

type FilterTab = "all" | "paid" | "pending" | "failed";

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  paid: { label: "Pago", color: "text-green-700", bg: "bg-green-50" },
  pending: { label: "Pendente", color: "text-amber-700", bg: "bg-amber-50" },
  failed: { label: "Falhado", color: "text-red-700", bg: "bg-red-50" },
  expired: { label: "Expirado", color: "text-red-700", bg: "bg-red-50" },
};

const deliveryLabels: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Por entregar", color: "text-amber-700", bg: "bg-amber-50" },
  delivered: { label: "Entregue", color: "text-green-700", bg: "bg-green-50" },
};

export default function EncomendasPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingDelivery, setUpdatingDelivery] = useState<string | null>(null);

  const loadOrders = () => {
    setLoading(true);
    getOrders(filter).then((data) => {
      setOrders(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleToggleDelivery = async (order: Order) => {
    const newStatus = order.delivery_status === "delivered" ? "pending" : "delivered";
    setUpdatingDelivery(order.id);
    const result = await updateDeliveryStatus(order.id, newStatus);
    if (result.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, delivery_status: newStatus } : o))
      );
    }
    setUpdatingDelivery(null);
  };

  const handleDeleteOrder = async (order: Order) => {
    if (!confirm(`Apagar encomenda de "${order.customer_name}"?`)) return;
    const result = await deleteOrder(order.id);
    if (result.success) {
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    }
  };

  const tabs: { label: string; value: FilterTab }[] = [
    { label: "Todas", value: "all" },
    { label: "Pagas", value: "paid" },
    { label: "Pendentes", value: "pending" },
    { label: "Falhadas", value: "failed" },
  ];

  const counts = {
    all: orders.length,
    paid: orders.filter((o) => o.payment_status === "paid").length,
    pending: orders.filter((o) => o.payment_status === "pending").length,
    failed: orders.filter((o) => o.payment_status === "failed" || o.payment_status === "expired").length,
  };

  const filteredOrders = filter === "all"
    ? orders
    : filter === "failed"
    ? orders.filter((o) => o.payment_status === "failed" || o.payment_status === "expired")
    : orders.filter((o) => o.payment_status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-[family-name:var(--font-headline)] text-on-surface mb-1">
          Encomendas
        </h1>
        <p className="text-secondary text-sm">
          Gestão de pedidos e entregas
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`p-4 rounded-xl text-left transition-all ${
              filter === tab.value
                ? "bg-primary text-on-primary"
                : "bg-surface-container-lowest hover:bg-surface-container-low"
            }`}
          >
            <p className={`text-2xl font-[family-name:var(--font-headline)] ${filter === tab.value ? "text-on-primary" : "text-on-surface"}`}>
              {counts[tab.value]}
            </p>
            <p className={`text-xs mt-1 ${filter === tab.value ? "text-on-primary/80" : "text-secondary"}`}>
              {tab.label}
            </p>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-surface-container-low rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">receipt_long</span>
            <p className="text-secondary">Nenhuma encomenda encontrada.</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-container-high/30">
            {filteredOrders.map((order) => {
              const ps = statusLabels[order.payment_status] || statusLabels.pending;
              const ds = deliveryLabels[order.delivery_status] || deliveryLabels.pending;
              const isExpanded = expandedId === order.id;

              return (
                <div key={order.id}>
                  {/* Order Row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="w-full px-6 py-5 flex items-center gap-4 hover:bg-surface-container-low/50 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium text-on-surface text-sm truncate">{order.customer_name}</p>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ps.bg} ${ps.color}`}>{ps.label}</span>
                        {order.payment_status === "paid" && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ds.bg} ${ds.color}`}>{ds.label}</span>
                        )}
                      </div>
                      <p className="text-xs text-secondary">
                        {order.payment_method === "mcx" ? "MCX" : "Referência"} · {order.customer_phone} ·{" "}
                        {new Date(order.created_at).toLocaleDateString("pt-AO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <span className="font-[family-name:var(--font-headline)] text-sm text-primary flex-shrink-0">
                      {formatPrice(order.total_amount)} Kz
                    </span>
                    <span className={`material-symbols-outlined text-secondary transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                      expand_more
                    </span>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-6 animate-fade-up">
                      {/* Customer Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-surface-container-low rounded-lg">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Cliente</p>
                          <p className="text-sm text-on-surface font-medium">{order.customer_name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Telemóvel</p>
                          <p className="text-sm text-on-surface">{order.customer_phone}</p>
                        </div>
                        {order.customer_email && (
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Email</p>
                            <p className="text-sm text-on-surface">{order.customer_email}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Município</p>
                          <p className="text-sm text-on-surface">{order.customer_municipality}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Endereço</p>
                          <p className="text-sm text-on-surface">{order.customer_address}</p>
                        </div>
                        {order.delivery_notes && (
                          <div className="md:col-span-2">
                            <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Orientação de Entrega</p>
                            <p className="text-sm text-on-surface italic">{order.delivery_notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Payment Info */}
                      {order.payment_method === "reference" && order.reference_number && (
                        <div className="p-5 bg-surface-container-low rounded-lg">
                          <p className="text-[10px] uppercase tracking-widest text-secondary mb-3">Dados da Referência</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-secondary">Entidade</p>
                              <p className="text-sm font-bold text-on-surface">{order.reference_entity}</p>
                            </div>
                            <div>
                              <p className="text-xs text-secondary">Referência</p>
                              <p className="text-sm font-bold text-on-surface">{order.reference_number}</p>
                            </div>
                            <div>
                              <p className="text-xs text-secondary">Validade</p>
                              <p className="text-sm text-on-surface">
                                {order.reference_due_date
                                  ? new Date(order.reference_due_date).toLocaleDateString("pt-AO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
                                  : "—"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-secondary">Transaction ID</p>
                              <p className="text-sm text-on-surface truncate">{order.transaction_id || "—"}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Items */}
                      <div className="space-y-3">
                        <p className="text-[10px] uppercase tracking-widest text-secondary">Produtos</p>
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 bg-surface-container-low rounded-lg">
                            {item.product_image_url && (
                              <div
                                className="w-10 h-12 rounded bg-surface-container bg-cover bg-center flex-shrink-0"
                                style={{ backgroundImage: `url(${item.product_image_url})` }}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-on-surface truncate">{item.product_name}</p>
                              <p className="text-xs text-secondary">{item.size_label} · Qtd: {item.quantity}</p>
                            </div>
                            <span className="text-sm font-[family-name:var(--font-headline)] text-primary">
                              {formatPrice(item.unit_price * item.quantity)} Kz
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between pt-2 text-sm">
                          <span className="text-secondary">Entrega</span>
                          <span className="text-on-surface">{formatPrice(order.delivery_fee)} Kz</span>
                        </div>
                        <div className="flex justify-between pt-1 font-bold">
                          <span className="text-on-surface">Total</span>
                          <span className="font-[family-name:var(--font-headline)] text-primary">{formatPrice(order.total_amount)} Kz</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2">
                        {(order.payment_status === "pending" || order.payment_status === "failed" || order.payment_status === "expired") && (
                          <button
                            onClick={() => handleDeleteOrder(order)}
                            className="px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-all active:scale-95 bg-surface-container-low text-error hover:bg-error/10"
                          >
                            <span className="material-symbols-outlined text-xl">delete</span>
                            Apagar
                          </button>
                        )}
                        {order.payment_status === "paid" && (
                          <button
                            onClick={() => handleToggleDelivery(order)}
                            disabled={updatingDelivery === order.id}
                            className={`px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${
                              order.delivery_status === "delivered"
                                ? "bg-surface-container-low text-secondary hover:bg-surface-container"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            <span className="material-symbols-outlined text-xl">
                              {order.delivery_status === "delivered" ? "undo" : "check_circle"}
                            </span>
                            {updatingDelivery === order.id
                              ? "Atualizando..."
                              : order.delivery_status === "delivered"
                              ? "Desfazer Entrega"
                              : "Marcar como Entregue"}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
