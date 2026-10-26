import type { ComponentProps, ReactNode } from "react";
import { useId } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import type { ControlAppearance } from "./control-field";
import {
  ControlField,
  controlBox,
  controlText,
  widthStyle,
} from "./control-field";

export type TextFieldProps = Omit<
  ComponentProps<typeof InputGroupInput>,
  "width"
> & {
  label?: ReactNode;
  required?: boolean;
  appearance?: ControlAppearance;
  /** Box width: px number or CSS width. */
  width?: number | string;
  error?: ReactNode;
  vertical?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  containerClassName?: string;
};

/**
 * A labelled text input (web-emr TextField). Height, type size, border and the read-only fill come from the design
 * system's control tokens, so the same field is a DS v1 field or an EMR field depending on the theme.
 *
 *   <TextField label="Mã NB:" readOnly width={130} value={code} />
 *   <TextField label="Tên NB:" required width={130} value={name} onChange={(e) => setName(e.target.value)} />
 */
export function TextField({
  id,
  label,
  required,
  appearance = "outline",
  width,
  error,
  vertical,
  iconLeft,
  iconRight,
  readOnly,
  disabled,
  className,
  containerClassName,
  ...props
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <ControlField
      id={inputId}
      label={label}
      required={required}
      error={error}
      vertical={vertical}
      className={containerClassName}
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
        {iconLeft && <InputGroupAddon>{iconLeft}</InputGroupAddon>}
        <InputGroupInput
          id={inputId}
          readOnly={readOnly}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          className={cn(controlText, className)}
          {...props}
        />
        {iconRight && (
          <InputGroupAddon align="inline-end">{iconRight}</InputGroupAddon>
        )}
      </InputGroup>
    </ControlField>
  );
}
