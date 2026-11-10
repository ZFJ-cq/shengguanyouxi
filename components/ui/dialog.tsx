"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  children,
  title,
  description,
  hideClose = false,
}: {
  className?: string;
  children: React.ReactNode;
  title: string;
  description?: string;
  hideClose?: boolean;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#2a2118]/45 backdrop-blur-[2px] data-[state=open]:animate-in" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[min(92vw,560px)] max-h-[86vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto scroll-thin paper-card rounded-sm p-6 fade-up",
          className,
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-6">
          <div>
            <DialogPrimitive.Title className="seal-title text-xl font-semibold">
              {title}
            </DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description className="mt-2 text-xs leading-relaxed text-ink-soft">
                {description}
              </DialogPrimitive.Description>
            ) : null}
          </div>
          {hideClose ? null : (
            <DialogPrimitive.Close className="rounded-sm p-1 text-ink-soft transition hover:bg-[#e8dcc4] hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar/30">
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          )}
        </div>
        <div className="rule-divider mb-4" />
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
