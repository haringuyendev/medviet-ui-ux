import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { controlBox, controlText, widthStyle } from "./control-field";

/**
 * A search box (web-emr Search): magnifier, a clear button once there is text, search on Enter, or while typing after
 * `debounce` ms. Control tokens for size and border.
 *
 *   <SearchField placeholder="Tìm theo mã hoặc tên bệnh nhân" onSearch={setQuery} debounce={300} />
 */
export function SearchField({
  value,
  defaultValue = "",
  onValueChange,
  onSearch,
  debounce,
  placeholder = "Tìm kiếm…",
  label = "Tìm kiếm",
  width,
  className,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Enter, the clear button, or the debounce timer. */
  onSearch?: (value: string) => void;
  debounce?: number;
  placeholder?: string;
  /** Accessible name of the box. */
  label?: string;
  width?: number | string;
  className?: string;
}) {
  const [own, setOwn] = useState(defaultValue);
  const text = value ?? own;
  const latest = useRef(onSearch);
  useEffect(() => {
    latest.current = onSearch;
  });
  useEffect(() => {
    if (debounce === undefined) return;
    const t = setTimeout(() => latest.current?.(text), debounce);
    return () => clearTimeout(t);
  }, [text, debounce]);
  const set = (v: string) => {
    if (value === undefined) setOwn(v);
    onValueChange?.(v);
  };
  return (
    <InputGroup
      style={widthStyle(width)}
      className={cn(controlBox({}), className)}
    >
      <InputGroupAddon>
        <SearchIcon className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        aria-label={label}
        value={text}
        placeholder={placeholder}
        onChange={(e) => set(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch?.(text)}
        className={cn(controlText, "[&::-webkit-search-cancel-button]:hidden")}
      />
      {text && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label="Xoá nội dung tìm"
            onClick={() => {
              set("");
              onSearch?.("");
            }}
          >
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
