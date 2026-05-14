import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Building2, 
  Search, 
  FileEdit, 
  Calendar, 
  History, 
  Users, 
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Org Profile', href: '/dashboard/profile', icon: Building2 },
  { name: 'Grant Discovery', href: '/dashboard/grants', icon: Search },
  { name: 'Proposal Editor', href: '/dashboard/editor', icon: FileEdit },
  { name: 'Budget Tools', href: '/dashboard/budget', icon: Sparkles },
  { name: 'Deadlines', href: '/dashboard/deadlines', icon: Calendar },
  { name: 'History', href: '/dashboard/history', icon: History },
  { name: 'Team', href: '/dashboard/team', icon: Users },
];

export default function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-slate-800">
        <span className="text-xl font-bold text-blue-400">GrantWriter AI</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-800 hover:text-blue-400 transition-colors"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-slate-800 p-4">
        <ul className="space-y-1">
          <li>
            <Link
              href="/dashboard/settings"
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-800 hover:text-blue-400 transition-colors"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </li>
          <li>
            <button
              className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-800 hover:text-red-400 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
