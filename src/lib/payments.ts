const MOMENU_API_URL = "https://api.momenu.online/api";

export function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)\+]/g, "");
  if (!cleaned.startsWith("244")) {
    if (cleaned.startsWith("9")) {
      cleaned = "244" + cleaned;
    }
  }
  return cleaned;
}

export interface PaymentProduct {
  id: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  iva: number;
}

export interface MCXPaymentRequest {
  amount: number;
  phoneNumber: string;
  products: PaymentProduct[];
  customerName: string;
  customerEmail?: string;
}

export interface ReferencePaymentRequest {
  amount: number;
  products: PaymentProduct[];
  customerName: string;
  customerEmail?: string;
}

export interface MCXPaymentResponse {
  success: boolean;
  transactionId?: string;
  invoiceUrl?: string;
  error?: string;
}

export interface ReferencePaymentResponse {
  success: boolean;
  operationId?: string;
  transactionId?: string;
  referenceNumber?: string;
  entity?: string;
  dueDate?: string;
  error?: string;
}

export interface ReferenceStatusResponse {
  success: boolean;
  status?: "pending" | "paid" | "failed" | "expired";
  invoiceUrl?: string;
  error?: string;
}

export async function createMCXPayment(
  req: MCXPaymentRequest
): Promise<MCXPaymentResponse> {
  const res = await fetch(`${MOMENU_API_URL}/payment/mcx`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.MOMENU_API_KEY!,
    },
    body: JSON.stringify({
      paymentInfo: {
        amount: req.amount,
        phoneNumber: req.phoneNumber,
      },
      products: req.products,
      customer: {
        name: req.customerName,
        email: req.customerEmail || "",
        phone: req.phoneNumber,
      },
    }),
  });

  const data = await res.json();
  return data;
}

export async function createReferencePayment(
  req: ReferencePaymentRequest
): Promise<ReferencePaymentResponse> {
  const res = await fetch(`${MOMENU_API_URL}/payment/reference`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.MOMENU_API_KEY!,
    },
    body: JSON.stringify({
      paymentInfo: {
        amount: req.amount,
      },
      products: req.products,
      customer: {
        name: req.customerName,
        email: req.customerEmail || "",
      },
    }),
  });

  const data = await res.json();
  return data;
}

export async function checkReferenceStatus(
  operationId: string,
  merchantTransactionId: string
): Promise<ReferenceStatusResponse> {
  const res = await fetch(
    `${MOMENU_API_URL}/payment/reference/status/${operationId}?merchantTransactionId=${merchantTransactionId}`,
    {
      headers: {
        "x-api-key": process.env.MOMENU_API_KEY!,
      },
    }
  );

  const data = await res.json();
  return {
    success: data.success,
    status: data.payment?.status || data.status,
    invoiceUrl: data.invoiceUrl,
    error: data.error,
  };
}
