import type { DiagramEdge, DiagramNode, DiagramNodeRole, DiagramSpec } from "@/lib/types";

/**
 * 机制图的布局引擎。
 *
 * 设计目标：
 * 1. **纯函数**：输入 DiagramSpec，输出可渲染的几何数据，便于测试与复用。
 * 2. **纵向分层**：机制是一条因果链，自上而下阅读最符合直觉，也最省移动端宽度。
 * 3. **标签不重叠**：同一层的多条连线标签会横向错开，这是移动端可读性的关键。
 *
 * 布局策略：
 * - 按拓扑层级把节点分层（drug → target → signal → effect 天然成链）。
 * - 同一层内多个节点横向均分，节点宽度按文字长度自适应但设有上下限。
 * - 跨层连线走右侧专用通道绕行，不穿过中间节点。
 * - 连线标签沿垂直段排列，与其它标签错开。
 */

/** 画布逻辑宽度。SVG 用 viewBox 缩放，实际显示宽度由容器决定 */
export const CANVAS_WIDTH = 360;

const PADDING_X = 14;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 16;

const NODE_HEIGHT = 40;
const NODE_HEIGHT_COMPACT = 34;

/** 层间垂直间距（要容纳连线标签，因此留得较宽） */
const LAYER_GAP = 56;

/** 同层节点之间的水平间距 */
const SIBLING_GAP = 14;

const NODE_MIN_WIDTH = 88;
const NODE_MAX_WIDTH = 150;

/** 右侧绕行通道的 x 坐标 */
const CHANNEL_X = CANVAS_WIDTH - 8;

/** 节点文字字号，同时用于宽度估算 */
const NODE_FONT_SIZE = 12;

/** 连线标签字号 */
const EDGE_LABEL_FONT_SIZE = 10;

/**
 * 估算文字宽度：中文按 1em，ASCII 按 0.56em。
 * 这是近似值，但足以决定节点宽度与是否需要换行。
 */
export function estimateTextWidth(text: string, fontSize: number): number {
  let width = 0;
  for (const char of text) {
    const isWide = /[\u2E80-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF\u3000-\u303F]/.test(char);
    width += isWide ? fontSize : fontSize * 0.56;
  }
  return width;
}

export interface LaidOutNode extends DiagramNode {
  x: number;
  y: number;
  width: number;
  height: number;
  /** 换行后的文字行，最多 2 行 */
  lines: string[];
  /** 该节点所在的层级索引，0 为最上层 */
  layer: number;
}

export interface LaidOutEdge extends DiagramEdge {
  /** 折线路径点，用于生成 path d 属性 */
  points: Array<{ x: number; y: number }>;
  /** 连线标签锚点与文本；无标签时为 undefined */
  labelAnchor?: { x: number; y: number };
  fromNode: LaidOutNode;
  toNode: LaidOutNode;
  /** 是否为跨层绕行连线，渲染时可加圆角处理 */
  isDetour: boolean;
}

export interface DiagramLayout {
  width: number;
  height: number;
  nodes: LaidOutNode[];
  edges: LaidOutEdge[];
  /** 图例中实际出现的角色，只渲染用到的 */
  rolesInUse: DiagramNodeRole[];
}

/**
 * 把节点按依赖关系分层（最长路径分层）。
 *
 * 节点层级 = 其所有前驱层级最大值 + 1，保证 drug 在最上、effect 在最下。
 * 若数据存在环，迭代次数会被限制，避免死循环。
 */
