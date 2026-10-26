import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** The teal bold title of an EMR form block ("Input", "Thông tin hành chính"). */
export function EmrSectionTitle({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn("text-[1rem] leading-6 font-bold text-emr-primary-brand", className)}
      {...props}
    />
  );
}
