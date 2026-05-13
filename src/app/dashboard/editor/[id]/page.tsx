import React from 'react';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import ProposalEditor from "@/components/ProposalEditor";
import { notFound } from "next/navigation";

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>Please sign in to access the editor.</div>;
  }

  const { id } = await params;

  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: {
      grant: true,
      organization: true,
    },
  });

  if (!proposal) {
    notFound();
  }

  // Ensure user belongs to the organization
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (user?.organizationId !== proposal.organizationId) {
    return <div>You do not have permission to edit this proposal.</div>;
  }

  return (
    <div className="h-full">
      <ProposalEditor 
        proposal={proposal} 
        userId={session.user.id}
        userName={session.user.name || session.user.email?.split('@')[0] || 'User'}
      />
    </div>
  );
}
