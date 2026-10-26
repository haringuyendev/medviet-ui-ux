import { useVirtualizer } from "@tanstack/react-virtual";
import type { Key, ReactNode } from "react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

/** Below this many items every item renders: cheap, and Ctrl+F keeps working on the lists most people open. */
export const VIRTUALIZE_FROM_ITEMS = 100;

/**
 * A list that renders all items while short and only the visible window once long (health-exam). It owns its scroll
 * box: give it a height (`className="h-[60vh]"` or a flex parent with min-h-0). `getItemKey` is the item's identity,
 * never its index.
 */
export function VirtualList<T>({
  items,
  renderItem,
  getItemKey,
  estimateSize,
  threshold = VIRTUALIZE_FROM_ITEMS,
  gap = 0,
  label,
  className,
}: {
  items: readonly T[];
  /** The contents of one `<li>`. */
  renderItem: (item: T, index: number) => ReactNode;
  getItemKey: (item: T, index: number) => Key;
  /** An item's height in px before it is measured; close is enough. */
  estimateSize: number;
  threshold?: number;
  gap?: number;
  /** Accessible name of the list. */
  label?: string;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const virtual = items.length >= threshold;
  const virtualizer = useVirtualizer({
    count: virtual ? items.length : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateSize,
    getItemKey: (i) => getItemKey(items[i] as T, i),
    overscan: 4,
    gap,
  });

  if (!virtual)
    return (
      <div ref={scrollRef} className={cn("overflow-y-auto", className)}>
        <ul aria-label={label} className="flex flex-col" style={{ gap }}>
          {items.map((item, i) => (
            <li key={getItemKey(item, i)}>{renderItem(item, i)}</li>
          ))}
        </ul>
      </div>
    );

  return (
    <div ref={scrollRef} className={cn("overflow-y-auto", className)}>
      <ul
        aria-label={label}
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((v) => (
          <li
            key={v.key}
            data-index={v.index}
            ref={virtualizer.measureElement}
            aria-setsize={items.length}
            aria-posinset={v.index + 1}
            className="absolute inset-x-0 top-0"
            style={{ transform: `translateY(${v.start}px)` }}
          >
            {renderItem(items[v.index] as T, v.index)}
          </li>
        ))}
      </ul>
    </div>
  );
}
