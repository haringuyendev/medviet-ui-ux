import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * The last question before something is lost: "Bỏ thay đổi?", "Xoá hồ sơ?", "Huỷ đăng ký?" (health-exam
 * discard-changes). Screens differ in what is at stake, so the copy comes in; Esc and a click outside mean "no".
 * Drive it from what is waiting for an answer: `open={pending !== null}`, `onCancel` drops it, `onConfirm` runs it.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  cancelLabel = "Huỷ",
  confirmLabel,
  destructive = true,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  cancelLabel?: string;
  /** Says what happens: "Bỏ thay đổi", "Xoá hồ sơ". */
  confirmLabel: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader className="place-items-start text-left">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            variant={destructive ? "destructive" : "default"}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
