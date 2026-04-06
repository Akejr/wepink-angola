import { NextRequest, NextResponse } from "next/server";
import { updateOrderPayment } from "@/lib/orders";

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentData } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: "orderId required" }, { status: 400 });
    }

    const result = await updateOrderPayment(orderId, paymentData);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ success: false, error: "Erro ao atualizar pedido" }, { status: 500 });
  }
}
