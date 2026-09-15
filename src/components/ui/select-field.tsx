import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function SelectField({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full appearance-none rounded-sm border border-border bg-raised bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 fill=%22none%22 stroke=%22%238c8a84%22 stroke-width=%221.6%22><path d=%22M1 1.5 6 6.5 11 1.5%22/></svg>')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat px-3 pr-9 text-sm text-fg",
        "focus-visible:outline-none focus-visible:border-border-strong",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
