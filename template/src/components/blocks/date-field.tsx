import { CalendarIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useId, useState } from "react";
import type { DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { calendarLocale } from "@/lib/calendar-locale";
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
 * The calendar button at the end of a date box: one date, or a range on two months. Users pick dates; typing
 * DD/MM/YYYY stays possible in the box itself.
 */
export function DateCalendarButton(
  props: { disabled?: boolean } & (
    | { mode: "single"; selected?: Date; onSelect: (date: Date) => void }
    | {
        mode: "range";
        selected?: DateRange;
        onSelect: (range: DateRange) => void;
      }
  ),
) {
  const [open, setOpen] = useState(false);
  return (
    <InputGroupAddon align="inline-end">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          disabled={props.disabled}
          render={
            <InputGroupButton
              size="icon-xs"
              aria-label={
                props.mode === "range"
                  ? "Chọn khoảng ngày trên lịch"
                  : "Chọn ngày trên lịch"
              }
            />
          }
        >
          <CalendarIcon />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0">
          {props.mode === "single" ? (
            <Calendar
              mode="single"
              locale={calendarLocale("vi")}
              selected={props.selected}
              defaultMonth={props.selected}
              captionLayout="dropdown"
              onSelect={(d) => {
                if (d) props.onSelect(d);
                setOpen(false);
              }}
            />
          ) : (
            <Calendar
              mode="range"
              locale={calendarLocale("vi")}
              numberOfMonths={2}
              selected={props.selected}
              defaultMonth={props.selected?.from}
              onSelect={(_, picked) => {
                // first click: the start (or a new start after a full range); second click: the end, then close.
                // react-day-picker would fill both ends on the first click.
                const prev = props.selected;
                const range: DateRange =
                  !prev?.from || prev.to
                    ? { from: picked, to: undefined }
                    : picked < prev.from
                      ? { from: picked, to: prev.from }
                      : { from: prev.from, to: picked };
                props.onSelect(range);
                if (range.to) setOpen(false);
              }}
            />
          )}
        </PopoverContent>
      </Popover>
    </InputGroupAddon>
  );
}

/**
 * A date field: a calendar to pick from (vi-VN, month/year dropdowns), and DD/MM/YYYY typed with an auto-filling mask
 * for fast keyboard entry (web-emr MaskDate / SelectDate). value is the masked text; parseDate(value) gives the Date.
 * picker={false} only when the user asked for typing alone.
 */
export function DateField({
  id,
  label,
  required,
  value,
  onChange,
  appearance = "outline",
  width = 150,
  readOnly,
  disabled,
  error,
  vertical,
  placeholder = "DD/MM/YYYY",
  picker = true,
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
  picker?: boolean;
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
          className={picker ? controlText : `${controlText} text-center`}
        />
        {picker && (
          <DateCalendarButton
            mode="single"
            disabled={readOnly || disabled}
            selected={parseDate(value) ?? undefined}
            onSelect={(d) => onChange(formatDateField(d))}
          />
        )}
      </InputGroup>
    </ControlField>
  );
}
