import { legend } from "@/lib/copy";
import type { DiagramEdge, DiagramNodeRole, DiagramSpec } from "@/lib/types";
import { layoutDiagram, type LaidOutEdge, type LaidOutNode } from "@/lib/diagram/layout";
import {
  EDGE_STYLES,
  EDGE_STYLES_DARK,
  LABEL_HALO_DARK,
  LABEL_HALO_LIGHT,
  LEGEND_ORDER,
  ROLE_STYLES,
  ROLE_STYLES_DARK,
  roleStylesToCssVars,
} from "@/lib/diagram/theme";

/**
 * 机制示意图渲染器。
 *
 * 这是一个**服务端组件**：SVG 在构建期（或请求期）生成好，
 * 不向客户端发送任何 JS，因此 20 张图对首屏性能几乎没有影响。
 *
 * 深色模式的处理：
 * 颜色不直接写死在 SVG 属性上，而是通过 CSS 自定义属性引用。
 * 浅色与深色两套值都写进同一段 <style>，切换主题时只改 .dark 类，
 * SVG 无需重新渲染——既避免了服务端为两种主题各渲染一遍，
 * 也避免了客户端水合时闪烁。
 */
export function MechanismDiagram({ spec }: { spec: DiagramSpec }) {
  const layout = layoutDiagram(spec);

  const description = `${spec.title}。共 ${spec.nodes.length} 个环节：${spec.nodes
    .map((node) => node.label)
    .join("、")}。`;

  const lightVars = roleStylesToCssVars(ROLE_STYLES, EDGE_STYLES);
  const darkVars = roleStylesToCssVars(ROLE_STYLES_DARK, EDGE_STYLES_DARK);

  return (
    <figure className="space-y-3">
      <figcaption className="text-sm font-semibold text-foreground/80">
        {spec.title}
      </figcaption>

      {/* 主题变量：浅色为默认值，.dark 下覆盖 */}
      <style>{`
.ph-diagram{${lightVars};--ph-label-halo:${LABEL_HALO_LIGHT}}
.dark .ph-diagram{${darkVars};--ph-label-halo:${LABEL_HALO_DARK}}
`}</style>

      <div className="ph-diagram overflow-hidden rounded-lg border border-border bg-card">
        <svg
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          width="100%"
          role="img"
          aria-label={description}
          className="block h-auto w-full"
          style={{ maxHeight: 640 }}
        >
          <defs>
            <marker id="ph-arrow-flow" viewBox="0 0 10 10" refX="8.5" refY="5"
              markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
              <path d="M 1 1 L 9 5 L 1 9 z" style={{ fill: "var(--ph-edge-flow)" }} />
            </marker>
            <marker
              id="ph-arrow-activate"
              viewBox="0 0 10 10"
              refX="8.5"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
              markerUnits="userSpaceOnUse"
            >
              <path d="M 1 1 L 9 5 L 1 9 z" style={{ fill: "var(--ph-edge-activate)" }} />
            </marker>
            <marker
              id="ph-arrow-inhibit"
              viewBox="0 0 10 10"
              refX="8.5"
              refY="5"
              markerWidth="9"
              markerHeight="9"
              orient="auto-start-reverse"
              markerUnits="userSpaceOnUse"
            >
              <line
                x1="6.5"
                y1="1.5"
                x2="6.5"
                y2="8.5"
                strokeWidth="2.2"
                strokeLinecap="round"
                style={{ stroke: "var(--ph-edge-inhibit)" }}
              />
            </marker>
          </defs>

          {layout.edges.map((edge, index) => (
            <Edge key={`${edge.from}-${edge.to}-${index}`} edge={edge} />
          ))}

          {layout.nodes.map((node) => (
            <Node key={node.id} node={node} />
          ))}
        </svg>
      </div>

      <Legend roles={layout.rolesInUse} kinds={Array.from(new Set(spec.edges.map((edge) => edge.kind)))} />
      <p className="text-xs leading-relaxed text-muted-foreground">
        顺序箭头表示所选作用主线中的联系，不等同于直接激活或严格的时间先后；并行作用、未明机制及临床限制见正文。
      </p>
    </figure>
  );
}

function Edge({ edge }: { edge: LaidOutEdge }) {
  const markerId = `ph-arrow-${edge.kind}`;
  const d = buildRoundedPath(edge.points);
  const strokeVar =
    `var(--ph-edge-${edge.kind})`;

  return (
    <g>
      <path
        d={d}
        fill="none"
        strokeWidth="1.6"
        strokeDasharray={EDGE_STYLES[edge.kind].dashArray}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={`url(#${markerId})`}
        style={{ stroke: strokeVar }}
      />
      {edge.label ? <EdgeLabel edge={edge} kind={edge.kind} /> : null}
    </g>
  );
}

/**
 * 把折线点转换成带圆角的路径。
 * 直角折线在视觉上偏"工程图"，加一点圆角更柔和，也更符合机制图的调性。
 */
