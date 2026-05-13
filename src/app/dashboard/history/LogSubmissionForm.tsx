"use client";

import React, { useState } from 'react';
import { updateSubmissionAction } from './actions';
import { ProposalStatus } from '@prisma/client';
import { Check, Loader2 } from 'lucide-react';

interface LogSubmissionFormProps {
  proposalId: string;
  currentStatus: ProposalStatus;
  onClose: () => void;
}

export default function LogSubmissionForm({ proposalId, currentStatus, onClose }: LogSubmissionFormProps) {
  const [status, setStatus] = useState<ProposalStatus>(currentStatus);
  const [submissionDate, setSubmissionDate] = useState('');
  const [fundingSecured, setFundingSecured] = useState('');
  const [feedback, setFeedback] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSubmissionAction(proposalId, {
        status,
        submissionDate: submissionDate ? new Date(submissionDate) : null,
        fundingSecured: fundingSecured ? parseFloat(fundingSecured) : null,
        feedback: feedback || null,
        finalPdfUrl: pdfUrl || null,
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to update submission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-slate-50 border-t border-slate-200">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase">Status</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value as ProposalStatus)}
            className="mt-1 w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="WON">Won</option>
            <option value="LOST">Lost</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase">Submission Date</label>
          <input 
            type="date"
            value={submissionDate}
            onChange={(e) => setSubmissionDate(e.target.value)}
            className="mt-1 w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        {status === 'WON' && (
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase">Funding Secured ($)</label>
            <input 
              type="number"
              value={fundingSecured}
              onChange={(e) => setFundingSecured(e.target.value)}
              placeholder="e.g. 50000"
              className="mt-1 w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        )}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-500 uppercase">Finalized PDF Link (Record Keeping)</label>
          <input 
            type="url"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            placeholder="https://storage.example.com/proposal.pdf"
            className="mt-1 w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-500 uppercase">Feedback / Notes</label>
          <textarea 
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={2}
            placeholder="Add any feedback received from the funder..."
            className="mt-1 w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
          Update Log
        </button>
      </div>
    </form>
  );
}
