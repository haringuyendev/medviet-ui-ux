import type { ReactNode } from "react";
import { useId } from "react";

import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import type { ControlAppearance } from "./control-field";
import {
  ControlField,
  controlBox,
  controlText,
  widthStyle,
} from "./control-field";

/** Digits typed → "DD/MM/YYYY" (slashes fill themselves; day ≤ 31, month 1–12). */
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

/** Date → "DD/MM/YYYY". */
export const formatDateField = (date: Date) =>
  `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;

/**
 * A typed date (web-emr MaskDate): digits become "DD/MM/YYYY" as they are typed, centred like EMR. For picking from a
 * calendar use DatePicker; this is for fast keyboard entry (ngày sinh, ngày cấp).
 */
export function DateField({
  id,
  label,
  required,
  value,
  onChange,
  appearance = "outline",
  width = 130,
  readOnly,
  disabled,
  error,
  vertical,
  placeholder = "DD/MM/YYYY",
}: {
  id?: string;
  label?: ReactNode;
  required?: boolean;
  value: string;
  onChange: (masked: string) => void;
  appearance?: ControlAppearance;
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
    <ControlField
      id={inputId}
      label={label}
      required={required}
      error={error}
      vertical={vertical}
    >
      <InputGroup
        style={widthStyle(width)}
        className={controlBox({
          appearance,
          readOnly,
          disabled,
          invalid: !!error,
        })}
      >
        <InputGroupInput
          id={inputId}
          inputMode="numeric"
          placeholder={placeholder}
          value={value}
          readOnly={readOnly}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          onChange={(e) => onChange(maskDate(e.target.value))}
          className={`${controlText} text-center`}
        />
      </InputGroup>
    </ControlField>
  );
}
