import type { ComponentProps, ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * web-emr's Label: 12px, --text-primary, never wraps, the required mark as a pink superscript `*` (isSup).
 * The colon is part of the text, as in EMR ("Mã NB:").
 */
export function EmrLabel({
  label,
  isSup,
  className,
  ...props
}: Omit<ComponentProps<typeof Label>, "children"> & {
  label: ReactNode;
  isSup?: boolean;
}) {
  if (!label) return null;
  return (
    <Label
      className={cn(
        "flex min-w-max items-center gap-0 text-[0.75rem] leading-normal font-normal text-emr-text-primary transition-all duration-[235ms]",
        className,
      )}
      {...props}
    >
      {label}
      {isSup && (
        <sup className="relative -top-[0.5em] text-[0.875rem] text-emr-danger-main">
          *
        </sup>
      )}
    </Label>
  );
}
