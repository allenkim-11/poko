import * as React from "react";

import { cn } from "@/lib/utils";

interface IconChipProps {
  label: string;
  icon?: string | null;
  variant?: "outline" | "accent";
  asButton?: boolean;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function IconChip({
  label,
  icon,
  variant = "outline",
  asButton = false,
  active = false,
  onClick,
  className,
}: IconChipProps) {
  const Comp = asButton ? "button" : "span";
  const variantClasses =
    variant === "accent"
      ? "border-transparent bg-accent text-accent-foreground"
      : "border-border text-foreground";
  const activeClasses = active
    ? "border-transparent bg-primary text-primary-foreground"
    : variantClasses;

  return (
    <Comp
      type={asButton ? "button" : undefined}
      onClick={asButton ? onClick : undefined}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
        asButton ? "transition hover:brightness-95" : "",
        activeClasses,
        className
      )}
    >
      {icon ? (
        <img
          src={icon}
          alt=""
          className="h-4 w-4"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : null}
      <span>{label}</span>
    </Comp>
  );
}
