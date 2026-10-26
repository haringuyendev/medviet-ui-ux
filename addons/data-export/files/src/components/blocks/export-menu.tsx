import { DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import type { ExportColumn } from "@/lib/export/csv";
import { downloadCsv } from "@/lib/export/csv";
import { formatNumber } from "@/lib/format";

/**
 * [Xuất] → Excel (.xlsx) | CSV for the rows the user is looking at. Columns give raw values (numbers, Dates), so Excel
 * can sum and sort them; the xlsx writer loads on demand.
 *
 *   <ExportMenu fileName="ho-so-kham" rows={table.getFilteredRowModel().rows.map((r) => r.original)}
 *     columns={[{ header: "Mã hồ sơ", value: (r) => r.code }, { header: "Ngày khám", value: (r) => new Date(r.examAt) }]} />
 */
export function ExportMenu<T>({
  fileName,
  columns,
  rows,
  label = "Xuất",
}: {
  fileName: string;
  columns: ExportColumn<T>[];
  rows: T[];
  label?: string;
}) {
  const done = () =>
    toast.add({ title: `Đã xuất ${formatNumber(rows.length, 0)} dòng` });
  const xlsx = async () => {
    const { downloadXlsx } = await import("@/lib/export/xlsx");
    downloadXlsx(
      fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`,
      columns.map((c) => ({ header: c.header, format: c.format })),
      rows.map((r) => columns.map((c) => c.value(r))),
    );
    done();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button type="button" variant="outline" disabled={!rows.length} />
        }
      >
        <DownloadIcon aria-hidden="true" />
        {label}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={xlsx}>Excel (.xlsx)</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            downloadCsv(fileName, columns, rows);
            done();
          }}
        >
          CSV (.csv)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
