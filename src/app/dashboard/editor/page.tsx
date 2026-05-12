import React from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  Save, 
  Send, 
  Sparkles, 
  FileCheck, 
  AlertCircle 
} from 'lucide-react';

export default function EditorPage() {
  return (
    <div className="flex h-[calc(100vh-160px)] flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Proposal Editor</h1>
          <p className="text-sm text-slate-500">Grant Proposal for Clean Energy Innovation v1.2</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <Send className="h-4 w-4" />
            Submit Review
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Main Editor Area */}
        <div className="flex flex-1 flex-col rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-1 border-b border-slate-100 p-2">
            <button className="rounded p-2 hover:bg-slate-100"><Bold className="h-4 w-4 text-slate-600" /></button>
            <button className="rounded p-2 hover:bg-slate-100"><Italic className="h-4 w-4 text-slate-600" /></button>
            <button className="rounded p-2 hover:bg-slate-100"><List className="h-4 w-4 text-slate-600" /></button>
            <div className="mx-2 h-6 w-px bg-slate-200" />
            <button className="flex items-center gap-2 rounded bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100">
              <Sparkles className="h-3 w-3" />
              AI Reword
            </button>
          </div>
          <textarea 
            className="flex-1 resize-none p-8 focus:outline-none text-slate-800 leading-relaxed"
            placeholder="Start writing your proposal here..."
            defaultValue={`# Executive Summary

The Green Earth Foundation proposes an innovative Clean Energy solution to address the increasing energy demands of urban populations while reducing carbon emissions by 40%. Our project focuses on the integration of smart-grid technology with distributed renewable sources...

## Project Description

Our approach involves a three-phase implementation strategy. In Phase 1, we will conduct a comprehensive audit of existing infrastructure. Phase 2 will involve the installation of...`}
          />
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-xs text-slate-500">
            <span>Word Count: 1,245 / 5,000</span>
            <span>Last saved at 2:45 PM</span>
          </div>
        </div>

        {/* AI Sidebar */}
        <div className="w-80 space-y-6 overflow-y-auto pr-1">
          <div className="rounded-xl bg-slate-900 p-6 text-white shadow-lg ring-1 ring-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-800 p-3 text-sm border-l-4 border-blue-500">
                <p className="font-medium text-blue-400">Suggestion</p>
                <p className="mt-1 text-slate-300">Try strengthening the financial justification section. The funder values specific ROI metrics.</p>
                <button className="mt-2 text-xs font-bold text-blue-400 hover:underline">Apply Improvement</button>
              </div>
              <div className="rounded-lg bg-slate-800 p-3 text-sm border-l-4 border-green-500">
                <p className="font-medium text-green-400">Compliance Pass</p>
                <p className="mt-1 text-slate-300">Section 2 meets all technical requirements specified in page 14 of the grant RFP.</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-slate-500" />
              Compliance Checker
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm text-slate-600">Mission Alignment</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm text-slate-600">Budget Justification</span>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <span className="text-sm text-slate-600 font-medium">Missing: Risk Mitigation Plan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
