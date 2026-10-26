import { CalendarIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useId, useState } from "react";

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
import { formatDateField, maskDate, parseDate } from "./date-field";

/**
 * A date typed as DD/MM/YYYY or picked from a calendar (web-emr SelectDate / PickerDate): the text and the calendar
 * stay in sync. value is the masked text; parseDate(value) gives the Date.
 */
export function DatePickerField({
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
  const [open, setOpen] = useState(false);
  const selected = parseDate(value) ?? undefined;
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
          className={controlText}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              disabled={readOnly || disabled}
              render={
                <InputGroupButton
                  size="icon-xs"
                  aria-label="Chọn ngày trên lịch"
                />
              }
            >
              <CalendarIcon />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <Calendar
                mode="single"
                locale={calendarLocale("vi")}
                selected={selected}
                defaultMonth={selected}
                captionLayout="dropdown"
                onSelect={(d) => {
                  if (d) onChange(formatDateField(d));
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </ControlField>
  );
}
