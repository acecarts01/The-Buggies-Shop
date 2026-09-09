'use client';

import React, { useState } from 'react';
import { MessageSquare, Phone, MapPin, X, ShieldCheck } from 'lucide-react';
import { CONTACT, ABN_INFO } from '@/src/config/site';

export default function ChatHub() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside aria-label="Support & Contact Hub" className="fixed bottom-4 right-4 z-40">
      {expanded ? (
        <div className="bg-white border border-[#E7E5E4] rounded-2xl p-4 shadow-sm w-80 text-xs text-[#121417] space-y-3 animate-in fade-in slide-in-from-bottom-2 surface-card">
          <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-2.5">
            <div>
              <div className="font-serif font-bold text-[#121417] text-sm">Yatala Operations Desk</div>
              <div className="text-[11px] text-[#78716C]">Golf Buggies Express PTY LTD</div>
            </div>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="p-1 rounded-md text-[#78716C] hover:text-[#121417] hover:bg-[#F7F6F2] transition-colors"
              aria-label="Close contact hub"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <a
              href={`https://wa.me/61480804189?text=${encodeURIComponent(
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
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#F7EFEA] border border-[#C86D51]/20 text-[#C86D51] font-bold hover:bg-[#B45A40] hover:text-white transition-all shadow-xs hover:-translate-y-px duration-200"
            >
              <Phone className="w-4 h-4" />
              <span>Call Yatala: 0480 804 189</span>
            </a>
          </div>

          <div className="pt-2.5 border-t border-[#E7E5E4] space-y-1.5 text-[11px] text-[#78716C]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C86D51] shrink-0" />
              <span>Depot: Yatala QLD 4207 (Direct Transport)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C86D51] shrink-0" />
              <span>ABN {ABN_INFO.abn} • ASIC Registered</span>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 bg-[#25D366] text-white font-bold text-xs py-2.5 px-4 rounded-full shadow-sm hover:bg-[#20bd5a] transition-all border border-white/20"
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
