import type { ReactNode } from "react";
import { cn } from "@/lib/format";

export function Badge({
  children,
  tone = "neutral"
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tone === "success" && "bg-mint/15 text-ink",
        tone === "warning" && "bg-honey/20 text-ink",
        tone === "neutral" && "bg-ink/5 text-ink"
      )}
    >
      {children}
    </span>
  );
}
