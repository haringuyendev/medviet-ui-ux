import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** What the action means; its fill comes from --button-<intent>-bg (a colour in DS v1, a gradient in EMR). */
export type ButtonIntent =
  | "primary"
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "neutral"
  | "soft";
export type ButtonAppearance = "solid" | "outline" | "ghost" | "link";

/** web-emr Button btnType names, mapped onto intent + appearance. */
export type EmrButtonType =
  | "ok"
  | "choose"
  | "outline"
  | "outline_active_gradient"
  | "outline_warning"
  | "outline_cancel"
  | "delete"
  | "confirm"
  | "back"
  | "cancel"
  | "outline_secondary"
  | "outline_active"
  | "boder_main"
  | "outline_upload"
  | "secondary_border_line"
  | "outline_back"
  | "full_normal"
  | "black_white"
  | "ghost"
  | "clarity"
  | "none_background"
  | "outline_disable"
  | "icon"
  | "hug"
  | "cover"
  | "normal_no_outline"
  | "custom"
  | "extra";

const EMR: Record<EmrButtonType, [ButtonIntent, ButtonAppearance]> = {
  ok: ["primary", "solid"],
  choose: ["primary", "solid"],
  outline: ["primary", "solid"],
  outline_active_gradient: ["primary", "solid"],
  outline_warning: ["warning", "solid"],
  outline_cancel: ["destructive", "solid"],
  delete: ["destructive", "solid"],
  confirm: ["success", "solid"],
  back: ["neutral", "solid"],
  cancel: ["neutral", "solid"],
  outline_secondary: ["info", "solid"],
  outline_active: ["info", "solid"],
  boder_main: ["primary", "outline"],
  outline_upload: ["primary", "outline"],
  secondary_border_line: ["info", "outline"],
  outline_back: ["neutral", "outline"],
  full_normal: ["neutral", "outline"],
  black_white: ["neutral", "outline"],
  ghost: ["neutral", "link"],
  clarity: ["neutral", "ghost"],
  none_background: ["soft", "solid"],
  outline_disable: ["neutral", "solid"],
  icon: ["neutral", "ghost"],
  hug: ["neutral", "ghost"],
  cover: ["neutral", "ghost"],
  normal_no_outline: ["neutral", "ghost"],
  custom: ["neutral", "ghost"],
  extra: ["neutral", "ghost"],
};

// Literal class names (Tailwind generates them): fill + text for solid, border + text for outline, text for the rest.
const SOLID: Record<ButtonIntent, string> = {
  primary: "bg-button-primary text-button-primary-foreground",
  success: "bg-button-success text-button-success-foreground",
  warning: "bg-button-warning text-button-warning-foreground",
  destructive: "bg-button-destructive text-button-destructive-foreground",
  info: "bg-button-info text-button-info-foreground",
  neutral: "bg-button-neutral text-button-neutral-foreground",
  soft: "bg-button-soft text-button-soft-foreground",
};
const LINE: Record<ButtonIntent, string> = {
  primary: "border-primary text-primary",
  success: "border-success-text text-success-text",
  warning: "border-warning-text text-warning-text",
  destructive: "border-destructive-text text-destructive-text",
  info: "border-info-text text-info-text",
  neutral: "border-input text-foreground",
  soft: "border-accent text-accent-foreground",
};

export type ActionButtonProps = Omit<
  ComponentProps<typeof Button>,
  "variant" | "size"
> & {
  intent?: ButtonIntent;
  appearance?: ButtonAppearance;
  /** EMR names (web-emr Button btnType); overrides intent/appearance. */
  btnType?: EmrButtonType;
  /** Compact: content width, tighter padding (EMR "reasonable"). */
  compact?: boolean;
  /** At least 100px wide (EMR "isPlump"). */
  plump?: boolean;
  full?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  shape?: "circle";
};

/**
 * A button whose size and fills come from the design system's button tokens: the same Lưu/Sửa/Huỷ row is DS v1
 * (flat colours, 32px) or EMR (gradients, 24px, 12px semibold) depending on the theme.
 *
 *   <ActionButton intent="primary" iconLeft={<SaveIcon />}>Lưu</ActionButton>
 *   <ActionButton btnType="outline_warning" compact iconLeft={<PencilIcon />}>Sửa</ActionButton>
 */
export function ActionButton({
  intent = "primary",
  appearance = "solid",
  btnType,
  compact,
  plump,
  full,
  iconLeft,
  iconRight,
  shape,
  className,
  children,
  ...props
}: ActionButtonProps) {
  const [i, a] = btnType ? EMR[btnType] : [intent, appearance];
  return (
    <Button
      variant="ghost"
      size="xs"
      className={cn(
        "h-(--button-height) min-h-(--button-height) gap-2 rounded-(--button-radius) border-0 px-(--button-padding-x) text-(length:--button-font-size) font-(weight:--button-font-weight) transition-all hover:brightness-95 focus-visible:ring-2 focus-visible:ring-ring",
        a === "solid" && SOLID[i],
        a === "outline" && cn("border bg-card hover:bg-card", LINE[i]),
        a === "ghost" &&
          cn("bg-transparent hover:bg-accent", LINE[i], "border-0"),
        a === "link" &&
          cn(
            "bg-transparent underline-offset-4 hover:underline hover:bg-transparent",
            LINE[i],
            "border-0",
          ),
        "disabled:bg-disabled disabled:text-disabled-foreground disabled:opacity-100",
        compact && "min-w-max px-2",
        plump && "min-w-[100px] px-4",
        full && "w-full",
        shape === "circle" && "rounded-full",
        className,
      )}
      {...props}
    >
      {iconLeft}
      {children}
      {iconRight}
    </Button>
  );
}