function buildRoundedPath(points: Array<{ x: number; y: number }>, radius = 8): string {
  const [first, ...rest] = points;
  if (!first) return "";
  if (rest.length === 0) return `M ${first.x} ${first.y}`;

  let d = `M ${first.x} ${first.y}`;
  let prev = first;

  rest.forEach((point, index) => {
    const isLast = index === rest.length - 1;
    if (isLast) {
      d += ` L ${point.x} ${point.y}`;
      prev = point;
      return;
    }

    const next = rest[index + 1];
    if (!next) {
      d += ` L ${point.x} ${point.y}`;
      prev = point;
      return;
    }

    const inDx = point.x - prev.x;
    const inDy = point.y - prev.y;
    const outDx = next.x - point.x;
    const outDy = next.y - point.y;
    const inLen = Math.hypot(inDx, inDy);
    const outLen = Math.hypot(outDx, outDy);

    if (inLen < 0.01 || outLen < 0.01) {
      d += ` L ${point.x} ${point.y}`;
      prev = point;
      return;
    }

    const r = Math.min(radius, inLen / 2, outLen / 2);
    const beforeX = point.x - (inDx / inLen) * r;
    const beforeY = point.y - (inDy / inLen) * r;
    const afterX = point.x + (outDx / outLen) * r;
    const afterY = point.y + (outDy / outLen) * r;

    d += ` L ${beforeX} ${beforeY} Q ${point.x} ${point.y} ${afterX} ${afterY}`;
    prev = point;
  });

  return d;
}

/**
 * 连线标签。
 *
 * 文字用主题色，但描边底必须跟随背景——浅色下白底、深色下深色底，
 * 否则深色模式下会出现一圈突兀的白边。
 */
function EdgeLabel({ edge, kind }: { edge: LaidOutEdge; kind: DiagramEdge["kind"] }) {
  if (!edge.labelAnchor) return null;
  const { x, y } = edge.labelAnchor;
  const strokeVar = `var(--ph-edge-${kind})`;

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize="10"
      strokeWidth="3"
      paintOrder="stroke"
      style={{
        fontWeight: 500,
        fill: strokeVar,
        stroke: "var(--ph-label-halo)",
      }}
    >
      {edge.label}
    </text>
  );
}

function Node({ node }: { node: LaidOutNode }) {
  const centerX = node.x + node.width / 2;
  const lineHeight = 15;

  const firstLineY =
    node.y + node.height / 2 - ((node.lines.length - 1) * lineHeight) / 2 + 4;

  return (
    <g>
      <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        rx={8}
        strokeWidth="1.25"
        style={{
          fill: `var(--ph-${node.role}-fill)`,
          stroke: `var(--ph-${node.role}-stroke)`,
        }}
      />
      {node.lines.map((line, index) => (
        <text
          key={`${node.id}-line-${index}`}
          x={centerX}
          y={firstLineY + index * lineHeight}
          textAnchor="middle"
          fontSize="12"
          style={{ fontWeight: 600, fill: `var(--ph-${node.role}-text)` }}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

/** 图例：只显示这张图实际用到的语义角色，顺序固定 */
function Legend({ roles, kinds }: { roles: DiagramNodeRole[]; kinds: DiagramEdge["kind"][] }) {
  const ordered = LEGEND_ORDER.filter((role) => roles.includes(role));
  if (ordered.length === 0) return null;

  return (
    <div className="ph-diagram flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <span className="text-[11px] text-muted-foreground">{legend.title}</span>
      {ordered.map((role) => (
        <span key={role} className="inline-flex items-center gap-1">
          <span
            aria-hidden="true"
            className="inline-block h-2.5 w-2.5 rounded-[3px] border"
            style={{
              backgroundColor: `var(--ph-${role}-fill)`,
              borderColor: `var(--ph-${role}-stroke)`,
            }}
          />
          <span className="text-[11px] text-muted-foreground">{legend[role]}</span>
        </span>
      ))}
      {kinds.includes("flow") && <span className="inline-flex items-center gap-1">
        <svg width="16" height="8" aria-hidden="true" className="shrink-0">
          <path d="M0 4 H13 M10 1 L14 4 L10 7" fill="none" strokeWidth="1.5" style={{ stroke: "var(--ph-edge-flow)" }} />
        </svg>
        <span className="text-[11px] text-muted-foreground">{legend.flow}</span>
      </span>}
      {kinds.includes("activate") && <span className="inline-flex items-center gap-1">
        <svg width="16" height="8" aria-hidden="true" className="shrink-0">
          <line
            x1="0"
            y1="4"
            x2="16"
            y2="4"
            strokeWidth="1.5"
            style={{ stroke: "var(--ph-edge-activate)" }}
          />
        </svg>
        <span className="text-[11px] text-muted-foreground">{legend.activate}</span>
      </span>}
      {kinds.includes("inhibit") && <span className="inline-flex items-center gap-1">
        <svg width="16" height="8" aria-hidden="true" className="shrink-0">
          <line
            x1="0"
            y1="4"
            x2="16"
            y2="4"
            strokeWidth="1.5"
            strokeDasharray="5 3"
            style={{ stroke: "var(--ph-edge-inhibit)" }}
          />
        </svg>
        <span className="text-[11px] text-muted-foreground">{legend.inhibit}</span>
      </span>}
    </div>
  );
}
