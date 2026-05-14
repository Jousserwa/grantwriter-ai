import React from 'react';
import BudgetNarrativeGenerator from "@/components/BudgetNarrativeGenerator";
import DashboardLayout from "@/components/DashboardLayout";

export default function BudgetPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Budget Tools</h1>
        <p className="text-slate-500 mt-2">
          Generate professional financial justifications for your grant proposals.
        </p>
      </div>
      
      <BudgetNarrativeGenerator />
    </div>
  );
}
