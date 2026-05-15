import React from 'react';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Check, CreditCard, Bitcoin } from 'lucide-react';

export default async function BillingPage() {
  const session = await auth();
  
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id || '' },
    include: {
      organization: {
        include: {
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      }
    }
  });

  const org = user?.organization;
  const currentPlan = org?.subscriptionTier || 'FREE';

  const tiers = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      desc: "Perfect for exploring the database.",
      features: ["1 proposal/month", "5 grant matches/month", "Standard AI Generator", "Email support"],
      highlight: false,
      disabled: currentPlan === 'FREE'
    },
    {
      id: "pro",
      name: "Pro",
      price: "$99",
      desc: "Unlimited access for growing teams.",
      features: ["Unlimited proposals", "Full global database access", "Advanced Compliance checker", "Word count optimizer", "Priority processing"],
      highlight: true,
      disabled: currentPlan === 'PRO'
    },
    {
      id: "org",
      name: "Organization",
      price: "$299",
      desc: "Institutional power for large teams.",
      features: ["Everything in Pro", "Real-time team collaboration", "API access for integrations", "Success rate analytics", "Dedicated account manager"],
      highlight: false,
      disabled: currentPlan === 'ORGANIZATION'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Billing & Subscription</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your organization's plan and payment history.
        </p>
      </div>

      <div className="rounded-xl bg-blue-50 border border-blue-100 p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-blue-700 uppercase tracking-wider">Current Plan</p>
          <p className="text-2xl font-bold text-slate-900">{currentPlan}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200">
            <CreditCard className="h-3.5 w-3.5 text-blue-600" /> Pay by Card
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200">
            <Bitcoin className="h-4 w-4 text-blue-600" /> Pay by Crypto
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <div key={tier.id} className={`relative p-8 rounded-3xl border ${tier.highlight ? 'border-blue-600 shadow-xl ring-4 ring-blue-50' : 'border-slate-200'} bg-white`}>
            {tier.highlight && (
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                Recommended
              </div>
            )}
            <h4 className="text-xl font-black text-slate-900 mb-1">{tier.name}</h4>
            <p className="text-slate-500 text-xs font-bold mb-6">{tier.desc}</p>
            
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black text-slate-900">{tier.price}</span>
              <span className="text-slate-400 text-sm font-bold">/ month</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              {tier.features.map((feature, fIdx) => (
                <li key={fIdx} className="flex gap-3 text-xs font-semibold text-slate-600">
                  <Check className="h-4 w-4 text-blue-600 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            
            {tier.id !== 'free' && (
              <form action="/api/checkout" method="POST" className="space-y-3">
                <input type="hidden" name="tier" value={tier.id} />
                <button 
                  name="method" 
                  value="card"
                  disabled={tier.disabled}
                  className={`w-full inline-flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${tier.highlight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-900 text-white hover:bg-slate-800'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Pay by Card
                </button>
                <button 
                  name="method" 
                  value="crypto"
                  disabled={tier.disabled}
                  className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pay by Crypto
                </button>
              </form>
            )}
            {tier.id === 'free' && (
              <button 
                disabled
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold bg-slate-100 text-slate-400 cursor-not-allowed"
              >
                Current Plan
              </button>
            )}
          </div>
        ))}
      </div>

      {org?.payments && org.payments.length > 0 && (
        <div className="mt-12">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Transactions</h3>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-700">Date</th>
                  <th className="px-6 py-4 font-bold text-slate-700">Amount</th>
                  <th className="px-6 py-4 font-bold text-slate-700">Method</th>
                  <th className="px-6 py-4 font-bold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {org.payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 text-slate-600">{new Date(payment.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">${payment.amount}</td>
                    <td className="px-6 py-4 text-slate-600">{payment.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        payment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                        payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
