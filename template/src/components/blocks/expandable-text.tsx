import { useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Long text shown on a few lines with "Xem thêm" / "Thu gọn" (web-emr CollapsedText): the toggle appears only when the
 * text is actually cut. Keeps line breaks.
 */
export function ExpandableText({
  text,
  lines = 3,
  moreLabel = "Xem thêm",
  lessLabel = "Thu gọn",
  className,
}: {
  text: string;
  lines?: number;
  moreLabel?: string;
  lessLabel?: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [cut, setCut] = useState(false);
  // measure after layout: is the clamped paragraph shorter than its content? (again when the text or lines change)
  // biome-ignore lint/correctness/useExhaustiveDependencies: text and lines change what is cut
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && !open) setCut(el.scrollHeight > el.clientHeight + 1);
  }, [text, lines, open]);
  return (
    <div
      className={cn(
        "text-(length:--control-font-size) text-control-fg",
        className,
      )}
    >
      <p
        ref={ref}
        className="break-words whitespace-pre-wrap"
        style={
          open
            ? undefined
            : {
                display: "-webkit-box",
                WebkitLineClamp: lines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
        }
      >
        {text}
      </p>
      {(cut || open) && (
        <Button
          type="button"
          variant="link"
          size="xs"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="mt-0.5 h-auto px-0 text-(length:--control-font-size)"
        >
          {open ? lessLabel : moreLabel}
        </Button>
      )}
    </div>
  );
}
