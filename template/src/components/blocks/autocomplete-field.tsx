import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { ControlField, widthStyle } from "./control-field";
import type { FieldOption } from "./select-field";

/**
 * Type to search, pick one (web-emr AutoComplete): static `options` filtered as you type, or `loadOptions(query)`
 * for a remote list (ICD-10, thuốc, bệnh nhân) called after `debounce` ms. Control tokens for the box, --list-bg for
 * the list.
 *
 *   <AutocompleteField label="Chẩn đoán:" loadOptions={(q) => api.icd10(q)} value={icd} onValueChange={setIcd} />
 */
export function AutocompleteField({
  id,
  label,
  required,
  options,
  loadOptions,
  debounce = 300,
  minChars = 1,
  value,
  onValueChange,
  placeholder = "Nhập để tìm…",
  emptyText = "Không có kết quả",
  loadingText = "Đang tìm…",
  width = 220,
  readOnly,
  disabled,
  error,
  vertical,
}: {
  id?: string;
  label?: ReactNode;
  required?: boolean;
  options?: FieldOption[];
  loadOptions?: (query: string) => Promise<FieldOption[]>;
  debounce?: number;
  minChars?: number;
  value: FieldOption | null;
  onValueChange: (value: FieldOption | null) => void;
  placeholder?: string;
  emptyText?: ReactNode;
  loadingText?: ReactNode;
  width?: number | string;
  readOnly?: boolean;
  disabled?: boolean;
  error?: ReactNode;
  vertical?: boolean;
}) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [query, setQuery] = useState("");
  const [remote, setRemote] = useState<FieldOption[]>([]);
  const [loading, setLoading] = useState(false);
  const load = useRef(loadOptions);
  useEffect(() => {
    load.current = loadOptions;
  });
  // remote search: a timer per query; a newer query cancels the older answer
  useEffect(() => {
    if (!load.current) return;
    if (query.trim().length < minChars) {
      setRemote([]);
      return;
    }
    let live = true;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const found = (await load.current?.(query.trim())) ?? [];
        if (live) setRemote(found);
      } finally {
        if (live) setLoading(false);
      }
    }, debounce);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [query, debounce, minChars]);
  const items = loadOptions ? remote : (options ?? []);
  const text = (o: FieldOption) =>
    typeof o.label === "string" ? o.label : o.value;
  return (
    <ControlField
      id={inputId}
      label={label}
      required={required}
      error={error}
      vertical={vertical}
    >
      <Combobox
        items={items}
        value={value}
        onValueChange={(v) => onValueChange((v as FieldOption | null) ?? null)}
        onInputValueChange={setQuery}
        itemToStringLabel={text}
        isItemEqualToValue={(a, b) => a.value === b.value}
        filter={loadOptions ? null : undefined}
        disabled={disabled || readOnly}
      >
        <ComboboxInput
          id={inputId}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          style={widthStyle(width)}
          className={cn(
            "h-(--control-height) min-h-(--control-height) rounded-(--control-radius) border-(length:--control-border-width) border-input bg-card text-(length:--control-font-size) text-control-fg shadow-none has-[input:focus-visible]:ring-0 [&_input]:text-(length:--control-font-size) md:[&_input]:text-(length:--control-font-size) [&_input]:placeholder:text-control-placeholder",
            readOnly && "bg-control-readonly",
            error && "border-destructive",
          )}
        />
        <ComboboxContent className="bg-list">
          <ComboboxEmpty>{loading ? loadingText : emptyText}</ComboboxEmpty>
          <ComboboxList>
            {(item: FieldOption) => (
              <ComboboxItem
                key={item.value}
                value={item}
                disabled={item.disabled}
                className="text-(length:--control-font-size) data-highlighted:bg-accent data-highlighted:text-accent-foreground"
              >
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </ControlField>
  );
}
