/**
 * 解析 `@/` 别名到仓库根目录的 file:// URL，并补齐 TS 扩展名。
 *
 * 两件事：
 * 1. `@/lib/xxx` → `<root>/lib/xxx`
 * 2. 项目源码里 import 不写扩展名（`@/lib/search/traditional`），
 *    而 Node 的 ESM 解析要求完整路径，因此这里补 `.ts` / `.tsx` / `/index.ts`。
 *
 * 由 ts-alias-hook.mjs 通过 module.register 挂载，只在测试时生效。
 */

import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { existsSync } from "node:fs";

const PROJECT_ROOT = process.cwd();

/** 尝试为无扩展名的路径找到实际文件 */
function resolveFile(basePath) {
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    join(basePath, "index.ts"),
    join(basePath, "index.tsx"),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate) && !candidate.endsWith("/")) {
      // 目录不算文件，用 existsSync 已排除大部分情况，再补一次后缀判断
      if (/\.(ts|tsx|mjs|js|json)$/.test(candidate)) return candidate;
    }
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const target = join(PROJECT_ROOT, specifier.slice(2));
    const resolved = resolveFile(target) ?? target;
    return {
      url: pathToFileURL(resolved).href,
      shortCircuit: true,
    };
  }

  // 相对路径导入也可能省略扩展名（如 ./traditional）
  if (specifier.startsWith(".") && !/\.(ts|tsx|mjs|js|json)$/.test(specifier)) {
    const parentPath = context.parentURL
      ? new URL(context.parentURL).pathname.replace(/^\/([A-Za-z]:)/, "$1")
      : PROJECT_ROOT;
    const baseDir = parentPath.includes(".")
      ? parentPath.slice(0, parentPath.lastIndexOf("/"))
      : parentPath;
    const target = join(baseDir, specifier);
    const resolved = resolveFile(target);
    if (resolved) {
      return { url: pathToFileURL(resolved).href, shortCircuit: true };
    }
  }

  return nextResolve(specifier, context);
}
