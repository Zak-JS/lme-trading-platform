interface RangeBarProps {
  current: number;
  low: number;
  high: number;
}

export function RangeBar({ current, low, high }: RangeBarProps) {
  const range = high - low || 1;
  const position = Math.max(0, Math.min(100, ((current - low) / range) * 100));
  return (
    <div className="flex flex-col gap-1 w-24">
      <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
        <span>{low.toFixed(0)}</span>
        <span>{high.toFixed(0)}</span>
      </div>
      <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden relative">
        <div
          className="absolute top-0 bottom-0 w-1 bg-primary rounded-full transform -translate-x-1/2"
          style={{ left: `${position}%` }}
        />
      </div>
    </div>
  );
}
