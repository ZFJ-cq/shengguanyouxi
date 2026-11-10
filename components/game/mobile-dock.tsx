"use client";

import { useEffect, useRef, useState } from "react";
import { BOARD, FACE_META, ruleShort } from "@/lib/game/board";
import { PLAYER_COLORS } from "@/lib/game/engine";
import type { DieFace, GameState } from "@/lib/game/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaceBadge } from "./face-badge";

const FACE_ORDER: DieFace[] = ["de", "cai", "gong", "zang"];

export function MobileDock({
  game,
  spinning,
  previewFace,
  onRoll,
}: {
  game: GameState;
  spinning: boolean;
  previewFace: DieFace;
  onRoll: () => void;
}) {
  const player = game.players[game.turn];
  const cell = BOARD[player.pos];
  const face = spinning ? previewFace : game.lastFace ?? "de";
  const meta = FACE_META[face];
  const finished = game.status === "finished";

  // 骰子落定后，短暂展示落骰动画
  const [landed, setLanded] = useState(false);
  const wasSpinning = useRef(false);

  useEffect(() => {
    if (wasSpinning.current && !spinning) {
      setLanded(true);
      wasSpinning.current = spinning;
      const timer = window.setTimeout(() => setLanded(false), 520);
      return () => window.clearTimeout(timer);
    }
    wasSpinning.current = spinning;
  }, [spinning]);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#8a6f45]/30 bg-[#f5ecdb]/96 shadow-[0_-10px_24px_-18px_rgba(60,40,20,0.7)] backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {spinning || landed ? (
        <div className="pointer-events-none absolute inset-x-0 -top-[72px] flex justify-center">
          <div className="relative">
            {spinning ? (
              <span
                className="dice-ring absolute inset-0 rounded-full border-2"
                style={{ borderColor: `${meta.color}66` }}
              />
            ) : null}
            <div
              className={cn(
                "relative flex h-14 w-14 items-center justify-center rounded-[12px] border-2 bg-[#fdf8ec] shadow-[0_14px_26px_-12px_rgba(60,40,20,0.85)]",
                spinning ? "dice-roll" : "dice-land",
              )}
              style={{ borderColor: `${meta.color}88` }}
            >
              <span
                className="select-none text-[28px] font-semibold leading-none"
                style={{ color: meta.color, fontFamily: "var(--font-kai)" }}
              >
                {meta.label}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-[640px] px-3 pb-2.5 pt-2">
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="flex min-w-0 items-center gap-1.5">
            <FaceBadge
              face={face}
              size="sm"
              className={cn("transition-opacity", (spinning || landed) && "opacity-30")}
            />
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] text-[#fdf6e7]"
              style={{ backgroundColor: PLAYER_COLORS[player.id % PLAYER_COLORS.length] }}
            >
              {player.name.slice(0, 1)}
            </span>
            <span className="truncate text-ink-soft">
              <span className="text-ink">{player.name}</span>
              <span className="mx-1 opacity-50">·</span>
              <span className="text-ink">{cell.name}</span>
            </span>
          </span>
          <span className="shrink-0 text-ink-soft">
            {spinning ? "旋转中…" : finished ? "已竣" : `第 ${game.round} 巡`}
          </span>
        </div>

        <div className="mt-2 flex items-stretch gap-2">
          <div className="grid flex-1 grid-cols-4 gap-1">
            {FACE_ORDER.map((key) => {
              const isLast = game.lastFace === key && !spinning;
              return (
                <div
                  key={key}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-[3px] border px-1 py-[5px] leading-none",
                    isLast
                      ? "border-cinnabar/45 bg-[#f7e7d4]"
                      : "border-[#8a6f45]/20 bg-[#fbf4e4]/70",
                  )}
                >
                  <span className="text-[10.5px]" style={{ color: FACE_META[key].color }}>
                    {FACE_META[key].label}
                  </span>
                  <span className="mt-[3px] text-[11px] text-ink">
                    {ruleShort(cell.rules[key])}
                  </span>
                </div>
              );
            })}
          </div>
          <Button
            className="h-[48px] w-[96px] shrink-0 text-sm tracking-[0.2em]"
            onClick={onRoll}
            disabled={spinning || finished}
          >
            {finished ? "已 竣" : spinning ? "…" : "掷 骰"}
          </Button>
        </div>
      </div>
    </div>
  );
}
