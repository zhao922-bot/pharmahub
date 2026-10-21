"""把 EPUB 教材抽取为可检索的纯文本（每章一个文件 + 一个合并全文）。

仅用于开发期内容核对，提取的原文保存在已忽略的 .refs/ 中。

用法：python scripts/extract-refs.py pharmacology="路径/药理学.epub"
"""
import argparse
import re
import sys
import zipfile
from pathlib import Path
from html.parser import HTMLParser

OUT = Path(__file__).resolve().parent.parent / ".refs"


class TextExtractor(HTMLParser):
    """把 HTML 转成保留段落边界的纯文本。"""

    BLOCK = {
        "p", "div", "br", "h1", "h2", "h3", "h4", "h5", "h6",
        "li", "tr", "td", "th", "section", "article", "blockquote",
    }

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.skip_depth = 0

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.skip_depth += 1
            return
        if tag in self.BLOCK:
            self.parts.append("\n")

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.skip_depth = max(0, self.skip_depth - 1)
            return
        if tag in self.BLOCK:
            self.parts.append("\n")

    def handle_data(self, data):
        if self.skip_depth == 0:
            self.parts.append(data)

    def text(self):
        raw = "".join(self.parts)
        raw = raw.replace("\u3000", " ")
        raw = re.sub(r"[ \t]+", " ", raw)
        raw = re.sub(r"\n\s*\n\s*\n+", "\n\n", raw)
        return raw.strip()


def html_to_text(html: str) -> str:
    parser = TextExtractor()
    parser.feed(html)
    return parser.text()


def main():
    parser = argparse.ArgumentParser(description="将本地 EPUB 提取到项目 .refs/，不上传参考原文。")
    parser.add_argument("books", nargs="+", metavar="分类=EPUB路径",
                        help="分类可为 pharmacology、general、tcm；路径含空格时给整个参数加引号")
    args = parser.parse_args()
    books = {}
    for spec in args.books:
        key, separator, filename = spec.partition("=")
        if not separator or key not in {"pharmacology", "general", "tcm"}:
            parser.error("请使用 pharmacology=路径、general=路径或 tcm=路径")
        path = Path(filename).expanduser()
        if not path.is_file():
            parser.error(f"找不到 EPUB：{path}")
        if key in books:
            parser.error(f"分类重复：{key}")
        books[key] = path
    OUT.mkdir(parents=True, exist_ok=True)
    for key, path in books.items():
        book_dir = OUT / key
        book_dir.mkdir(exist_ok=True)
        merged = []
        with zipfile.ZipFile(path) as zf:
            html_names = sorted(
                n for n in zf.namelist()
                if n.lower().endswith((".html", ".htm", ".xhtml"))
            )
            for name in html_names:
                html = zf.read(name).decode("utf-8", errors="ignore")
                text = html_to_text(html)
                if not text:
                    continue
                out_name = Path(name).stem + ".txt"
                (book_dir / out_name).write_text(text, encoding="utf-8")
                merged.append(f"\n\n===== {name} =====\n\n{text}")
        (OUT / f"{key}.txt").write_text("".join(merged), encoding="utf-8")
        print(f"{key}: {len(html_names)} html -> {len(merged)} txt, "
              f"{(OUT / (key + '.txt')).stat().st_size:,} bytes")


if __name__ == "__main__":
    sys.exit(main())
