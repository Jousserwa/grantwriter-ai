import React from 'react';
import { Search, Filter, MapPin, DollarSign, Calendar } from 'lucide-react';

const grants = [
  {
    id: 1,
    title: 'Clean Energy Innovation Grant',
    funder: 'U.S. Department of Energy',
    amount: '$500,000 - $2,000,000',
    location: 'United States',
    deadline: 'Oct 15, 2024',
    category: 'Energy'
  },
  {
    id: 2,
    title: 'Sustainable Agriculture Initiative',
    funder: 'World Bank',
    amount: '$1,000,000',
    location: 'Global',
    deadline: 'Nov 30, 2024',
    category: 'Agriculture'
  },
  {
    id: 3,
    title: 'Horizon Europe Cluster 5',
    funder: 'European Commission',
    amount: '€2,000,000 - €5,000,000',
    location: 'Europe',
    deadline: 'Sept 15, 2024',
    category: 'Climate'
  },
  {
    id: 4,
    title: 'Youth Education Fund',
    funder: 'UNESCO',
    amount: '$50,000 - $200,000',
    location: 'Developing Nations',
    deadline: 'Dec 01, 2024',
    category: 'Education'
  }
];

export default function GrantsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Grant Discovery</h1>
          <p className="mt-1 text-sm text-slate-500">
            Find the perfect funding opportunities for your mission.
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
          Sync Global Database
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
                <div className="mt-2 space-y-2">
                  {['Energy', 'Climate', 'Education', 'Health', 'Agriculture'].map(cat => (
                    <label key={cat} className="flex items-center text-sm text-slate-600">
                      <input type="checkbox" className="mr-2 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>
              <hr className="border-slate-100" />
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</label>
                <select className="mt-2 block w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>Any amount</option>
                  <option>$0 - $100k</option>
                  <option>$100k - $500k</option>
                  <option>$500k - $1M</option>
                  <option>$1M+</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-xl border-0 py-3 pl-10 pr-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              placeholder="Search grants by title, funder, or keywords..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {grants.map((grant) => (
              <div key={grant.id} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:ring-blue-300 transition-all cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                        {grant.category}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{grant.funder}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{grant.title}</h3>
                    <div className="flex flex-wrap gap-4 pt-2">
                      <div className="flex items-center text-sm text-slate-500">
                        <DollarSign className="mr-1 h-4 w-4" />
                        {grant.amount}
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <MapPin className="mr-1 h-4 w-4" />
                        {grant.location}
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="mr-1 h-4 w-4" />
                        Deadline: {grant.deadline}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 md:flex-none inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                      Save
                    </button>
                    <button className="flex-1 md:flex-none inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                      Generate Proposal
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
