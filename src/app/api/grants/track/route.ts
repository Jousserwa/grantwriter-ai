export const dynamic = "force-dynamic";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const grantId = formData.get("grantId") as string;

  if (!grantId) {
    return NextResponse.json({ error: "Grant ID is required" }, { status: 400 });
  }

  // Get user's organization
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { organizationId: true },
  });

  let organizationId = user?.organizationId;

  if (!organizationId) {
      // Create organization if it doesn't exist
      const newOrg = await prisma.organization.create({
          data: {
              name: `${session.user.name || 'My'}'s Organization`,
              users: { connect: { id: session.user.id } }
          }
      });
      organizationId = newOrg.id;
  }

  // Check if already tracking
  const existing = await prisma.deadlineTracker.findFirst({
    where: {
      grantId,
      organizationId,
    },
  });

  if (!existing) {
    await prisma.deadlineTracker.create({
      data: {
        grantId,
        organizationId,
        userId: session.user.id,
      },
    });
  }

  // Redirect back to grants page or dashboard
  const referer = req.headers.get("referer") || "/grants";
  return NextResponse.redirect(referer, 303);
}
