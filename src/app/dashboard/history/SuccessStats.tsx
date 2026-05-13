import React from 'react';
import { Trophy, Target, DollarSign, FileCheck } from 'lucide-react';

interface StatsProps {
  totalProposals: number;
  wonProposals: number;
  totalFunding: number;
}

export default function SuccessStats({ totalProposals, wonProposals, totalFunding }: StatsProps) {
  const winRate = totalProposals > 0 ? Math.round((wonProposals / totalProposals) * 100) : 0;

  const stats = [
    { name: 'Total Proposals', value: totalProposals, icon: FileCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Win Rate', value: `${winRate}%`, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Proposals Won', value: wonProposals, icon: Trophy, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Funding Secured', value: `$${totalFunding.toLocaleString()}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.name} className="flex items-center rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className={`mr-4 rounded-lg ${stat.bg} p-3`}>
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{stat.name}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
