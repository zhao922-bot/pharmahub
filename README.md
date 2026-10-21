# 药枢 PharmaHub · 云端版

中文药物机制学习应用，包含 123 张卡片、36 组常用药对比、机制图、测验、解析与参考资料。基于 Vinext、React 和 Cloudflare D1，通过 Sites 托管。

## 在线使用

**正式网址：[药枢 PharmaHub](https://pharmahub.ampleox17.chatgpt.site)** · [ACEI / ARB 对比测验](https://pharmahub.ampleox17.chatgpt.site/quiz?compare=acei-vs-arb)

网站已向其他 ChatGPT 账号开放，可以分享网址给他人使用。手机和其他电脑直接通过浏览器访问，无需安装项目、启动原电脑或连接同一个 Wi-Fi。

1. 打开正式网址，按提示使用自己的 ChatGPT 账号登录。
2. 阅读卡片与机制图，收藏药物、进行掌握程度自评，完成普通测验或同类药对比测验并查看解析。
3. 换设备时登录同一账号，打开或刷新页面即可查看云端已保存的记录。

## 账号与学习数据

| 数据 | 保存与访问规则 |
| --- | --- |
| 复习进度 | 各账号独立保存自评、SM-2 状态、下次复习日期及复习历史 |
| 统计与热力图 | 根据当前账号的记录计算今日复习数、连续学习天数和学习热力图 |
| 收藏 | 各账号拥有自己的药物卡片收藏清单 |
| 测验与错题 | 各账号独立保存答题记录、正确率、错题本和错题重练记录 |
| CSV / JSON 导出 | 仅导出当前登录账号的复习、测验、错题与收藏记录 |

药物卡片、机制图、对比内容及参考资料由大家共用，个人学习记录按 ChatGPT 用户 ID 隔离。同一账号在手机和电脑上共用记录；新账号从空白个人记录开始，不继承其他人的进度。不同账号在应用内互不查看、修改或清空对方的数据。

站点的访问范围已开放，应用仍要求登录：未登录访问首页或卡片页会进入 ChatGPT 登录流程，个人导出接口返回 401。服务端从登录身份取得用户 ID，不接受前端指定其他用户的数据归属。个人导出使用 `Cache-Control: no-store`。

- **统计时区**：每日统计与复习计划统一采用 UTC+8，页面显示该规则。
- **本地历史**：云端 D1 与原电脑上的 SQLite 数据库独立。本地历史尚未迁移，不会自动上传或与云端合并；原本地项目及数据保留。
- **联网要求**：云端版需要联网，个人页面和学习记录不进入 Service Worker 离线页面缓存。
- **内容范围**：内容仅供学习参考；来源、核对日期和教学简化说明见各卡片及对比详情。

## 数据安全与药物知识免责声明

更新日期：2026-10-21。完整说明可从软件各主要页面底部进入，也可访问 [在线免责声明](https://pharmahub.ampleox17.chatgpt.site/disclaimer)。本说明同时区分 `online` 云端版与 `main` 本地版。

> 仅供药学学习参考，不提供诊断、处方或个体化治疗建议。账号隔离和数据加密均有适用边界，不能保证绝对安全。

### 数据安全与隐私说明

- **保存哪些数据**：云端学习数据库以当前站点的 ChatGPT 用户 ID 关联复习状态、复习历史、收藏、测验作答和错题记录，用于保存进度、计算统计与导出。登录信息由平台提供；应用的学习数据库不保存 ChatGPT 密码或聊天内容。浏览器还可能保存主题、安装提示等本机偏好。
- **数据库由谁托管**：云端版通过 Sites 托管，Cloudflare D1 由平台代为开通和绑定，不是每位访客个人 Cloudflare 账户中的数据库。站点项目所有权不等于底层 Cloudflare 账户所有权；当前应用未提供底层账户注册主体、存储地区或备份保留期限的确认信息。
- **账号隔离与加密**：云端版要求 ChatGPT 登录，服务端依据已验证的用户身份限定个人记录的读取、修改与导出。所有账号共用数据库，通过用户 ID 在应用层隔离，并非每人一个数据库。Cloudflare 官方说明 D1 提供静态存储加密与传输加密，密钥由 Cloudflare 管理；这不是由用户独占密钥的端到端加密。
- **安全保障的边界**：具备相应权限的站点或平台数据库管理人员可能访问记录。现有访问控制与测试不能排除账号被盗、程序漏洞、配置错误、服务故障或数据丢失；本站尚未经过独立安全审计，不承诺绝对安全、永久保存或持续可用。本站用于学习，请勿将其作为病历、处方或患者身份等敏感信息的存储工具。
- **导出、退出与删除**：可在“导出学习数据”中下载当前账号的记录。请妥善保存导出文件，在共用设备上使用后退出账号。退出登录、清理浏览器缓存或清空错题本，不等于删除全部云端学习数据；当前应用没有一键删除全部云端记录的入口，也未设置自动到期删除规则。
- **本地版的不同之处**：在自己电脑运行的本地版将学习记录保存在运行服务的电脑上的 SQLite 数据库，默认路径为 data/pharmahub.db，没有 ChatGPT 登录或按账号隔离功能。访问同一本地服务的设备共用记录，浏览器也可能缓存页面；请控制本地服务、电脑文件和备份的访问权限。本地历史不会自动上传或与云端合并。

### 药物知识免责声明

- **用途仅限学习**：药物卡片、机制图、同类药对比、测验和解析用于药学学习与知识复习，不构成诊断、处方、个体化用药建议或临床决策依据，也不能替代医生或药师的专业判断。测验分数、自评结果和复习计划不代表执业资格或临床能力认证。
- **内容存在简化与更新限制**：机制图、记忆要点和题目可能进行教学简化，不能涵盖全部作用机制、禁忌、不良反应、相互作用或特殊人群注意事项。未列出某项风险不代表风险不存在。内容可能有错误、遗漏或更新滞后；来源与核对日期不等于持续更新或已通过独立专业审定，程序测试通过也不能证明医学内容完全正确。
- **不要跨范围套用**：不同国家或地区、厂家、剂型、给药途径、适应症与年龄人群的批准信息可能不同。同类药对比不表示可以自行互换，也不代表某药对所有患者更优；不得将一项研究、某一制剂或地区的结论直接外推到其他用药场景。
- **实际用药请核对并咨询**：实际用药应核对所在地当前批准的具体产品说明书、适用指南，并向医生或药师咨询。不要仅凭本站内容自行开始、停止、更换药物或调整剂量，也不要据此延误诊疗。如有急症，请及时就医或联系当地急救服务，不要等待本站信息。
- **参考资料与纠错**：外部链接用于核对所列知识点，不表示本站或来源机构认可全部内容，也不构成药品推荐。发现问题时，请保留页面地址、相关表述和依据，反馈给站点维护者；核实前请勿将存疑内容用于实际用药。本免责声明不能代替内容纠错、安全维护和必要的专业审核。

参考：[Cloudflare D1：数据安全说明（英文）](https://developers.cloudflare.com/d1/reference/data-security/)；[FDA：了解药物获益与风险（英文）](https://www.fda.gov/drugs/information-consumers-and-patients-drugs/think-it-through-managing-benefits-and-risks-medicines)。以下资料分别说明托管数据库的加密机制与一般用药安全原则；药物具体知识点仍应核对各卡片和对比页所列来源。

## 版本与源码

| 分支 | 用途 | 运行与数据 |
| --- | --- | --- |
| [main](https://github.com/zhao922-bot/pharmahub/tree/main) | 原本地版 | Next.js + Node.js + 本地 SQLite，无 ChatGPT 账号体系 |
| [online](https://github.com/zhao922-bot/pharmahub/tree/online) | 当前云端版 | Sites / Vinext / Cloudflare Workers + D1，ChatGPT 登录及账号隔离 |

本 README 对应 `online` 分支。网站向其他 ChatGPT 账号开放不改变 GitHub 源码仓库的私有权限。

## 已完成的验证

云端上线时，252 项测试、类型检查和正式构建通过；66 项浏览器检查覆盖 320/375/1366 px、主要页面、跨会话读取进度、完整对比测验与解析、错题和导出。药物卡片与对比数据源文件和本地版一致。

开放访问时复核了 7 项云端数据测试，覆盖账号隔离、并发复习、收藏、测验/错题操作、事务回滚和 UTC+8 日期边界；线上匿名访问首页及卡片页跳转登录，匿名导出返回 401。初次上线验收记录见 [云端验收报告](docs/cloud-verification-2026-10-21.md)，其中所有者私有访问描述属于开放前的历史状态。

## 开发与检查

`npm run install:ci` 安装锁定依赖；`npm test` 验证题库与学习逻辑；`npm run typecheck` 检查类型；`npm run build` 构建完整 Worker。

`npm run db:generate` 根据 `db/schema.ts` 生成迁移。首次本地构建后，将 `drizzle/*.sql` 按顺序应用到本地 D1：

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_round_jean_grey.sql
npm run dev
```

迁移文件名以当前 `drizzle/` 内文件为准。开发预览地址为 `http://localhost:5173`，开发环境的登录按钮使用本地模拟账号。生产环境只使用 Sites 提供的真实登录身份。测试数据库不包含真实学习记录。

`scripts/cloud-data.test.mjs` 使用 Node 内置 SQLite 执行真实数据层 SQL，覆盖账号隔离、并发复习、原子收藏、测验/错题流水和事务回滚。正式发布由 Sites 应用已提交的 D1 迁移；不在页面请求期间创建表。

下方保留托管运行时的维护说明。

## Prerequisites

- Node.js `>=22.13.0`
- Portable: Windows, macOS, or Linux; no Bash required
- Managed Linux: managed Linux runtime with Bash, `flock`, `curl`, `sha256sum`, and GNU `timeout`
- Git and `tar` (including Windows `tar.exe`) are required for publishing; portable publication does not require Bash

## Sites Lifecycle

The Sites initializer copies the shared starter and selects managed-linux only when `SITES_MANAGED_LINUX_CONTAINER=1`; otherwise it selects portable. It saves the selection only in ignored `.sites-runtime/execution-profile.json`. Both profiles copy/configure first, then use the plugin's separate `install-dependencies.mjs` step to measure installation independently. Edit source under `app/` and follow the Sites skill for installation, preview, builds, and publishing.

Run `node <plugin-root>/scripts/configure-execution-profile.mjs` only when the profile is unknown for the current checkout and environment. Profile changes do not alter tracked source or require reinstalling otherwise-valid dependencies; restart an existing preview to use the new selection. Do not commit or upload `.sites-runtime/`.

This starter does not use `wrangler.jsonc`.

Publish archives outside the source checkout or under its ignored `outputs/` directory. Local `.env*`, `.dev.vars*`, TypeScript build state, and tool runtime directories are ignored; keep the hosting manifest, migrations, and authored scripts in source control.

`install:ci` runs `npm ci` once against the shared lockfile, disables parent-workspace discovery, and includes required dev/optional dependencies despite production/omit settings. Sharp defaults to prebuilt binaries unless explicitly configured otherwise. Do not overlap installers.

- **Portable:** Preserve host HOME, npm cache, registry, proxy, temporary paths, retry/concurrency settings, and lifecycle-script policy. Use `--prefer-offline --no-audit --no-fund`.
- **Managed Linux:** Use the existing project-local HOME/cache/tmp setup and Linux install lock, tarball preflight, and timeout. Restore the image-seeded npm cache only when its lockfile hash matches; retain network fallback. Builds keep their existing timeout. These helpers are not invoked by the portable profile.

`scripts/sites-env.mjs` preserves the caller's HOME, npm cache, proxy, XDG, and temporary-directory configuration while defaulting Wrangler and Miniflare state to the checkout. If npm reports an unwritable cache, select a writable path with `npm_config_cache` for that install. The `dev` and `start` scripts also keep Wrangler logs inside the checkout. Generated `.sites-runtime/` and `.wrangler/` directories are disposable and ignored by Git.

On portable, `npm run dev` uses `vinext dev` with HMR, starting at port 5173. Vinext records the running server in ignored `.vinext/` state, rejects an ordinary duplicate launch, and recovers stale state after a stopped process; exactly simultaneous starts can race. Pass `--port <port>` or `--hostname <host>` after `npm run dev --` when needed; keep portable previews on loopback.

For browser QA on managed Linux, use `sites-preview start`. The project's dev script runs Vite and accepts the supervisor's `--host 0.0.0.0 --port 4173 --strictPort` arguments. The internal browser uses `http://terminal.local:4173/`; it is not a user-facing URL. The supervisor owns the preview lifecycle. The ignored local profile survives the supervisor's cleared process environment.

The portable profile simulates ChatGPT sign-in only for loopback development requests. Visit `/signin-with-chatgpt?return_to=/` to sign in as `local_seedy` (`seedy@sites.test`, display name `Seedy`) and `/signout-with-chatgpt?return_to=/` to sign out. The development cookie preserves that identity across server restarts. Mock auth is disabled in the managed-linux profile and is not included in production builds; hosted authentication remains dispatch-owned.

The Worker uses `vinext/server/fetch-handler`, including Vinext's config-aware image handling. After building, `npm start` runs that Worker locally through Wrangler on `127.0.0.1`, sharing `.wrangler/state` with dev preview and local D1 migrations; it does not deploy the site or simulate sign-in. Use the URL printed by the server. Pass `npm start -- --port <port>` to select a different built-preview port.

Local previews use Miniflare's placeholder `Request.cf` metadata without a network lookup. Set `CLOUDFLARE_CF_FETCH_ENABLED=true` to opt into fetching preview metadata; this setting does not change hosted request metadata.

Local tool usage metrics are disabled by default. Set `WRANGLER_SEND_METRICS=true` to opt in.

## Included Shape

- edit site code under `app/`
- `app/chatgpt-auth.ts` provides optional dispatch-owned ChatGPT sign-in helpers
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `worker/index.ts` is the production Worker entrypoint and preserves request-scoped connector bindings
- `scripts/vite/` contains the maintained Vite integrations and the vendored Sites plugin license
- `scripts/connector-preview/` contains the local connector preview Worker and session helpers
- the remaining `scripts/` files select execution profiles and run installation, development, and builds; the plugin's helpers orchestrate the Sites lifecycle
- `dist/` contains generated deployment output; `.vinext/`, `.wrangler/`, and `.sites-runtime/` contain ignored local tool state
- `lib/db/context.ts` obtains the signed-in user and a request-scoped D1 session; `lib/db/*-store.ts` scopes every personal record operation to that user
- `db/index.ts` provides a Drizzle D1 helper; the application repositories use the user-scoped context above
- `db/schema.ts` defines five user-scoped tables: review state, review history, favorites, quiz attempts, and wrong questions; `drizzle/` contains their migrations
- `@cloudflare/workers-types` provides Worker types; `cloudflare-env.d.ts` declares optional `DB`/`BUCKET` bindings—update these declarations if binding names change
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

Signed-in visitors receive both `oai-authenticated-user-id` and `oai-authenticated-user-email`. Private Sites require every visitor to sign in; public Sites may also have anonymous visitors, for whom neither header is present.

The user ID is stable for the same user on the same Site and different across Sites. Use it as the durable user key; use email and name for display or contact purposes.

SIWC-authenticated workspace sites may also receive `oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty `name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by `oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const userId = requestHeaders.get("oai-authenticated-user-id");
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use the returned `userId` as the stable user key for user-owned records; do not use email as a durable identifier.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send anonymous visitors through Sign in with ChatGPT.
- In a Server Component, start sign-in with `<a href={chatGPTSignInPath(returnTo)} target="_top">`. The auth helper module is server-only; do not import it into a Client Component.
- Do not use `fetch`, XHR, a client-side router, or a framework link that can prefetch the sign-in route. SIWC must start as a top-level navigation.
- Never request the AuthAPI authorization endpoint directly. The dispatch-owned `/signin-with-chatgpt` route must start the SIWC flow.
- Use `chatGPTSignOutPath(returnTo)` for browser sign-out links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the OAuth cookies, and identity header injection. Do not implement app routes for those reserved paths. Routes that do not import and call the helper remain anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the Sites hosting platform's access policy controls for workspace-wide restrictions, or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write actions tied to the current ChatGPT user. Leave public content anonymous.

## Local D1 migrations

For a D1-backed local preview, generate SQL with `npm run db:generate`. Build once through the Sites skill's build entrypoint (or `npm run build` for standalone use) to generate `dist/server/wrangler.json`, rebuilding if bindings change. From the project root, apply each pending migration in order:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_example.sql
```

Replace the filename with the pending migration and `DB` with your D1 binding name if different. Use `.wrangler/state`, not `.wrangler/state/v3`; Wrangler adds the versioned directories. Do not replay migrations already applied locally. This updates only the preview database; publishing applies production migrations separately.

## Diagnostic Commands

- `npm run install:ci`: perform the one locked dependency install
- `npm run dev`: start the Vite/Vinext development server
- `npm run build`: build the deployable Sites artifact
- `npm run start`: preview the built Worker locally with D1/R2 support
- `npm run db:generate`: generate Drizzle migrations after schema changes

When using the Sites plugin, follow its skill instructions for installation, builds, and publishing. These npm commands remain available for standalone use.

The portable build runs Vinext directly without a host `timeout` command. The managed-linux build uses `scripts/build-verified.sh` and its existing `SITES_BUILD_TIMEOUT` setting.

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
