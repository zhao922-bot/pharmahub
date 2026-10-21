"""在教材全文中检索指定药物，输出上下文片段供人工核对。

用法：
    python scripts/lookup-refs.py 美托洛尔 氨氯地平
"""
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent / ".refs"
BOOKS = ["pharmacology", "general", "tcm"]
WINDOW = 700


def main(names):
    texts = {}
    for key in BOOKS:
        p = BASE / f"{key}.txt"
        if p.exists():
            texts[key] = p.read_text(encoding="utf-8")

    for name in names:
        print(f"\n{'=' * 70}\n【{name}】\n{'=' * 70}")
        for key, text in texts.items():
            hits = [m.start() for m in re.finditer(re.escape(name), text)]
            if not hits:
                continue
            print(f"\n--- {key}: {len(hits)} 处命中 ---")
            # 只取前 3 处，避免输出过长
            for idx, pos in enumerate(hits[:3], 1):
                start = max(0, pos - WINDOW // 3)
                end = min(len(text), pos + WINDOW)
                snippet = text[start:end]
                snippet = re.sub(r"\n{2,}", "\n", snippet)
                print(f"\n[命中 {idx} @ {pos}]")
                print(snippet.strip())


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("请提供药物名称")
        sys.exit(1)
    main(sys.argv[1:])
