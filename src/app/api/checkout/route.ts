export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createInvoice } from "@/lib/nowpayments";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    // For demo purposes, we'll allow unauthenticated users if needed, 
    // but in production, we'd require a session and organization.
    // if (!session?.user?.organizationId) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const formData = await req.formData();
    const tierId = formData.get("tier") as string;
    const method = formData.get("method") as string;

    const prices: Record<string, number> = {
      pro: 99,
      org: 299,
    };

    const amount = prices[tierId];
    if (!amount) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    // Get organization ID from session or create/find a default one for the user
    let organizationId = session?.user?.organizationId;

    if (!organizationId && session?.user?.id) {
      // Find if user already has an organization
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { organization: true },
      });

      if (user?.organizationId) {
        organizationId = user.organizationId;
      } else {
        // Create a default organization for the user
        const newOrg = await prisma.organization.create({
          data: {
            name: `${session.user.name || 'My'}'s Organization`,
            users: { connect: { id: session.user.id } },
          },
        });
        organizationId = newOrg.id;
      }
    }

    if (!organizationId) {
      // Last resort fallback for testing (should not happen if logged in)
      organizationId = "cm3mockorgid";
      // Ensure it exists in DB
      await prisma.organization.upsert({
        where: { id: organizationId },
        update: {},
        create: { id: organizationId, name: "Test Organization" },
      });
    }

    const orderId = `${tierId.toUpperCase()}-${organizationId}-${Date.now()}`;
    const description = `${tierId.charAt(0).toUpperCase() + tierId.slice(1)} Subscription for GrantWriter AI`;

    // Create NOWPayments invoice
    const invoice = await createInvoice({
      amount,
      orderId,
      description,
    });

    // Save payment record in database
    await prisma.payment.create({
      data: {
        organizationId: organizationId,
        amount,
        currency: "USD",
        paymentMethod: method === "card" ? "CARD" : "CRYPTO",
        nowpaymentsId: invoice.id.toString(),
        status: "PENDING",
      },
    });

    // Redirect to NOWPayments
    return NextResponse.redirect(invoice.invoice_url, 303);
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
