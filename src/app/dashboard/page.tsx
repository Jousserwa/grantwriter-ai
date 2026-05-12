import React from 'react';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { 
  FileText, 
  Search, 
  Clock, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>Please sign in.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      organization: {
        include: {
          proposals: {
            orderBy: { updatedAt: 'desc' },
            take: 3,
            include: { grant: true }
          }
        }
      }
    }
  });

  const org = user?.organization;
  const proposals = org?.proposals || [];

  const stats = [
    { name: 'Total Proposals', value: proposals.length.toString(), icon: FileText, color: 'bg-blue-500' },
    { name: 'Active Grants', value: '45', icon: Search, color: 'bg-green-500' },
    { name: 'Upcoming Deadlines', value: '3', icon: Clock, color: 'bg-yellow-500' },
    { name: 'Success Rate', value: '68%', icon: CheckCircle2, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 underline decoration-blue-500 decoration-4 underline-offset-8">
          Welcome back, {session.user.name || 'User'}
        </h1>
        <p className="mt-4 text-slate-500 uppercase text-xs font-bold tracking-widest">
          {org?.name || 'Complete your organization profile to get started'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="flex items-center rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className={`mr-4 flex h-12 w-12 items-center justify-center rounded-lg ${stat.color} text-white`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 text-shadow-sm">Recent Proposals</h2>
            <Link href="/dashboard/history" className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {proposals.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-4">No proposals created yet.</p>
            ) : proposals.map((proposal) => (
              <Link 
                key={proposal.id} 
                href={`/dashboard/editor/${proposal.id}`}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="mr-3 h-10 w-10 rounded bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{proposal.title}</p>
                    <p className="text-xs text-slate-500">Last edited {proposal.updatedAt.toLocaleDateString()}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Recommended Grants</h2>
            <Link href="/dashboard/grants" className="text-sm text-blue-600 font-medium hover:underline">Explore</Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center">
                  <div className="mr-3 h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Global Tech Grant {i}</p>
                    <p className="text-xs text-slate-500">Deadline: Oct 2024</p>
                  </div>
                </div>
                <Link href="/dashboard/grants" className="text-sm font-medium text-blue-600 hover:text-blue-700">View</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
