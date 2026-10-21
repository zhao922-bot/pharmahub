/**
 * 错题重练端到端验收。
 *
 * 覆盖：空状态 → 重练入口 → 出题数量 → 出题顺序 → 完成结果 →
 *       答对标记 → 记录保留。
 *
 * 关键点：出题顺序用**预置的已知 wrong_count**来验证，而不是依赖随机答题
 * 产生的数据。这样断言是确定的，不会时过时不过。
 *
 * 用法：先 pnpm build，再 pnpm verify -- verify-review
 */
import puppeteer from "puppeteer-core";
import Database from "better-sqlite3";
import { resolveBrowserPath } from "./browser-path.mjs";
import { getVerificationContext } from "./verify-context.mjs";

const { baseURL: BASE, dbPath: DB_PATH } = getVerificationContext();
const CHROME = resolveBrowserPath();

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 900 });

const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
};

/** 直接读写数据库，用于预置确定的数据 */
function withDb(fn) {
  const db = new Database(DB_PATH);
  try {
    return fn(db);
  } finally {
    db.close();
  }
}

function resetData() {
  withDb((db) => {
    db.exec(
      "DELETE FROM quiz_attempt; DELETE FROM wrong_question; DELETE FROM review_log; DELETE FROM review_history; DELETE FROM favorite;",
    );
  });
}

/**
 * 预置一组已知错题。wrong_count 与期望排序一致地设置，
 * 并让 last_wrong_at 各不相同以避免同分时的排序歧义。
 *
 * correctFragment 是该题正确选项里必然出现的文本片段，
 * 用于「答对」场景下精确点选正确答案（选项顺序是打乱的）。
 */
const SEEDED = [
  {
    questionId: "metoprolol:target",
    cardId: "metoprolol",
    kind: "target",
    wrongCount: 5,
    name: "美托洛尔",
    correctFragment: "选择性阻断心肌",
  },
  {
    questionId: "metformin:target",
    cardId: "metformin",
    kind: "target",
    wrongCount: 4,
    name: "二甲双胍",
    correctFragment: "抑制肝糖异生",
  },
  {
    questionId: "omeprazole:category",
    cardId: "omeprazole",
    kind: "category",
    wrongCount: 3,
    name: "奥美拉唑",
    correctFragment: "消化系统",
  },
  {
    questionId: "aspirin:indication",
    cardId: "aspirin",
    kind: "indication",
    wrongCount: 1,
    name: "阿司匹林",
    correctFragment: "动脉粥样硬化",
  },
];

function seedWrongQuestions() {
  withDb((db) => {
    const insert = db.prepare(
      `INSERT INTO wrong_question (question_id, card_id, kind, wrong_count, last_wrong_at)
       VALUES (?, ?, ?, ?, ?)`,
    );
    // 故意按乱序插入，验证排序不是靠插入顺序
    for (const item of [SEEDED[2], SEEDED[0], SEEDED[3], SEEDED[1]]) {
      const timestamp = new Date(Date.now() - item.wrongCount * 60_000).toISOString();
      insert.run(item.questionId, item.cardId, item.kind, item.wrongCount, timestamp);
    }
  });
}

/**
 * 逐题走完整个重练流程，返回按出现顺序去重后的题干。
 *
 * 去重是必要的：答完一题后题干仍留在屏幕上（同时展示判定与解析），
 * 如果每轮都记录，同一题会被记两次。
 *
 * 这里用**题号索引**去重，而不是「题干与上一条比较」。
 * 原因：点「下一题」后页面有短暂过渡期，题干可能还没切换，
 * 此时采集会拿到上一题的残留文本。只比较相邻项挡不住这种错位
 * （会出现 A → A → B → A 这样的序列），必须按题号归位。
 *
 * answerCorrectly 为 true 时按 correctFragment 点选正确答案，
 * 否则点第一个选项（用来制造答错）。
 */
