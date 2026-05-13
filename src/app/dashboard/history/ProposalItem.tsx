"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { FileText, Clock, ChevronRight, BarChart2, ExternalLink } from "lucide-react";
import DeleteProposalButton from "./DeleteProposalButton";
import LogSubmissionForm from "./LogSubmissionForm";

import { Proposal, Grant } from "@prisma/client";

interface ProposalWithGrant extends Proposal {
  grant: Grant;
}

interface ProposalItemProps {
  proposal: ProposalWithGrant;
  isOwner: boolean;
}

export default function ProposalItem({ proposal, isOwner }: ProposalItemProps) {
  const [isLogging, setIsLogging] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WON': return 'bg-green-100 text-green-800 border-green-200';
      case 'LOST': return 'bg-red-100 text-red-800 border-red-200';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="border-b border-slate-100 last:border-0">
      <div className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${proposal.status === 'WON' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900">{proposal.title}</h3>
              {proposal.fundingSecured && (
                <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                  • ${proposal.fundingSecured.toLocaleString()} won
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Updated {new Date(proposal.updatedAt).toLocaleDateString()}
              </span>
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(proposal.status)}`}>
                {proposal.status}
              </span>
              {proposal.grant?.funder && (
                <span className="text-xs text-slate-400">
                  Funder: {proposal.grant.funder}
                </span>
              )}
              {proposal.finalPdfUrl && (
                <a 
                  href={proposal.finalPdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 flex items-center gap-1 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3" />
                  View PDF
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsLogging(!isLogging)}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <BarChart2 className="h-4 w-4" />
            Log Outcome
          </button>
          <Link 
            href={`/dashboard/editor/${proposal.id}`}
            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
            title="Edit Proposal"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
          {isOwner && <DeleteProposalButton id={proposal.id} />}
        </div>
      </div>
      
      {isLogging && (
        <LogSubmissionForm 
          proposalId={proposal.id} 
          currentStatus={proposal.status} 
          onClose={() => setIsLogging(false)} 
        />
      )}
      
      {proposal.feedback && !isLogging && (
        <div className="px-6 pb-4 ml-14">
          <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-200 italic">
            &ldquo; {proposal.feedback} &rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
