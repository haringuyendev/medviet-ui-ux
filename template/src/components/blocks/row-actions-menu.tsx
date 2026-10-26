import { EllipsisIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * A table row's actions behind one "⋯" button, so the action column stays narrow however many actions a state
 * offers (gmhs). Children are DropdownMenuItem / DropdownMenuSeparator; put the destructive one last with
 * `variant="destructive"`.
 */
export function RowActionsMenu({
  label = "Thao tác",
  className,
  children,
}: {
  /** The trigger's accessible name. */
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={cn(className)}
            title={label}
          />
        }
      >
        <EllipsisIcon aria-hidden="true" />
        {/* visually hidden text rather than aria-label: page search and translation see it */}
        <span className="sr-only">{label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-44">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
