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

/** Pattern characters: 0 = digit, A = letter, * = letter or digit; anything else is a literal filled in for you. */
export const MASKS = {
  time: "00:00",
  "time-seconds": "00:00:00",
  datetime: "00/00/0000 00:00",
  cccd: "000 000 000 000",
  bhyt: "AA0 00 00 000 00000",
  phone: "0000 000 000",
} as const;

/** Apply a pattern to what was typed: keeps matching characters, fills literals, stops when the pattern ends. */
export function applyMask(input: string, pattern: string): string {
  const chars = [...input.replace(/[^\p{L}\p{N}]/gu, "")];
  let out = "";
  let i = 0;
  for (const p of pattern) {
    if (i >= chars.length) break;
    const c = chars[i];
    if (p === "0" || p === "A" || p === "*") {
      const ok = p === "0" ? /\d/.test(c) : p === "A" ? /\p{L}/u.test(c) : true;
      if (!ok) break;
      out += p === "A" ? c.toUpperCase() : c;
      i++;
    } else out += p;
  }
  return out;
}

/** The value without the literals (what an API wants: "001234567890" rather than "001 234 567 890"). */
export const unmask = (value: string) => value.replace(/[^\p{L}\p{N}]/gu, "");

/**
 * A labelled input that formats as you type (web-emr Mask): a preset (time, time-seconds, datetime, cccd, bhyt,
 * phone) or a custom pattern. value is the formatted text; unmask(value) strips the literals.
 *
 *   <MaskedField label="Giờ thực hiện:" mask="time-seconds" value={t} onChange={setT} />
 *   <MaskedField label="Số CCCD:" mask="cccd" value={id} onChange={setId} />
 */
export function MaskedField({
  id,
  label,
  required,
  mask,
  value,
  onChange,
  appearance = "outline",
  width,
  readOnly,
  disabled,
  error,
  vertical,
  placeholder,
}: {
  id?: string;
  label?: ReactNode;
  required?: boolean;
  mask: keyof typeof MASKS | (string & {});
  value: string;
  onChange: (formatted: string) => void;
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
  const pattern = (MASKS as Record<string, string>)[mask] ?? mask;
  const hint = placeholder ?? pattern.replace(/0/g, "_").replace(/[A*]/g, "_");
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
          value={value}
          placeholder={hint}
          readOnly={readOnly}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          inputMode={/[A*]/.test(pattern) ? "text" : "numeric"}
          maxLength={pattern.length}
          onChange={(e) => onChange(applyMask(e.target.value, pattern))}
          className={`${controlText} tabular-nums`}
        />
      </InputGroup>
    </ControlField>
  );
}
