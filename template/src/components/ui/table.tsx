"use client";

import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

function Table({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<"table"> & {
  /**
   * LOCAL EXTENSION — not in the shadcn registry. A `shadcn add --overwrite`
   * of `table` will drop it and silently un-stick every sticky header built on
   * it; re-apply this prop after any sync.
   *
   * Classes for the scroll container the table renders inside. A sticky
   * `TableHeader` sticks to its nearest scrolling ancestor, and that ancestor
   * is this element — so a table that scrolls vertically inside a fixed-height
   * panel has to size and scroll *here*, not on a wrapper around it.
   */
  containerClassName?: string;
}) {
  return (
    <div
      data-slot="table-container"
      className={cn("relative w-full overflow-x-auto", containerClassName)}
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

/**
 * LOCAL EXTENSION — not in the shadcn registry, like `containerClassName`
 * above. A `shadcn add --overwrite` of `table` drops it and every data screen
 * quietly loses its brand header; re-apply after any sync.
 *
 * `primary` is the filled header the data tables in this workspace open with:
 * one prop instead of the same four utility classes retyped per table, so a
 * screen cannot end up a shade off from the one beside it. It reaches into the
 * rows and cells it owns because the colour has to carry the whole band —
 * `TableHead` sets `text-foreground`, and `TableRow` a `hover:bg-muted/50` that
 * would otherwise wash over the fill whenever the pointer crossed the header.
 */
const tableHeaderVariants = cva("[&_tr]:border-b", {
  variants: {
    variant: {
      default: "",
      primary:
        "bg-primary [&_th]:text-primary-foreground [&_tr]:border-b-0 [&_tr]:hover:bg-primary",
    },
  },
  defaultVariants: { variant: "default" },
});

function TableHeader({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"thead"> & VariantProps<typeof tableHeaderVariants>) {
  return (
    <thead
      data-slot="table-header"
      className={cn(tableHeaderVariants({ variant, className }))}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  tableHeaderVariants,
};
