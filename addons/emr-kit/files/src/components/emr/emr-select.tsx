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
import { EmrField } from "./emr-field";

export type EmrOption = { value: string; label: ReactNode; disabled?: boolean };

/**
 * web-emr's Select / AutoComplete (static options) with the antd theme of ProviderAntd: 24px box, 12px Roboto,
 * chevron, options on --bg-secondary, hovered option --primary-hover, selected --bg-secondary (normal weight).
 *
 *   <EmrSelect label="Giới tính:" isSup width={146} options={GENDERS} value={sex} onValueChange={setSex} />
 */
export function EmrSelect({
  id,
  label,
  isSup,
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
  isSup?: boolean;
  options: EmrOption[];
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
    <EmrField
      id={triggerId}
      label={label}
      isSup={isSup}
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
          style={{ width: typeof width === "number" ? `${width}px` : width }}
          className={cn(
            "h-6 min-h-6 data-[size=sm]:h-6 rounded-[5px] border-[0.5px] border-emr-text-stroke bg-white px-1.5 py-0 text-[12px] text-emr-text-primary shadow-none focus-visible:border-emr-primary-active focus-visible:ring-0 data-placeholder:text-emr-text-primary",
            readOnly && "bg-emr-bg-secondary disabled:opacity-100",
            error && "border-emr-danger-main",
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-emr-bg-secondary text-[12px]">
          {options.map((o) => (
            <SelectItem
              key={o.value}
              value={o.value}
              disabled={o.disabled}
              className="text-[12px] text-emr-text-primary focus:bg-emr-primary-hover data-selected:bg-emr-bg-secondary data-selected:font-normal"
            >
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </EmrField>
  );
}
