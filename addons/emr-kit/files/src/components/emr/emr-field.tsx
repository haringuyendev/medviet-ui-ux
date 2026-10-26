import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { EmrLabel } from "./emr-label";

/**
 * EMR field layout: label beside the control (horizontal, EMR default) or above it (vertical), with the error
 * message under it. Used by every EMR input.
 */
export function EmrField({
  id,
  label,
  isSup,
  error,
  vertical,
  className,
  children,
}: {
  id?: string;
  label?: ReactNode;
  isSup?: boolean;
  error?: ReactNode;
  vertical?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div
        className={cn(
          "flex gap-2",
          vertical ? "flex-col items-start gap-1" : "items-center",
        )}
      >
        {label && (
          <EmrLabel
            htmlFor={id}
            label={label}
            isSup={isSup}
            className={cn(error && "text-emr-danger-main")}
          />
        )}
        {children}
      </div>
      {error && (
        <p className="text-[0.75rem] text-emr-danger-main" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
