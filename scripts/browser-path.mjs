import { statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { posix, win32 } from "node:path";

function isFile(path) {
  try { return statSync(path).isFile(); } catch { return false; }
}

/** Windows 安装器注册的完整路径、macOS Spotlight 索引，均支持自定义安装目录。 */
export function registeredBrowserPaths(platform, env, run = execFileSync) {
  const paths = [];
  if (platform === "win32") {
    // 用 .NET 读 Unicode 值并明确输出 UTF-8，避免 reg.exe 本地代码页损坏中文路径。
    const command = `
      [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $false
      $browserPaths = @(
        foreach ($exe in @('chrome.exe', 'msedge.exe', 'chromium.exe')) {
          foreach ($hive in @('CurrentUser', 'LocalMachine')) {
            foreach ($view in @('Registry64', 'Registry32')) {
              $baseKey = $null
              $appKey = $null
              try {
                $baseKey = [Microsoft.Win32.RegistryKey]::OpenBaseKey(
                  [Microsoft.Win32.RegistryHive]::$hive, [Microsoft.Win32.RegistryView]::$view)
                $appKey = $baseKey.OpenSubKey('SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\' + $exe)
                if ($appKey) {
                  $value = $appKey.GetValue('')
                  if ($value -is [string] -and $value) { $value }
                }
              } catch { } finally {
                if ($appKey) { $appKey.Dispose() }
                if ($baseKey) { $baseKey.Dispose() }
              }
            }
          }
        }
      )
      ConvertTo-Json -InputObject $browserPaths -Compress
    `;
    try {
      const output = run("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", command], {
        encoding: "utf8", windowsHide: true, timeout: 5000, stdio: ["ignore", "pipe", "ignore"],
      });
      for (const value of JSON.parse(output.replace(/^\uFEFF/, ""))) {
        if (typeof value === "string") paths.push(value.trim().replace(/^"(.*)"$/, "$1").replace(/%([^%]+)%/g, (match, key) => {
          const actualKey = Object.keys(env).find((name) => name.toLowerCase() === key.toLowerCase());
          return actualKey ? env[actualKey] : match;
        }));
      }
    } catch { /* PowerShell 或注册表不可用时继续 PATH 和常见目录 */ }
  } else if (platform === "darwin") {
    for (const [id, executable] of [
      ["com.google.Chrome", "Google Chrome"], ["com.microsoft.edgemac", "Microsoft Edge"],
      ["org.chromium.Chromium", "Chromium"],
    ]) {
      try {
        const output = run("/usr/bin/mdfind", [`kMDItemCFBundleIdentifier == '${id}'`], {
          encoding: "utf8", timeout: 2000, stdio: ["ignore", "pipe", "ignore"],
        });
        for (const bundle of output.trim().split("\n").filter(Boolean)) {
          paths.push(posix.join(bundle, "Contents/MacOS", executable));
        }
      } catch { /* Spotlight 不可用时，继续 PATH 和常见目录 */ }
    }
  }
  return paths;
}

/** 显式配置错误时立即报错，避免悄悄使用另一份浏览器。 */
export function resolveBrowserPath({
  platform = process.platform,
  env = process.env,
  exists = isFile,
  registered = () => registeredBrowserPaths(platform, env),
} = {}) {
  const override = env.BROWSER_PATH || env.CHROME_PATH;
  if (override) {
    if (exists(override)) return override;
    throw new Error(`指定的浏览器文件不存在：${override}。请检查 BROWSER_PATH / CHROME_PATH。`);
  }

  const pathApi = platform === "win32" ? win32 : posix;
  const names = platform === "win32"
    ? ["chrome.exe", "msedge.exe", "chromium.exe"]
    : ["google-chrome", "google-chrome-stable", "microsoft-edge", "microsoft-edge-stable", "chromium", "chromium-browser"];
  const searchPath = env.PATH || env.Path || "";
  const candidates = [
    ...registered(),
    ...searchPath.split(pathApi.delimiter).filter(Boolean).flatMap((directory) =>
      names.map((name) => pathApi.join(directory.replace(/^"(.*)"$/, "$1"), name))),
  ];
  if (platform === "win32") {
    for (const directory of [
      env.PROGRAMFILES || "C:\\Program Files",
      env["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)",
      env.LOCALAPPDATA,
    ].filter(Boolean)) {
      for (const executable of ["Google/Chrome/Application/chrome.exe", "Microsoft/Edge/Application/msedge.exe", "Chromium/Application/chrome.exe"]) {
        candidates.push(win32.join(directory, executable));
      }
    }
  } else if (platform === "darwin") {
    for (const directory of ["/Applications", ...(env.HOME ? [posix.join(env.HOME, "Applications")] : [])]) {
      for (const name of ["Google Chrome", "Microsoft Edge", "Chromium"]) {
        candidates.push(posix.join(directory, `${name}.app`, "Contents/MacOS", name));
      }
    }
  } else if (platform === "linux") {
    for (const directory of ["/usr/bin", "/usr/local/bin", "/snap/bin"]) {
      for (const name of names) candidates.push(posix.join(directory, name));
    }
  }

  const found = candidates.find(exists);
  if (found) return found;
  throw new Error("未找到用于自动验收的 Chrome、Edge 或 Chromium。请安装其中一种，或用 BROWSER_PATH 指定完整路径（兼容 CHROME_PATH）。日常使用可继续通过默认浏览器打开药枢。");
}
