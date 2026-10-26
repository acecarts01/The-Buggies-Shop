'use client';

import { FileText, Receipt } from 'lucide-react';

export type RequestType = 'quote' | 'invoice';

interface Props {
  value: RequestType;
  onChange: (v: RequestType) => void;
  /** 'dark' sits in the product modal, 'light' in the catalogue and landing forms. */
  tone?: 'dark' | 'light';
}

/** "I would like: a quote / a tax invoice". Sent with the request so the sales desk knows which to prepare. */
export default function RequestTypeToggle({ value, onChange, tone = 'light' }: Props) {
  const dark = tone === 'dark';
  const opts: { key: RequestType; label: string; hint: string; icon: typeof FileText }[] = [
    { key: 'quote', label: 'Quote', hint: 'Itemised price, valid for a set time', icon: FileText },
    { key: 'invoice', label: 'Tax invoice', hint: 'Ready to pay, with payment details', icon: Receipt },
  ];
  return (
    <fieldset className="space-y-1.5">
      <legend className={`block font-semibold mb-1 ${dark ? 'text-[#A8A29E]' : 'text-[#6B645E]'}`}>I would like</legend>
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Quote or tax invoice">
        {opts.map((o) => {
          const active = value === o.key;
          return (
            <button
              key={o.key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.key)}
              className={`rounded-lg border p-2.5 text-left transition-all ${
                dark
                  ? active
                    ? 'border-[#E2A17A] bg-[#121417] text-[#ffffff]'
                    : 'border-[#2B2F34] bg-[#121417] text-[#A8A29E] hover:border-[#E2A17A]/50'
                  : active
                    ? 'border-[#B45A40] bg-[#F7EFEA] text-[#121417]'
                    : 'border-[#E7E5E4] bg-white text-[#6B645E] hover:border-[#C86D51]/50'
              }`}
            >
              <o.icon className={`w-4 h-4 mb-1 ${active ? (dark ? 'text-[#E2A17A]' : 'text-[#A85640]') : ''}`} aria-hidden="true" />
              <div className="text-xs font-bold leading-tight">{o.label}</div>
              <div className={`text-[10px] leading-tight ${dark ? 'text-[#A8A29E]' : 'text-[#6B645E]'}`}>{o.hint}</div>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
