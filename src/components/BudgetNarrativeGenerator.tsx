"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, Loader2, Copy, Check } from 'lucide-react';

interface BudgetItem {
  id: string;
  item: string;
  cost: string;
  description: string;
}

interface BudgetNarrativeGeneratorProps {
  onInsert?: (narrative: string) => void;
}

export default function BudgetNarrativeGenerator({ onInsert }: BudgetNarrativeGeneratorProps) {
  const [items, setItems] = useState<BudgetItem[]>([
    { id: '1', item: '', cost: '', description: '' }
  ]);
  const [projectContext, setProjectContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNarrative, setGeneratedNarrative] = useState('');
  const [copied, setCopied] = useState(false);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), item: '', cost: '', description: '' }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof BudgetItem, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/budget-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budgetItems: items.filter(i => i.item && i.cost),
          projectContext
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setGeneratedNarrative(data.narrative);
    } catch (error) {
      console.error("Failed to generate budget narrative:", error);
      alert("Failed to generate narrative. Please check your inputs.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedNarrative);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          Budget Narrative Generator
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Input your budget data and let AI write the financial justification.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Project Context (Optional)
          </label>
          <textarea
            value={projectContext}
            onChange={(e) => setProjectContext(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. This project aims to provide clean water to 5,000 households in rural Kenya..."
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Budget Items
          </label>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id} className="flex gap-3 items-start">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                    placeholder="Item (e.g. Project Manager)"
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={item.cost}
                    onChange={(e) => updateItem(item.id, 'cost', e.target.value)}
                    placeholder="Cost (e.g. $50,000)"
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Brief use case"
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addItem}
            className="mt-3 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || items.every(i => !i.item)}
          className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors mt-4"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Narrative...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Narrative
            </>
          )}
        </button>
      </div>

      {generatedNarrative && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Generated Narrative</h3>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100"
              >
                {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              {onInsert && (
                <button
                  onClick={() => onInsert(generatedNarrative)}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                >
                  Insert into Proposal
                </button>
              )}
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
              {generatedNarrative}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
