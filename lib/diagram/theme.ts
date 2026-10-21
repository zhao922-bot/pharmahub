import type { DiagramNodeRole } from "@/lib/types";

/**
 * 机制图语义配色。
 *
 * 靶点、作用过程与效应各固定一种颜色，全库统一并在图例中说明。
 * 此处定义颜色值，渲染器转为 CSS 变量，服务端与深浅主题共用同一语义。
 *
 * 深浅两套配色：
 * - 浅色下用较深的描边 + 浅填充，保证文字对比度 ≥ 4.5:1
 * - 深色下描边提亮、填充变深，否则原色在深色背景上会糊成一片
 *
 * 切换方式：根元素加 .dark 类时由 CSS 覆盖（见 mechanism-diagram 的 <style>）。
 * 这里同时导出两套值，供内联样式与 CSS 变量使用。
 */
export interface RoleStyle {
  fill: string;
  stroke: string;
  text: string;
  accent: string;
  legendKey: DiagramNodeRole;
}

export const ROLE_STYLES: Record<DiagramNodeRole, RoleStyle> = {
  drug: {
    fill: "#eef2f8",
    stroke: "#94a6c0",
    text: "#1e3350",
    accent: "#64748b",
    legendKey: "drug",
  },
  target: {
    fill: "#e8edfb",
    stroke: "#4a5fc1",
    text: "#26306e",
    accent: "#4a5fc1",
    legendKey: "target",
  },
  signal: {
    fill: "#e3f4f1",
    stroke: "#1f8f7d",
    text: "#0f4f45",
    accent: "#1f8f7d",
    legendKey: "signal",
  },
  effect: {
    fill: "#fdf1e0",
    stroke: "#c07a1d",
    text: "#6b3f08",
    accent: "#c07a1d",
    legendKey: "effect",
  },
};

/** 深色模式下的配色：描边提亮、填充压暗、文字改为浅色 */
export const ROLE_STYLES_DARK: Record<DiagramNodeRole, RoleStyle> = {
  drug: {
    fill: "#1f2a3a",
    stroke: "#7d8ea6",
    text: "#dbe4ef",
    accent: "#94a3b8",
    legendKey: "drug",
  },
  target: {
    fill: "#1e2a52",
    stroke: "#8fa2f0",
    text: "#dde3ff",
    accent: "#8fa2f0",
    legendKey: "target",
  },
  signal: {
    fill: "#123a35",
    stroke: "#5cc9b4",
    text: "#d3f5ee",
    accent: "#5cc9b4",
    legendKey: "signal",
  },
  effect: {
    fill: "#3a2a12",
    stroke: "#e5a955",
    text: "#ffe9c9",
    accent: "#e5a955",
    legendKey: "effect",
  },
};

/** 图例展示顺序：固定，避免不同卡片图例顺序不一致 */
export const LEGEND_ORDER: readonly DiagramNodeRole[] = ["drug", "target", "signal", "effect"];

/** 连线颜色：激活与抑制使用不同色，并配合箭头/平头双重区分（不依赖颜色单独传达信息） */
export const EDGE_STYLES = {
  flow: { stroke: "#4b6478", dashArray: undefined },
  activate: {
    stroke: "#4b6478",
    dashArray: undefined,
  },
  inhibit: {
    stroke: "#a3442f",
    dashArray: "5 3",
  },
} as const;

/** 深色模式下的连线颜色 */
export const EDGE_STYLES_DARK = {
  flow: { stroke: "#93a8bd", dashArray: undefined },
  activate: {
    stroke: "#93a8bd",
    dashArray: undefined,
  },
  inhibit: {
    stroke: "#e08a72",
    dashArray: "5 3",
  },
} as const;

/**
 * 把配色表转成 CSS 自定义属性声明。
 *
 * 渲染器在 SVG 里引用 var(--ph-target-fill) 这样的变量，
 * 深色模式下由 .dark 覆盖，无需重新计算布局或重渲染 SVG。
 */
export function roleStylesToCssVars(
  styles: Record<DiagramNodeRole, RoleStyle>,
  edgeStyles: { activate: { stroke: string }; inhibit: { stroke: string }; flow: { stroke: string } },
): string {
  const lines: string[] = [];
  for (const [role, style] of Object.entries(styles)) {
    lines.push(`--ph-${role}-fill:${style.fill}`);
    lines.push(`--ph-${role}-stroke:${style.stroke}`);
    lines.push(`--ph-${role}-text:${style.text}`);
  }
  lines.push(`--ph-edge-activate:${edgeStyles.activate.stroke}`);
  lines.push(`--ph-edge-inhibit:${edgeStyles.inhibit.stroke}`);
  lines.push(`--ph-edge-flow:${edgeStyles.flow.stroke}`);
  return lines.join(";");
}

/** 连线标签的描边底色：浅色模式用白，深色模式用卡片底色 */
export const LABEL_HALO_LIGHT = "#ffffff";
export const LABEL_HALO_DARK = "#1b2430";
