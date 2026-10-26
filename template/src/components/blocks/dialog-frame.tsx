import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-3xl",
  xl: "sm:max-w-5xl",
} as const;

/**
 * A modal with a title, a body and an action row (web-emr Modal / ModalPro): radius, border, padding, overlay tint and
 * the title's size, weight, colour and alignment come from the dialog tokens (EMR: centred primary-dark title, teal
 * overlay). `full` fills the screen (ModalPro isFull).
 *
 *   <DialogFrame open={open} onOpenChange={setOpen} title="Xác nhận ký" footer={<ActionButton …>Ký</ActionButton>}>…</DialogFrame>
 */
export function DialogFrame({
  open,
  onOpenChange,
  title,
  description,
  footer,
  size = "md",
  full,
  showCloseButton = true,
  className,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  size?: keyof typeof SIZES;
  full?: boolean;
  showCloseButton?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn(
          "gap-4 rounded-(--dialog-radius) border border-dialog-border bg-card p-(--dialog-padding) ring-0",
          full
            ? "h-[calc(100dvh-2rem)] max-w-[calc(100dvw-2rem)] sm:max-w-[calc(100dvw-2rem)]"
            : SIZES[size],
          className,
        )}
      >
        <DialogHeader>
          <DialogTitle
            className="text-(length:--dialog-title-size) font-(weight:--dialog-title-weight) text-dialog-title"
            style={{ textAlign: "var(--dialog-title-align)" as "left" }}
          >
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children && (
          <div className={cn("min-h-0", full && "flex-1 overflow-auto")}>
            {children}
          </div>
        )}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
