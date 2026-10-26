import type { Key, ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type GridColumn<T> = {
  key: string;
  title: ReactNode;
  /** Cell content; defaults to row[key]. */
  render?: (row: T, index: number) => ReactNode;
  width?: number | string;
  /** Defaults to the theme's --table-align (DS v1 left, EMR centre). */
  align?: "left" | "center" | "right";
};

/**
 * A simple grid of records (web-emr Table / antd Table look) whose header fill, type size, cell padding, row hover
 * and selection come from the table tokens. Sorting, filtering, pagination: DataTable.
 *
 *   <GridTable rowKey={(r) => r.id} data={rows} columns={[{ key: "stt", title: "STT", width: 60, render: (_, i) => i + 1 }, …]} />
 */
export function GridTable<T>({
  columns,
  data,
  rowKey,
  selectedKey,
  onRowClick,
  empty = "Không có dữ liệu",
  className,
}: {
  columns: GridColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => Key;
  selectedKey?: Key | null;
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
  className?: string;
}) {
  // the theme's --table-align as an inline style: the table primitive's own text-left can't win over it
  const alignStyle = (a?: GridColumn<T>["align"]) => ({
    textAlign: a ?? ("var(--table-align)" as "left"),
  });
  const cell =
    "border-r border-table-border px-(--table-cell-padding-x) py-(--table-cell-padding-y) text-(length:--table-font-size) last:border-r-0";
  return (
    <div
      className={cn(
        "overflow-hidden rounded-t-(--table-radius) border border-table-border",
        className,
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="border-0 bg-table-header hover:bg-table-header">
            {columns.map((c) => (
              <TableHead
                key={c.key}
                style={{ width: c.width, ...alignStyle(c.align) }}
                className={cn(
                  cell,
                  "h-auto font-(weight:--table-header-weight) text-table-header-foreground",
                )}
              >
                {c.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className={cn(cell, "py-4 text-center text-muted-foreground")}
              >
                {empty}
              </TableCell>
            </TableRow>
          )}
          {data.map((row, i) => {
            const k = rowKey(row, i);
            return (
              <TableRow
                key={k}
                data-state={selectedKey === k ? "selected" : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "border-table-border hover:bg-table-row-hover data-[state=selected]:bg-table-row-selected",
                  onRowClick && "cursor-pointer",
                )}
              >
                {columns.map((c) => (
                  <TableCell
                    key={c.key}
                    style={alignStyle(c.align)}
                    className={cn(cell, "text-control-fg")}
                  >
                    {c.render
                      ? c.render(row, i)
                      : String((row as Record<string, unknown>)[c.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
