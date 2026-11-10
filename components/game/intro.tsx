import { cn } from "@/lib/utils";

const SECTION_MARK = (
  <span className="mr-2 inline-block h-3 w-3 translate-y-[1px] rounded-[1px] bg-[#a3301f]" />
);

export function Intro({ className, hideHeading = false }: { className?: string; hideHeading?: boolean }) {
  return (
    <section className={cn("mt-10", className)}>
      {hideHeading ? null : (
        <div className="mb-4 flex items-baseline gap-3">
          <h2 className="seal-title text-xl">图说</h2>
          <span className="text-[11px] tracking-[0.2em] text-ink-soft">玩法 · 源流 · 品阶</span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <article className="paper-card rounded-sm p-5">
          <h3 className="flex items-center text-sm text-ink">{SECTION_MARK}玩法四则</h3>
          <ol className="mt-3 space-y-2.5 text-[12.5px] leading-relaxed text-ink-soft">
            <li>
              <span className="mr-1 text-cinnabar">一</span>
              择二至四人，各自定名，同自「白丁」起家。
            </li>
            <li>
              <span className="mr-1 text-cinnabar">二</span>
              依座次轮流掷骰，骰为四德陀螺：德、才、功、赃。
            </li>
            <li>
              <span className="mr-1 text-cinnabar">三</span>
              所停之格各载四德升降之例，掷得何字，即依此字进退；遇罚停者次巡免掷。
            </li>
            <li>
              <span className="mr-1 text-cinnabar">四</span>
              先登「宰相·太师」者拜相，本局告竣，余者依官阶定名次。
            </li>
          </ol>
        </article>

        <article className="paper-card rounded-sm p-5">
          <h3 className="flex items-center text-sm text-ink">{SECTION_MARK}源流小考</h3>
          <div className="mt-3 space-y-3 text-[12.5px] leading-[1.95] text-ink-soft">
            <p>
              升官图相传起于唐，宋人称为「彩选」「选官图」，以骰子比色定迁转；至清代，遂成岁朝（元旦）阖家所行的博戏，与「览胜图」「百官铎」并称盘戏。
            </p>
            <p>
              其法以陀螺四面分书德、才、功、赃：德为最优，才次之，功又次之，赃则贬黜；每格各有升降之例，故同一掷而所处之位不同，吉凶亦异。
            </p>
            <p>
              旧时仕宦人家借此为子弟讲官制、明荣辱。今复其盘格，以四德代骰，规矩依旧而无需纸笔。
            </p>
          </div>
        </article>

        <article className="paper-card rounded-sm p-5">
          <h3 className="flex items-center text-sm text-ink">{SECTION_MARK}品阶与盘路</h3>
          <div className="mt-3 space-y-2 text-[12.5px] leading-relaxed text-ink-soft">
            <p>
              清代官阶分九品十八级，自正一品至从九品；未入流者，则为白丁、童生、生员之属。
            </p>
            <div className="space-y-1.5 pt-1">
              {[
                { label: "科举", text: "白丁 → 童生 → 生员 → 举人 → 贡士 → 进士 → 状元" },
                { label: "词林", text: "编修 → 侍读学士 → 祭酒 → 内阁学士" },
                { label: "外官", text: "知县 → 知府 → 道员 → 按察使 → 布政使 → 督抚" },
                { label: "部院", text: "侍郎 → 左都御史 → 刑、兵、吏部尚书" },
                { label: "禁旅", text: "八旗都统" },
                { label: "极臣", text: "殿阁大学士 → 宰相·太师" },
              ].map((item) => (
                <div key={item.label} className="flex gap-2">
                  <span className="w-8 shrink-0 text-cinnabar">{item.label}</span>
                  <span className="text-[11.5px] leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>
            <p className="pt-1 text-[11px]">
              官职愈高，德才之益愈缓，犯赃之罚愈重——此亦旧谱「高处不胜寒」之意。
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
