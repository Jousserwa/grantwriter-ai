export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import prisma from "@/lib/prisma";

const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get("x-nowpayments-sig");

    if (!signature || !IPN_SECRET) {
      return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
    }

    const hmac = crypto.createHmac("sha512", IPN_SECRET);
    hmac.update(JSON.stringify(JSON.parse(body), Object.keys(JSON.parse(body)).sort()));
    const checkSignature = hmac.digest("hex");

    if (signature !== checkSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const data = JSON.parse(body);
    const { payment_status } = data;

    if (payment_status === "finished") {
      // Update payment status and activate subscription
      const payment = await prisma.payment.update({
        where: { nowpaymentsId: data.payment_id.toString() },
        data: { status: "COMPLETED" },
        include: { organization: true },
      });

      if (payment) {
        // Activate or update subscription
        await prisma.subscription.updateMany({
          where: { organizationId: payment.organizationId },
          data: { isActive: true },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("NOWPayments Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
