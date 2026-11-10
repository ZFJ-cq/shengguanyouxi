"use client";

import { useState } from "react";
import { BOARD, FACE_META, GROUP_META, ruleText } from "@/lib/game/board";
import type { BoardCell, DieFace, GameState } from "@/lib/game/types";
import { PLAYER_COLORS } from "@/lib/game/engine";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FaceBadge } from "./face-badge";
import { cn } from "@/lib/utils";

const FACE_ORDER: DieFace[] = ["de", "cai", "gong", "zang"];
const DEFAULT_NAMES = ["甲", "乙", "丙", "丁"];

export function SetupDialog({
  open,
  onOpenChange,
  canDismiss,
  onStart,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canDismiss: boolean;
  onStart: (names: string[]) => void;
}) {
  const [count, setCount] = useState(2);
  const [names, setNames] = useState<string[]>(DEFAULT_NAMES);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="开印定座"
        description="清制升官图，以四德陀螺定升贬。请择同局人数，各留名号。"
        hideClose={!canDismiss}
      >
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-xs text-ink-soft">同局人数</p>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCount(n)}
                  className={cn(
                    "rounded-[3px] border px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar/40",
                    count === n
                      ? "border-cinnabar bg-[#f7e7d4] text-cinnabar"
                      : "border-[#8a6f45]/30 bg-[#fbf4e4]/60 text-ink-soft hover:border-[#8a6f45]/60",
                  )}
                >
                  {n} 位
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs text-ink-soft">名号</p>
            <div className="space-y-2">
              {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-[#fdf6e7]"
                    style={{ backgroundColor: PLAYER_COLORS[index] }}
                  >
                    {names[index].slice(0, 1) || "·"}
                  </span>
                  <input
                    value={names[index]}
                    maxLength={6}
                    onChange={(event) => {
                      const next = [...names];
                      next[index] = event.target.value;
                      setNames(next);
                    }}
                    placeholder={`第 ${index + 1} 位`}
                    className="h-9 w-full rounded-[3px] border border-[#8a6f45]/35 bg-[#fdf8ec]/80 px-3 text-sm text-ink outline-none transition focus:border-cinnabar/60"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[3px] border border-[#8a6f45]/25 bg-[#fbf4e4]/60 p-3 text-[11px] leading-relaxed text-ink-soft">
            众人自「白丁」起家，依格中四德之例升迁贬谪，先登「宰相·太师」者胜。赃字主罚，官职愈高、罚愈重。
          </div>

          <Button
            size="lg"
            className="w-full tracking-[0.4em]"
            onClick={() => onStart(names.slice(0, count).map((name, i) => name.trim() || `第${i + 1}位`))}
          >
            开 局
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CellDialog({
  cell,
  onClose,
}: {
  cell: BoardCell | null;
  onClose: () => void;
}) {
  const group = cell ? GROUP_META[cell.group] : null;

  return (
    <Dialog open={!!cell} onOpenChange={(open) => (open ? null : onClose())}>
      {cell && group ? (
        <DialogContent title={cell.name} description={`${cell.rank} · ${group.label}`}>
          <div className="space-y-4">
            <p className="text-[13px] leading-[1.9] text-ink">{cell.note}</p>
            <div className="rule-divider" />
            <div>
              <p className="mb-2 text-[11px] text-ink-soft">
                四德之例 · 恰在此格时所应升贬
              </p>
              <div className="grid grid-cols-2 gap-2">
                {FACE_ORDER.map((face) => (
                  <div
                    key={face}
                    className="rounded-[3px] border border-[#8a6f45]/20 bg-[#fbf4e4]/60 p-2"
                  >
                    <div className="flex items-center gap-2">
                      <FaceBadge face={face} size="sm" />
                      <span className="text-[11px] text-ink-soft">{FACE_META[face].hint}</span>
                    </div>
                    <p className="mt-1.5 text-xs text-ink">{ruleText(cell.rules[face])}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-ink-soft">
              第 {cell.id + 1} 格 · 共 {BOARD.length} 格
            </p>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

export function RulesDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="玩法与典故" description="升官图起于唐，盛于清，为岁朝博戏之一种。">
        <div className="space-y-5 text-[13px] leading-[1.9] text-ink">
          <section>
            <h3 className="seal-title mb-2 text-sm">一、行棋之法</h3>
            <ul className="list-decimal space-y-1.5 pl-5 text-ink-soft">
              <li>众人同自「白丁」起家，依座次轮流掷骰。</li>
              <li>骰为四德陀螺：德、才、功、赃，各面所主不同。</li>
              <li>所停之格各载四德升降之例，掷得何字，即依该格此字所载进、退、留任。</li>
              <li>进至「宰相·太师」者拜相，本局即终，余者依官阶定名次。</li>
            </ul>
          </section>
          <section>
            <h3 className="seal-title mb-2 text-sm">二、四德释义</h3>
            <div className="grid grid-cols-2 gap-2">
              {FACE_ORDER.map((face) => (
                <div
                  key={face}
                  className="rounded-[3px] border border-[#8a6f45]/20 bg-[#fbf4e4]/60 p-2.5"
                >
                  <div className="flex items-center gap-2">
                    <FaceBadge face={face} size="sm" />
                    <span className="text-xs text-ink">{FACE_META[face].hint}</span>
                  </div>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-soft">
                    {FACE_META[face].meaning}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h3 className="seal-title mb-2 text-sm">三、本作之例</h3>
            <ul className="list-disc space-y-1.5 pl-5 text-ink-soft">
              <li>官职愈高，德才之进益愈缓，而犯赃之罚愈重——高处不胜寒。</li>
              <li>若罚停一巡，次巡轮至该家时即自动停掷，实录有载。</li>
              <li>白丁无官可革，犯赃只罚停一巡；已在白丁而遇贬，则止于白丁。</li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ResultDialog({
  game,
  onRestart,
  onClose,
  open,
}: {
  game: GameState;
  onRestart: () => void;
  onClose: () => void;
  open: boolean;
}) {
  const champion = game.ranking[0];
  return (
    <Dialog open={open} onOpenChange={(next) => (next ? null : onClose())}>
      <DialogContent title="本局告竣" description="先登相位者为魁，余者依官阶序次。">
        <div className="space-y-4">
          <div className="rounded-[3px] border border-[#a9853f]/40 bg-[#f7ecd6] p-4 text-center">
            <p className="text-[11px] tracking-[0.3em] text-ink-soft">拜相</p>
            <p
              className="mt-1 text-2xl font-semibold"
              style={{ color: PLAYER_COLORS[(champion?.playerId ?? 0) % PLAYER_COLORS.length] }}
            >
              {champion?.name}
            </p>
            <p className="mt-1 text-[11px] text-ink-soft">
              共掷 {champion?.rolls ?? 0} 次 · 位极人臣
            </p>
          </div>

          <div className="overflow-hidden rounded-[3px] border border-[#8a6f45]/25">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#efe2c8] text-[11px] text-ink-soft">
                <tr>
                  <th className="px-3 py-2 font-normal">名次</th>
                  <th className="px-3 py-2 font-normal">名号</th>
                  <th className="px-3 py-2 font-normal">终官</th>
                  <th className="px-3 py-2 text-right font-normal">掷骰</th>
                </tr>
              </thead>
              <tbody>
                {game.ranking.map((entry) => (
                  <tr key={entry.playerId} className="border-t border-[#8a6f45]/15">
                    <td className="px-3 py-2 text-ink-soft">第 {entry.rank}</td>
                    <td className="px-3 py-2 text-ink">{entry.name}</td>
                    <td className="px-3 py-2 text-ink-soft">{BOARD[entry.pos].name}</td>
                    <td className="px-3 py-2 text-right text-ink-soft">{entry.rolls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              观 棋 局
            </Button>
            <Button className="flex-1" onClick={onRestart}>
              再 开 一 局
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
