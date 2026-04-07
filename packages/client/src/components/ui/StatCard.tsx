import { Card } from './Card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | React.ReactNode;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  accentColor?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  icon,
  accentColor,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn('p-6', accentColor && `border-t-2 ${accentColor}`, className)}
    >
      <div className="flex items-center justify-between pb-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && <div className="flex h-8 w-8 items-center justify-center rounded-full">{icon}</div>}
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-2xl font-bold font-mono tabular-nums">{value}</div>
        {change && (
          <p
            className={cn(
              'text-xs font-medium',
              change.isPositive ? 'text-emerald-500' : 'text-red-500'
            )}
          >
            {change.isPositive ? '+' : ''}
            {change.value}
          </p>
        )}
      </div>
    </Card>
  );
}
