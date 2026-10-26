import type { ComponentProps, ReactNode } from "react";
import { useId } from "react";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ControlField, widthStyle } from "./control-field";

/**
 * A labelled multi-line field (web-emr TextField tag_textarea): type size, border, radius and read-only fill from the
 * control tokens, min height from --textarea-min-height. Label above by default (vertical).
 */
export function TextAreaField({
  id,
  label,
  required,
  error,
  vertical = true,
  width,
  readOnly,
  disabled,
  className,
  ...props
}: Omit<ComponentProps<typeof Textarea>, "width"> & {
  label?: ReactNode;
  required?: boolean;
  error?: ReactNode;
  vertical?: boolean;
  width?: number | string;
}) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <ControlField
      id={fieldId}
      label={label}
      required={required}
      error={error}
      vertical={vertical}
    >
      <Textarea
        id={fieldId}
        readOnly={readOnly}
        disabled={disabled}
        required={required}
        aria-invalid={error ? true : undefined}
        style={widthStyle(width)}
        className={cn(
          "min-h-(--textarea-min-height) rounded-(--control-radius) border-(length:--control-border-width) border-input bg-card px-(--control-padding-x) py-1 text-(length:--control-font-size) text-control-fg md:text-(length:--control-font-size) shadow-none placeholder:text-(length:--control-placeholder-size) placeholder:text-control-placeholder focus-visible:border-ring focus-visible:ring-0",
          readOnly && "bg-control-readonly",
          disabled && "bg-control-disabled opacity-100",
          error && "border-destructive",
          className,
        )}
        {...props}
      />
    </ControlField>
  );
}
