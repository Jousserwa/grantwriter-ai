export const dynamic = "force-dynamic";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateProposal } from "@/lib/ai-proposal";

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
    include: { organization: true },
  });

  if (!user?.organizationId || !user.organization) {
      return NextResponse.json({ error: "Organization profile required to generate proposal" }, { status: 400 });
  }

  const grant = await prisma.grant.findUnique({
      where: { id: grantId }
  });

  if (!grant) {
      return NextResponse.json({ error: "Grant not found" }, { status: 404 });
  }

  // Build organization profile string
  const orgProfile = `
    Mission: ${user.organization.mission || 'N/A'}
    Sector: ${user.organization.sector || 'N/A'}
    Country: ${user.organization.country || 'N/A'}
    Past Projects: ${user.organization.pastProjects || 'N/A'}
  `;

  // Generate the proposal content using AI
  const content = await generateProposal(orgProfile, grant.description || grant.title);

  // Create a proposal in the database
  const proposal = await prisma.proposal.create({
    data: {
        title: `Proposal for ${grant.title}`,
        content: content,
        grantId: grantId,
        organizationId: user.organizationId,
        userId: session.user.id,
        status: 'DRAFT',
    }
  });

  // Also track it if not already tracked
  const existingTracker = await prisma.deadlineTracker.findFirst({
      where: { grantId, organizationId: user.organizationId }
  });

  if (!existingTracker) {
      await prisma.deadlineTracker.create({
          data: {
              grantId,
              organizationId: user.organizationId,
              userId: session.user.id
          }
      });
  }

  // Redirect to the editor page (frontend dev put it in /dashboard/editor/[id])
  return NextResponse.redirect(new URL(`/dashboard/editor/${proposal.id}`, req.url), 303);
}
