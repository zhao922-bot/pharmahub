/**
 * 生成 PWA 图标。
 *
 * 不引入 sharp / canvas 等依赖，直接手写 PNG 编码：
 * 图标是简单的双色几何图形（圆角背景 + 药丸），
 * 用 zlib 压缩原始像素即可，Node 内置模块足够。
 *
 * 运行：node scripts/gen-icons.mjs
 */

import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "icons");

// 品牌色，与 globals.css 的 --primary 一致（深海军蓝）
const BRAND = [30, 58, 95];
const BRAND_LIGHT = [45, 82, 128];
const WHITE = [255, 255, 255];

/** PNG 的 CRC32 */
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) {
    c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typeBuffer = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuffer, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

/** 把 RGBA 像素数组编码为 PNG */
function encodePng(width, height, pixels) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // 每行前加一个 filter 字节（0 = None）
  const raw = Buffer.alloc(height * (width * 4 + 1));
  let offset = 0;
  for (let y = 0; y < height; y += 1) {
    raw[offset] = 0;
    offset += 1;
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      raw[offset] = pixels[i];
      raw[offset + 1] = pixels[i + 1];
      raw[offset + 2] = pixels[i + 2];
      raw[offset + 3] = pixels[i + 3];
      offset += 4;
    }
  }

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/**
 * 绘制图标。
 *
 * @param {number} size 边长
 * @param {boolean} maskable 是否为 maskable 图标
 *   maskable 要求内容落在中心 80% 的安全区内，
 *   因为系统可能裁成圆形、方形或水滴形。
 */
function drawIcon(size, maskable) {
  const pixels = new Uint8Array(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;

  // 圆角半径：maskable 图标用全填充背景（系统自己裁），普通图标用圆角
  const radius = maskable ? 0 : size * 0.22;

  // 药丸主体尺寸
  const safeScale = maskable ? 0.62 : 0.72;
  const pillW = size * safeScale;
  const pillH = pillW * 0.46;
  const pillRadius = pillH / 2;
  // 药丸倾斜 45 度
  const angle = -Math.PI / 4;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4;
      const px = x + 0.5;
      const py = y + 0.5;

      // --- 背景：圆角矩形 ---
      let insideBackground;
      if (radius === 0) {
        insideBackground = true;
      } else {
        const dx = Math.max(radius - px, 0, px - (size - radius));
        const dy = Math.max(radius - py, 0, py - (size - radius));
        insideBackground = dx * dx + dy * dy <= radius * radius;
      }

      if (!insideBackground) {
        pixels[i + 3] = 0; // 透明
        continue;
      }

      // 背景渐变：左上亮、右下暗
      const t = (px + py) / (2 * size);
      const bg = [
        Math.round(BRAND_LIGHT[0] + (BRAND[0] - BRAND_LIGHT[0]) * t),
        Math.round(BRAND_LIGHT[1] + (BRAND[1] - BRAND_LIGHT[1]) * t),
        Math.round(BRAND_LIGHT[2] + (BRAND[2] - BRAND_LIGHT[2]) * t),
      ];

      // --- 药丸：旋转坐标系后判断是否在圆角矩形内 ---
      const relX = px - cx;
      const relY = py - cy;
      const rotX = relX * cos - relY * sin;
      const rotY = relX * sin + relY * cos;

      const halfW = pillW / 2;
      const halfH = pillH / 2;
      const ax = Math.abs(rotX);
      const ay = Math.abs(rotY);

      let insidePill = false;
      if (ax <= halfW && ay <= halfH) {
        if (ax <= halfW - pillRadius) {
          insidePill = true;
        } else {
          const cornerX = ax - (halfW - pillRadius);
          const cornerY = ay;
          insidePill = cornerX * cornerX + cornerY * cornerY <= pillRadius * pillRadius;
        }
      }

      if (insidePill) {
        // 药丸中线（沿长轴）画一条分割线，体现「胶囊两半」
        const isSeam = Math.abs(rotX) < size * 0.012;
        if (isSeam) {
          pixels[i] = bg[0];
          pixels[i + 1] = bg[1];
          pixels[i + 2] = bg[2];
        } else {
          pixels[i] = WHITE[0];
          pixels[i + 1] = WHITE[1];
          pixels[i + 2] = WHITE[2];
        }
      } else {
        pixels[i] = bg[0];
        pixels[i + 1] = bg[1];
        pixels[i + 2] = bg[2];
      }

      pixels[i + 3] = 255;
    }
  }

  return encodePng(size, size, pixels);
}

mkdirSync(OUT_DIR, { recursive: true });

const targets = [
  { name: "icon-192.png", size: 192, maskable: false },
  { name: "icon-512.png", size: 512, maskable: false },
  { name: "icon-maskable-512.png", size: 512, maskable: true },
  { name: "apple-touch-icon.png", size: 180, maskable: true },
  { name: "favicon-32.png", size: 32, maskable: false },
];

for (const target of targets) {
  const png = drawIcon(target.size, target.maskable);
  writeFileSync(join(OUT_DIR, target.name), png);
  console.log(`${target.name}  ${target.size}x${target.size}  ${png.length} 字节`);
}

console.log("\n图标生成完成");
