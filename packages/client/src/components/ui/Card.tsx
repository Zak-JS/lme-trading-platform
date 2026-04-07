import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg bg-card text-card-foreground',
        variant === 'default' && 'border border-border/50',
        variant === 'elevated' && 'border border-border shadow-lg shadow-black/20',
        variant === 'bordered' && 'border-2 border-border',
        className
      )}
      {...props}
    />
  );
}
