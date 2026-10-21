"use client";

import { useState, useTransition } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

import { toggleFavoriteAction } from "@/app/actions";
import { detail } from "@/lib/copy";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  cardId: string;
  initialFavorited: boolean;
}

/**
 * 收藏按钮。
 *
 * 采用乐观更新：点击后立即切换图标，再等服务端确认；
 * 失败则回滚。收藏是低风险操作，不值得让用户等待一次网络往返。
 */
export function FavoriteButton({ cardId, initialFavorited }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (isPending) return;
    const previous = favorited;
    setFavorited(!previous);
    setError(null);
    startTransition(async () => {
      try {
        const result = await toggleFavoriteAction(cardId);
        if (!result.ok) throw new Error("favorite failed");
        setFavorited(result.favorited);
      } catch {
        setFavorited(previous);
        setError(detail.favoriteFailed);
      }
    });
  }

  const Icon = favorited ? BookmarkCheck : Bookmark;
  const label = favorited ? detail.favoriteRemove : detail.favoriteAdd;

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={favorited}
        aria-label={label}
        className={cn(
          // min-h-8（32px）是移动端可点区域的下限。
          // 原来只有 py-1.5 时实测高度 30px，手指点起来容易偏，
          // 加上 min-h 后视觉不变但可点区域达标。
          "inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:opacity-60",
          favorited
            ? "border-primary/30 bg-primary/10 text-primary"
            : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        )}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </button>
      {error ? <span role="alert" className="text-[10px] text-red-700 dark:text-red-300">{error}</span> : null}
    </div>
  );
}
