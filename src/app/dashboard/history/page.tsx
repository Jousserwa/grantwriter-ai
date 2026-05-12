import React from 'react';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FileText, Clock, ChevronRight } from "lucide-react";

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Proposal History</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage and track all your grant proposals.
        </p>
      </div>

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
          <ul className="divide-y divide-slate-100">
            {proposals.map((proposal) => (
              <li key={proposal.id} className="hover:bg-slate-50 transition-colors">
                <Link href={`/dashboard/editor/${proposal.id}`} className="block p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{proposal.title}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Updated {proposal.updatedAt.toLocaleDateString()}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                            {proposal.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
