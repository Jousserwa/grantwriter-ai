export const dynamic = "force-dynamic";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const trackerId = formData.get("trackerId") as string;

  if (!trackerId) {
    return NextResponse.json({ error: "Tracker ID is required" }, { status: 400 });
  }

  // Ensure the tracker belongs to the user's organization
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { organizationId: true },
  });

  const tracker = await prisma.deadlineTracker.findUnique({
    where: { id: trackerId },
  });

  if (!tracker || tracker.organizationId !== user?.organizationId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.deadlineTracker.delete({
    where: { id: trackerId },
  });

  const referer = req.headers.get("referer") || "/dashboard";
  return NextResponse.redirect(referer, 303);
}
