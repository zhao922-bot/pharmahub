import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { detail } from "@/lib/copy";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-content px-4">
        <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            404
          </p>
          <h1 className="mt-3 text-xl font-semibold tracking-tight">
            {detail.notFoundTitle}
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            {detail.notFoundBody}
          </p>
          <Button asChild className="mt-6">
            <Link href="/cards">{detail.backToList}</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
