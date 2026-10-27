import { PrinterIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * A paper form to print (biên bản, phiếu, bảng bàn giao; gmhs "In bảng"). On screen: an A4 sheet on a muted desk with
 * [In]; when printing: only the sheet, at A4 with the margins below. Mark app chrome that must not print with
 * `print:hidden` (sidebar, header, toolbars); everything inside the sheet prints in black on white.
 *
 *   <PrintSheet title="Biên bản bàn giao" orientation="portrait">…</PrintSheet>
 */
export function PrintSheet({
  title,
  orientation = "portrait",
  margin = "12mm",
  printLabel = "In",
  actions,
  className,
  children,
}: {
  /** Shown above the sheet on screen and used as the document title when saving as PDF. */
  title: string;
  orientation?: "portrait" | "landscape";
  margin?: string;
  printLabel?: string;
  /** More buttons next to [In] (Tải PDF, Đóng). */
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const print = () => {
    const previous = document.title;
    document.title = title;
    window.print();
    document.title = previous;
  };
  const width = orientation === "portrait" ? "210mm" : "297mm";
  return (
    <div className="flex flex-col items-center gap-4 bg-muted p-4 print:block print:bg-transparent print:p-0">
      <style>{`@page { size: A4 ${orientation}; margin: ${margin}; } @media print { body { background: none; } }`}</style>
      <div
        className="flex w-full items-center justify-between gap-2 print:hidden"
        style={{ maxWidth: width }}
      >
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <div className="flex gap-2">
          {actions}
          <Button type="button" onClick={print}>
            <PrinterIcon aria-hidden="true" />
            {printLabel}
          </Button>
        </div>
      </div>
      {/* medviet-ignore raw-color: paper is white and ink is black on screen and in print, whatever the theme */}
      <article
        className={cn(
          "w-full bg-white text-black shadow-sm print:shadow-none",
          className,
        )}
        style={{
          maxWidth: width,
          minHeight: orientation === "portrait" ? "297mm" : "210mm",
          padding: margin,
        }}
      >
        {children}
      </article>
    </div>
  );
}
