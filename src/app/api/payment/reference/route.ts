import { NextRequest, NextResponse } from "next/server";
import { createReferencePayment } from "@/lib/payments";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, products, customerName, customerEmail } = body;

    if (!amount || !products || !customerName) {
      return NextResponse.json(
        { success: false, error: "Dados incompletos" },
        { status: 400 }
      );
    }

    const result = await createReferencePayment({
      amount,
      products,
      customerName,
      customerEmail,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Reference payment error:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao gerar referência" },
      { status: 500 }
    );
  }
}
