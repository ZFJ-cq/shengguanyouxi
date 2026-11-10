"use client";

import { Dice5, ScrollText, Users } from "lucide-react";
import { BOARD, FACE_META, ruleText } from "@/lib/game/board";
import { PLAYER_COLORS } from "@/lib/game/engine";
import type { DieFace, GameState } from "@/lib/game/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaceBadge } from "./face-badge";

const FACE_ORDER: DieFace[] = ["de", "cai", "gong", "zang"];

export function DicePanel({
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

  return (
    <section className="paper-card rounded-sm p-4">
      <div className="flex items-center justify-between">
        <h2 className="seal-title text-base">掷骰行棋</h2>
        <span className="text-[11px] text-ink-soft">
          第 {game.round} 巡 · 余 {game.players.length} 位
        </span>
      </div>
      <div className="rule-divider my-3" />

      <div className="flex items-center gap-2 text-xs text-ink-soft">
        <span
          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold text-[#fdf6e7]"
          style={{ backgroundColor: PLAYER_COLORS[player.id % PLAYER_COLORS.length] }}
        >
          {player.name.slice(0, 1)}
        </span>
        <span className="text-ink">{player.name}</span>
        <span>执骰，现居</span>
        <span className="text-ink">{cell.name}</span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative h-[96px] w-[96px] shrink-0">
          <div
            className="absolute inset-[6px] rotate-45 rounded-[16px] border shadow-[0_10px_20px_-14px_rgba(60,40,20,0.9)]"
            style={{
              background: `linear-gradient(145deg, #fdf8ec, ${meta.color}22)`,
              borderColor: `${meta.color}66`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn("select-none text-[40px] font-semibold", spinning && "top-spin")}
              style={{ color: meta.color, fontFamily: "var(--font-kai)" }}
            >
              {meta.label}
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm text-ink">{meta.hint}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">
            {spinning ? "陀螺疾转，诸公屏息……" : game.lastMessage}
          </p>
          <div className="mt-3">
            <Button
              size="lg"
              className="w-full tracking-[0.4em]"
              onClick={onRoll}
              disabled={spinning || finished}
            >
              {finished ? "本局已竣" : spinning ? "旋转中" : "掷 骰"}
            </Button>
            <p className="mt-2 text-center text-[10px] text-ink-soft">按空格键亦可掷骰</p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] text-ink-soft">
          <Dice5 className="h-3.5 w-3.5" />
          <span>本格升降之例 · {cell.name}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {FACE_ORDER.map((key) => {
            const rule = cell.rules[key];
            const isLast = game.lastFace === key;
            return (
              <div
                key={key}
                className={cn(
                  "flex items-center gap-2 rounded-[3px] border px-2 py-1.5",
                  isLast
                    ? "border-cinnabar/40 bg-[#f7e7d4]"
                    : "border-[#8a6f45]/20 bg-[#fbf4e4]/60",
                )}
              >
                <FaceBadge face={key} size="sm" />
                <span className="truncate text-[11px] text-ink">{ruleText(rule)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PlayersList({ game }: { game: GameState }) {
  return (
    <ul className="space-y-2">
      {game.players.map((player) => {
        const active = player.id === game.players[game.turn].id && game.status === "playing";
        const cell = BOARD[player.pos];
        const percent = ((player.pos + 1) / BOARD.length) * 100;
        return (
          <li
            key={player.id}
            className={cn(
              "rounded-[3px] border px-2.5 py-2 transition-colors",
              active ? "border-cinnabar/40 bg-[#f9eede]" : "border-transparent bg-[#fbf4e4]/40",
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-[#fdf6e7]"
                style={{ backgroundColor: PLAYER_COLORS[player.id % PLAYER_COLORS.length] }}
              >
                {player.name.slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-xs text-ink">{player.name}</span>
                  <span className="shrink-0 text-[10px] text-ink-soft">掷 {player.rolls} 次</span>
                </div>
                <div className="mt-0.5 flex items-baseline justify-between gap-2">
                  <span className="truncate text-[11px] text-ink-soft">
                    {cell.name}
                    <span className="ml-1 opacity-60">{cell.rank}</span>
                  </span>
                  {player.skip > 0 ? (
                    <span className="shrink-0 rounded-[2px] bg-[#3a332c]/10 px-1 text-[10px] text-[#3a332c]">
                      罚停 {player.skip}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-[#8a6f45]/15">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percent}%`,
                  backgroundColor: PLAYER_COLORS[player.id % PLAYER_COLORS.length],
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function PlayersPanel({ game }: { game: GameState }) {
  return (
    <section className="paper-card rounded-sm p-4">
      <div className="flex items-center justify-between">
        <h2 className="seal-title flex items-center gap-1.5 text-base">
          <Users className="h-4 w-4" /> 列位官身
        </h2>
        <span className="text-[11px] text-ink-soft">{BOARD.length} 阶</span>
      </div>
      <div className="rule-divider my-3" />
      <PlayersList game={game} />
    </section>
  );
}

export function LogList({ game, className }: { game: GameState; className?: string }) {
  return (
    <ol className={cn("space-y-2", className)}>
      {game.logs.map((log) => (
        <li key={log.id} className="flex items-start gap-2 text-[11.5px] leading-relaxed">
          {log.face ? (
            <FaceBadge face={log.face} size="sm" className="mt-[1px] shrink-0" />
          ) : (
            <span
              className={cn(
                "mt-[6px] inline-block h-1.5 w-1.5 shrink-0 rounded-full",
                log.kind === "finish" ? "bg-cinnabar" : "bg-[#8a6f45]/50",
              )}
            />
          )}
          <span
            className={cn(
              "text-ink-soft",
              log.kind === "move" && "text-ink",
              log.kind === "finish" && "font-semibold text-cinnabar",
              log.kind === "skip" && "text-[#8a6f45]",
            )}
          >
            {log.text}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function LogPanel({ game }: { game: GameState }) {
  return (
    <section className="paper-card flex min-h-0 flex-col rounded-sm p-4">
      <div className="flex items-center justify-between">
        <h2 className="seal-title flex items-center gap-1.5 text-base">
          <ScrollText className="h-4 w-4" /> 对局实录
        </h2>
        <span className="text-[11px] text-ink-soft">共 {game.logs.length} 条</span>
      </div>
      <div className="rule-divider my-3" />
      <LogList game={game} className="scroll-thin max-h-[300px] overflow-y-auto pr-1" />
    </section>
  );
}
