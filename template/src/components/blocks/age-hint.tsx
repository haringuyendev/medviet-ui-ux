import { formatAge } from "@/lib/age";
import { cn } from "@/lib/utils";

/**
 * The age beside Ngày sinh ("8 tháng", "3 tuổi 2 tháng", "35 tuổi"), so the receptionist checks Đối tượng khám without
 * doing the arithmetic (health-exam birth-date-age-hint). Renders nothing until the date is complete and real.
 */
export function AgeHint({
  birthDate,
  today,
  className,
}: {
  /** DateField's "DD/MM/YYYY" text, or a Date */
  birthDate: Date | string | null | undefined;
  today?: Date;
  className?: string;
}) {
  const age = formatAge(birthDate, today);
  if (!age) return null;
  return (
    <span
      className={cn("text-sm text-muted-foreground tabular-nums", className)}
    >
      {age}
    </span>
  );
}
