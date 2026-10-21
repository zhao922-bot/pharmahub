import Link from "next/link";
import { Download } from "lucide-react";

import { footer } from "@/lib/copy";

export function SiteFooter() {
  return (
    <footer className="mt-14 border-t border-border/70 py-6">
      <div className="mx-auto w-full max-w-content px-4">
        <p className="text-xs leading-5 text-muted-foreground">{footer.note}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-[11px] text-muted-foreground/70">{footer.builtWith}</p>
          <Link
            href="/export"
            className="inline-flex items-center gap-1 rounded text-[11px] text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          >
            <Download className="h-3 w-3" aria-hidden="true" />
            {footer.exportLink}
          </Link>
        </div>
      </div>
    </footer>
  );
}