async function walkThroughReview({ answerCorrectly = false } = {}) {
  await page.goto(`${BASE}/quiz/review`, { waitUntil: "networkidle0" });

  /** 题号 → 题干，天然去重 */
  const promptByIndex = new Map();
  let guard = 0;

  while (guard < 40) {
    guard += 1;

    const state = await page.evaluate(() => {
      const text = document.body.textContent || "";
      const progress = text.match(/第\s*(\d+)\s*\/\s*(\d+)\s*题/);
      return {
        done: text.includes("错题重练完成"),
        index: progress ? Number(progress[1]) : null,
        total: progress ? Number(progress[2]) : null,
        prompt: document.querySelector("p.text-\\[15px\\]")?.textContent?.trim() ?? "",
        hasNext: Array.from(document.querySelectorAll("button")).some((b) =>
          /下一题|查看结果/.test(b.textContent || ""),
        ),
      };
    });

    if (state.done) break;

    // 按题号记录：同一题号只保留第一次采集到的题干
    if (state.index !== null && state.prompt && !promptByIndex.has(state.index)) {
      promptByIndex.set(state.index, state.prompt);
    }

    if (state.hasNext) {
      await page.evaluate(() => {
        const button = Array.from(document.querySelectorAll("button")).find((b) =>
          /下一题|查看结果/.test(b.textContent || ""),
        );
        if (button) button.click();
      });
    } else {
      // 找出当前题对应的正确片段
      const current = SEEDED.find((item) => (state.prompt ?? "").includes(item.name));
      const fragment = answerCorrectly && current ? current.correctFragment : "";

      const answered = await page.evaluate((target) => {
        const options = Array.from(
          document.querySelectorAll("ul li button:not([disabled])"),
        );
        if (options.length === 0) return false;
        if (target) {
          const hit = options.find((option) => (option.textContent || "").includes(target));
          if (hit) {
            hit.click();
            return true;
          }
        }
        options[0].click();
        return true;
      }, fragment);

      if (!answered) break;
    }

    await new Promise((resolve) => setTimeout(resolve, 700));
  }

  // 按题号升序输出，保证顺序与页面一致
  return [...promptByIndex.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, prompt]) => prompt);
}

// === 1. 空状态 ===
resetData();
await page.goto(`${BASE}/quiz/review`, { waitUntil: "networkidle0" });
const emptyState = await page.evaluate(() => {
  const text = document.body.textContent || "";
  return { hasEmpty: text.includes("错题本是空的"), hasCta: text.includes("去做测验") };
});
check("空错题本显示引导", emptyState.hasEmpty && emptyState.hasCta);

// === 2. 预置错题后重练 ===
seedWrongQuestions();

await page.goto(`${BASE}/wrong-book`, { waitUntil: "networkidle0" });
const wrongBookPage = await page.evaluate(() => {
  const text = document.body.textContent || "";
  const retryLink = Array.from(document.querySelectorAll("a")).find(
    (a) => a.getAttribute("href") === "/quiz/review",
  );
  return {
    hasRetry: Boolean(retryLink),
    hasCount: /本次重练\s*4\s*道题/.test(text.replace(/\s+/g, " ")),
  };
});
check("错题本显示重练入口", wrongBookPage.hasRetry);
check("错题本显示重练题数", wrongBookPage.hasCount);

const prompts = await walkThroughReview();
check(
  "重练题数等于错题数",
  prompts.length === SEEDED.length,
  `实际 ${prompts.length} / 预期 ${SEEDED.length}`,
);

// === 3. 出题顺序必须按错误次数降序 ===
const orderedCorrectly = SEEDED.every((item, index) =>
  (prompts[index] ?? "").includes(item.name),
);
check(
  "出题顺序按错误次数降序",
  orderedCorrectly,
  prompts.map((p, i) => `${i + 1}.${p.slice(0, 12)}`).join(" "),
);

// === 4. 结果页 ===
const resultPage = await page.evaluate(() => {
  const text = document.body.textContent || "";
  return {
    hasDone: text.includes("错题重练完成"),
    hasScore: /\d+\s*\/\s*\d+/.test(text),
    hasBack: text.includes("回到错题本"),
    hasRetry: text.includes("再练一遍"),
  };
});
check("重练完成显示结果页", resultPage.hasDone);
check("结果页显示得分", resultPage.hasScore);
check("结果页有回到错题本", resultPage.hasBack);
check("结果页有再练一遍", resultPage.hasRetry);

// === 5. 答对后标记，但记录保留 ===
// 重新预置错题，这次全部答对，验证 last_correct_at 会被写入
resetData();
seedWrongQuestions();
await walkThroughReview({ answerCorrectly: true });

const afterCorrect = withDb((db) => ({
  total: db.prepare("SELECT COUNT(*) n FROM wrong_question").get().n,
  mastered: db
    .prepare("SELECT COUNT(*) n FROM wrong_question WHERE last_correct_at IS NOT NULL")
    .get().n,
}));
check(
  "错题记录未被自动删除",
  afterCorrect.total === SEEDED.length,
  `${afterCorrect.total} / ${SEEDED.length}`,
);
check(
  "答对的错题被标记为已答对",
  afterCorrect.mastered > 0,
  `已答对 ${afterCorrect.mastered} / ${afterCorrect.total} 道`,
);

// === 6. 再练一遍仍可进入 ===
await page.goto(`${BASE}/quiz/review`, { waitUntil: "networkidle0" });
const canRetry = await page.evaluate(
  () => (document.querySelector("p.text-\\[15px\\]")?.textContent?.trim() ?? "").length > 0,
);
check("再次进入重练页仍有题目", canRetry);

await browser.close();

// 收尾：清空测试数据，避免影响人工使用
resetData();

console.log(`\n结果: ${results.filter(Boolean).length}/${results.length} 通过`);
process.exit(results.every(Boolean) ? 0 : 1);
