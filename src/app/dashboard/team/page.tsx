import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import TeamMemberTable from "./TeamMemberTable";

export default async function TeamPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { organization: true }
  });

  if (!user?.organizationId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
        <h2 className="text-xl font-semibold text-slate-900">No Organization Found</h2>
        <p className="mt-2 text-slate-500 max-w-md">You need to create or join an organization to manage a team. Head over to your profile to get started.</p>
        <a href="/dashboard/profile" className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          Setup Organization
        </a>
      </div>
    );
  }

  const members = await prisma.user.findMany({
    where: { organizationId: user.organizationId },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900">Team Management</h1>
        <p className="text-slate-500">
          Manage members of <span className="font-semibold text-slate-700">{user.organization?.name}</span>
        </p>
      </div>

      <TeamMemberTable 
        members={members.map(m => ({
          ...m,
          organizationRole: m.organizationRole.toString()
        }))} 
        currentUserRole={user.organizationRole.toString()} 
      />
      
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
        <div className="flex gap-3">
          <div className="mt-0.5">
            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-amber-800">Permissions Note</h3>
            <div className="mt-1 text-sm text-amber-700">
              <p>Owners can invite and remove members. Members have read/write access to all organization proposals. Real-time collaboration is enabled for all team members currently viewing the same proposal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
