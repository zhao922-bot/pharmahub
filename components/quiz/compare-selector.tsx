"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { quiz as quizCopy } from "@/lib/copy";

/** 原生选择框让键盘和手机用户能直接到达任意对比组。 */
export function CompareSelector({ groups, activeId }: {
  groups: Array<{ id: string; title: string }>;
  activeId?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <div className="mt-3 space-y-1.5">
      <label htmlFor="compare-select" className="text-xs font-medium text-muted-foreground">
        {quizCopy.compareSelectLabel}
      </label>
      <select
        id="compare-select"
        name="compare"
        value={activeId ?? ""}
        disabled={pending}
        aria-busy={pending}
        onChange={(event) => {
          const id = event.target.value;
          if (id) startTransition(() => router.push(`/quiz?compare=${encodeURIComponent(id)}`));
        }}
        className="block h-11 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
      >
        <option value="" disabled>{quizCopy.compareSelectPlaceholder(groups.length)}</option>
        {groups.map((group) => <option key={group.id} value={group.id}>{group.title}</option>)}
      </select>
    </div>
  );
}
