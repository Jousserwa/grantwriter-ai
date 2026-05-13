"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ProposalStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateSubmissionAction(
  proposalId: string,
  data: {
    status: ProposalStatus;
    submissionDate?: Date | null;
    feedback?: string | null;
    fundingSecured?: number | null;
    finalPdfUrl?: string | null;
  }
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId }
  });

  if (!proposal || !user || user.organizationId !== proposal.organizationId) {
    throw new Error("Unauthorized");
  }

  await prisma.proposal.update({
    where: { id: proposalId },
    data: {
      status: data.status,
      submissionDate: data.submissionDate,
      feedback: data.feedback,
      fundingSecured: data.fundingSecured,
      finalPdfUrl: data.finalPdfUrl,
    }
  });

  revalidatePath("/dashboard/history");
}
