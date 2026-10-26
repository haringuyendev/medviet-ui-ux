import type { ReactNode } from "react";
import { useId } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { EmrLabel } from "./emr-label";
import type { EmrOption } from "./emr-select";

// web-emr Check/styles.module.scss: 16px box, 2px --text-stroke border, radius 4px; selected border and tick
// --primary-brand, selected label --primary-brand; hover label --primary-brand_light.
const box =
  "size-4 rounded-[0.25rem] border-2 border-emr-text-stroke shadow-none data-checked:border-emr-primary-brand data-checked:bg-white data-checked:text-emr-primary-brand focus-visible:ring-0";
const radio =
  "size-4 border-2 border-emr-text-stroke shadow-none data-checked:border-emr-primary-brand data-checked:bg-white data-checked:text-emr-primary-brand [&_svg]:fill-emr-primary-brand focus-visible:ring-0";
const optionLabel =
  "cursor-pointer text-[12px] font-normal text-emr-text-primary transition-colors duration-[250ms] hover:text-emr-primary-brand-light peer-data-checked:text-emr-primary-brand";

/**
 * web-emr's CheckGroup: a title and checkboxes, vertical by default (Chế độ chăm sóc). value is the checked values.
 */
export function EmrCheckGroup({
  label,
  isSup,
  options,
  value,
  onValueChange,
  horizontal,
  readOnly,
}: {
  label?: ReactNode;
  isSup?: boolean;
  options: EmrOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  horizontal?: boolean;
  readOnly?: boolean;
}) {
  const id = useId();
  return (
    <fieldset
      className={cn("flex flex-col gap-1", readOnly && "pointer-events-none opacity-60")}
    >
      {label && (
        <legend className="mb-1 text-[0.75rem] leading-normal text-emr-text-primary">
          {label}
          {isSup && (
            <sup className="relative -top-[0.5em] text-[0.875rem] text-emr-danger-main">
              *
            </sup>
          )}
        </legend>
      )}
      <div className={cn("flex gap-2", horizontal ? "flex-row flex-wrap gap-4" : "flex-col")}>
        {options.map((o) => {
          const itemId = `${id}-${o.value}`;
          const checked = value.includes(o.value);
          return (
            <div key={o.value} className="flex items-center gap-1">
              <Checkbox
                id={itemId}
                checked={checked}
                disabled={o.disabled}
                onCheckedChange={(on) =>
                  onValueChange(on ? [...value, o.value] : value.filter((v) => v !== o.value))
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

/** web-emr's radio list (Tick typeTick radio): round 16px, --primary-brand dot. */
export function EmrRadioGroup({
  label,
  isSup,
  options,
  value,
  onValueChange,
  horizontal,
  readOnly,
}: {
  label?: ReactNode;
  isSup?: boolean;
  options: EmrOption[];
  value: string | null;
  onValueChange: (value: string) => void;
  horizontal?: boolean;
  readOnly?: boolean;
}) {
  const id = useId();
  return (
    <div className={cn("flex flex-col gap-1", readOnly && "pointer-events-none opacity-60")}>
      {label && <EmrLabel id={`${id}-label`} label={label} isSup={isSup} className="mb-1" />}
      <RadioGroup
        aria-labelledby={label ? `${id}-label` : undefined}
        value={value}
        onValueChange={(v) => onValueChange(v as string)}
        className={cn("gap-2", horizontal ? "flex flex-row flex-wrap gap-4" : "flex flex-col")}
      >
        {options.map((o) => (
          <div key={o.value} className="flex items-center gap-1">
            <RadioGroupItem
              id={`${id}-${o.value}`}
              value={o.value}
              disabled={o.disabled}
              className={cn("peer", radio)}
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
