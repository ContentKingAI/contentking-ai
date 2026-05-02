import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variantClasses: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-black",
  secondary: "border border-ink/10 bg-white text-ink hover:border-ink/25 hover:bg-cloud",
  ghost: "text-ink hover:bg-ink/5",
  danger: "border border-coral/35 bg-coral/10 text-ink hover:bg-coral/15"
};

const baseClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-mint focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  children: ReactNode;
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}

export function ButtonLink({ className, variant = "primary", href, ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(baseClasses, variantClasses[variant], className)}
      href={href}
      {...props}
    />
  );
}
