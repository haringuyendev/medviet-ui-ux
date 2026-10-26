import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * A value the screen shows but nobody may edit, drawn as a filled-in field (health-exam): Input's border, radius and
 * height on a muted ground, so switching between Xem and Sửa moves nothing. A `<dt>`/`<dd>` pair, not an
 * `<input readOnly>` (no caret inviting typing). Render inside a `<dl>`, e.g. `<dl className="grid gap-3 md:grid-cols-2">`.
 */
export function ReadonlyField({
  label,
  value,
  placeholder = "—",
  icon,
  tone = "default",
  multiline = false,
  className,
}: {
  label: string;
  value: string;
  /** Shown, muted, when `value` is empty: "Không", "—"… */
  placeholder?: string;
  icon?: ReactNode;
  /** `destructive` marks a clinical-safety value (dị ứng…); the caller decides, an empty box is never marked. */
  tone?: "default" | "destructive";
  /** Prose rather than a word: taller box, value aligned to the top. */
  multiline?: boolean;
  className?: string;
}) {
  const isEmpty = value.length === 0;
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)}>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "flex gap-1.5 rounded-md border border-input bg-muted/40 px-2.5 py-1.5 text-sm shadow-xs",
          multiline ? "min-h-20 items-start" : "min-h-8 items-center",
          isEmpty && "text-muted-foreground",
          tone === "destructive" &&
            !isEmpty &&
            "border-destructive/40 bg-destructive/5 font-medium text-destructive",
        )}
      >
        {icon}
        <span className="min-w-0 flex-1 break-words whitespace-pre-wrap">
          {isEmpty ? placeholder : value}
        </span>
      </dd>
    </div>
  );
}
