import type { BoardCell, CellGroup, DieFace, FaceRule } from "./types";

const move = (n: number, extra: Partial<FaceRule> = {}): FaceRule => ({ move: n, ...extra });

/** 各仕途阶段的四维骰规则底本 */
const TIER: Record<CellGroup, Record<DieFace, FaceRule>> = {
  exam: {
    de: move(4),
    cai: move(3),
    gong: move(2),
    zang: move(-2),
  },
  hanlin: {
    de: move(4),
    cai: move(3),
    gong: move(2),
    zang: move(-3),
  },
  central: {
    de: move(4),
    cai: move(3),
    gong: move(2),
    zang: move(-4),
  },
  local: {
    de: move(4),
    cai: move(3),
    gong: move(2),
    zang: move(-4),
  },
  court: {
    de: move(4),
    cai: move(3),
    gong: move(2),
    zang: move(-6),
  },
  peak: {
    de: move(5),
    cai: move(3),
    gong: move(2),
    zang: move(-8),
  },
};

interface Seed {
  name: string;
  rank: string;
  group: CellGroup;
  note: string;
  over?: Partial<Record<DieFace, FaceRule>>;
}

const SEEDS: Seed[] = [
  {
    name: "白丁",
    rank: "无品",
    group: "exam",
    note: "未入仕的平民。升官图以白丁为起点，一切功名自此而始，故虽无官可革，亦无损可贬。",
    over: { zang: move(0, { skip: 1, text: "无官可革，罚停一巡" }) },
  },
  {
    name: "童生",
    rank: "无品",
    group: "exam",
    note: "应过县试、府试、院试而未取者，读书人的通称。虽未得功名，已列士林。",
  },
  {
    name: "生员",
    rank: "无品",
    group: "exam",
    note: "即秀才。院试录取后入府、州、县学，可免差徭，见官不跪，是正途的起点。",
  },
  {
    name: "举人",
    rank: "无品",
    group: "exam",
    note: "乡试中试者。取得选官资格，可授教职、知县，亦可继续会试搏进士。",
  },
  {
    name: "贡士",
    rank: "无品",
    group: "exam",
    note: "会试中试者，取得殿试资格。殿试不黜落，只定甲第名次。",
  },
  {
    name: "进士",
    rank: "正七品出身",
    group: "exam",
    note: "殿试录取者。一甲赐进士及第，二甲赐进士出身，三甲赐同进士出身，为正途之最。",
  },
  {
    name: "状元及第",
    rank: "从六品",
    group: "exam",
    note: "殿试一甲第一，授翰林院修撰。跨马游街、御赐簪花，是士人一生的最高荣耀。",
    over: { gong: move(3), zang: move(-3) },
  },
  {
    name: "翰林院编修",
    rank: "正七品",
    group: "hanlin",
    note: "由庶吉士散馆授职，掌修国史、实录。翰林院为储才之地，升转较他途为速。",
  },
  {
    name: "侍读学士",
    rank: "从四品",
    group: "hanlin",
    note: "掌进讲经史、校阅典籍，常侍君侧，号清要之职，最易简放。",
  },
  {
    name: "国子监祭酒",
    rank: "从四品",
    group: "hanlin",
    note: "国子监最高长官，掌国学政令，为天下士子之师，士林望之如泰山北斗。",
  },
  {
    name: "内阁学士",
    rank: "从二品",
    group: "hanlin",
    note: "掌票拟批答、参赞机务，为入阁之阶。能列名内阁者，已近中枢。",
  },
  {
    name: "吏部侍郎",
    rank: "正二品",
    group: "central",
    note: "吏部副长官，掌文官铨选、升调黜陟。六部之中，吏部权重，侍郎之缺常争。",
  },
  {
    name: "知县",
    rank: "正七品",
    group: "local",
    note: "一县之长，掌钱粮、刑名、教化，号称亲民之官。京官外放知县，多视为迁谪。",
    over: { zang: move(-3, { text: "贪墨被参，革职留任" }) },
  },
  {
    name: "知州",
    rank: "从五品",
    group: "local",
    note: "州之长官，位略高于知县，掌一州政事，散州多与县同，直隶州则比府。",
  },
  {
    name: "同知",
    rank: "正五品",
    group: "local",
    note: "知府的佐贰官，分掌粮捕、水利、海防诸事，俗称二府。",
    over: { zang: move(-2, { skip: 1, text: "降调候补，罚停一巡" }) },
  },
  {
    name: "知府",
    rank: "从四品",
    group: "local",
    note: "一府之长，承上启下，掌属县治理与赋税，是地方治乱的关键一任。",
  },
  {
    name: "盐运使",
    rank: "从三品",
    group: "local",
    note: "掌盐政、盐课与盐引。清代最肥之缺，也最易招物议，盐案一发往往倾家。",
    over: { zang: move(-3, { skip: 1, text: "盐案发，革职候审" }) },
  },
  {
    name: "道员",
    rank: "正四品",
    group: "local",
    note: "分守、分巡各道长官，介于省与府之间，俗称道台，多兼兵备、粮储之衔。",
  },
  {
    name: "按察使",
    rank: "正三品",
    group: "local",
    note: "一省司法长官，掌刑名按劾、驿传，俗称臬台，与布政使并称两司。",
  },
  {
    name: "布政使",
    rank: "从二品",
    group: "local",
    note: "一省民政财政长官，掌钱粮、户版、条陈政令，俗称藩台，位在巡抚之下。",
  },
  {
    name: "巡抚",
    rank: "从二品",
    group: "local",
    note: "一省最高长官，掌军政民政，例加兵部侍郎衔。封疆之任，自此始。",
    over: { zang: move(-5, { text: "失察褫职，降为藩司" }) },
  },
  {
    name: "漕运总督",
    rank: "正二品",
    group: "local",
    note: "总管南粮北运，辖漕船、漕丁与沿途卫所，事关京师粮储，为天下第一等要缺。",
  },
  {
    name: "河道总督",
    rank: "正二品",
    group: "local",
    note: "总理河道疏浚与堤防。清代河工岁费巨万，责任綦重，功成则加衔，溃决则严谴。",
  },
  {
    name: "两江总督",
    rank: "正二品",
    group: "local",
    note: "辖江苏、安徽、江西三省，财赋甲于天下，例兼两淮盐政，为督抚之首。",
  },
  {
    name: "直隶总督",
    rank: "正二品",
    group: "local",
    note: "辖京畿，例兼北洋大臣，居天下督抚之首，入觐最便，议政最重。",
    over: { zang: move(-6, { text: "辇毂之下犯赃，褫职拿问" }) },
  },
  {
    name: "都察院左都御史",
    rank: "从一品",
    group: "central",
    note: "都察院长官，掌纠劾百司、风闻奏事，与刑部、大理寺共理大狱，号称言官之长。",
    over: { zang: move(-6, { text: "风宪官犯赃，罪加一等" }) },
  },
  {
    name: "刑部尚书",
    rank: "从一品",
    group: "central",
    note: "刑部长官，掌天下刑名。与都察院、大理寺合称三法司，秋审、朝审皆司其职。",
  },
  {
    name: "兵部尚书",
    rank: "从一品",
    group: "central",
    note: "兵部长官，掌武职选授、军械、驿传。有战事则与军机大臣共筹方略。",
  },
  {
    name: "吏部尚书",
    rank: "从一品",
    group: "central",
    note: "吏部长官，掌文官黜陟。六部之首，一纸部议可定百僚荣辱。",
    over: { zang: move(-10, { text: "卖官鬻爵，抄家流放" }) },
  },
  {
    name: "八旗都统",
    rank: "从一品",
    group: "court",
    note: "八旗各旗最高统兵官，掌旗务、户籍与兵丁，非勋旧不能居之。",
    over: { zang: move(-8, { text: "侵饷革旗，发往军台" }) },
  },
  {
    name: "保和殿大学士",
    rank: "正一品",
    group: "peak",
    note: "殿阁大学士之首，掌票拟、承旨，俗称相国。位极人臣，非资深望重者不授。",
    over: { zang: move(-12, { text: "权相倾覆，追夺封典" }) },
  },
  {
    name: "宰相·太师",
    rank: "正一品",
    group: "peak",
    note: "位极人臣，一人之下。升官图以此为终局，得之者拜相封侯，名垂竹帛。",
    over: {
      de: move(0, { text: "已极人臣，无阶可升" }),
      cai: move(0, { text: "已极人臣，无阶可升" }),
      gong: move(0, { text: "已极人臣，无阶可升" }),
      zang: move(0, { text: "已极人臣，无阶可升" }),
    },
  },
];

