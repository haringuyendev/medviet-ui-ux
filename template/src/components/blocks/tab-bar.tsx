import type { ReactNode } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type TabItem = {
  value: string;
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
};

const LIST = {
  // web-emr TabPro: tabs on a strip of --tab-bg, the active one --tab-active-bg joined to the panel below
  folder: "h-auto gap-0 rounded-t-(--tab-radius) rounded-b-none bg-tab p-0",
  underline:
    "h-auto gap-4 rounded-none border-b border-border bg-transparent p-0",
  pill: "h-auto gap-1 rounded-(--tab-radius) bg-tab p-1",
} as const;
const TRIGGER = {
  folder:
    "h-(--tab-height) rounded-t-(--tab-radius) rounded-b-none border-0 px-4 data-active:bg-tab-active data-active:text-tab-active-foreground data-active:shadow-none",
  underline:
    "h-(--tab-height) rounded-none border-0 bg-transparent px-1 after:bg-tab-line data-active:bg-transparent data-active:text-tab-active-foreground data-active:shadow-none",
  pill: "h-(--tab-height) rounded-(--tab-radius) border-0 px-3 data-active:bg-tab-active data-active:text-tab-active-foreground data-active:shadow-sm",
} as const;

/**
 * Tabs whose look comes from the tab tokens: `folder` (web-emr TabPro, the EMR record tabs), `underline` (web-emr
 * Tabs list_underlined), `pill`. Give items with content for panels, or only labels and render the panel yourself.
 *
 *   <TabBar variant="folder" items={[{ value: "info", label: "Hành chính", content: <Info /> }, …]} />
 */
export function TabBar({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = "folder",
  className,
}: {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: keyof typeof LIST;
  className?: string;
}) {
  return (
    <Tabs
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={(v) => onValueChange?.(v as string)}
      className={cn("gap-0", className)}
    >
      <TabsList
        variant={variant === "underline" ? "line" : "default"}
        className={LIST[variant]}
      >
        {items.map((t) => (
          <TabsTrigger
            key={t.value}
            value={t.value}
            disabled={t.disabled}
            className={cn(
              "text-(length:--tab-font-size) font-(weight:--tab-font-weight) text-tab-foreground disabled:opacity-50",
              TRIGGER[variant],
            )}
          >
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map(
        (t) =>
          t.content !== undefined && (
            <TabsContent
              key={t.value}
              value={t.value}
              className={cn(
                variant === "folder" &&
                  "rounded-b-(--tab-radius) bg-tab-active p-4",
              )}
            >
              {t.content}
            </TabsContent>
          ),
      )}
    </Tabs>
  );
}
