import { BOARD, FACE_META, FINAL_POS, ruleText } from "./board";
import type { DieFace, GameState, LogEntry, Player, RankingEntry } from "./types";

export const PLAYER_COLORS = ["#a3301f", "#35507a", "#3c6b52", "#a9853f"];

/** 清代升官图以陀螺四德定升贬，此处按民间常见配比设定权重 */
const FACE_WEIGHTS: Array<{ face: DieFace; weight: number }> = [
  { face: "de", weight: 30 },
  { face: "cai", weight: 30 },
  { face: "gong", weight: 20 },
  { face: "zang", weight: 20 },
];

export function rollFace(): DieFace {
  const total = FACE_WEIGHTS.reduce((sum, item) => sum + item.weight, 0);
  let n = Math.random() * total;
  for (const item of FACE_WEIGHTS) {
    n -= item.weight;
    if (n < 0) return item.face;
  }
  return "gong";
}

function nextLogId(logs: LogEntry[]): number {
  return (logs[0]?.id ?? 0) + 1;
}

function makeLog(
  logs: LogEntry[],
  entry: Omit<LogEntry, "id">,
): LogEntry {
  return { id: nextLogId(logs), ...entry };
}

export function createGame(names: string[]): GameState {
  const players: Player[] = names.map((name, index) => ({
    id: index,
    name: name.trim() || `第${index + 1}位`,
    pos: 0,
    rolls: 0,
    skip: 0,
  }));

  return {
    players,
    turn: 0,
    round: 1,
    logs: [
      {
        id: 1,
        playerId: -1,
        playerName: "司仪",
        from: 0,
        to: 0,
        kind: "system",
        text: `开印：${players.length} 位自白丁起家，逐鹿相位。`,
      },
    ],
    status: "playing",
    ranking: [],
    lastFace: null,
    lastMessage: "请首座掷骰。",
  };
}

export function currentPlayer(state: GameState): Player {
  return state.players[state.turn];
}

function computeRanking(players: Player[]): RankingEntry[] {
  return [...players]
    .sort((a, b) => b.pos - a.pos || a.rolls - b.rolls)
    .map((player, index) => ({
      playerId: player.id,
      name: player.name,
      pos: player.pos,
      rolls: player.rolls,
      rank: index + 1,
    }));
}

function describeMove(
  playerName: string,
  from: number,
  face: DieFace,
  move: number,
  to: number,
): string {
  const fromCell = BOARD[from];
  const faceLabel = FACE_META[face].label;
  if (move > 0) {
    return `${playerName}：${fromCell.name} · ${faceLabel} · 进 ${move} 格 → ${BOARD[to].name}`;
  }
  if (move < 0) {
    const blocked = from === 0;
    return `${playerName}：${fromCell.name} · ${faceLabel} · 退 ${-move} 格 → ${
      BOARD[to].name
    }${blocked ? "（已为民，无官可降）" : ""}`;
  }
  return `${playerName}：${fromCell.name} · ${faceLabel} · 留任`;
}

/** 结算一次掷骰。face 可由 UI 预先生成以配合动画 */
export function spin(state: GameState, face: DieFace = rollFace()): GameState {
  if (state.status === "finished") return state;

  const players = state.players.map((player) => ({ ...player }));
  const player = players[state.turn];
  const cell = BOARD[player.pos];
  const rule = cell.rules[face];
  const from = player.pos;
  const to = Math.min(FINAL_POS, Math.max(0, from + rule.move));
  const logs = state.logs;

  player.pos = to;
  player.rolls += 1;
  if (rule.skip) player.skip += rule.skip;

  const moveLog = makeLog(logs, {
    playerId: player.id,
    playerName: player.name,
    face,
    from,
    to,
    kind: "move",
    text: describeMove(player.name, from, face, rule.move, to),
  });

  let nextLogs = [moveLog, ...logs];
  let lastMessage = `${FACE_META[face].label} · ${ruleText(rule)}`;

  if (player.skip > 0 && rule.skip) {
    const skipLog = makeLog(nextLogs, {
      playerId: player.id,
      playerName: player.name,
      face,
      from: to,
      to,
      kind: "skip",
      text: `${player.name}：罚停 ${player.skip} 巡（${ruleText(rule)}）`,
    });
    nextLogs = [skipLog, ...nextLogs];
  }

  if (to === FINAL_POS) {
    const finishLog = makeLog(nextLogs, {
      playerId: player.id,
      playerName: player.name,
      from,
      to,
      kind: "finish",
      text: `${player.name} 拜相入阁，位极人臣，本局告竣！`,
    });
    return {
      ...state,
      players,
      logs: [finishLog, ...nextLogs],
      status: "finished",
      ranking: computeRanking(players),
      lastFace: face,
      lastMessage: `${player.name} 拜相！`,
    };
  }

  // 移交给下一位未被罚停的玩家
  let turn = state.turn;
  let round = state.round;
  let guard = 0;
  while (guard < players.length * 4) {
    guard += 1;
    turn = (turn + 1) % players.length;
    if (turn === 0) round += 1;
    const next = players[turn];
    if (next.skip > 0) {
      next.skip -= 1;
      const skipLog = makeLog(nextLogs, {
        playerId: next.id,
        playerName: next.name,
        face: undefined,
        from: next.pos,
        to: next.pos,
        kind: "skip",
        text: `${next.name}：罚停一巡（尚余 ${next.skip} 巡）`,
      });
      nextLogs = [skipLog, ...nextLogs];
      continue;
    }
    break;
  }

  return {
    ...state,
    players,
    turn,
    round,
    logs: nextLogs,
    lastFace: face,
    lastMessage,
  };
}
