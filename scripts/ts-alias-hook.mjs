/**
 * Node 测试用的路径别名解析钩子。
 *
 * 项目里用 `@/xxx` 指向仓库根目录（tsconfig paths）。Node 直接跑 TS 源码时
 * 不认识这个别名，本钩子把 `@/` 前缀重写成 file:// URL。
 *
 * 只给 `node --test` 用，不参与构建。
 * 用法：node --test --experimental-strip-types --import ./scripts/ts-alias-hook.mjs ...
 */

import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./ts-alias-resolver.mjs", pathToFileURL(import.meta.filename));
