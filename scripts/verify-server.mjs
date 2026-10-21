import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import { setTimeout as sleep } from "node:timers/promises";

const require = createRequire(import.meta.url);

export async function availablePort(host) {
  const socket = createServer();
  await new Promise((resolve, reject) => {
    socket.once("error", reject);
    socket.listen(0, host, resolve);
  });
  const port = socket.address().port;
  await new Promise((resolve, reject) => socket.close((error) => error ? reject(error) : resolve()));
  return port;
}

/** 直接启动 Node，无 shell 中间进程；只管理本函数创建的进程句柄。 */
export function createTestServer({ root, port, dbPath, host }) {
  let current = null;
  return {
    async start() {
      if (current) throw new Error("测试服务已经启动");
      const child = spawn(process.execPath, [
        require.resolve("next/dist/bin/next"), "start", "-p", String(port), "-H", host,
      ], {
        cwd: root,
        env: { ...process.env, PHARMAHUB_DB_PATH: dbPath },
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"],
      });
      let output = "";
      let failure = null;
      let exited = false;
      const done = new Promise((resolve) => {
        child.once("error", (error) => { failure = error; exited = true; resolve(); });
        child.once("exit", () => { exited = true; resolve(); });
      });
      current = { child, done };
      const collect = (chunk) => { output = (output + chunk.toString()).slice(-16000); };
      child.stdout.on("data", collect);
      child.stderr.on("data", collect);
      const deadline = Date.now() + 30000;
      while (Date.now() < deadline && !exited) {
        // 先等自己的服务报就绪，避免端口竞争时误连其他服务。
        if (/Ready in/.test(output)) {
          try {
            const response = await fetch(`http://127.0.0.1:${port}/`, {
              signal: AbortSignal.timeout(2000),
            });
            await response.arrayBuffer();
            if (response.ok && !exited) return;
          } catch { /* 启动期间继续等待 */ }
        }
        await sleep(100);
      }
      throw new Error(`测试服务启动失败：${failure?.message || output || "超时"}`);
    },
    async stop() {
      if (!current) return;
      const { child, done } = current;
      child.kill("SIGTERM");
      const timer = setTimeout(() => child.kill("SIGKILL"), 5000);
      try { await done; } finally { clearTimeout(timer); current = null; }
    },
  };
}
