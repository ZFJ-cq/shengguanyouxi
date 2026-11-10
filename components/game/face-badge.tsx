import { FACE_META } from "@/lib/game/board";
import type { DieFace } from "@/lib/game/types";
import { cn } from "@/lib/utils";

export function FaceBadge({
  face,
  size = "md",
  className,
}: {
  face: DieFace;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const meta = FACE_META[face];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[3px] border font-semibold leading-none",
        size === "sm" && "h-5 w-5 text-[11px]",
        size === "md" && "h-7 w-7 text-sm",
        size === "lg" && "h-12 w-12 text-2xl",
        className,
      )}
      style={{
        color: meta.color,
        borderColor: `${meta.color}55`,
        backgroundColor: `${meta.color}12`,
      }}
    >
      {meta.label}
    </span>
  );
}
