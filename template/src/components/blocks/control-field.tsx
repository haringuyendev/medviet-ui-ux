import type { ComponentProps, ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * The label of a form control, from the design system's label tokens: size, weight, colour, and the required mark
 * as a superscript `*` in --required-color (EMR) or the DS v1 text colour. Never wraps.
 */
export function ControlLabel({
  label,
  required,
  className,
  ...props
}: Omit<ComponentProps<typeof Label>, "children"> & {
  label: ReactNode;
  required?: boolean;
}) {
  return (
    <Label
      className={cn(
        "flex min-w-max items-center gap-0 text-(length:--label-font-size) leading-normal font-(weight:--label-font-weight) text-label",
        className,
      )}
      {...props}
    >
      {label}
      {required && (
        <sup className="relative -top-[0.5em] text-(length:--required-size) text-required">
          *
        </sup>
      )}
    </Label>
  );
}

/**
 * Label + control + error, the layout every field primitive uses: label beside the control (horizontal, the EMR
 * default) or above it (vertical, the DS v1 default for long forms).
 */
export function ControlField({
  id,
  label,
  required,
  error,
  vertical,
  className,
  children,
}: {
  id?: string;
  label?: ReactNode;
  required?: boolean;
  error?: ReactNode;
  vertical?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div
        className={cn(
          "flex gap-(--label-gap)",
          vertical ? "flex-col items-start gap-1.5" : "items-center",
        )}
      >
        {label && (
          <ControlLabel
            htmlFor={id}
            label={label}
            required={required}
            className={cn(error && "text-destructive-text")}
          />
        )}
        {children}
      </div>
      {error && (
        <p
          className="text-(length:--label-font-size) text-destructive-text"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/** Control box looks: outline (default), underline, plain (no border), bare (no box). EMR kindStyle in brackets. */
export type ControlAppearance = "outline" | "underline" | "plain" | "bare";

/** Classes of the control box: sizes, border and fills come from the control tokens. */
export function controlBox({
  appearance = "outline",
  readOnly,
  disabled,
  invalid,
}: {
  appearance?: ControlAppearance;
  readOnly?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}) {
  return cn(
    "h-(--control-height) min-h-(--control-height) bg-card shadow-none transition-all has-[[data-slot=input-group-control]:focus-visible]:ring-0",
    appearance === "outline" && // [border_enter]
      "rounded-(--control-radius) border-(length:--control-border-width) border-input p-[2px] hover:border-ring focus-within:border-ring",
    appearance === "underline" && // [underline]
      "rounded-none border-0 border-b-(length:--control-border-width) border-input bg-transparent px-0 hover:border-ring focus-within:border-ring",
    appearance === "plain" &&
      "rounded-(--control-radius) border-transparent p-1", // [no_border]
    appearance === "bare" && "border-0 bg-transparent p-0", // [set_field]
    readOnly && appearance !== "bare" && "bg-control-readonly",
    disabled && "bg-control-disabled",
    invalid && "border-destructive",
  );
}

/** Classes of the text inside a control box. */
export const controlText =
  "h-auto px-(--control-padding-x) py-0 text-(length:--control-font-size) leading-[initial] md:text-(length:--control-font-size) text-control-fg placeholder:text-(length:--control-placeholder-size) placeholder:text-control-placeholder disabled:cursor-not-allowed disabled:opacity-100";

/** A width prop (px number or any CSS width) as a style. */
export const widthStyle = (width?: number | string) =>
  width === undefined
    ? undefined
    : { width: typeof width === "number" ? `${width}px` : width };
