import test from "node:test";
import assert from "node:assert/strict";
import { registeredBrowserPaths, resolveBrowserPath } from "./browser-path.mjs";

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

