import type { ComponentProps } from "react";

import { Input } from "@/components/ui/input";

type TimeInputProps = Omit<
  ComponentProps<typeof Input>,
  "value" | "onChange" | "type"
> & {
  /** `HH:mm`, 24-hour, or "" for none. */
  value: string;
  onChange(next: string): void;
};

/**
 * Keeps the digits as `HH:mm`: the colon fills itself in, an hour above 23 or a minute above 59 is refused. A native
 * `type="time"` follows the OS locale and shows a 12-hour "--:-- --" box on an English one. (gmhs, health-exam)
 */
export function maskTime(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 4);
  const hour = digits.slice(0, 2);
  const minute = digits.slice(2);
  if (hour.length === 2 && Number(hour) > 23) return hour.slice(0, 1);
  if (minute.length === 2 && Number(minute) > 59)
    return `${hour}:${minute.slice(0, 1)}`;
  return minute ? `${hour}:${minute}` : hour;
}

export function TimeInput({ value, onChange, ...props }: TimeInputProps) {
  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      placeholder="hh:mm"
      value={value}
      onChange={(event) => onChange(maskTime(event.target.value))}
    />
  );
}
