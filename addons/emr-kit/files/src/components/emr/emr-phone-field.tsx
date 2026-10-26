import { AsYouType, getCountryCallingCode, isValidPhoneNumber } from "libphonenumber-js/max";
import type { CountryCode } from "libphonenumber-js/max";
import type { ReactNode } from "react";
import { useId } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { EmrField } from "./emr-field";

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
const flag = (c: string) => String.fromCodePoint(...[...c].map((ch) => 0x1f1a5 + ch.charCodeAt(0)));

/** Valid number for the country (libphonenumber-js, as web-emr's PhoneField). */
export const isValidPhone = (value: string, country: CountryCode = "VN") =>
  !!value && isValidPhoneNumber(value, country);

/**
 * web-emr's PhoneField: country flag picker + a 24px number box formatted while typing (libphonenumber-js).
 * value is what the user typed; check it with isValidPhone(value, country).
 */
export function EmrPhoneField({
  id,
  label,
  isSup,
  value,
  onChange,
  country = "VN",
  onCountryChange,
  width = 130,
  readOnly,
  error,
}: {
  id?: string;
  label?: ReactNode;
  isSup?: boolean;
  value: string;
  onChange: (value: string) => void;
  country?: CountryCode;
  onCountryChange?: (country: CountryCode) => void;
  width?: number | string;
  readOnly?: boolean;
  error?: ReactNode;
}) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <EmrField id={inputId} label={label} isSup={isSup} error={error}>
      <div className="flex items-center gap-1">
        <Select
          value={country}
          onValueChange={(v) => onCountryChange?.(v as CountryCode)}
          disabled={readOnly}
        >
          <SelectTrigger
            size="sm"
            aria-label="Quốc gia"
            className="h-6 min-h-6 data-[size=sm]:h-6 gap-0.5 border-0 bg-transparent px-0.5 py-0 text-[12px] shadow-none focus-visible:ring-0"
          >
            <span className="text-base leading-none">{flag(country)}</span>
          </SelectTrigger>
          <SelectContent className="bg-emr-bg-secondary text-[12px]">
            {COUNTRIES.map((c) => (
              <SelectItem key={c.code} value={c.code} className="text-[12px] focus:bg-emr-primary-hover">
                {flag(c.code)} {c.name} (+{getCountryCallingCode(c.code)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <InputGroup
          style={{ width: typeof width === "number" ? `${width}px` : width }}
          className={cn(
            "h-6 min-h-6 rounded-[0.3125rem] border-[0.5px] border-emr-text-stroke bg-white p-[2px] shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0",
            readOnly && "bg-emr-bg-secondary",
            error && "border-emr-danger-main",
          )}
        >
          <InputGroupInput
            id={inputId}
            type="tel"
            inputMode="tel"
            value={value}
            readOnly={readOnly}
            aria-invalid={error ? true : undefined}
            onChange={(e) => onChange(new AsYouType(country).input(e.target.value))}
            className="h-[18px] px-1 py-0 text-[0.75rem] text-emr-text-primary placeholder:text-[0.875rem] placeholder:text-emr-info"
          />
        </InputGroup>
      </div>
    </EmrField>
  );
}
