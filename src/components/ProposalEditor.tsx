"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { 
  Bold, 
  Italic, 
  List, 
  Save, 
  Send, 
  Sparkles, 
  FileCheck, 
  AlertCircle,
  Clock,
  CheckCircle,
  ChevronRight,
  X,
  Calculator
} from 'lucide-react';
import { updateProposalAction } from "@/app/dashboard/editor/actions";
import BudgetNarrativeGenerator from './BudgetNarrativeGenerator';

import { Proposal } from "@prisma/client";

interface ProposalEditorProps {
  proposal: Proposal;
  userId?: string;
  userName?: string;
}

const COLORS = ['#958DF1', '#F98181', '#FBBC88', '#FAF594', '#70C2B4', '#94FADB', '#B9EDF8'];

export default function ProposalEditor({ proposal, userId, userName }: ProposalEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [showBudgetGenerator, setShowBudgetGenerator] = useState(false);

  // Set up Yjs
  const { ydoc, provider } = useMemo(() => {
    const doc = new Y.Doc();
    // Use a unique room name for each proposal
    const roomName = `grant-proposal-${proposal.id}`;
    
    // In a real app, this would be a secure websocket server
    // For demo purposes, we'll use a public one or assume a local one
    const wsProvider = new WebsocketProvider(
      process.env.NEXT_PUBLIC_WS_URL || 'wss://demos.yjs.dev', 
      roomName, 
      doc
    );
    
    return { ydoc: doc, provider: wsProvider };
  }, [proposal.id]);

  useEffect(() => {
    provider.on('status', (event: { status: 'connecting' | 'connected' | 'disconnected' }) => {
      setStatus(event.status);
    });

    return () => {
      provider.disconnect();
      ydoc.destroy();
    };
  }, [provider, ydoc]);

  const [userColor] = useState(() => COLORS[Math.floor(Math.random() * COLORS.length)]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // The Collaboration extension comes with its own history handling
        // @ts-expect-error - history property might not be in the type definition but is accepted at runtime
        history: false,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: userName || 'Anonymous User',
          color: userColor,
        },
      }),
    ],
    // content: proposal.content || '<p>Start writing your proposal...</p>', // Removed as Collaboration handles content
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[500px] p-8',
      },
    },
  });

  // Initial content sync if the document is empty
  useEffect(() => {
    if (editor && proposal.content && ydoc.getText('default').length === 0) {
      // Only set initial content if it's a new collaborative session for this doc
      // Wait a bit to ensure we didn't just connect to an existing session
      setTimeout(() => {
        if (ydoc.getText('default').length === 0) {
          editor.commands.setContent(proposal.content);
        }
      }, 500);
    }
  }, [editor, proposal.content, ydoc]);

  const handleSave = async () => {
    if (!editor) return;
    setIsSaving(true);
    try {
      await updateProposalAction(proposal.id, editor.getHTML());
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInsertNarrative = (narrative: string) => {
    if (editor) {
      // Use insertContent to append the narrative to the editor
      editor.commands.insertContent(narrative);
      setShowBudgetGenerator(false);
    }
  };

  if (!editor) {
    return null;
  }

  const wordCount = editor.getText().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex h-[calc(100vh-160px)] flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Proposal Editor</h1>
          <p className="text-sm text-slate-500">{proposal.title} (Draft)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center text-xs text-slate-400 mr-2">
            {isSaving ? (
              <span className="flex items-center gap-1"><Clock className="h-3 w-3 animate-spin" /> Saving...</span>
            ) : lastSaved ? (
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            ) : null}
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
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
        <div className="flex flex-1 flex-col rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-1 border-b border-slate-100 p-2 bg-slate-50/50">
            <button 
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`rounded p-2 hover:bg-slate-200 ${editor.isActive('bold') ? 'bg-slate-200 text-blue-600' : 'text-slate-600'}`}
            >
              <Bold className="h-4 w-4" />
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`rounded p-2 hover:bg-slate-200 ${editor.isActive('italic') ? 'bg-slate-200 text-blue-600' : 'text-slate-600'}`}
            >
              <Italic className="h-4 w-4" />
            </button>
            <button 
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`rounded p-2 hover:bg-slate-200 ${editor.isActive('bulletList') ? 'bg-slate-200 text-blue-600' : 'text-slate-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
            
            <button 
              onClick={() => setShowBudgetGenerator(!showBudgetGenerator)}
              className={`rounded p-2 hover:bg-slate-200 ${showBudgetGenerator ? 'bg-slate-200 text-blue-600' : 'text-slate-600'}`}
              title="Budget Narrative Generator"
            >
              <Calculator className="h-4 w-4" />
            </button>
            
            <div className="mx-2 h-6 w-px bg-slate-200" />
            
            <button className="flex items-center gap-2 rounded bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100">
              <Sparkles className="h-3 w-3" />
              AI Reword
            </button>
            <button className="flex items-center gap-2 rounded bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100">
              <Sparkles className="h-3 w-3" />
              Expand Section
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
             <EditorContent editor={editor} />
          </div>

          {/* Footer Stats */}
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-xs text-slate-500 bg-slate-50/30">
            <div className="flex items-center gap-4">
              <span>Word Count: {wordCount} / 5,000</span>
              <span>Characters: {editor.getText().length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${status === 'connected' ? 'bg-green-500' : status === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span>
                {status === 'connected' ? 'Online Collaboration Active' : status === 'connecting' ? 'Connecting...' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* AI sidebar */}
        <div className="w-80 space-y-6 overflow-y-auto pr-1 hidden xl:block">
          <div className="rounded-xl bg-slate-900 p-6 text-white shadow-lg ring-1 ring-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-800 p-3 text-sm border-l-4 border-blue-500 hover:bg-slate-700 transition-colors cursor-pointer">
                <p className="font-medium text-blue-400 flex items-center justify-between">
                  Suggestion 
                  <ChevronRight className="h-3 w-3" />
                </p>
                <p className="mt-1 text-slate-300">Try strengthening the financial justification section. The funder values specific ROI metrics.</p>
              </div>
              <div className="rounded-lg bg-slate-800 p-3 text-sm border-l-4 border-green-500">
                <p className="font-medium text-green-400">Compliance Pass</p>
                <p className="mt-1 text-slate-300">Section 2 meets all technical requirements specified in the grant RFP.</p>
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
                <div className="flex flex-col">
                  <span className="text-sm text-slate-600 font-medium text-yellow-700">Incomplete Section</span>
                  <span className="text-xs text-slate-500">Missing: Risk Mitigation Plan</span>
                </div>
              </div>
            </div>
            <button className="mt-6 w-full rounded-md bg-slate-50 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              Run Full Audit
            </button>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">Word Count Optimizer</h3>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(100, (wordCount/5000)*100)}%` }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">{wordCount} / 5,000 words ({Math.round((wordCount/5000)*100)}%)</p>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Based on historical data, proposals for this funder perform best between 3,500 and 4,500 words.
            </p>
          </div>
        </div>
      </div>

      {showBudgetGenerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowBudgetGenerator(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
            <BudgetNarrativeGenerator onInsert={handleInsertNarrative} />
          </div>
        </div>
      )}
    </div>
  );
}
