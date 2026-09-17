import React from 'react';
import { STATUS_LABEL, type OrderStatus } from '@/lib/orders';

const TONE: Record<OrderStatus, string> = {
  new: 'bg-[#B8973F] text-[#071527] border-[#B8973F]',
  awaiting_invoice: 'bg-[#3A2F12] text-[#D9C27A] border-[#B8973F]/60',
  invoice_sent: 'bg-[#12294A] text-white border-[#4C6A96]',
  paid: 'bg-[#0F3D26] text-[#7FD09A] border-[#1E7A46]',
  dispatched: 'bg-[#0F3D26] text-[#7FD09A] border-[#1E7A46]',
};

export default function StatusBadge({ status, active = true, done = false }: { status: OrderStatus; active?: boolean; done?: boolean }) {
  const tone = active ? TONE[status] : done ? 'bg-[#0F3D26]/60 text-[#7FD09A] border-[#1E7A46]/60' : 'bg-transparent text-[#6B7A94] border-white/10';
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-all ${tone} ${active ? 'shadow-[0_0_0_4px_rgba(184,151,63,0.18)]' : ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-current animate-pulse' : 'bg-current opacity-60'}`} aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  );
}
