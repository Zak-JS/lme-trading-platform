import type { MetalSymbol } from "@lme/shared";
import { cn } from "@/lib/utils";

interface MetalIconProps {
  symbol: MetalSymbol;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const metalColors: Record<MetalSymbol, string> = {
  CU: "bg-orange-500/20 text-orange-500 border-orange-500/30",
  AL: "bg-slate-400/20 text-slate-300 border-slate-400/30",
  ZN: "bg-zinc-400/20 text-zinc-300 border-zinc-400/30",
  PB: "bg-stone-500/20 text-stone-400 border-stone-500/30",
  NI: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
  SN: "bg-amber-500/20 text-amber-500 border-amber-500/30",
};

const sizeClasses = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-12 w-12 text-lg",
};

export function MetalIcon({ symbol, size = "md", className }: MetalIconProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border font-bold",
        metalColors[symbol],
        sizeClasses[size],
        className,
      )}
    >
      {symbol}
    </div>
  );
}
