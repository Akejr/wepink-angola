import { NextRequest, NextResponse } from "next/server";
import { createOrder, updateOrderPayment } from "@/lib/orders";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderData, paymentResult, paymentMethod } = body;

    // Create order
    const result = await createOrder(orderData);
    if (!result.success || !result.orderId) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // Update with payment info
    if (paymentMethod === "mcx" && paymentResult?.success) {
      await updateOrderPayment(result.orderId, {
        payment_status: "paid",
        transaction_id: paymentResult.transactionId,
        invoice_url: paymentResult.invoiceUrl,
      });
    } else if (paymentMethod === "reference" && paymentResult?.success) {
      await updateOrderPayment(result.orderId, {
        payment_status: "pending",
        operation_id: paymentResult.operationId,
        transaction_id: paymentResult.transactionId,
        reference_number: paymentResult.referenceNumber,
        reference_entity: paymentResult.entity,
        reference_due_date: paymentResult.dueDate,
      });
    } else if (!paymentResult?.success) {
      await updateOrderPayment(result.orderId, {
        payment_status: "failed",
      });
    }

    return NextResponse.json({ success: true, orderId: result.orderId });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao criar pedido" },
      { status: 500 }
    );
  }
}