function assignLayers(nodes: DiagramNode[], edges: DiagramEdge[]): Map<string, number> {
  const layerOf = new Map<string, number>();
  const incoming = new Map<string, string[]>();

  for (const node of nodes) {
    incoming.set(node.id, []);
    layerOf.set(node.id, 0);
  }
  for (const edge of edges) {
    const list = incoming.get(edge.to);
    if (list) list.push(edge.from);
  }

  let changed = true;
  let guard = 0;
  while (changed && guard <= nodes.length + 1) {
    changed = false;
    guard += 1;
    for (const node of nodes) {
      const preds = incoming.get(node.id) ?? [];
      let maxPredLayer = -1;
      for (const predId of preds) {
        const predLayer = layerOf.get(predId);
        if (predLayer !== undefined && predLayer > maxPredLayer) {
          maxPredLayer = predLayer;
        }
      }
      const candidate = maxPredLayer + 1;
      const current = layerOf.get(node.id) ?? 0;
      if (candidate > current) {
        layerOf.set(node.id, candidate);
        changed = true;
      }
    }
  }

  return layerOf;
}

/** 把一段文字拆成最多 2 行，尽量在分隔符处断开 */
function wrapLabel(label: string, maxWidth: number, fontSize: number): string[] {
  if (estimateTextWidth(label, fontSize) <= maxWidth) {
    return [label];
  }

  const breakChars = [" ", "·", "→", "，", "、", "（", "/", "+"];
  const chars = [...label];
  let bestIndex = -1;
  let bestDiff = Number.POSITIVE_INFINITY;

  for (let i = 1; i < chars.length; i += 1) {
    const char = chars[i];
    if (!char || !breakChars.includes(char)) continue;
    const head = chars.slice(0, i + 1).join("");
    const headWidth = estimateTextWidth(head, fontSize);
    if (headWidth > maxWidth) continue;
    const diff = maxWidth - headWidth;
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = i;
    }
  }

  if (bestIndex > 0) {
    return [
      chars.slice(0, bestIndex + 1).join("").trim(),
      chars.slice(bestIndex + 1).join("").trim(),
    ].filter((line) => line.length > 0);
  }

  let cut = chars.length;
  while (cut > 1 && estimateTextWidth(chars.slice(0, cut).join(""), fontSize) > maxWidth) {
    cut -= 1;
  }
  return [chars.slice(0, cut).join(""), chars.slice(cut).join("")].filter(
    (line) => line.length > 0,
  );
}

/**
 * 计算机制图布局。
 */
export function layoutDiagram(spec: DiagramSpec): DiagramLayout {
  const usableWidth = CANVAS_WIDTH - PADDING_X * 2;

  const layerOf = assignLayers(spec.nodes, spec.edges);
  const maxLayer = Math.max(0, ...Array.from(layerOf.values()));

  const layers: DiagramNode[][] = Array.from({ length: maxLayer + 1 }, () => []);
  for (const node of spec.nodes) {
    const layer = layerOf.get(node.id) ?? 0;
    layers[layer]?.push(node);
  }

  const laidOutNodes: LaidOutNode[] = [];
  const nodeById = new Map<string, LaidOutNode>();

  let cursorY = PADDING_TOP;

  layers.forEach((layerNodes, layerIndex) => {
    if (layerNodes.length === 0) return;

    const height = layerNodes.length === 1 ? NODE_HEIGHT : NODE_HEIGHT_COMPACT;

    const idealWidths = layerNodes.map((node) => {
      const textWidth = estimateTextWidth(node.label, NODE_FONT_SIZE) + 20;
      return Math.min(NODE_MAX_WIDTH, Math.max(NODE_MIN_WIDTH, textWidth));
    });

    const siblingsGapTotal = SIBLING_GAP * (layerNodes.length - 1);
    const totalIdeal = idealWidths.reduce((sum, w) => sum + w, 0) + siblingsGapTotal;

    let widths = idealWidths;
    if (totalIdeal > usableWidth) {
      const available = usableWidth - siblingsGapTotal;
      const scale = available / idealWidths.reduce((sum, w) => sum + w, 0);
      widths = idealWidths.map((w) => Math.max(64, w * scale));
    }

    const totalWidth =
      widths.reduce((sum, w) => sum + w, 0) + siblingsGapTotal;

    let cursorX = (CANVAS_WIDTH - totalWidth) / 2;

    layerNodes.forEach((node, index) => {
      const width = widths[index] ?? NODE_MIN_WIDTH;
      const lines = wrapLabel(node.label, width - 12, NODE_FONT_SIZE);

      const laidOut: LaidOutNode = {
        ...node,
        x: cursorX,
        y: cursorY,
        width,
        height,
        lines,
        layer: layerIndex,
      };

      laidOutNodes.push(laidOut);
      nodeById.set(node.id, laidOut);
      cursorX += width + SIBLING_GAP;
    });

    cursorY += height + LAYER_GAP;
  });

  const contentBottom = cursorY - LAYER_GAP + PADDING_BOTTOM;
  const height = Math.max(contentBottom, PADDING_TOP + NODE_HEIGHT + PADDING_BOTTOM);

  // 生成连线，并统一处理标签避让
  const laidOutEdges: LaidOutEdge[] = [];
  for (const edge of spec.edges) {
    const fromNode = nodeById.get(edge.from);
    const toNode = nodeById.get(edge.to);
    if (!fromNode || !toNode) continue;

    const isDetour = toNode.layer - fromNode.layer > 1;
    laidOutEdges.push({
      ...edge,
      fromNode,
      toNode,
      points: routeEdge(fromNode, toNode, isDetour),
      isDetour,
    });
  }

  assignLabelAnchors(laidOutEdges);

  const rolesInUse = Array.from(
    new Set(spec.nodes.map((node) => node.role)),
  ) as DiagramNodeRole[];

  return {
    width: CANVAS_WIDTH,
    height,
    nodes: laidOutNodes,
    edges: laidOutEdges,
    rolesInUse,
  };
}

