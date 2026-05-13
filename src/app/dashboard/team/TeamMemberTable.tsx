"use client";

import React, { useState } from 'react';
import { removeMemberAction, inviteMemberAction } from './actions';
import { Trash2, UserPlus, Mail, Shield, User } from 'lucide-react';

interface Member {
  id: string;
  name: string | null;
  email: string | null;
  organizationRole: string;
  image: string | null;
}

interface TeamMemberTableProps {
  members: Member[];
  currentUserRole: string;
}

export default function TeamMemberTable({ members, currentUserRole }: TeamMemberTableProps) {
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await inviteMemberAction(inviteEmail);
      setInviteEmail('');
      setIsInviting(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to invite member");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await removeMemberAction(userId);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Failed to remove member");
      }
    }
  };

  return (
    <div className="space-y-4">
      {isInviting && (
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
          <form onSubmit={handleInvite} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="email" className="block text-xs font-medium text-blue-700 uppercase mb-1">
                Invite by Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                <input
                  type="email"
                  id="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  required
                  className="w-full rounded-md border-0 py-2 pl-10 text-slate-900 ring-1 ring-inset ring-blue-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Invite'}
              </button>
              <button
                type="button"
                onClick={() => setIsInviting(false)}
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Member</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Role</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-100 flex items-center justify-center">
                      {member.image ? (
                        <img src={member.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{member.name || 'Anonymous'}</div>
                      <div className="text-sm text-slate-500">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    member.organizationRole === 'OWNER' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {member.organizationRole === 'OWNER' && <Shield className="h-3 w-3" />}
                    {member.organizationRole}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  {currentUserRole === 'OWNER' && member.organizationRole !== 'OWNER' && (
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="text-red-600 hover:text-red-900 flex items-center gap-1 ml-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isInviting && currentUserRole === 'OWNER' && (
        <button
          onClick={() => setIsInviting(true)}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Invite another colleague
        </button>
      )}
    </div>
  );
}
