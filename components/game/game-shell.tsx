"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, HelpCircle, RotateCcw, ScrollText, Users } from "lucide-react";
import { Board } from "./board";
import { DicePanel, LogList, LogPanel, PlayersList, PlayersPanel } from "./side-panel";
import { MobileDock } from "./mobile-dock";
import { MobilePage } from "./mobile-page";
import { CellDialog, ResultDialog, RulesDialog, SetupDialog } from "./dialogs";
import { Intro } from "./intro";
import { createGame, rollFace, spin } from "@/lib/game/engine";
import type { BoardCell, DieFace, GameState } from "@/lib/game/types";
import { useMediaQuery } from "@/lib/use-media";
import { Button } from "@/components/ui/button";

const FACES: DieFace[] = ["de", "cai", "gong", "zang"];

type MobileView = "players" | "log" | "guide";

function IconButton({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      title={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-[#8a6f45]/45 bg-[#fbf4e4]/80 text-ink-soft transition hover:border-[#8a6f45] hover:text-ink active:translate-y-[1px]"
    >
      {children}
    </button>
  );
}

export function GameShell() {
  const [game, setGame] = useState<GameState | null>(null);
  const [setupOpen, setSetupOpen] = useState(true);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<BoardCell | null>(null);
  const [mobileView, setMobileView] = useState<MobileView | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [previewFace, setPreviewFace] = useState<DieFace>("de");
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const isNarrow = useMediaQuery("(max-width: 767px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const cols = isNarrow ? 4 : 8;

  const clearTimers = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => clearTimers, []);

  useEffect(() => {
    if (game?.status !== "finished") return;
    const timer = window.setTimeout(() => setResultOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, [game?.status]);

  // 手机上随棋子自动滚动到当前官位
  const turnPos = game ? `${game.turn}:${game.players[game.turn].pos}` : "";
  useEffect(() => {
    if (isDesktop || !game) return;
    const cell = document.getElementById(`cell-${game.players[game.turn].pos}`);
    cell?.scrollIntoView({ block: "center", behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnPos, isDesktop]);

  const handleRoll = () => {
    if (!game || game.status !== "playing" || spinning) return;

    setSpinning(true);
    const face = rollFace();
    let ticks = 0;

    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      ticks += 1;
      setPreviewFace(FACES[Math.floor(Math.random() * FACES.length)]);
      if (ticks < 10) return;

      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      setPreviewFace(face);
      timeoutRef.current = window.setTimeout(() => {
        setSpinning(false);
        setGame((prev) => (prev ? spin(prev, face) : prev));
      }, 200);
    }, 80);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" && event.code !== "Enter") return;
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "BUTTON"].includes(target.tagName)) return;
      if (setupOpen || rulesOpen || resultOpen || selectedCell || mobileView) return;
      event.preventDefault();
      handleRoll();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [game, spinning, setupOpen, rulesOpen, resultOpen, selectedCell, mobileView]);

  const handleStart = (names: string[]) => {
    clearTimers();
    setSpinning(false);
    setGame(createGame(names));
    setResultOpen(false);
    setSetupOpen(false);
    setMobileView(null);
    setPreviewFace("de");
  };

  const openSetup = () => {
    setResultOpen(false);
    setSetupOpen(true);
  };

  const openMobileView = (view: MobileView) => {
    if (!game && view !== "guide") {
      openSetup();
      return;
    }
    setMobileView(view);
  };

  return (
    <main className="fixed inset-0 flex h-[100dvh] flex-col overflow-hidden px-3 pb-[calc(96px+env(safe-area-inset-bottom))] pt-3 lg:static lg:mx-auto lg:h-auto lg:max-w-[1280px] lg:flex-none lg:overflow-visible lg:px-6 lg:pb-16 lg:pt-10">
      <header className="flex shrink-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 -rotate-3 flex-col items-center justify-center rounded-[4px] border-2 border-[#7d2015] bg-[#a3301f] text-[#fdf6e7] shadow-[0_8px_18px_-12px_rgba(120,32,20,0.9)] sm:h-[58px] sm:w-[58px]">
            <span
              className="text-[11px] leading-[1.15] tracking-[0.2em] sm:text-[15px]"
              style={{ fontFamily: "var(--font-kai)" }}
            >
              升官
            </span>
            <span
              className="text-[11px] leading-[1.15] tracking-[0.2em] sm:text-[15px]"
              style={{ fontFamily: "var(--font-kai)" }}
            >
              图台
            </span>
          </div>
          <div className="min-w-0">
            <h1 className="seal-title text-[22px] leading-tight sm:text-[28px] lg:text-[32px]">
              升官图台
            </h1>
            <p className="hidden text-[11px] tracking-[0.28em] text-ink-soft sm:block">
              清 · 升官图博戏 · 数字复原
            </p>
            <p className="mt-0.5 truncate text-[10px] text-ink-soft sm:hidden">
              {game
                ? `第 ${game.round} 巡 · ${game.players[game.turn].name} 执骰`
                : "清 · 升官图博戏"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
          <IconButton label="列位官身" onPress={() => openMobileView("players")}>
            <Users className="h-[15px] w-[15px]" />
          </IconButton>
          <IconButton label="对局实录" onPress={() => openMobileView("log")}>
            <ScrollText className="h-[15px] w-[15px]" />
          </IconButton>
          <IconButton label="图说" onPress={() => openMobileView("guide")}>
            <BookOpen className="h-[15px] w-[15px]" />
          </IconButton>
          <IconButton label="重开" onPress={openSetup}>
            <RotateCcw className="h-[15px] w-[15px]" />
          </IconButton>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="outline" size="sm" onClick={() => setRulesOpen(true)}>
            <HelpCircle className="h-3.5 w-3.5" />
            玩法与典故
          </Button>
          <Button variant="outline" size="sm" onClick={openSetup}>
            <RotateCcw className="h-3.5 w-3.5" />
            重开
          </Button>
        </div>
      </header>

      <div className="mt-3 flex min-h-0 flex-1 flex-col gap-3 lg:mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_356px] lg:items-start lg:gap-5">
        <div className="flex min-h-0 flex-1 flex-col gap-5 lg:block lg:space-y-5">
          <Board game={game} cols={cols} fill={!isDesktop} onSelectCell={setSelectedCell} />
          {game ? (
            <div className="hidden lg:block">
              <LogPanel game={game} />
            </div>
          ) : null}
        </div>

        <aside className="hidden lg:sticky lg:top-6 lg:flex lg:flex-col lg:gap-5">
          {game ? (
            <>
              <DicePanel
                game={game}
                spinning={spinning}
                previewFace={previewFace}
                onRoll={handleRoll}
              />
              <PlayersPanel game={game} />
            </>
          ) : (
            <>
              <section className="paper-card rounded-sm p-6 text-center">
                <p className="text-sm text-ink-soft">尚未开印</p>
                <Button className="mt-4 w-full" onClick={openSetup}>
                  开 印 定 座
                </Button>
              </section>
              <section className="paper-card rounded-sm p-5 text-[12px] leading-relaxed text-ink-soft">
                升官图为清代岁朝流行的博戏，以陀螺四德定人仕途。此作复原其盘格与升降之例，可二人以上同局。
              </section>
            </>
          )}
        </aside>
      </div>

      <Intro className="hidden lg:block" />

      <footer className="mt-8 hidden flex-wrap items-center justify-between gap-2 border-t border-[#8a6f45]/20 pt-4 text-[10.5px] text-ink-soft sm:text-[11px] lg:flex">
        <span>升官图台 · 纯前端静态之作，不设后端，牌局数据尽在本地。</span>
        <span>骰路无常，仕途亦然。</span>
      </footer>

      {game ? (
        <MobileDock
          game={game}
          spinning={spinning}
          previewFace={previewFace}
          onRoll={handleRoll}
        />
      ) : null}

      {mobileView === "players" && game ? (
        <MobilePage
          title="列位官身"
          note={`${game.players.length} 位同局 · 共 ${game.logs.length} 条实录`}
          onBack={() => setMobileView(null)}
        >
          <div className="mb-3 grid grid-cols-3 gap-2">
            {[
              { label: "巡次", value: `第 ${game.round} 巡` },
              { label: "掷骰", value: `${game.players.reduce((sum, p) => sum + p.rolls, 0)} 次` },
              {
                label: "领先",
                value: [...game.players].sort((a, b) => b.pos - a.pos)[0].name,
              },
            ].map((item) => (
              <div key={item.label} className="paper-card rounded-sm px-2 py-2 text-center">
                <p className="text-[10px] text-ink-soft">{item.label}</p>
                <p className="mt-0.5 truncate text-xs text-ink">{item.value}</p>
              </div>
            ))}
          </div>
          <section className="paper-card rounded-sm p-3">
            <PlayersList game={game} />
          </section>
        </MobilePage>
      ) : null}

      {mobileView === "log" && game ? (
        <MobilePage
          title="对局实录"
          note={`共 ${game.logs.length} 条 · 第 ${game.round} 巡`}
          onBack={() => setMobileView(null)}
        >
          <section className="paper-card rounded-sm p-3.5">
            <LogList game={game} className="space-y-3" />
          </section>
        </MobilePage>
      ) : null}

      {mobileView === "guide" ? (
        <MobilePage title="图说" note="玩法 · 源流 · 品阶" onBack={() => setMobileView(null)}>
          <Intro className="mt-0" hideHeading />
          <Button variant="outline" className="mt-4 w-full" onClick={() => setRulesOpen(true)}>
            <HelpCircle className="h-3.5 w-3.5" />
            玩法与典故详本
          </Button>
        </MobilePage>
      ) : null}

      <SetupDialog
        open={setupOpen}
        onOpenChange={setSetupOpen}
        canDismiss={!!game}
        onStart={handleStart}
      />
      <CellDialog cell={selectedCell} onClose={() => setSelectedCell(null)} />
      <RulesDialog open={rulesOpen} onOpenChange={setRulesOpen} />
      {game ? (
        <ResultDialog
          game={game}
          open={resultOpen}
          onClose={() => setResultOpen(false)}
          onRestart={openSetup}
        />
      ) : null}
    </main>
  );
}
