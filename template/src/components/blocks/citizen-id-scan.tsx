import { ScanLine } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { CitizenCard } from "@/lib/citizen-id";
import { parseCitizenCard } from "@/lib/citizen-id";
import { DescriptionList } from "./description-list";

type Detector = {
  detect: (source: CanvasImageSource) => Promise<{ rawValue: string }[]>;
};
declare global {
  interface Window {
    BarcodeDetector?: new (options: { formats: string[] }) => Detector;
  }
}

const NOT_READ = "Không đọc được số CCCD. Quét lại, hoặc gõ 12 số CCCD.";

/**
 * Reads the QR on a CCCD with the camera: the browser's BarcodeDetector where it exists, jsQR (loaded on first use)
 * elsewhere, e.g. Chrome on Windows. Calls onText with each decoded QR until unmounted.
 */
function CameraReader({
  onText,
  onError,
}: {
  onText: (text: string) => void;
  onError: (message: string) => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const handlers = useRef({ onText, onError });
  handlers.current = { onText, onError };
  useEffect(() => {
    let stream: MediaStream | null = null;
    let timer = 0;
    let stopped = false;
    const canvas = document.createElement("canvas");
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
      } catch {
        handlers.current.onError(
          "Không mở được camera. Cho phép trình duyệt dùng camera, hoặc dùng máy quét.",
        );
        return;
      }
      const v = video.current;
      if (stopped || !v) {
        for (const t of stream.getTracks()) t.stop();
        return;
      }
      v.srcObject = stream;
      await v.play().catch(() => {});
      const detector = window.BarcodeDetector
        ? new window.BarcodeDetector({ formats: ["qr_code"] })
        : null;
      const jsQR = detector ? null : (await import("jsqr")).default;
      const tick = async () => {
        if (stopped) return;
        if (v.videoWidth) {
          let text = "";
          if (detector)
            text =
              (await detector.detect(v).catch(() => []))[0]?.rawValue ?? "";
          else if (jsQR) {
            canvas.width = v.videoWidth;
            canvas.height = v.videoHeight;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            ctx?.drawImage(v, 0, 0);
            const img = ctx?.getImageData(0, 0, canvas.width, canvas.height);
            if (img) text = jsQR(img.data, img.width, img.height)?.data ?? "";
          }
          if (text) handlers.current.onText(text);
        }
        timer = window.setTimeout(tick, 200);
      };
      tick();
    })();
    return () => {
      stopped = true;
      clearTimeout(timer);
      for (const t of stream?.getTracks() ?? []) t.stop();
    };
  }, []);
  return (
    <video
      ref={video}
      muted
      playsInline
      aria-label="Hình từ camera"
      className="aspect-video w-full rounded-lg bg-muted object-cover"
    />
  );
}

/**
 * Quét CCCD: a handheld QR reader types into the box and presses Enter (the usual desk setup), or the camera reads the
 * QR; typing the 12 digits works too. Shows what was read, then onScan(card) when the user confirms. birthDate and
 * issuedDate are DD/MM/YYYY, ready for DateField; gender is "Nam" / "Nữ".
 */
export function CitizenIdScanDialog({
  open,
  onOpenChange,
  onScan,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (card: CitizenCard) => void;
}) {
  const [mode, setMode] = useState("reader");
  const [text, setText] = useState("");
  const [card, setCard] = useState<CitizenCard | null>(null);
  const [error, setError] = useState("");
  const reset = () => {
    setText("");
    setCard(null);
    setError("");
  };
  const read = (raw: string) => {
    const found = parseCitizenCard(raw);
    if (found) {
      setCard(found);
      setError("");
    } else setError(NOT_READ);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Quét CCCD</DialogTitle>
          <DialogDescription>
            Đưa mã QR ở mặt trước CCCD vào máy quét hoặc camera. Gõ 12 số CCCD
            cũng được.
          </DialogDescription>
        </DialogHeader>
        {card ? (
          <DescriptionList
            items={[
              { label: "Số CCCD", value: card.citizenId },
              { label: "Họ và tên", value: card.fullName },
              { label: "Ngày sinh", value: card.birthDate },
              { label: "Giới tính", value: card.gender },
              { label: "Ngày cấp", value: card.issuedDate },
              { label: "Số CMND cũ", value: card.oldId },
              { label: "Địa chỉ", value: card.address, full: true },
            ]}
          />
        ) : (
          <Tabs value={mode} onValueChange={(v) => setMode(String(v))}>
            <TabsList>
              <TabsTrigger value="reader">Máy quét</TabsTrigger>
              <TabsTrigger value="camera">Camera</TabsTrigger>
            </TabsList>
            <TabsContent value="reader" className="flex flex-col gap-2">
              <Textarea
                autoFocus
                rows={3}
                aria-label="Nội dung mã QR hoặc số CCCD"
                placeholder="Quét mã QR trên CCCD, hoặc gõ 12 số rồi nhấn Enter"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  // readers press Enter right after the payload; Shift+Enter is still a new line
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    read(text);
                  }
                }}
              />
            </TabsContent>
            <TabsContent value="camera">
              {open && mode === "camera" && (
                <CameraReader
                  onText={(raw) => {
                    if (parseCitizenCard(raw)) read(raw);
                  }}
                  onError={setError}
                />
              )}
            </TabsContent>
          </Tabs>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          {card ? (
            <>
              <Button variant="outline" onClick={reset}>
                Quét lại
              </Button>
              <Button
                onClick={() => {
                  onScan(card);
                  reset();
                  onOpenChange(false);
                }}
              >
                Dùng thông tin này
              </Button>
            </>
          ) : (
            mode === "reader" && (
              <Button onClick={() => read(text)} disabled={!text.trim()}>
                Đọc
              </Button>
            )
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** A "Quét CCCD" button that opens CitizenIdScanDialog. */
export function CitizenIdScanButton({
  onScan,
  label = "Quét CCCD",
}: {
  onScan: (card: CitizenCard) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <ScanLine />
        {label}
      </Button>
      <CitizenIdScanDialog open={open} onOpenChange={setOpen} onScan={onScan} />
    </>
  );
}
