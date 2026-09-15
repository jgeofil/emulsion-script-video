import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-40 w-full rounded-md border border-border bg-raised px-3 py-3 text-sm text-fg placeholder:text-subtle",
      "transition-colors duration-150 focus-visible:outline-none focus-visible:border-border-strong",
      "disabled:opacity-40 resize-y leading-relaxed",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