/**
 * 连线走线。
 *
 * - 上下同列：直接竖直连接。
 * - 相邻层不同列：竖直出 → 水平折 → 竖直进。
 * - 跨层：沿右侧专用通道绕行，绝不穿过中间节点。
 * - 同层：从侧面水平连接。
 */
function routeEdge(
  from: LaidOutNode,
  to: LaidOutNode,
  isDetour: boolean,
): Array<{ x: number; y: number }> {
  const fromCx = from.x + from.width / 2;
  const toCx = to.x + to.width / 2;
  const fromBottom = from.y + from.height;
  const toTop = to.y;

  if (from.layer === to.layer) {
    const goingRight = toCx > fromCx;
    const startX = goingRight ? from.x + from.width : from.x;
    const endX = goingRight ? to.x : to.x + to.width;
    const midY = from.y + from.height / 2;
    return [
      { x: startX, y: midY },
      { x: endX, y: midY },
    ];
  }

  // 跨层：走右侧通道
  if (isDetour) {
    const exitY = fromBottom + 14;
    const entryY = toTop - 14;
    // 通道固定在画布内右侧留白处，保证圆角完整可见、不被裁切
    const channelX = CANVAS_WIDTH - 6;
    return [
      { x: fromCx, y: fromBottom },
      { x: fromCx, y: exitY },
      { x: channelX, y: exitY },
      { x: channelX, y: entryY },
      { x: toCx, y: entryY },
      { x: toCx, y: toTop },
    ];
  }

  const sameColumn = Math.abs(fromCx - toCx) < 6;
  if (sameColumn) {
    return [
      { x: fromCx, y: fromBottom },
      { x: toCx, y: toTop },
    ];
  }

  const midY = fromBottom + (toTop - fromBottom) / 2;
  return [
    { x: fromCx, y: fromBottom },
    { x: fromCx, y: midY },
    { x: toCx, y: midY },
    { x: toCx, y: toTop },
  ];
}

/**
 * 统一分配连线标签位置，解决重叠。
 *
 * 关键点：标签必须跟着**连线自己的走向**走，不能都用同一个中点。
 * 若两条线从同一个节点分叉到左右两侧，水平折段的中点会重合，
 * 文字必然叠在一起。因此这里按连线方向选择锚点：
 *
 * - 向右下走：标签放在折段靠右的部分（远离分叉点）
 * - 向左下走：标签放在折段靠左的部分
 * - 同列直连：标签放在线段中点
 *
 * 冲突时沿垂直方向上下交替试探，优先保持在原间隙内。
 */
