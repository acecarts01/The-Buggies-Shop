'use client';

import React, { useState } from 'react';
import { MessageSquare, Phone, MapPin, X, ShieldCheck } from 'lucide-react';
import { CONTACT, ABN_INFO } from '@/src/config/site';

export default function ChatHub() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside aria-label="Support & Contact Hub" className="fixed bottom-4 right-4 z-40">
      {expanded ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-2xl w-80 text-xs text-[#1E293B] space-y-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
            <div>
              <div className="font-serif font-bold text-[#1E293B] text-sm">Yatala Operations Desk</div>
              <div className="text-[11px] text-[#64748B]">Golf Buggies Express PTY LTD</div>
            </div>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="p-1 rounded-md text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8F9FA] transition-colors"
              aria-label="Close contact hub"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <a
              href={`https://wa.me/61480408189?text=${encodeURIComponent(
                'Hello The Buggies Express team, I have an inquiry regarding your golf buggies.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#25D366] text-white font-bold hover:bg-[#20bd5a] transition-all shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat via WhatsApp (Live)</span>
            </a>

            <a
              href={`tel:${CONTACT.phone}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#EFF6FF] border border-[#2563EB]/20 text-[#2563EB] font-bold hover:bg-[#2563EB] hover:text-white transition-all shadow-xs"
            >
              <Phone className="w-4 h-4" />
              <span>Call Yatala: 0480 408 189</span>
            </a>
          </div>

          <div className="pt-2.5 border-t border-[#E2E8F0] space-y-1.5 text-[11px] text-[#64748B]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
              <span>Depot: Yatala QLD 4207 (Direct Transport)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
              <span>ABN {ABN_INFO.abn} • ASIC Registered</span>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 bg-[#25D366] text-white font-bold text-xs py-2.5 px-4 rounded-full shadow-xl hover:bg-[#20bd5a] transition-all border border-white/20"
          id="chathub-toggle-btn"
          aria-label="Open support and contact options"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Chat with Yatala Sales Desk</span>
          <span className="sm:hidden">Chat</span>
        </button>
      )}
    </aside>
  );
}
