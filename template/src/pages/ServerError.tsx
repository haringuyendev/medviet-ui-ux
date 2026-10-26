import { TriangleAlertIcon } from "lucide-react";
import type { FallbackProps } from "react-error-boundary";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

/**
 * What the ErrorBoundary in App renders once the tree has thrown. A full reload rather than a retry: the app's state is
 * of unknown validity, so re-rendering the same tree tends to throw straight back (turbo-web _template_vite).
 */
export default function ServerError(_: FallbackProps) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TriangleAlertIcon />
          </EmptyMedia>
          <EmptyTitle>Đã có lỗi xảy ra</EmptyTitle>
          <EmptyDescription>
            Ứng dụng gặp sự cố ngoài dự kiến. Tải lại trang để tiếp tục.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => window.location.reload()}>
            Tải lại trang
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  );
}
