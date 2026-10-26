import { FileQuestionIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function NotFound() {
  const location = useLocation();
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileQuestionIcon />
          </EmptyMedia>
          <EmptyTitle>Không tìm thấy trang</EmptyTitle>
          <EmptyDescription>
            Đường dẫn <code>{location.pathname}</code> không tồn tại hoặc đã
            được chuyển đi.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button render={<Link to="/" />}>Về trang chủ</Button>
        </EmptyContent>
      </Empty>
    </main>
  );
}
