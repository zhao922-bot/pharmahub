import { fork } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveBrowserPath } from "./browser-path.mjs";
import { availablePort, createTestServer } from "./verify-server.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SUITES = [
  "walkthrough", "check-diagrams", "verify-pwa", "verify-lan", "verify-compare",
  "verify-json-heatmap", "verify-export-filter", "verify-review", "verify-stage3",
  "verify-stage4", "verify-search", "verify-interactions", "verify-offline", "shoot",
  "verify-compare-quiz", "verify-card-expansion",
  "verify-maintenance",
];
const args = process.argv.slice(2).filter((arg) => arg !== "--");
let activeTest = null;
let interrupted = false;
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    interrupted = true;
    activeTest?.kill("SIGTERM");
  });
}

async function runSuite(name, browserPath) {
  const directory = await mkdtemp(join(tmpdir(), "pharmahub-verify-"));
  const dbPath = join(directory, "pharmahub.db");
  let server;
  let controls = Promise.resolve();
  try {
    const host = name === "verify-lan" ? "0.0.0.0" : "127.0.0.1";
    const port = await availablePort(host);
    server = createTestServer({ root: ROOT, port, dbPath, host });
    console.log(`\n[${name}] 独立端口 ${port}，临时数据库 ${dbPath}`);
    await server.start();
    if (interrupted) return 130;
    const child = fork(join(ROOT, "scripts", `${name}.mjs`), [], {
      cwd: ROOT,
      execArgv: ["verify-compare-quiz", "verify-card-expansion"].includes(name)
        ? ["--experimental-strip-types", "--import", "./scripts/ts-alias-hook.mjs"]
        : process.execArgv,
      env: {
        ...process.env,
        BROWSER_PATH: browserPath,
        PHARMAHUB_DB_PATH: dbPath,
        PHARMAHUB_VERIFY_CONTEXT: JSON.stringify({ directory, port }),
      },
      windowsHide: true,
      stdio: ["ignore", "inherit", "inherit", "ipc"],
    });
    activeTest = child;
    child.on("message", (message) => {
      if (message?.type !== "server-control") return;
      controls = controls.then(async () => {
        let error;
        try {
          if (name !== "verify-offline" || typeof message.running !== "boolean") {
            throw new Error("该验收不允许启停服务");
          }
          if (message.running) await server.start();
          else await server.stop();
        } catch (cause) { error = cause.message; }
        if (child.connected) child.send({
          type: "server-result", requestId: message.requestId, error,
        }, () => {});
      });
    });
    // 全库内容验收逐卡/逐组执行，扩容后需要比交互冒烟测试更长的时限。
    const timeoutMinutes = ["verify-compare-quiz", "verify-card-expansion"].includes(name) ? 15 : 5;
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      console.error(`[${name}] 超过 ${timeoutMinutes} 分钟，终止本次验收。`);
      child.kill("SIGTERM");
    }, timeoutMinutes * 60000);
    try {
      return await new Promise((resolve, reject) => {
        child.once("error", reject);
        child.once("exit", (code) => resolve(interrupted ? 130 : timedOut ? 1 : code ?? 1));
      });
    } finally {
      clearTimeout(timer);
      activeTest = null;
    }
  } finally {
    await controls;
    await server?.stop();
    // 清理前确认绝对路径仍在本次临时目录范围内。
    if (dirname(resolve(directory)) !== resolve(tmpdir()) || !basename(directory).startsWith("pharmahub-verify-")) {
      throw new Error("临时目录范围校验失败，已停止清理。");
    }
    await rm(directory, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
}

async function main() {
  if (args.includes("--list")) { console.log(SUITES.join("\n")); return; }
  const selected = args.length ? args.map((arg) => arg.replace(/\.mjs$/, "")) : SUITES;
  const unknown = selected.filter((name) => !SUITES.includes(name));
  if (unknown.length) throw new Error(`未知验收脚本：${unknown.join(", ")}。用 pnpm verify -- --list 查看列表。`);
  if (!existsSync(join(ROOT, ".next", "BUILD_ID"))) {
    throw new Error("缺少生产构建。请先停止开发服务并运行 pnpm build，再运行 pnpm verify。");
  }
  const browserPath = resolveBrowserPath();
  console.log(`验收浏览器：${browserPath}`);
  const results = [];
  for (const name of selected) {
    if (interrupted) break;
    try { results.push({ name, code: await runSuite(name, browserPath) }); }
    catch (error) { console.error(error); results.push({ name, code: 1 }); }
  }
  console.log("\n验收汇总：");
  for (const result of results) console.log(`${result.code === 0 ? "✓" : "✗"} ${result.name}`);
  process.exitCode = interrupted ? 130 : results.some((result) => result.code !== 0) ? 1 : 0;
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
