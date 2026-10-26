import type { CountryCode } from "libphonenumber-js/max";
import {
  AsYouType,
  getCountryCallingCode,
  isValidPhoneNumber,
} from "libphonenumber-js/max";
import type { ReactNode } from "react";
import { useId } from "react";

import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { ControlAppearance } from "./control-field";
import {
  ControlField,
  controlBox,
  controlText,
  widthStyle,
} from "./control-field";

const COUNTRIES: { code: CountryCode; name: string }[] = [
  { code: "VN", name: "Việt Nam" },
  { code: "US", name: "Hoa Kỳ" },
  { code: "JP", name: "Nhật Bản" },
  { code: "KR", name: "Hàn Quốc" },
  { code: "CN", name: "Trung Quốc" },
  { code: "TH", name: "Thái Lan" },
  { code: "LA", name: "Lào" },
  { code: "KH", name: "Campuchia" },
  { code: "FR", name: "Pháp" },
  { code: "AU", name: "Úc" },
];
const flag = (c: string) =>
  String.fromCodePoint(...[...c].map((ch) => 0x1f1a5 + ch.charCodeAt(0)));

/** Valid number for the country (libphonenumber-js metadata, as web-emr PhoneField). */
export const isValidPhone = (value: string, country: CountryCode = "VN") =>
  !!value && isValidPhoneNumber(value, country);

/**
 * A phone number with a country flag (web-emr PhoneField): formatted while typing for the chosen country; validate
 * with isValidPhone(value, country). Uses the control tokens.
 */
export function PhoneField({
  id,
  label,
  required,
  value,
  onChange,
  country = "VN",
  onCountryChange,
  appearance = "outline",
  width = 130,
  readOnly,
  error,
  vertical,
}: {
  id?: string;
  label?: ReactNode;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  country?: CountryCode;
  onCountryChange?: (country: CountryCode) => void;
  appearance?: ControlAppearance;
  width?: number | string;
  readOnly?: boolean;
  error?: ReactNode;
  vertical?: boolean;
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
      <div className="flex items-center gap-1">
        <Select
          value={country}
          onValueChange={(v) => onCountryChange?.(v as CountryCode)}
          disabled={readOnly}
        >
          <SelectTrigger
            size="sm"
            aria-label="Quốc gia"
            className="h-(--control-height) min-h-(--control-height) gap-0.5 border-0 bg-transparent px-0.5 py-0 shadow-none focus-visible:ring-0 data-[size=sm]:h-(--control-height)"
          >
            <span className="text-base leading-none">{flag(country)}</span>
          </SelectTrigger>
          <SelectContent className="bg-list text-(length:--control-font-size)">
            {COUNTRIES.map((c) => (
              <SelectItem
                key={c.code}
                value={c.code}
                className="text-(length:--control-font-size) focus:bg-accent focus:text-accent-foreground"
              >
                {flag(c.code)} {c.name} (+{getCountryCallingCode(c.code)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <InputGroup
          style={widthStyle(width)}
          className={controlBox({ appearance, readOnly, invalid: !!error })}
        >
          <InputGroupInput
            id={inputId}
            type="tel"
            inputMode="tel"
            value={value}
            readOnly={readOnly}
            required={required}
            aria-invalid={error ? true : undefined}
            onChange={(e) =>
              onChange(new AsYouType(country).input(e.target.value))
            }
            className={controlText}
          />
        </InputGroup>
      </div>
    </ControlField>
  );
}
