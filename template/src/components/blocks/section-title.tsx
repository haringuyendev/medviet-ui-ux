import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** The title of a block of a screen or form; size, weight and colour from the section-title tokens. */
export function SectionTitle({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "text-(length:--section-title-size) leading-6 font-(weight:--section-title-weight) text-section-title",
        className,
      )}
      {...props}
    />
  );
}
