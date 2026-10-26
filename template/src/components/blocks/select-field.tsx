import type { ReactNode } from "react";
import { useId } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ControlField, widthStyle } from "./control-field";

export type FieldOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

/**
 * A labelled select (web-emr Select / AutoComplete with static options): the trigger takes the control tokens, the
 * list the popover colours; the hovered option is --accent. Type-to-search over a long or remote list: Combobox.
 *
 *   <SelectField label="Giới tính:" required width={146} options={GENDERS} value={sex} onValueChange={setSex} />
 */
export function SelectField({
  id,
  label,
  required,
  options,
  value,
  onValueChange,
  placeholder,
  width = 146,
  readOnly,
  disabled,
  error,
  vertical,
}: {
  id?: string;
  label?: ReactNode;
  required?: boolean;
  options: FieldOption[];
  value?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  width?: number | string;
  readOnly?: boolean;
  disabled?: boolean;
  error?: ReactNode;
  vertical?: boolean;
}) {
  const autoId = useId();
  const triggerId = id ?? autoId;
  return (
    <ControlField
      id={triggerId}
      label={label}
      required={required}
      error={error}
      vertical={vertical}
    >
      <Select
        value={value ?? null}
        onValueChange={(v) => onValueChange?.(v as string | null)}
        disabled={disabled || readOnly}
        items={options}
      >
        <SelectTrigger
          id={triggerId}
          size="sm"
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          style={widthStyle(width)}
          className={cn(
            "h-(--control-height) min-h-(--control-height) rounded-(--control-radius) border-(length:--control-border-width) border-input bg-card px-(--control-padding-x) py-0 text-(length:--control-font-size) text-control-fg shadow-none focus-visible:border-ring focus-visible:ring-0 data-[size=sm]:h-(--control-height) data-placeholder:text-control-placeholder",
            readOnly && "bg-control-readonly disabled:opacity-100",
            error && "border-destructive",
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-list text-(length:--control-font-size)">
          {options.map((o) => (
            <SelectItem
              key={o.value}
              value={o.value}
              disabled={o.disabled}
              className="text-(length:--control-font-size) focus:bg-accent focus:text-accent-foreground"
            >
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </ControlField>
  );
}
