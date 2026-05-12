import React from 'react';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { saveProfile } from "./actions";

export default async function ProfilePage() {
  const session = await auth();
  
  let org = null;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { organization: true },
    });
    org = user?.organization;
  }

  const financials = org?.financials as any;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Organization Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          This information helps us find the best grants for your organization.
        </p>
      </div>

      <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <form action={saveProfile} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-2">
              <label htmlFor="org-name" className="block text-sm font-medium text-slate-700">Organization Name</label>
              <input
                type="text"
                id="org-name"
                name="org-name"
                defaultValue={org?.name || ''}
                required
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="Green Earth Foundation"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="mission" className="block text-sm font-medium text-slate-700">Mission Statement</label>
              <textarea
                id="mission"
                name="mission"
                defaultValue={org?.mission || ''}
                rows={3}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="Describe your organization's core mission..."
              />
            </div>

            <div>
              <label htmlFor="sector" className="block text-sm font-medium text-slate-700">Sector</label>
              <select
                id="sector"
                name="sector"
                defaultValue={org?.sector || 'Non-profit'}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              >
                <option value="Non-profit">Non-profit</option>
                <option value="University">University</option>
                <option value="Startup">Startup</option>
                <option value="Green Energy">Green Energy</option>
              </select>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-slate-700">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                defaultValue={org?.country || ''}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="United States"
              />
            </div>

            <div>
              <label htmlFor="team-size" className="block text-sm font-medium text-slate-700">Team Size</label>
              <input
                type="number"
                id="team-size"
                name="team-size"
                defaultValue={org?.teamSize || ''}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="10"
              />
            </div>

            <div>
              <label htmlFor="annual-budget" className="block text-sm font-medium text-slate-700">Annual Budget (USD)</label>
              <input
                type="text"
                id="annual-budget"
                name="annual-budget"
                defaultValue={financials?.annualBudget || ''}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="$500,000"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="past-projects" className="block text-sm font-medium text-slate-700">Past Projects</label>
              <textarea
                id="past-projects"
                name="past-projects"
                defaultValue={org?.pastProjects || ''}
                rows={4}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="List your key successful projects..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
