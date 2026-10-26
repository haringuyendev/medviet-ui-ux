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

export type EmrColumn<T> = {
  key: string;
  title: ReactNode;
  /** Cell content; defaults to row[key]. */
  render?: (row: T, index: number) => ReactNode;
  width?: number | string;
  align?: "left" | "center" | "right";
};

/**
 * web-emr's table (antd Table with the ProviderAntd theme): --primary-brand header with white text and rounded top
 * corners, 12px cells with 4px padding, centred, --border_tbl lines, hovered row --primary-hover, selected row
 * --primary-active. For sorting/filtering/pagination use DataTable with these classes.
 *
 *   <EmrTable rowKey={(r) => r.id} columns={[{ key: "stt", title: "STT", width: 60, render: (_, i) => i + 1 }, …]} data={rows} />
 */
export function EmrTable<T>({
  columns,
  data,
  rowKey,
  selectedKey,
  onRowClick,
  empty = "Không có dữ liệu",
  className,
}: {
  columns: EmrColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => Key;
  selectedKey?: Key | null;
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
  className?: string;
}) {
  const align = (a: EmrColumn<T>["align"] = "center") =>
    a === "left" ? "text-left" : a === "right" ? "text-right" : "text-center";
  return (
    <div
      className={cn(
        "overflow-hidden rounded-t-[8px] border-[0.5px] border-emr-border-tbl",
        className,
      )}
    >
      <Table className="text-[12px]">
        <TableHeader>
          <TableRow className="border-0 bg-emr-primary-brand hover:bg-emr-primary-brand">
            {columns.map((c) => (
              <TableHead
                key={c.key}
                style={{ width: c.width }}
                className={cn(
                  "h-auto border-r border-emr-border-tbl px-1 py-1 text-[12px] font-semibold text-white last:border-r-0",
                  align(c.align),
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
                className="px-1 py-4 text-center text-emr-text-secondary"
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
                  "border-emr-border-tbl hover:bg-emr-primary-hover data-[state=selected]:bg-emr-primary-active",
                  onRowClick && "cursor-pointer",
                )}
              >
                {columns.map((c) => (
                  <TableCell
                    key={c.key}
                    className={cn(
                      "border-r border-emr-border-tbl px-1 py-1 text-[12px] text-emr-text-primary last:border-r-0",
                      align(c.align),
                    )}
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
