// Reading a list from an Excel/CSV file the user picked (FileUpload block), and the template file they fill in.
// SheetJS loads on demand. Pattern from health-exam's registration import.
export type ImportColumn<K extends string = string> = {
  key: K;
  /** The header in the template; matching ignores case, Vietnamese accents and extra spaces. */
  header: string;
  required?: boolean;
  /** Example value written in the template's second row. */
  example?: string | number;
  /** Other headers accepted for this column ("SĐT", "Điện thoại"). */
  aliases?: string[];
};
export type ImportCell = string | number | boolean | Date | null;
export type ImportRow<K extends string> = {
  row: number;
  values: Record<K, ImportCell>;
  errors: string[];
};

const norm = (s: unknown) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

/**
 * Rows of the first sheet (or `sheet`), keyed by the columns' `key`. Headers are found on the first row that matches
 * at least one column. Empty rows are skipped; a missing required value becomes an error on that row (1-based, as
 * Excel shows it), so the screen can list "Dòng 7: thiếu Họ tên".
 */
export async function readSheet<K extends string>(
  file: File,
  columns: ImportColumn<K>[],
  { sheet }: { sheet?: string } = {},
): Promise<{ rows: ImportRow<K>[]; missingColumns: string[] }> {
  const XLSX = await import("xlsx");
  const wb = XLSX.read(await file.arrayBuffer(), { cellDates: true });
  const ws = wb.Sheets[sheet ?? wb.SheetNames[0] ?? ""];
  if (!ws) return { rows: [], missingColumns: columns.map((c) => c.header) };
  const grid = XLSX.utils.sheet_to_json<ImportCell[]>(ws, {
    header: 1,
    raw: true,
    defval: null,
    blankrows: false,
  });
  const want = columns.map((c) => ({
    c,
    names: [c.header, ...(c.aliases ?? [])].map(norm),
  }));
  const headerAt = grid.findIndex((r) =>
    r.some((cell) => want.some((w) => w.names.includes(norm(cell)))),
  );
  if (headerAt < 0)
    return { rows: [], missingColumns: columns.map((c) => c.header) };
  const header = (grid[headerAt] ?? []).map(norm);
  const index = new Map(
    want.map((w) => [w.c.key, header.findIndex((h) => w.names.includes(h))]),
  );
  const missingColumns = want
    .filter((w) => w.c.required && (index.get(w.c.key) ?? -1) < 0)
    .map((w) => w.c.header);
  const rows: ImportRow<K>[] = [];
  grid.slice(headerAt + 1).forEach((cells, i) => {
    if (cells.every((v) => v === null || String(v).trim() === "")) return;
    const values = {} as Record<K, ImportCell>;
    const errors: string[] = [];
    for (const { c } of want) {
      const at = index.get(c.key) ?? -1;
      const raw = at >= 0 ? (cells[at] ?? null) : null;
      values[c.key] = typeof raw === "string" ? raw.trim() || null : raw;
      if (c.required && (values[c.key] === null || values[c.key] === ""))
        errors.push(`thiếu ${c.header}`);
    }
    rows.push({ row: headerAt + i + 2, values, errors });
  });
  return { rows, missingColumns };
}

/** Download the template: headers (required ones marked *), one example row, columns sized to their header. */
export async function downloadImportTemplate(
  fileName: string,
  columns: ImportColumn[],
) {
  const XLSX = await import("xlsx");
  const ws = XLSX.utils.aoa_to_sheet([
    columns.map((c) => (c.required ? `${c.header} *` : c.header)),
    columns.map((c) => c.example ?? ""),
  ]);
  ws["!cols"] = columns.map((c) => ({
    wch: Math.max(12, c.header.length + 4),
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Mẫu nhập");
  XLSX.writeFile(
    wb,
    fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`,
  );
}
