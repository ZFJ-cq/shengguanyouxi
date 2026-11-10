export type DieFace = "de" | "cai" | "gong" | "zang";

export type CellGroup = "exam" | "hanlin" | "central" | "local" | "court" | "peak";

export interface FaceRule {
  /** 正数为进格，负数为退格，0 为留任 */
  move: number;
  /** 罚停巡数 */
  skip?: number;
  /** 自定义规则说明 */
  text?: string;
}

export interface BoardCell {
  id: number;
  name: string;
  rank: string;
  group: CellGroup;
  note: string;
  rules: Record<DieFace, FaceRule>;
}

export interface Player {
  id: number;
  name: string;
  pos: number;
  rolls: number;
  skip: number;
}

export interface LogEntry {
  id: number;
  playerId: number;
  playerName: string;
  face?: DieFace;
  from: number;
  to: number;
  text: string;
  kind: "move" | "skip" | "system" | "finish";
}

export interface RankingEntry {
  playerId: number;
  name: string;
  pos: number;
  rolls: number;
  rank: number;
}

export interface GameState {
  players: Player[];
  turn: number;
  round: number;
  logs: LogEntry[];
  status: "playing" | "finished";
  ranking: RankingEntry[];
  lastFace: DieFace | null;
  lastMessage: string;
}
