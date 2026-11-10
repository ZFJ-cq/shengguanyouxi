"use client";

import { BOARD, GROUP_META, cellCoord } from "@/lib/game/board";
import { PLAYER_COLORS } from "@/lib/game/engine";
import type { BoardCell, GameState, Player } from "@/lib/game/types";
import { cn } from "@/lib/utils";

interface BoardProps {
  game: GameState | null;
  cols: number;
  /** 铺满可用高度（手机竖屏布局） */
  fill?: boolean;
  onSelectCell: (cell: BoardCell) => void;
}

function PlayerToken({ player, active, compact }: { player: Player; active: boolean; compact: boolean }) {
  return (
    <span
      className={cn(
        "token inline-flex items-center justify-center rounded-full border text-[10px] font-semibold leading-none text-[#fdf6e7] shadow-[0_2px_5px_rgba(40,25,10,0.35)]",
        compact ? "h-5 w-5" : "h-[22px] w-[22px]",
        active && "ring-2 ring-[#a9853f] ring-offset-1 ring-offset-[#f7efdd]",
      )}
      style={{
        backgroundColor: PLAYER_COLORS[player.id % PLAYER_COLORS.length],
        borderColor: "rgba(255,251,240,0.7)",
      }}
      title={`${player.name} · ${player.pos + 1}/${BOARD.length}`}
    >
      {player.name.slice(0, 1)}
    </span>
  );
}

export function Board({ game, cols, fill = false, onSelectCell }: BoardProps) {
  const compact = cols <= 4;
  const rows = Math.ceil(BOARD.length / cols);

  return (
    <section
      className={cn(
        "paper-card board-frame rounded-sm p-2.5 sm:p-4",
        fill && "flex min-h-0 flex-1 flex-col p-2",
      )}
    >
      <div
        className={cn(
          "mb-2 flex flex-wrap items-center justify-between gap-2 px-1 sm:mb-3",
          fill && "hidden",
        )}
      >
        <div className="flex items-baseline gap-2">
          <h2 className="seal-title text-base sm:text-lg">仕途全图</h2>
          <span className="text-[10px] text-ink-soft sm:text-[11px]">
            自白丁至宰相，共 {BOARD.length} 阶
          </span>
        </div>
        <div className="hidden flex-wrap items-center gap-x-3 gap-y-1 sm:flex">
          {Object.entries(GROUP_META).map(([key, meta]) => (
            <span key={key} className="flex items-center gap-1 text-[11px] text-ink-soft">
              <i
                className="inline-block h-2 w-2 rounded-[1px]"
                style={{ backgroundColor: meta.color }}
              />
              {meta.label}
            </span>
          ))}
        </div>
      </div>

      <div
        className={cn("grid gap-[4px] sm:gap-[5px]", fill && "min-h-0 flex-1 gap-1")}
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: fill ? `repeat(${rows}, minmax(0, 1fr))` : `repeat(${rows}, minmax(0, auto))`,
        }}
      >
        {BOARD.map((cell) => {
          const { row, col } = cellCoord(cell.id, cols);
          const meta = GROUP_META[cell.group];
          const playersHere = game ? game.players.filter((player) => player.pos === cell.id) : [];
          const isFinal = cell.id === BOARD.length - 1;
          const activeHere = game
            ? game.players.some(
                (player) => player.pos === cell.id && player.id === game.players[game.turn].id,
              )
            : false;

          return (
            <button
              key={cell.id}
              id={`cell-${cell.id}`}
              type="button"
              onClick={() => onSelectCell(cell)}
              style={{
                gridColumnStart: col + 1,
                gridRowStart: row + 1,
                backgroundColor: isFinal ? "rgba(163,48,31,0.9)" : `${meta.color}0f`,
                borderColor: isFinal ? "rgba(169,133,63,0.9)" : `${meta.color}4d`,
              }}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-[3px] border text-left transition-all hover:z-10 hover:-translate-y-[2px] hover:shadow-[0_8px_18px_-10px_rgba(60,40,20,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar/50",
                compact ? "h-[74px] p-1.5" : "h-[96px] p-2 sm:h-[108px]",
                fill && "h-full min-h-0 p-1",
                activeHere && "shadow-[0_6px_16px_-8px_rgba(163,48,31,0.6)]",
              )}
            >
              <div className="flex items-start justify-between gap-1">
                <span
                  className="text-[9px] leading-none tracking-wider sm:text-[9.5px]"
                  style={{
                    color: isFinal
                      ? "rgba(253,246,231,0.85)"
                      : cell.id === 0
                        ? "#a3301f"
                        : "rgba(98,86,70,0.55)",
                  }}
                >
                  {cell.id === 0 ? "起家" : isFinal ? "终局" : String(cell.id + 1).padStart(2, "0")}
                </span>
                <span
                  className="rounded-[2px] px-1 py-[2px] text-[9px] leading-none sm:text-[9.5px]"
                  style={{
                    color: isFinal ? "#f8eed6" : meta.color,
                    backgroundColor: isFinal ? "rgba(255,255,255,0.16)" : `${meta.color}16`,
                  }}
                >
                  {cell.rank}
                </span>
              </div>

              <div
                className={cn(
                  "font-kai leading-[1.25]",
                  compact ? "text-[12.5px]" : "text-[13px] sm:text-[14px]",
                  fill && "text-[12px] leading-[1.15]",
                  isFinal ? "text-[#fdf6e7]" : "text-ink",
                )}
                style={{ fontFamily: "var(--font-kai)" }}
              >
                {cell.name}
              </div>

              <div
                className={cn(
                  "flex min-h-[20px] items-end justify-between gap-1",
                  fill && "min-h-[16px]",
                )}
              >
                <span
                  className="hidden text-[9px] leading-none opacity-0 transition-opacity group-hover:opacity-100 sm:inline"
                  style={{ color: isFinal ? "rgba(253,246,231,0.85)" : meta.color }}
                >
                  查阅
                </span>
                <div className="flex -space-x-1">
                  {playersHere.map((player) => (
                    <PlayerToken
                      key={player.id}
                      player={player}
                      compact={compact}
                      active={player.id === game?.players[game.turn].id}
                    />
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p
        className={cn(
          "mt-2 px-1 text-[11px] leading-relaxed text-ink-soft",
          fill ? "hidden" : "hidden sm:block",
        )}
      >
        棋路由左至右、右至左往复而行，序次递增。点按任一格可查阅官职考与四德升降之例。
      </p>
    </section>
  );
}
