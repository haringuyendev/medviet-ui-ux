import type { ReactNode } from "react";
import { useId } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { ControlLabel } from "./control-field";
import type { FieldOption } from "./select-field";

// check tokens: size, border, radius, checked fill/tick, label size and checked label colour
const box =
  "size-(--check-size) rounded-(--check-radius) border-(length:--check-border-width) border-check-border shadow-none focus-visible:ring-0 data-checked:border-check-on data-checked:bg-check-checked data-checked:text-check-checked-foreground";
const dot =
  "size-(--check-size) border-(length:--check-border-width) border-check-border shadow-none focus-visible:ring-0 data-checked:border-check-on data-checked:bg-check-checked data-checked:text-check-on [&_svg]:fill-check-on";
const optionLabel =
  "cursor-pointer text-(length:--check-label-size) font-normal text-label transition-colors peer-data-checked:text-check-label-on";

function GroupTitle({
  id,
  label,
  required,
}: {
  id: string;
  label: ReactNode;
  required?: boolean;
}) {
  return (
    <ControlLabel id={id} label={label} required={required} className="mb-1" />
  );
}

/**
 * A titled list of checkboxes (web-emr CheckGroup), vertical by default. value is the checked values.
 *
 *   <CheckboxGroup label="Chế độ chăm sóc:" options={CARE} value={care} onValueChange={setCare} />
 */
export function CheckboxGroup({
  label,
  required,
  options,
  value,
  onValueChange,
  horizontal,
  readOnly,
}: {
  label?: ReactNode;
  required?: boolean;
  options: FieldOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  horizontal?: boolean;
  readOnly?: boolean;
}) {
  const id = useId();
  return (
    <fieldset
      aria-labelledby={label ? `${id}-title` : undefined}
      className={cn(
        "m-0 flex min-w-0 flex-col gap-1 border-0 p-0",
        readOnly && "pointer-events-none opacity-60",
      )}
    >
      {label && (
        <GroupTitle id={`${id}-title`} label={label} required={required} />
      )}
      <div
        className={cn(
          "flex gap-2",
          horizontal ? "flex-row flex-wrap gap-4" : "flex-col",
        )}
      >
        {options.map((o) => {
          const itemId = `${id}-${o.value}`;
          return (
            <div key={o.value} className="flex items-center gap-1">
              <Checkbox
                id={itemId}
                checked={value.includes(o.value)}
                disabled={o.disabled}
                onCheckedChange={(on) =>
                  onValueChange(
                    on
                      ? [...value, o.value]
                      : value.filter((v) => v !== o.value),
                  )
                }
                className={cn("peer", box)}
              />
              <Label htmlFor={itemId} className={optionLabel}>
                {o.label}
              </Label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

/** A titled list of radio options (web-emr Tick, radio), vertical by default. */
export function RadioList({
  label,
  required,
  options,
  value,
  onValueChange,
  horizontal,
  readOnly,
}: {
  label?: ReactNode;
  required?: boolean;
  options: FieldOption[];
  value: string | null;
  onValueChange: (value: string) => void;
  horizontal?: boolean;
  readOnly?: boolean;
}) {
  const id = useId();
  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        readOnly && "pointer-events-none opacity-60",
      )}
    >
      {label && (
        <GroupTitle id={`${id}-title`} label={label} required={required} />
      )}
      <RadioGroup
        aria-labelledby={label ? `${id}-title` : undefined}
        value={value}
        onValueChange={(v) => onValueChange(v as string)}
        className={cn(
          "gap-2",
          horizontal ? "flex flex-row flex-wrap gap-4" : "flex flex-col",
        )}
      >
        {options.map((o) => (
          <div key={o.value} className="flex items-center gap-1">
            <RadioGroupItem
              id={`${id}-${o.value}`}
              value={o.value}
              disabled={o.disabled}
              className={cn("peer", dot)}
            />
            <Label htmlFor={`${id}-${o.value}`} className={optionLabel}>
              {o.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
