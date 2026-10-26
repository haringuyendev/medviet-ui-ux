import type { ReactNode } from "react";
import { useId } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/**
 * A labelled on/off switch (web-emr Switch): track, knob, border and sizes from the switch tokens (DS v1: the
 * shadcn switch; EMR: 40 × 20 with a 2px border).
 */
export function SwitchField({
  label,
  checked,
  onCheckedChange,
  disabled,
  labelFirst,
  className,
}: {
  label: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Label before the switch (EMR forms) rather than after it. */
  labelFirst?: boolean;
  className?: string;
}) {
  const id = useId();
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        labelFirst && "flex-row-reverse justify-end",
        className,
      )}
    >
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        className={cn(
          "h-(--switch-height) w-(--switch-width) px-(--switch-padding) border-(length:--switch-border-width) border-switch-border data-[size=default]:h-(--switch-height) data-[size=default]:w-(--switch-width) data-checked:bg-switch-track-on data-unchecked:bg-switch-track",
          "**:data-[slot=switch-thumb]:size-(--switch-knob) **:data-[slot=switch-thumb]:bg-switch-knob **:data-[slot=switch-thumb]:data-checked:bg-switch-knob-on **:data-[slot=switch-thumb]:data-checked:translate-x-(--switch-travel)",
        )}
      />
      <Label
        htmlFor={id}
        className="cursor-pointer text-(length:--label-font-size) font-(weight:--label-font-weight) text-label"
      >
        {label}
      </Label>
    </div>
  );
}
