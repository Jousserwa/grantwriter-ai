"use client";

import { Trash2 } from "lucide-react";
import { deleteProposalAction } from "../editor/actions";

export default function DeleteProposalButton({ id }: { id: string }) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this proposal?")) {
      try {
        await deleteProposalAction(id);
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert("An unknown error occurred");
        }
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
      title="Delete Proposal"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  );
}
