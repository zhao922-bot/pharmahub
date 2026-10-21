import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { registeredBrowserPaths, resolveBrowserPath } from "./browser-path.mjs";
import { getVerificationContext } from "./verify-context.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const resolveWith = (options) => resolveBrowserPath({
  platform: "win32", env: {}, registered: () => [], exists: () => false, ...options,
});

test("浏览器：自定义路径优先，支持空格与中文", () => {
  const path = "D:\\我的工具\\便携浏览器\\chrome.exe";
  assert.equal(resolveWith({ env: { BROWSER_PATH: path, CHROME_PATH: "other" }, exists: (p) => p === path }), path);
});
test("浏览器：兼容旧 CHROME_PATH 配置", () => {
  assert.equal(resolveWith({ env: { CHROME_PATH: "custom" }, exists: (p) => p === "custom" }), "custom");
});
test("浏览器：显式路径错误不静默降级", () => {
  assert.throws(() => resolveWith({
    env: { BROWSER_PATH: "missing" }, registered: () => ["available"], exists: (p) => p === "available",
  }), /指定的浏览器文件不存在/);
});
test("浏览器：未装 Chrome 时识别登记在自定义目录的 Edge", () => {
  const edge = "E:\\Applications\\Edge\\msedge.exe";
  assert.equal(resolveWith({ registered: () => [edge], exists: (p) => p === edge }), edge);
});
test("浏览器：解析用户级注册表路径与环境变量", () => {
  const paths = registeredBrowserPaths("win32", { LOCALAPPDATA: "D:\\用户\\AppData" }, (command, args) => {
    assert.equal(command, "powershell.exe");
    assert.ok(args.includes("-NonInteractive"));
    return JSON.stringify(['"%LocalAppData%\\Custom Edge\\msedge.exe"']);
  });
  assert.ok(paths.includes("D:\\用户\\AppData\\Custom Edge\\msedge.exe"));
});
test("浏览器：Linux 从 PATH 查找自定义安装目录", () => {
  const chromium = "/opt/tools/custom/chromium";
  assert.equal(resolveWith({
    platform: "linux", env: { PATH: "/bin:/opt/tools/custom" }, exists: (p) => p === chromium,
  }), chromium);
});
test("浏览器：Windows 从 PATH 查找便携版", () => {
  const browser = "F:\\Portable Apps\\msedge.exe";
  assert.equal(resolveWith({
    env: { Path: '"F:\\Portable Apps";C:\\Windows' }, exists: (p) => p === browser,
  }), browser);
});
test("浏览器：macOS 识别非 Applications 目录中的应用包", () => {
  const paths = registeredBrowserPaths("darwin", {}, (_command, args) =>
    args[0].includes("com.microsoft.edgemac") ? "/Volumes/Tools/Microsoft Edge.app\n" : "");
  assert.deepEqual(paths, ["/Volumes/Tools/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"]);
});
test("浏览器：登记与 PATH 均缺失时才用常见目录", () => {
  const edge = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  assert.equal(resolveWith({ exists: (p) => p === edge }), edge);
});
test("浏览器：完全找不到时提示配置方法", () => {
  assert.throws(() => resolveWith({}), /BROWSER_PATH.*默认浏览器/);
});

const directory = join(tmpdir(), "pharmahub-verify-unit");
const dbPath = join(directory, "pharmahub.db");
const env = {
  PHARMAHUB_DB_PATH: dbPath,
  PHARMAHUB_VERIFY_CONTEXT: JSON.stringify({ directory, port: 45678 }),
};
test("验收：没有 IPC 父进程时拒绝运行", () => {
  assert.throws(() => getVerificationContext(env, false), /pnpm verify/);
});
test("验收：拒绝临时目录之外的数据库", () => {
  assert.throws(() => getVerificationContext({
    ...env, PHARMAHUB_VERIFY_CONTEXT: JSON.stringify({ directory: join(root, "data"), port: 45678 }),
  }, true), /上下文无效/);
});
test("验收：拒绝服务与脚本数据库不一致", () => {
  assert.throws(() => getVerificationContext({
    ...env, PHARMAHUB_DB_PATH: join(root, "data", "pharmahub.db"),
  }, true), /配置不一致/);
});
test("验收：地址只能由独立端口生成，忽略旧外部服务覆盖", () => {
  assert.deepEqual(getVerificationContext({ ...env, VERIFY_BASE: "http://localhost:3000" }, true), {
    dbPath, port: 45678, baseURL: "http://127.0.0.1:45678",
  });
});
test("验收：16 个浏览器脚本直接调用均在访问服务前拒绝", () => {
  for (const name of [
    "walkthrough", "check-diagrams", "shoot", "verify-pwa", "verify-lan", "verify-compare",
    "verify-json-heatmap", "verify-export-filter", "verify-review", "verify-stage3",
    "verify-stage4", "verify-search", "verify-interactions", "verify-offline",
    "verify-compare-quiz", "verify-card-expansion",
  ]) {
    const child = spawnSync(process.execPath, [join(root, "scripts", `${name}.mjs`)], {
      cwd: root, env: { ...process.env, PHARMAHUB_VERIFY_CONTEXT: "" },
      encoding: "utf8", windowsHide: true, timeout: 10000,
    });
    assert.equal(child.status, 1, name);
    assert.match(child.stderr, /请通过 pnpm verify/, name);
  }
});
test("验收：未知脚本名在启动服务前报错", () => {
  const child = spawnSync(process.execPath, [join(root, "scripts", "verify.mjs"), "../reset-db"], {
    cwd: root, encoding: "utf8", windowsHide: true, timeout: 10000,
  });
  assert.equal(child.status, 1);
  assert.match(child.stderr, /未知验收脚本/);
  assert.doesNotMatch(child.stdout, /独立端口/);
});
