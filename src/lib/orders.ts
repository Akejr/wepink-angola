import { supabase } from "./supabase";

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_municipality: string;
  customer_address: string;
  delivery_notes: string | null;
  payment_method: "reference" | "mcx";
  payment_status: "pending" | "paid" | "failed" | "expired";
  delivery_status: "pending" | "delivered";
  total_amount: number;
  delivery_fee: number;
  subtotal: number;
  transaction_id: string | null;
  operation_id: string | null;
  reference_number: string | null;
  reference_entity: string | null;
  reference_due_date: string | null;
  invoice_url: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_subtitle: string | null;
  product_image_url: string | null;
  size_label: string;
  size_ml: number | null;
  unit_price: number;
  quantity: number;
}

export interface CreateOrderData {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_municipality: string;
  customer_address: string;
  delivery_notes?: string;
  payment_method: "reference" | "mcx";
  total_amount: number;
  delivery_fee: number;
  subtotal: number;
  items: {
    product_id: string;
    product_name: string;
    product_subtitle?: string;
    product_image_url?: string;
    size_label: string;
    size_ml?: number;
    unit_price: number;
    quantity: number;
  }[];
}

export async function createOrder(
  data: CreateOrderData
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_email: data.customer_email || null,
      customer_municipality: data.customer_municipality,
      customer_address: data.customer_address,
      delivery_notes: data.delivery_notes || null,
      payment_method: data.payment_method,
      payment_status: "pending",
      delivery_status: "pending",
      total_amount: data.total_amount,
      delivery_fee: data.delivery_fee,
      subtotal: data.subtotal,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { success: false, error: orderError?.message || "Erro ao criar pedido" };
  }

  const itemsData = data.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    product_subtitle: item.product_subtitle || null,
    product_image_url: item.product_image_url || null,
    size_label: item.size_label,
    size_ml: item.size_ml || null,
    unit_price: item.unit_price,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(itemsData);

  if (itemsError) {
    return { success: false, error: itemsError.message };
  }

  return { success: true, orderId: order.id };
}

export async function updateOrderPayment(
  orderId: string,
  data: {
    payment_status?: string;
    transaction_id?: string;
    operation_id?: string;
    reference_number?: string;
    reference_entity?: string;
    reference_due_date?: string;
    invoice_url?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("orders")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getOrders(status?: string): Promise<Order[]> {
  let query = supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("payment_status", status);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
  return data as Order[];
}

export async function getOrder(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Order;
}

export async function updateDeliveryStatus(
  orderId: string,
  status: "pending" | "delivered"
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("orders")
    .update({ delivery_status: status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteOrder(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("orders").delete().eq("id", orderId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
