import { formatDate } from "@/lib/format";

export type ExportCell = string | number | boolean | Date | null | undefined;
/** One exported column: its header and how to read the value from a row (raw numbers and Dates, not formatted text). */
export type ExportColumn<T> = {
  header: string;
  value: (row: T) => ExportCell;
  format?: string;
};

const quote = (v: ExportCell) => {
  const s =
    v === null || v === undefined
      ? ""
      : v instanceof Date
        ? formatDate(v)
        : String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function download(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** UTF-8 CSV with a BOM, so Excel shows Vietnamese correctly. */
export function downloadCsv<T>(
  fileName: string,
  columns: ExportColumn<T>[],
  rows: T[],
) {
  const lines = [
    columns.map((c) => quote(c.header)).join(","),
    ...rows.map((r) => columns.map((c) => quote(c.value(r))).join(",")),
  ];
  download(
    new Blob([`﻿${lines.join("\r\n")}`], { type: "text/csv;charset=utf-8" }),
    fileName.endsWith(".csv") ? fileName : `${fileName}.csv`,
  );
}
