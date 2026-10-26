import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** The button kinds of web-emr's libs/cake/Button (btnType), with the same names. */
export type EmrButtonType =
  | "ok"
  | "back"
  | "ghost"
  | "outline_cancel"
  | "delete"
  | "outline"
  | "extra"
  | "full_normal"
  | "clarity"
  | "outline_secondary"
  | "outline_warning"
  | "black_white"
  | "custom"
  | "confirm"
  | "cover"
  | "outline_upload"
  | "choose"
  | "cancel"
  | "none_background"
  | "outline_active"
  | "outline_back"
  | "outline_disable"
  | "icon"
  | "normal_no_outline"
  | "secondary_border_line"
  | "boder_main"
  | "hug"
  | "outline_active_gradient";

// web-emr Button/styles.module.scss, one entry per .btn_<type>
const TYPES: Partial<Record<EmrButtonType, string>> = {
  ok: "bg-emr-primary-brand p-[5px] text-white hover:bg-emr-primary-brand hover:text-white",
  back: "bg-emr-btn-back hover:bg-emr-btn-back",
  confirm: "bg-emr-success-main text-white hover:bg-emr-success-main",
  choose: "bg-emr-primary-brand text-white hover:bg-emr-primary-brand",
  cancel: "bg-emr-btn-back text-emr-text-primary hover:bg-emr-btn-back",
  clarity: "border-0 bg-transparent text-emr-normal shadow-none hover:bg-transparent",
  ghost: "border-0 bg-transparent text-emr-text-primary underline hover:bg-transparent",
  outline:
    "max-h-6 border-[0.5px] border-emr-primary-brand bg-emr-gadient-green-enable px-[5px] py-[2px] text-white shadow-none",
  outline_secondary:
    "max-h-6 border border-emr-secondary-normal bg-emr-secondary-normal px-[5px] py-[2px] text-white shadow-none hover:bg-emr-secondary-normal",
  boder_main:
    "max-h-6 border-[0.5px] border-emr-primary-brand bg-white px-[5px] py-[2px] text-emr-primary-brand shadow-none hover:bg-white",
  outline_upload:
    "max-h-6 border-[0.5px] border-emr-primary-brand px-[5px] py-[2px] text-[13px] font-medium text-emr-primary-brand shadow-none",
  outline_cancel:
    "max-h-6 border-[0.5px] border-transparent bg-emr-btn-error px-[5px] py-[2px] text-white shadow-none",
  outline_back:
    "max-h-6 border-[0.5px] border-emr-text-stroke px-[5px] py-[2px] text-emr-text-primary shadow-none",
  outline_warning:
    "max-h-6 border-[0.5px] border-transparent bg-emr-btn-warning px-[5px] py-[2px] text-white shadow-none",
  delete:
    "border-[0.5px] border-emr-danger-main bg-emr-danger-main text-white hover:bg-emr-danger-main hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)]",
  full_normal: "justify-between border-[0.5px] border-emr-text-stroke",
  black_white:
    "border border-emr-text-stroke bg-transparent text-emr-text-primary hover:border-emr-text-primary hover:bg-emr-text-primary hover:text-white",
  outline_active_gradient:
    "max-h-6 bg-emr-gadient-green-enable px-[5px] py-[2px] text-white shadow-none",
  outline_active:
    "max-h-6 border-[0.5px] border-emr-secondary-normal bg-emr-secondary-normal px-[5px] py-[2px] text-white shadow-none hover:bg-emr-secondary-normal",
  outline_disable:
    "max-h-6 border-[0.5px] border-emr-bg-disable-button bg-emr-bg-disable-button px-[5px] py-[2px] text-emr-bg-disable shadow-none",
  cover: "h-full min-h-12",
  none_background:
    "bg-emr-primary-light font-normal shadow-none hover:bg-emr-primary-light",
  icon: "m-auto h-full p-0 shadow-none",
  normal_no_outline: "relative z-10 max-h-6 hover:translate-y-0 hover:shadow-none",
  secondary_border_line:
    "relative z-10 max-h-6 border-[0.5px] border-emr-secondary-normal hover:translate-y-0 hover:shadow-none",
  hug: "min-w-0 max-w-fit p-1 shadow-none",
};

export type EmrButtonProps = Omit<
  ComponentProps<typeof Button>,
  "variant" | "size"
> & {
  btnType?: EmrButtonType;
  /** EMR "reasonable": compact (padding 5px 8px, 12px text). */
  reasonable?: boolean;
  /** EMR "isPlump": min width 100px. */
  isPlump?: boolean;
  full?: boolean;
  /** No size at all (EMR "hug"). */
  hug?: boolean;
  shadown?: boolean;
  isBorder?: boolean;
  shape?: "circle";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

/**
 * web-emr's Button, rebuilt on @medviet/ui Button: 24px high, 12px semibold, radius 6px, gap 8px, and the EMR kinds
 * (btnType) with their gradients and colours. Lift on focus like EMR.
 *
 *   <EmrButton btnType="outline" reasonable iconLeft={<SaveIcon />}>Lưu</EmrButton>
 *   <EmrButton btnType="outline_warning" reasonable iconLeft={<PencilIcon />}>Sửa</EmrButton>
 *   <EmrButton btnType="outline_cancel" reasonable iconLeft={<XIcon />}>Huỷ</EmrButton>
 */
export function EmrButton({
  btnType,
  reasonable,
  isPlump,
  full,
  hug,
  shadown,
  isBorder,
  shape,
  iconLeft,
  iconRight,
  className,
  children,
  ...props
}: EmrButtonProps) {
  return (
    <Button
      variant="ghost"
      size="xs"
      className={cn(
        // .Button
        "h-auto min-h-6 w-fit gap-2 rounded-[6px] border-0 bg-white text-[0.75rem] font-semibold text-emr-normal transition-all duration-[235ms] focus-visible:shadow-[rgba(0,0,0,0.3)_2px_8px_4px_-6px] focus-visible:ring-0",
        "disabled:border-emr-bg-disable-button disabled:bg-emr-bg-disable-button disabled:font-bold disabled:text-white disabled:opacity-100",
        btnType && TYPES[btnType],
        reasonable && "min-w-max px-2 py-[5px] text-[12px]",
        isPlump && "max-h-6 min-h-6 min-w-[100px] px-4",
        full && "w-full",
        hug && "max-h-fit min-h-0 min-w-0 max-w-fit p-0",
        shadown && "shadow-[0_3px_6px_#3b404533]",
        isBorder && "border-[0.5px] border-emr-text-stroke",
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