export const BOARD: BoardCell[] = SEEDS.map((seed, id) => ({
  id,
  name: seed.name,
  rank: seed.rank,
  group: seed.group,
  note: seed.note,
  rules: { ...TIER[seed.group], ...seed.over },
}));

export const BOARD_COLS = 8;
export const BOARD_ROWS = Math.ceil(BOARD.length / BOARD_COLS);
export const FINAL_POS = BOARD.length - 1;

export const GROUP_META: Record<CellGroup, { label: string; color: string }> = {
  exam: { label: "科举", color: "#3c6b52" },
  hanlin: { label: "词林", color: "#35507a" },
  central: { label: "部院", color: "#6d4256" },
  local: { label: "外官", color: "#8d5a2f" },
  court: { label: "禁旅", color: "#4a4a55" },
  peak: { label: "极臣", color: "#a3301f" },
};

export const FACE_META: Record<
  DieFace,
  { label: string; color: string; hint: string; meaning: string }
> = {
  de: {
    label: "德",
    color: "#2f6b5e",
    hint: "清正廉明",
    meaning: "德行卓著，考语上上，例得优叙升迁。",
  },
  cai: {
    label: "才",
    color: "#35507a",
    hint: "才具优长",
    meaning: "才干出众，位列上考，循例升转。",
  },
  gong: {
    label: "功",
    color: "#a9853f",
    hint: "劳绩可录",
    meaning: "积有劳绩，议叙加级，升迁稍缓。",
  },
  zang: {
    label: "赃",
    color: "#3a332c",
    hint: "贪墨败检",
    meaning: "贪赃枉法，例应参革，降调甚至褫职为民。",
  },
};

export function ruleText(rule: FaceRule): string {
  if (rule.text) return rule.text;
  if (rule.move > 0) return `进 ${rule.move} 格`;
  if (rule.move < 0) return `退 ${-rule.move} 格`;
  return "留任";
}

export function cellCoord(index: number, cols: number = BOARD_COLS): { row: number; col: number } {
  const row = Math.floor(index / cols);
  const offset = index % cols;
  const col = row % 2 === 0 ? offset : cols - 1 - offset;
  return { row, col };
}

/** 紧凑写法：+4 / -4 / 停1，供手机端窄条使用 */
export function ruleShort(rule: FaceRule): string {
  if (rule.move > 0) return `+${rule.move}`;
  if (rule.move < 0) return `${rule.move}`;
  if (rule.skip) return `停${rule.skip}`;
  return "留";
}
