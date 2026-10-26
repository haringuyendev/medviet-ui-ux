import type { ReactNode } from "react";
import { useId } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * One labelled checkbox (web-emr Tick). `fill` is web-emr Turn: a square that fills with the check colour when on
 * (bật/tắt one option, e.g. "Ưu tiên"). Box, border and checked colours come from the check tokens.
 */
export function CheckboxField({
  label,
  checked,
  onCheckedChange,
  fill,
  disabled,
  readOnly,
  className,
}: {
  label: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  fill?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}) {
  const id = useId();
  return (
    <div
      className={cn(
        "flex items-center gap-1",
        readOnly && "pointer-events-none opacity-60",
        className,
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(on) => onCheckedChange(on === true)}
        className={cn(
          "peer size-(--check-size) rounded-(--check-radius) border-(length:--check-border-width) border-check-border shadow-none focus-visible:ring-0 data-checked:border-check-on",
          fill
            ? "data-checked:bg-check-on data-checked:text-check-on"
            : "data-checked:bg-check-checked data-checked:text-check-checked-foreground",
        )}
      />
      <Label
        htmlFor={id}
        className="cursor-pointer text-(length:--check-label-size) font-normal text-label peer-data-checked:text-check-label-on"
      >
        {label}
      </Label>
    </div>
  );
}
