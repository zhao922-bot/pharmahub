"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { DrugCardListItem } from "@/components/cards/drug-card-list-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cards as cardsCopy } from "@/lib/copy";
import type { Category, CategoryId } from "@/lib/types";
import type { DrugCardSummary } from "@/lib/data/cards";
import {
  buildSearchIndex,
  searchCardIndex,
  type SearchMatch,
} from "@/lib/search";
import { cn } from "@/lib/utils";

type CategoryFilter = CategoryId | "all";

interface CardBrowserProps {
  cards: DrugCardSummary[];
  categories: readonly Category[];
  categoryCounts: Record<CategoryId, number>;
  totalCount: number;
  /** 从首页分类入口带入的初始分类 */
  initialCategory: CategoryId | null;
}

/**
 * 卡片库的搜索 + 分类筛选。
 *
 * 卡片的可搜索摘要统一传入客户端并在内存中建立索引，
 * 本地过滤能带来零延迟的输入体验，也避免了每次按键都请求服务端。
 *
 * 搜索逻辑与服务端 `cardRepository.getSummaries({ keyword })` 共用
 * `lib/search` 里的同一套函数，保证两边结果一致。
 */
export function CardBrowser({
  cards,
  categories,
  categoryCounts,
  totalCount,
  initialCategory,
}: CardBrowserProps) {
  const [keyword, setKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(
    initialCategory ?? "all",
  );

  const trimmedKeyword = keyword.trim();

  // 输入很频繁，用 deferred value 让筛选计算不阻塞按键渲染
  const deferredKeyword = useDeferredValue(trimmedKeyword);

  // 索引只在卡片数据变化时重建一次
  const index = useMemo(() => buildSearchIndex(cards), [cards]);

  const matched = useMemo(() => {
    const hits = searchCardIndex(index, deferredKeyword);
    const cardById = new Map(cards.map((card) => [card.id, card]));
    return hits
      .map((hit) => {
        const card = cardById.get(hit.id);
        return card ? { card, match: hit.match } : null;
      })
      .filter((entry): entry is { card: DrugCardSummary; match: SearchMatch | null } =>
        entry !== null,
      );
  }, [index, cards, deferredKeyword]);

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? matched
        : matched.filter((entry) => entry.card.category === activeCategory),
    [matched, activeCategory],
  );

  const hasKeyword = deferredKeyword.length > 0;
  const isFiltering = activeCategory !== "all" || hasKeyword;

  // 输入与结果不同步时（deferred 还没追上），提示正在搜索
  const isStale = hasKeyword && trimmedKeyword !== deferredKeyword;

  function resetFilters() {
    setKeyword("");
    setActiveCategory("all");
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="relative">
          <label htmlFor="card-search" className="sr-only">
            {cardsCopy.searchLabel}
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="card-search"
            type="text"
            inputMode="search"
            autoComplete="off"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder={cardsCopy.searchPlaceholder}
            className="pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden"
          />
          {keyword.length > 0 ? (
            <button
              type="button"
              onClick={() => setKeyword("")}
              aria-label={cardsCopy.clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {/* 分类筛选：移动端横向滚动，避免换行挤压 */}
        <div
          role="group"
          aria-label={cardsCopy.allCategories}
          className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max items-center gap-2 sm:w-full sm:flex-wrap">
            <FilterChip
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
              label={cardsCopy.allCategories}
              count={totalCount}
            />
            {categories.map((category) => (
              <FilterChip
                key={category.id}
                active={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
                label={category.name}
                count={categoryCounts[category.id]}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {isFiltering
            ? cardsCopy.resultCountFiltered(filtered.length, totalCount)
            : cardsCopy.resultCount(totalCount)}
        </p>
        {isFiltering ? (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs">
            {cardsCopy.resetFilters}
          </Button>
        ) : null}
      </div>

      {filtered.length > 0 ? (
        <ul
          className={cn(
            "space-y-3 transition-opacity",
            isStale && "opacity-60",
          )}
        >
          {filtered.map((entry) => (
            <li key={entry.card.id}>
              <DrugCardListItem card={entry.card} match={entry.match} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-10 text-center">
          <p className="text-sm font-medium">{cardsCopy.emptyTitle}</p>
          <p className="mt-1 text-xs text-muted-foreground">{cardsCopy.emptyBody}</p>
          <Button variant="outline" size="sm" onClick={resetFilters} className="mt-4">
            {cardsCopy.resetFilters}
          </Button>
        </div>
      )}

      {/* 搜索范围提示：只在没有输入时展示，避免干扰结果 */}
      {!hasKeyword ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/20 p-3.5">
          <p className="text-xs font-medium">{cardsCopy.searchHintTitle}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {cardsCopy.searchHintBody}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground/80 hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "text-[11px] tabular-nums",
          active ? "text-primary-foreground/70" : "text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}
