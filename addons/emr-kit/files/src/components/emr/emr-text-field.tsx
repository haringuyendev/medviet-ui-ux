import type { ComponentProps, ReactNode } from "react";
import { useId } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { EmrField } from "./emr-field";

/** The look of an EMR control box (web-emr TextField kindStyle). */
export type EmrKindStyle =
  | "border_enter"
  | "border"
  | "underline"
  | "no_border"
  | "set_field";

// web-emr TextField/styles.module.scss
export const KIND: Record<EmrKindStyle, string> = {
  border_enter:
    "rounded-[5px] border-[0.5px] border-emr-text-stroke bg-white p-[2px] hover:border-emr-primary-active focus-within:border-emr-primary-active",
  border:
    "max-h-7 rounded-[5px] border-[0.5px] border-emr-text-stroke bg-white p-[2px]",
  underline:
    "max-h-7 rounded-none border-0 border-b-[0.5px] border-emr-text-stroke bg-transparent px-0 py-1 hover:border-emr-primary-active focus-within:border-emr-primary-active",
  no_border: "rounded-[5px] border-transparent bg-white p-1",
  set_field: "border-0 bg-transparent p-0",
};
export const KIND_READONLY: Record<EmrKindStyle, string> = {
  border_enter: "bg-emr-bg-secondary",
  border: "bg-emr-bg-secondary",
  underline: "rounded-[0.3125rem] bg-emr-bg-teriary",
  no_border: "bg-emr-bg-secondary",
  set_field: "",
};

export type EmrTextFieldProps = Omit<
  ComponentProps<typeof InputGroupInput>,
  "width"
> & {
  label?: ReactNode;
  isSup?: boolean;
  kindStyle?: EmrKindStyle;
  /** Box width in px (EMR width prop) or any CSS width. */
  width?: number | string;
  error?: ReactNode;
  vertical?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  containerClassName?: string;
};

/**
 * web-emr's TextField: label beside a 24px box, 12px text, placeholder 14px in --info, read-only boxes grey,
 * errors with a --danger-main border. kindStyle picks the box (border_enter is the EMR form default).
 *
 *   <EmrTextField label="Mã NB:" readOnly width={130} value={code} />
 *   <EmrTextField label="Tên NB:" isSup width={130} value={name} onChange={(e) => setName(e.target.value)} />
 */
export function EmrTextField({
  id,
  label,
  isSup,
  kindStyle = "border_enter",
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
}: EmrTextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <EmrField
      id={inputId}
      label={label}
      isSup={isSup}
      error={error}
      vertical={vertical}
      className={containerClassName}
    >
      <InputGroup
        style={{ width: typeof width === "number" ? `${width}px` : width }}
        className={cn(
          "h-6 min-h-6 shadow-none transition-all duration-[235ms] has-[[data-slot=input-group-control]:focus-visible]:ring-0",
          KIND[kindStyle],
          readOnly && KIND_READONLY[kindStyle],
          disabled && "bg-emr-bg-disable",
          error && "border-emr-danger-main",
        )}
      >
        {iconLeft && <InputGroupAddon>{iconLeft}</InputGroupAddon>}
        <InputGroupInput
          id={inputId}
          readOnly={readOnly}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          className={cn(
            "h-[18px] px-1 py-0 text-[0.75rem] leading-[initial] text-emr-text-primary placeholder:text-[0.875rem] placeholder:text-emr-info disabled:cursor-not-allowed disabled:opacity-100",
            className,
          )}
          {...props}
        />
        {iconRight && (
          <InputGroupAddon align="inline-end">{iconRight}</InputGroupAddon>
        )}
      </InputGroup>
    </EmrField>
  );
}
