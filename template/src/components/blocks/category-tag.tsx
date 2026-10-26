import type { ComponentProps } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** The 11 category colours of the MedViet design system (web-emr's light/dark pairs, AA). */
export type TagColor =
  | "blue"
  | "cyan"
  | "green"
  | "navy"
  | "orange"
  | "pink"
  | "red"
  | "violet"
  | "yellow"
  | "brown"
  | "gray";

// Literal class names so Tailwind generates them.
const COLORS: Record<TagColor, string> = {
  blue: "bg-tag-blue text-tag-blue-foreground",
  cyan: "bg-tag-cyan text-tag-cyan-foreground",
  green: "bg-tag-green text-tag-green-foreground",
  navy: "bg-tag-navy text-tag-navy-foreground",
  orange: "bg-tag-orange text-tag-orange-foreground",
  pink: "bg-tag-pink text-tag-pink-foreground",
  red: "bg-tag-red text-tag-red-foreground",
  violet: "bg-tag-violet text-tag-violet-foreground",
  yellow: "bg-tag-yellow text-tag-yellow-foreground",
  brown: "bg-tag-brown text-tag-brown-foreground",
  gray: "bg-tag-gray text-tag-gray-foreground",
};

/**
 * A category label: khoa, loại dịch vụ, nhóm khách hàng, gói khám. Categories only: a status (chờ, xong, huỷ) is a
 * StatusBadge, whose colours carry a shared meaning. Give each category one colour, the same on every screen:
 *
 *   const KHOA_COLOR: Record<Khoa, TagColor> = { noi: "blue", ngoai: "cyan", san: "pink", nhi: "orange" };
 *   <CategoryTag color={KHOA_COLOR[row.khoa]}>{KHOA_LABEL[row.khoa]}</CategoryTag>
 */
export function CategoryTag({
  color,
  className,
  ...props
}: Omit<ComponentProps<typeof Badge>, "variant"> & { color: TagColor }) {
  return (
    <Badge
      variant="secondary"
      className={cn("border-transparent", COLORS[color], className)}
      {...props}
    />
  );
}