function assignLabelAnchors(edges: LaidOutEdge[]): void {
  const LINE_HEIGHT = 12;
  const CHAR_WIDTH_FACTOR = 0.95;

  interface Placed {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  /**
   * 全局共享的已占位列表。
   *
   * 不能按层间隙分组检测：跨层绕行线的标签会跨越多个间隙，
   * 其锚点可能正好落在别的间隙的标签位置上。只有全局检测才能保证不叠字。
   */
  const placed: Placed[] = [];

  // 先算所有标签的首选锚点，再按 y 从小到大依次放置，避免放置顺序造成偏斜
  const pending = edges
    .filter((edge) => Boolean(edge.label))
    .map((edge) => {
      const labelWidth =
        estimateTextWidth(edge.label ?? "", EDGE_LABEL_FONT_SIZE) * CHAR_WIDTH_FACTOR;

      const fromCx = edge.fromNode.x + edge.fromNode.width / 2;
      const toCx = edge.toNode.x + edge.toNode.width / 2;
      const fromBottom = edge.fromNode.y + edge.fromNode.height;
      const toTop = edge.toNode.y;

      const dx = toCx - fromCx;
      let anchorX: number;
      let preferredY = fromBottom + (toTop - fromBottom) / 2 - 3;

      if (edge.isDetour) {
        // 绕行线：标签贴着右侧通道放置，并垂直居中于整条竖直段。
        // 若仍按起点 x 摆放，标签会飘在离连线很远的地方，读者无法判断它属于哪条线。
        anchorX = CANVAS_WIDTH - 6 - 8 - labelWidth / 2;
        preferredY = (fromBottom + toTop) / 2;
      } else if (Math.abs(dx) < 8) {
        anchorX = fromCx;
      } else {
        // 分叉连线：把标签推向目标一侧，远离分叉点
        anchorX = fromCx + dx * 0.62;
      }

      const halfWidth = labelWidth / 2;
      anchorX = Math.min(
        CANVAS_WIDTH - PADDING_X - halfWidth,
        Math.max(PADDING_X + halfWidth, anchorX),
      );

      return { edge, anchorX, preferredY, labelWidth, fromBottom, toTop };
    })
    .sort((a, b) => a.preferredY - b.preferredY);

  for (const item of pending) {
    const { edge, anchorX, preferredY, labelWidth, fromBottom, toTop } = item;
    const halfWidth = labelWidth / 2;

    const makeRect = (y: number) => ({
      x: anchorX - halfWidth,
      y: y - EDGE_LABEL_FONT_SIZE,
      width: labelWidth,
      height: LINE_HEIGHT,
    });

    // 垂直可用范围：起点底边到终点顶边之间，留 2px 余量
    const minY = fromBottom + EDGE_LABEL_FONT_SIZE + 2;
    const maxY = toTop - 4;

    // 候选位置：首选位置优先，然后按 6px 步长上下交替微调
    const candidates = [preferredY];
    for (let step = 1; step <= 6; step += 1) {
      candidates.push(preferredY - step * 6, preferredY + step * 6);
    }

    let anchorY = preferredY;
    let chosenRect = makeRect(preferredY);
    let found = false;

    for (const candidateY of candidates) {
      if (candidateY < minY || candidateY > maxY) continue;
      const rect = makeRect(candidateY);
      if (placed.some((p) => intersects(p, rect))) continue;
      anchorY = candidateY;
      chosenRect = rect;
      found = true;
      break;
    }

    // 所有候选都冲突时，仍放置在原位（宁可略挤，也不能丢标签）
    if (!found) {
      anchorY = Math.min(maxY, Math.max(minY, preferredY));
      chosenRect = makeRect(anchorY);
    }

    placed.push(chosenRect);
    edge.labelAnchor = { x: anchorX, y: anchorY };
  }
}

function intersects(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
): boolean {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  );
}
