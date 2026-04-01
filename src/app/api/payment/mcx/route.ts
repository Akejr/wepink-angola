import { NextRequest, NextResponse } from "next/server";
import { createMCXPayment, formatPhoneNumber } from "@/lib/payments";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, phoneNumber, products, customerName, customerEmail } = body;

    if (!amount || !phoneNumber || !products || !customerName) {
      return NextResponse.json(
        { success: false, error: "Dados incompletos" },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    const result = await createMCXPayment({
      amount,
      phoneNumber: formattedPhone,
      products,
      customerName,
      customerEmail,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("MCX payment error:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao processar pagamento" },
      { status: 500 }
    );
  }
}
