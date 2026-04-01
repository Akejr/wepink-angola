import { NextRequest, NextResponse } from "next/server";
import { checkReferenceStatus } from "@/lib/payments";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const operationId = searchParams.get("operationId");
    const merchantTransactionId = searchParams.get("merchantTransactionId");

    if (!operationId || !merchantTransactionId) {
      return NextResponse.json(
        { success: false, error: "Parâmetros em falta" },
        { status: 400 }
      );
    }

    const result = await checkReferenceStatus(operationId, merchantTransactionId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Reference status error:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao verificar status" },
      { status: 500 }
    );
  }
}
