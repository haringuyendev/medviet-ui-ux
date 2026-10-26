import { PenLineIcon } from "lucide-react";
import type { Ref } from "react";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import type { PointGroup } from "signature_pad";
import SignaturePadLib from "signature_pad";

import { Button } from "@/components/ui/button";

/** Export ratio cap: keeps a scribbled-full pad near ~140 KB of data URL (health-exam ADR-0013). */
const MAX_EXPORT_RATIO = 2;
/** Ink that prints and scans well on white paper. */
const INK = "#1f2a44";
/** Total stroke length (CSS px) that makes a signature: a dot or a brushing thumb falls short. */
export const MIN_STROKE_LENGTH = 60;

export type SignatureCapture = {
  dataUrl: string;
  canvas: { width: number; height: number; devicePixelRatio: number };
};
export type SignaturePadHandle = {
  /** The drawing as a transparent PNG, or null while nothing is drawn. */
  capture: () => SignatureCapture | null;
  clear: () => void;
};

function totalStrokeLength(groups: PointGroup[]) {
  let total = 0;
  for (const g of groups)
    for (let i = 1; i < g.points.length; i++) {
      const a = g.points[i - 1];
      const b = g.points[i];
      if (a && b) total += Math.hypot(b.x - a.x, b.y - a.y);
    }
  return total;
}

/**
 * The signing surface: `signature_pad` wrapped once. The parent learns the stroke length continuously (to enable
 * [Xác nhận] at MIN_STROKE_LENGTH) and pulls the PNG through the ref only when it needs it. Resizing (a phone
 * rotating) keeps the strokes: they are lifted with toData() and replayed at the new ratio.
 *
 *   const pad = useRef<SignaturePadHandle>(null);
 *   <SignaturePad ref={pad} label="Chữ ký người bệnh" onStrokeLengthChange={setLength} />
 *   <Button disabled={length < MIN_STROKE_LENGTH} onClick={() => save(pad.current?.capture())}>Xác nhận</Button>
 */
export function SignaturePad({
  ref,
  label,
  placeholder = "Ký tên vào đây",
  hint = "Dùng chuột, bút hoặc ngón tay để ký.",
  clearLabel = "Ký lại",
  onStrokeLengthChange,
}: {
  ref?: Ref<SignaturePadHandle>;
  /** What a screen reader is told the drawing area is. */
  label: string;
  placeholder?: string;
  hint?: string;
  clearLabel?: string;
  onStrokeLengthChange?: (lengthPx: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePadLib | null>(null);
  const ratioRef = useRef(1);
  const notifyRef = useRef(onStrokeLengthChange);
  const [strokeLength, setStrokeLength] = useState(0);

  useEffect(() => {
    notifyRef.current = onStrokeLengthChange;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pad = new SignaturePadLib(canvas, {
      penColor: INK,
      minWidth: 1,
      maxWidth: 2.4,
      backgroundColor: "rgba(0,0,0,0)",
    });
    padRef.current = pad;
    const report = () => {
      const length = totalStrokeLength(pad.toData());
      setStrokeLength(length);
      notifyRef.current?.(length);
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_EXPORT_RATIO);
      const width = Math.round(rect.width * ratio);
      const height = Math.round(rect.height * ratio);
      if (canvas.width === width && canvas.height === height) return;
      const strokes = pad.toData(); // before the width assignment wipes the bitmap
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")?.scale(ratio, ratio);
      ratioRef.current = ratio;
      pad.clear();
      pad.fromData(strokes);
    };
    resize();
    pad.addEventListener("endStroke", report);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      pad.removeEventListener("endStroke", report);
      pad.off();
      padRef.current = null;
    };
  }, []);

  const clear = () => {
    padRef.current?.clear();
    setStrokeLength(0);
    notifyRef.current?.(0);
  };

  useImperativeHandle(ref, () => ({
    capture: () => {
      const pad = padRef.current;
      const canvas = canvasRef.current;
      if (!pad || !canvas || pad.isEmpty()) return null;
      const rect = canvas.getBoundingClientRect();
      return {
        dataUrl: pad.toDataURL("image/png"),
        canvas: {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          devicePixelRatio: ratioRef.current,
        },
      };
    },
    clear,
  }));

  return (
    <div className="flex flex-col gap-2">
      {/* aura-ignore raw-color: a signature is captured on white paper, whatever the theme */}
      <div className="relative h-40 w-full overflow-hidden rounded-lg border border-input bg-white">
        {strokeLength === 0 && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-sm text-muted-foreground"
          >
            {placeholder}
          </span>
        )}
        {/* touch-none keeps a stroke a stroke instead of scrolling the page */}
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={label}
          className="absolute inset-0 size-full touch-none"
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{hint}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={strokeLength === 0}
          onClick={clear}
        >
          <PenLineIcon aria-hidden="true" />
          {clearLabel}
        </Button>
      </div>
    </div>
  );
}
