import type { ReactNode } from "react";
import { useId } from "react";

import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { EmrField } from "./emr-field";
import type { EmrKindStyle } from "./emr-text-field";
import { KIND, KIND_READONLY } from "./emr-text-field";

/** Digits typed → "DD/MM/YYYY" (slashes fill themselves; day ≤ 31, month ≤ 12). */
export function maskDate(input: string): string {
  const d = input.replace(/\D/g, "").slice(0, 8);
  const day = d.slice(0, 2);
  const month = d.slice(2, 4);
  const year = d.slice(4);
  if (day.length === 2 && Number(day) > 31) return day.slice(0, 1);
  if (month.length === 2 && (Number(month) > 12 || Number(month) === 0))
    return `${day}/${month.slice(0, 1)}`;
  return [day, month, year].filter(Boolean).join("/");
}

/** "DD/MM/YYYY" → Date, or null when incomplete or not a real date. */
export function parseDate(value: string): Date | null {
  const m = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const date = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  return date.getDate() === Number(m[1]) ? date : null;
}

/**
 * web-emr's MaskDate: a typed date in a 24px box with the "DD/MM/YYYY" placeholder centred, as on EMR forms
 * (Ngày sinh). value/onChange carry the masked text; parseDate turns it into a Date.
 */
export function EmrDateInput({
  id,
  label,
  isSup,
  value,
  onChange,
  kindStyle = "border_enter",
  width = 130,
  readOnly,
  disabled,
  error,
  vertical,
  placeholder = "DD/MM/YYYY",
}: {
  id?: string;
  label?: ReactNode;
  isSup?: boolean;
  value: string;
  onChange: (masked: string) => void;
  kindStyle?: EmrKindStyle;
  width?: number | string;
  readOnly?: boolean;
  disabled?: boolean;
  error?: ReactNode;
  vertical?: boolean;
  placeholder?: string;
}) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <EmrField
      id={inputId}
      label={label}
      isSup={isSup}
      error={error}
      vertical={vertical}
    >
      <InputGroup
        style={{ width: typeof width === "number" ? `${width}px` : width }}
        className={cn(
          "h-6 min-h-6 rounded-[0.3rem] shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0",
          KIND[kindStyle],
          readOnly && "bg-emr-bg-readonly",
          readOnly && KIND_READONLY[kindStyle] === "" && "bg-transparent",
          disabled && "bg-emr-bg-disable",
          error && "border-emr-danger-main",
        )}
      >
        <InputGroupInput
          id={inputId}
          inputMode="numeric"
          placeholder={placeholder}
          value={value}
          readOnly={readOnly}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          onChange={(e) => onChange(maskDate(e.target.value))}
          className="h-[18px] px-1 py-0 text-center text-[12px] text-emr-text-primary placeholder:text-[0.875rem] placeholder:text-emr-info"
        />
      </InputGroup>
    </EmrField>
  );
}
