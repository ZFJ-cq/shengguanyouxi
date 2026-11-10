"use client";

import { ChevronLeft } from "lucide-react";

export function MobilePage({
  title,
  note,
  onBack,
  children,
}: {
  title: string;
  note?: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[#ece0c9] lg:hidden">
      <div
        className="flex items-center gap-3 border-b border-[#8a6f45]/25 bg-[#f3e9d6]/95 px-3 pb-2.5 backdrop-blur"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="返回"
          className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-[#8a6f45]/40 bg-[#fbf4e4]/80 text-ink-soft transition active:translate-y-[1px]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="min-w-0">
          <h2 className="seal-title text-base leading-tight">{title}</h2>
          {note ? <p className="mt-0.5 text-[10px] text-ink-soft">{note}</p> : null}
        </div>
      </div>
      <div
        className="scroll-thin flex-1 overflow-y-auto px-3 py-3"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        {children}
      </div>
    </div>
  );
}
