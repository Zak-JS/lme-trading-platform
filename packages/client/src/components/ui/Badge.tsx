import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "bg-primary/20 text-primary": variant === "default",
          "bg-success-muted text-success": variant === "success",
          "bg-warning-muted text-warning": variant === "warning",
          "bg-error-muted text-error": variant === "danger",
          "bg-info-muted text-info": variant === "info",
          "border border-border text-foreground": variant === "outline",
        },
        className,
      )}
      {...props}
    />
  );
}
