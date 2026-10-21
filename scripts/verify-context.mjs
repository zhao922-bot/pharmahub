import { basename, join, resolve } from "node:path";
import { tmpdir } from "node:os";

/** 验收只能由统一入口 fork，禁止意外连接日常服务或清空用户数据库。 */
export function getVerificationContext(env = process.env, connected = process.connected) {
  if (!connected || !env.PHARMAHUB_VERIFY_CONTEXT) {
    throw new Error("请通过 pnpm verify -- <脚本名> 运行验收；统一入口会创建独立服务和临时数据库。");
  }
  const context = JSON.parse(env.PHARMAHUB_VERIFY_CONTEXT);
  const { directory, port } = context;
  if (
    typeof directory !== "string" ||
    resolve(directory, "..") !== resolve(tmpdir()) ||
    !basename(directory).startsWith("pharmahub-verify-") ||
    !Number.isInteger(port) || port < 1 || port > 65535
  ) {
    throw new Error("验收上下文无效，拒绝访问数据库。");
  }
  const dbPath = join(directory, "pharmahub.db");
  if (env.PHARMAHUB_DB_PATH !== dbPath) {
    throw new Error("验收数据库与服务配置不一致，拒绝执行。");
  }
  return { dbPath, port, baseURL: `http://127.0.0.1:${port}` };
}

/** 离线验收通过 IPC 请求父进程启停它拥有的服务，不按端口或进程名杀进程。 */
export async function setTestServerRunning(running) {
  getVerificationContext();
  const requestId = `${Date.now()}-${Math.random()}`;
  return new Promise((resolveRequest, reject) => {
    const timer = setTimeout(() => finish(new Error("测试服务控制超时")), 45000);
    const onDisconnect = () => finish(new Error("验收入口已断开"));
    const onMessage = (message) => {
      if (message?.type === "server-result" && message.requestId === requestId) {
        finish(message.error ? new Error(message.error) : null);
      }
    };
    function finish(error) {
      clearTimeout(timer);
      process.off("message", onMessage);
      process.off("disconnect", onDisconnect);
      if (error) reject(error);
      else resolveRequest();
    }
    process.on("message", onMessage);
    process.once("disconnect", onDisconnect);
    process.send({ type: "server-control", requestId, running }, (error) => {
      if (error) finish(error);
    });
  });
}
