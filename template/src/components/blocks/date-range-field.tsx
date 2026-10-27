import type { ReactNode } from "react";
import { useId } from "react";

import {
  InputGroup,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import type { ControlAppearance } from "./control-field";
import {
  ControlField,
  controlBox,
  controlText,
  widthStyle,
} from "./control-field";
import {
  DateCalendarButton,
  formatDateField,
  maskDate,
  parseDate,
} from "./date-field";

export type DateRangeText = { from: string; to: string };

/** True when both ends are dates and from ≤ to. */
export function isValidRange(range: DateRangeText) {
  const from = parseDate(range.from);
  const to = parseDate(range.to);
  return !!from && !!to && from <= to;
}

/**
 * Từ ngày – đến ngày in one box (web-emr RangeDate): picked on a two-month calendar, or typed with each end masked as
 * DD/MM/YYYY. An end before the start is reported as an error. picker={false} only when the user asked for typing alone.
 */
export function DateRangeField({
  id,
  label,
  required,
  value,
  onChange,
  appearance = "outline",
  width = 270,
  readOnly,
  disabled,
  error,
  vertical,
  picker = true,
}: {
  id?: string;
  label?: ReactNode;
  required?: boolean;
  value: DateRangeText;
  onChange: (value: DateRangeText) => void;
  appearance?: ControlAppearance;
  width?: number | string;
  readOnly?: boolean;
  disabled?: boolean;
  error?: ReactNode;
  vertical?: boolean;
  picker?: boolean;
}) {
  const autoId = useId();
  const fromId = id ?? autoId;
  const from = parseDate(value.from);
  const to = parseDate(value.to);
  const reversed = !!from && !!to && to < from;
  const message = error ?? (reversed ? "Đến ngày phải sau Từ ngày" : undefined);
  const input = (key: keyof DateRangeText, inputId: string, name: string) => (
    <InputGroupInput
      id={inputId}
      aria-label={name}
      inputMode="numeric"
      placeholder="DD/MM/YYYY"
      value={value[key]}
      readOnly={readOnly}
      disabled={disabled}
      aria-invalid={message ? true : undefined}
      onChange={(e) => onChange({ ...value, [key]: maskDate(e.target.value) })}
      className={`${controlText} text-center`}
    />
  );
  return (
    <ControlField
      id={fromId}
      label={label}
      required={required}
      error={message}
      vertical={vertical}
    >
      <InputGroup
        style={widthStyle(width)}
        className={controlBox({
          appearance,
          readOnly,
          disabled,
          invalid: !!message,
        })}
      >
        {input("from", fromId, "Từ ngày")}
        <InputGroupText className="px-0 text-(length:--control-font-size)">
          –
        </InputGroupText>
        {input("to", `${fromId}-to`, "Đến ngày")}
        {picker && (
          <DateCalendarButton
            mode="range"
            disabled={readOnly || disabled}
            selected={from ? { from, to: to ?? undefined } : undefined}
            onSelect={(r) =>
              onChange({
                from: r.from ? formatDateField(r.from) : "",
                to: r.to ? formatDateField(r.to) : "",
              })
            }
          />
        )}
      </InputGroup>
    </ControlField>
  );
}
