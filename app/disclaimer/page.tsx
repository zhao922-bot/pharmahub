import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Download, ShieldCheck } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { disclaimerCopy, nav, site } from "@/lib/copy";

export const metadata: Metadata = {
  title: disclaimerCopy.pageTitle,
  description: disclaimerCopy.pageBody,
};

export default function DisclaimerPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-content px-4 pb-4">
        <div className="pt-6">
          <Link href="/" className="inline-flex items-center gap-1 rounded text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {nav.home}
          </Link>
          <p className="mt-5 text-xs font-medium text-primary">{site.stageBadge}</p>
          <h1 className="mt-2 text-2xl font-semibold leading-snug tracking-tight sm:text-[28px]">{disclaimerCopy.pageTitle}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{disclaimerCopy.pageBody}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {disclaimerCopy.updatedLabel} · <time dateTime={disclaimerCopy.updatedAt}>{disclaimerCopy.updatedAt}</time>
          </p>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm leading-6">{disclaimerCopy.summary}</p>
        </div>

        <nav aria-label={disclaimerCopy.contentsLabel} className="mt-5 flex flex-wrap gap-2">
          {disclaimerCopy.sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="rounded-full border border-border px-3 py-2 text-xs font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {section.title}
            </a>
          ))}
        </nav>

        <div className="mt-6 space-y-6">
          {disclaimerCopy.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-20 rounded-xl border border-border bg-card p-4 sm:p-6">
              <h2 id={`${section.id}-title`} className="text-lg font-semibold">{section.title}</h2>
              <ul className="mt-5 space-y-5">
                {section.items.map((item) => (
                  <li key={item.title}>
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-7 text-muted-foreground">{item.body}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section aria-labelledby="disclaimer-references" className="mt-6 rounded-xl border border-dashed border-border p-4 sm:p-6">
          <h2 id="disclaimer-references" className="text-base font-semibold">{disclaimerCopy.referenceTitle}</h2>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">{disclaimerCopy.referenceBody}</p>
          <ul className="mt-3 space-y-3">
            {disclaimerCopy.references.map((reference) => (
              <li key={reference.href}>
                <a href={reference.href} target="_blank" rel="noopener noreferrer" className="rounded text-sm text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{reference.title}</a>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/export"><Download className="h-4 w-4" aria-hidden="true" />{disclaimerCopy.exportLink}</Link>
          </Button>
          <Button asChild>
            <Link href="/cards">{disclaimerCopy.backToLearning}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

