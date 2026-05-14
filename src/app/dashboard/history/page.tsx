import React from 'react';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";
import SuccessStats from "./SuccessStats";
import ProposalItem from "./ProposalItem";

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>Please sign in to view your proposals.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      organization: {
        include: {
          proposals: {
            include: {
              grant: true
            },
            orderBy: { updatedAt: 'desc' }
          }
        }
      }
    }
  });

  const proposals = user?.organization?.proposals || [];
  const isOwner = user?.organizationRole === 'OWNER';

  // Calculate stats
  const totalProposals = proposals.length;
  const wonProposals = proposals.filter((p: any) => p.status === 'WON').length;
  const totalFunding = proposals.reduce((acc: number, p: any) => acc + (p.fundingSecured || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Submission History</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track your success rate and manage all submitted proposals.
        </p>
      </div>

      <SuccessStats 
        totalProposals={totalProposals} 
        wonProposals={wonProposals} 
        totalFunding={totalFunding} 
      />

      <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        {proposals.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No proposals yet</h3>
            <p className="text-slate-500 mt-1">Start by finding a grant and generating a proposal.</p>
            <Link 
              href="/dashboard/grants"
              className="mt-6 inline-flex items-center text-blue-600 font-medium hover:underline"
            >
              Go to Grant Discovery <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {proposals.map((proposal: any) => (
              <ProposalItem 
                key={proposal.id} 
                proposal={proposal} 
                isOwner={isOwner} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
