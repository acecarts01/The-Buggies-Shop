'use client';

import React from 'react';
import { LogOut } from 'lucide-react';

export default function AdminSignOut() {
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch('/api/admin/session/', { method: 'DELETE' });
        window.location.href = '/admin/login/';
      }}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A9B4C6] hover:text-white transition-colors"
    >
      <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
      Sign out
    </button>
  );
}
