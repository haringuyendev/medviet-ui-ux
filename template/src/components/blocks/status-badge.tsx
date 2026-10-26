import type { BadgeVariant } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** The colour groups a status can take; each maps to a Badge variant and a full-strength dot. */
export type StatusTone =
  | "neutral"
  | "info"
  | "warning"
  | "success"
  | "destructive";

const TONES: Record<StatusTone, { variant: BadgeVariant; dot: string }> = {
  neutral: { variant: "secondary", dot: "bg-muted-foreground" },
  info: { variant: "info", dot: "bg-info" },
  warning: { variant: "warning", dot: "bg-warning" },
  success: { variant: "success", dot: "bg-success" },
  destructive: { variant: "destructive", dot: "bg-destructive" },
};

/**
 * A status as a chip: tinted Badge + a dot at full saturation, so it stays scannable where the tint is faint
 * (health-exam record/exam/CLS badges, gmhs hồ sơ chips). Map each app status to a tone once, next to the type:
 *
 *   const RECORD_STATUS = defineStatuses<RecordStatus>({
 *     waiting: { tone: "warning", label: "Chờ khám" },
 *     examining: { tone: "info", label: "Đang khám" },
 *     examined: { tone: "success", label: "Đã khám" },
 *     cancelled: { tone: "destructive", label: "Đã huỷ" },
 *   });
 *   <StatusBadge {...RECORD_STATUS[record.status]} />
 *
 * MedViet workflow colours (web-emr): in progress/reviewing → info, waiting → warning, done → success,
 * missing/rejected/cancelled → destructive, not started → neutral.
 */
export function StatusBadge({
  tone,
  label,
  className,
}: {
  tone: StatusTone;
  label: string;
  className?: string;
}) {
  const t = TONES[tone];
  return (
    <Badge variant={t.variant} className={className}>
      <span
        aria-hidden="true"
        className={cn("size-1.5 shrink-0 rounded-full", t.dot)}
      />
      {label}
    </Badge>
  );
}

/** Typed status → { tone, label } map: a status missing from the map fails to compile. */
export function defineStatuses<S extends string>(
  map: Record<S, { tone: StatusTone; label: string }>,
) {
  return map;
}
