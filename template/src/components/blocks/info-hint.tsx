import { InfoIcon } from "lucide-react";
import { useId } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * A secondary line kept off the screen: an ⓘ that shows it on hover or keyboard focus (gmhs). The text stays in the
 * DOM (visually hidden) as the button's description, so screen readers and tests still get it.
 */
export function InfoHint({
  text,
  label = "Chi tiết",
}: {
  text: string;
  label?: string;
}) {
  const id = useId();
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label={label}
            aria-describedby={id}
            className="inline-flex size-5 shrink-0 cursor-help items-center justify-center rounded-full opacity-70 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          />
        }
      >
        <InfoIcon aria-hidden="true" className="size-3.5" />
        <span id={id} className="sr-only">
          {text}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">{text}</TooltipContent>
    </Tooltip>
  );
}
