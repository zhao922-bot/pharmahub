"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CheckCircle2, FileUp, Upload, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { importCopy } from "@/lib/copy-features";

const MAX_FILE_BYTES = 2 * 1024 * 1024;

type ImportKind = keyof typeof importCopy.kindLabels;

interface ImportResponsePayload {
  ok: boolean;
  message?: string;
  kind?: ImportKind;
  total?: number;
  inserted?: number;
  updated?: number;
  skipped?: number;
}

export function ImportPanel() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setFeedback(null);
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setSelectedFile(null);
      setFeedback({ type: "error", message: importCopy.errorTooLarge });
      return;
    }
    setSelectedFile(file);
  }

  async function handleImport() {
    if (!selectedFile || isImporting) return;

    if (selectedFile.size > MAX_FILE_BYTES) {
      setFeedback({ type: "error", message: importCopy.errorTooLarge });
      return;
    }

    setIsImporting(true);
    setFeedback(null);

    try {
      const rawText = await selectedFile.text();
      try {
        JSON.parse(rawText);
      } catch {
        setFeedback({ type: "error", message: importCopy.errorInvalidJson });
        return;
      }

      const response = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: rawText,
      });

      const payload = (await response.json()) as ImportResponsePayload;
      if (!response.ok || !payload.ok) {
        setFeedback({
          type: "error",
          message: payload.message ?? importCopy.errorNetwork,
        });
        return;
      }

      const kindLabel = payload.kind
        ? importCopy.kindLabels[payload.kind]
        : "";
      setFeedback({
        type: "success",
        message: importCopy.successSummary(
          kindLabel,
          payload.total ?? 0,
          payload.inserted ?? 0,
          payload.updated ?? 0,
          payload.skipped ?? 0,
        ),
      });
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch {
      setFeedback({ type: "error", message: importCopy.errorNetwork });
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <section className="mt-6" aria-labelledby="import-heading">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-2.5">
            <FileUp
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <h2 id="import-heading" className="text-[15px] font-semibold">
                {importCopy.sectionTitle}
              </h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {importCopy.sectionBody}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-within:ring-2 focus-within:ring-ring">
              <Upload className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{importCopy.selectFile}</span>
              <input
                ref={inputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>

            <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
              {selectedFile
                ? importCopy.selectedFile(
                    selectedFile.name,
                    (selectedFile.size / 1024).toFixed(1),
                  )
                : importCopy.noFileSelected}
            </span>

            <Button
              type="button"
              size="sm"
              disabled={!selectedFile || isImporting}
              onClick={() => void handleImport()}
              className="shrink-0"
            >
              {isImporting ? importCopy.importing : importCopy.importButton}
            </Button>
          </div>

          <div aria-live="polite" className="mt-3">
            {feedback ? (
              <div
                className={
                  feedback.type === "success"
                    ? "flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-2.5 text-xs text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
                    : "flex items-start gap-2 rounded-lg border border-red-200 bg-red-50/70 px-3 py-2.5 text-xs text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100"
                }
              >
                {feedback.type === "success" ? (
                  <CheckCircle2
                    className="mt-0.5 h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <XCircle
                    className="mt-0.5 h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span className="min-w-0 break-words">{feedback.message}</span>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
