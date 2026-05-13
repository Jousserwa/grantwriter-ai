"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProposalAction(id: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  const proposal = await prisma.proposal.findUnique({
    where: { id }
  });

  if (!proposal || !user || user.organizationId !== proposal.organizationId) {
    throw new Error("Unauthorized");
  }

  // Calculate word count (simple)
  const wordCount = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;

  await prisma.proposal.update({
    where: { id },
    data: {
      content,
      wordCount,
    },
  });

  revalidatePath(`/dashboard/editor/${id}`);
}

export async function deleteProposalAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  const proposal = await prisma.proposal.findUnique({
    where: { id }
  });

  if (!proposal || !user || user.organizationId !== proposal.organizationId) {
    throw new Error("Unauthorized");
  }

  // Only owners can delete
  if (user.organizationRole !== 'OWNER') {
    throw new Error("Only organization owners can delete proposals.");
  }

  await prisma.proposal.delete({
    where: { id }
  });

  revalidatePath("/dashboard/history");
  redirect("/dashboard/history");
}

export async function createProposalFromGrant(grantId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { organization: true },
  });

  if (!user?.organizationId) {
    throw new Error("User must belong to an organization to create a proposal.");
  }

  const grant = await prisma.grant.findUnique({
    where: { id: grantId },
  });

  if (!grant) {
    throw new Error("Grant not found");
  }

  const proposal = await prisma.proposal.create({
    data: {
      title: `Proposal for ${grant.title}`,
      grantId: grant.id,
      organizationId: user.organizationId,
      userId: user.id,
      status: 'DRAFT',
      content: `<h1>Proposal for ${grant.title}</h1><p>Proposed for ${grant.funder}</p><h2>Project Description</h2><p>Our approach to ${grant.title} involves...</p>`,
    },
  });

  redirect(`/dashboard/editor/${proposal.id}`);
}
