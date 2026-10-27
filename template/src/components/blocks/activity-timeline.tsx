import type { ReactNode } from "react";

import { formatDate, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export type ActivityTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "destructive";

export type ActivityItem = {
  id?: string;
  at: Date | string | number;
  /** who did it: "BS.CKI Phạm Thu Hà", "Hệ thống" */
  actor?: ReactNode;
  /** what happened: "ký tường trình", "chuyển trạng thái Đang khám → Đã khám" */
  action: ReactNode;
  /** an extra line: the reason, the old/new value, a note */
  detail?: ReactNode;
  /** the dot's colour, by meaning (the same tones as StatusBadge) */
  tone?: ActivityTone;
};

const DOT: Record<ActivityTone, string> = {
  neutral: "bg-muted-foreground",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

function dayLabel(d: Date, today: Date) {
  if (dayKey(d) === dayKey(today)) return "Hôm nay";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (dayKey(d) === dayKey(yesterday)) return "Hôm qua";
  return formatDate(d);
}

/**
 * Lịch sử of a record: who did what and when, newest first, grouped by day ("Hôm nay", "Hôm qua", 25/10/2026), a
 * coloured dot per meaning (health-exam record history, gmhs ca history). Pass items in any order.
 */
export function ActivityTimeline({
  items,
  today = new Date(),
  empty = "Chưa có thay đổi nào.",
  className,
}: {
  items: ActivityItem[];
  today?: Date;
  empty?: ReactNode;
  className?: string;
}) {
  if (!items.length)
    return <p className="text-sm text-muted-foreground">{empty}</p>;
  const sorted = items
    .map((item) => ({ ...item, date: new Date(item.at) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  const days: { label: string; items: typeof sorted }[] = [];
  for (const item of sorted) {
    const label = dayLabel(item.date, today);
    if (days.at(-1)?.label !== label) days.push({ label, items: [] });
    days.at(-1)?.items.push(item);
  }
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {days.map((day) => (
        <section key={day.label} className="flex flex-col gap-2">
          <h3 className="text-xs font-medium text-muted-foreground">
            {day.label}
          </h3>
          <ol className="flex flex-col">
            {day.items.map((item, i) => (
              <li
                key={item.id ?? `${item.date.getTime()}-${i}`}
                className="relative flex gap-3 pb-4 last:pb-0"
              >
                {/* the line joining the dots, under all but the last item */}
                {i < day.items.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-4 bottom-0 left-[calc(3.5rem-0.5px)] w-px bg-border"
                  />
                )}
                <time
                  dateTime={item.date.toISOString()}
                  className="w-10 shrink-0 pt-px text-xs text-muted-foreground tabular-nums"
                >
                  {formatTime(item.date)}
                </time>
                <span
                  aria-hidden
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    DOT[item.tone ?? "neutral"],
                  )}
                />
                <div className="flex min-w-0 flex-col gap-0.5 text-sm">
                  <p>
                    {item.actor && (
                      <span className="font-medium">{item.actor} </span>
                    )}
                    {item.action}
                  </p>
                  {item.detail && (
                    <p className="text-muted-foreground">{item.detail}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
