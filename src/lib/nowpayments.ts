const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_API_URL = "https://api.nowpayments.io/v1";

export async function createInvoice({
  amount,
  orderId,
  description,
  payCurrency,
}: {
  amount: number;
  orderId: string;
  description: string;
  payCurrency?: string;
}) {
  const response = await fetch(`${NOWPAYMENTS_API_URL}/invoice`, {
    method: "POST",
    headers: {
      "x-api-key": NOWPAYMENTS_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      price_amount: amount,
      price_currency: "usd",
      pay_currency: payCurrency,
      order_id: orderId,
      order_description: description,
      ipn_callback_url: `https://grantwriter-ai-olive.vercel.app/api/payments/nowpayments/webhook`,
      success_url: `https://grantwriter-ai-olive.vercel.app/dashboard?payment=success`,
      cancel_url: `https://grantwriter-ai-olive.vercel.app/pricing?payment=cancelled`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create invoice");
  }

  return response.json();
}
