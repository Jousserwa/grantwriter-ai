import React from 'react';
import { 
  FileText, 
  Search, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

const stats = [
  { name: 'Total Proposals', value: '12', icon: FileText, color: 'bg-blue-500' },
  { name: 'Active Grants', value: '45', icon: Search, color: 'bg-green-500' },
  { name: 'Upcoming Deadlines', value: '3', icon: Clock, color: 'bg-yellow-500' },
  { name: 'Success Rate', value: '68%', icon: CheckCircle2, color: 'bg-purple-500' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
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
          <h2 className="text-lg font-semibold text-slate-900">Recent Proposals</h2>
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center">
                  <div className="mr-3 h-10 w-10 rounded bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                    P{i}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Grant Proposal for Green Tech {i}</p>
                    <p className="text-xs text-slate-500">Last edited 2 hours ago</p>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  In Progress
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Recommended Grants</h2>
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center">
                  <div className="mr-3 h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">EU Horizon Europe - Stage {i}</p>
                    <p className="text-xs text-slate-500">Deadline: Sept 15, 2024</p>
                  </div>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
