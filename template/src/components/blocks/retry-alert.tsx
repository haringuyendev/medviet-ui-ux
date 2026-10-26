import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * An inline error strip with [Thử lại], right under what failed (a section that didn't load, a save that was refused),
 * instead of a toast: the user retries in place without losing what they typed (health-exam ADR-0030).
 */
export function RetryAlert({
  message,
  onRetry,
  isRetrying = false,
  retryLabel = "Thử lại",
  className,
}: {
  message: string;
  onRetry: () => void;
  /** Locks the button while the previous attempt runs. */
  isRetrying?: boolean;
  retryLabel?: string;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-center justify-between gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2",
        className,
      )}
    >
      <span className="text-sm text-foreground">{message}</span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={isRetrying}
        onClick={onRetry}
      >
        {retryLabel}
      </Button>
    </div>
  );
}
