import { heatmap as heatmapCopy } from "@/lib/copy";
import {
  buildHeatmapGrid,
  countToLevel,
  DAYS_PER_WEEK,
  type HeatCell,
  type HeatLevel,
} from "@/lib/review/heatmap";
import { cn } from "@/lib/utils";

/**
 * 学习热力图。
 *
 * 服务端组件：数据在请求期查好，网格在服务端算完，客户端不承担计算。
 * 交互只有 CSS hover 的原生 title 提示，因此不需要任何 JS。
 *
 * 移动端取舍：
 * 26 周 × 7 天 = 182 个格子，在 375px 宽度下每个格子约 9px。
 * 直接用 flex 会让格子被挤压变形，所以用 `overflow-x-auto` 横向滚动，
 * 并让格子保持固定尺寸——可读性优先于「一屏看全」。
 * 移动端默认滚到最右（最近的日期），因为那才是用户最关心的。
 */
export function StudyHeatmap({
  dailyCounts,
  today,
  weeks = 26,
}: {
  dailyCounts: ReadonlyArray<{ date: string; count: number }>;
  today: Date;
  weeks?: number;
}) {
  const grid = buildHeatmapGrid(dailyCounts, today, weeks);

  return (
    <section aria-labelledby="heatmap-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="heatmap-heading" className="text-sm font-semibold tracking-tight">
          {heatmapCopy.title}
        </h2>
        <p className="text-[11px] text-muted-foreground">
          {heatmapCopy.subtitle(weeks)}
        </p>
      </div>

      {/* 概览数字 */}
      <dl className="mt-3 grid grid-cols-3 gap-2">
        <div>
          <dt className="text-[11px] text-muted-foreground">{heatmapCopy.totalReviews}</dt>
          <dd className="mt-0.5 text-lg font-semibold leading-none tabular-nums">
            {grid.totalCount}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-muted-foreground">{heatmapCopy.activeDays}</dt>
          <dd className="mt-0.5 text-lg font-semibold leading-none tabular-nums">
            {grid.activeDays}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-muted-foreground">{heatmapCopy.longestStreak}</dt>
          <dd className="mt-0.5 text-lg font-semibold leading-none tabular-nums">
            {grid.longestStreak}
          </dd>
        </div>
      </dl>

      {/* 网格：移动端横向滚动 */}
      {/*
        dir="rtl" 是为了让滚动条初始停在最右侧（最近的日期）——RTL 容器的
        滚动原点在右边。内层再设回 ltr，保证各周仍按时间从左到右排列。
        这是纯 CSS 方案，不需要客户端 JS 去 scrollTo。
      */}
      <div
        dir="rtl"
        className="mt-4 -mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:thin]"
      >
        <div dir="ltr" className="inline-block min-w-full">
          {/* 月份标签：只在月份变化时显示，用 nowrap 避免被列宽挤成两行 */}
          <div className="mb-1 flex gap-[3px]" aria-hidden="true">
            {grid.weeks.map((week, index) => {
              const prev = index > 0 ? grid.weeks[index - 1]?.monthLabel : null;
              const show = week.monthLabel !== null && week.monthLabel !== prev;
              return (
                <div
                  key={`m-${index}`}
                  className="h-3 w-[11px] shrink-0 whitespace-nowrap text-[9px] leading-none text-muted-foreground"
                >
                  {show ? `${week.monthLabel}月` : ""}
                </div>
              );
            })}
          </div>

          <div className="flex gap-[3px]">
            {grid.weeks.map((week, weekIndex) => (
              <div key={`w-${weekIndex}`} className="flex flex-col gap-[3px]">
                {Array.from({ length: DAYS_PER_WEEK }, (_, dayIndex) => {
                  const cell = week.cells[dayIndex] ?? null;
                  return (
                    <HeatSquare
                      key={`c-${weekIndex}-${dayIndex}`}
                      cell={cell}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 图例 */}
      <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
        <span>{heatmapCopy.legendLess}</span>
        {([0, 1, 2, 3, 4] as HeatLevel[]).map((level) => (
          <span
            key={level}
            aria-hidden="true"
            className={cn("h-[11px] w-[11px] rounded-[2px]", levelClass(level))}
          />
        ))}
        <span>{heatmapCopy.legendMore}</span>
      </div>

      {grid.totalCount === 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">{heatmapCopy.emptyHint}</p>
      ) : null}
    </section>
  );
}

/** 等级 → 配色类名。深色模式下靠 dark: 前缀自动适配 */
function levelClass(level: HeatLevel): string {
  switch (level) {
    case 0:
      return "bg-muted";
    case 1:
      return "bg-emerald-200 dark:bg-emerald-900";
    case 2:
      return "bg-emerald-300 dark:bg-emerald-700";
    case 3:
      return "bg-emerald-500 dark:bg-emerald-500";
    case 4:
      return "bg-emerald-700 dark:bg-emerald-300";
  }
}

function HeatSquare({ cell }: { cell: HeatCell | null }) {
  // 未来日期：不渲染格子，避免被误读成「那天没学」
  if (!cell) {
    return <span className="h-[11px] w-[11px] shrink-0" aria-hidden="true" />;
  }

  const label =
    cell.count === 0
      ? heatmapCopy.dayEmpty(cell.date)
      : heatmapCopy.dayCount(cell.date, cell.count);

  return (
    <span
      title={label}
      aria-label={label}
      role="img"
      className={cn(
        "block h-[11px] w-[11px] shrink-0 rounded-[2px]",
        levelClass(cell.level),
        cell.isToday && "ring-1 ring-foreground/40 ring-offset-1 ring-offset-background",
      )}
    />
  );
}
