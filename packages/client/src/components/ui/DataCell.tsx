import { cn } from '@/lib/utils';

interface DataCellProps {
  value: number;
  format?: 'price' | 'percent' | 'number';
  showSign?: boolean;
  className?: string;
}

export function DataCell({
  value,
  format = 'number',
  showSign = false,
  className,
}: DataCellProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;

  let formattedValue = Math.abs(value).toString();

  if (format === 'price') {
    formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(value));
  } else if (format === 'percent') {
    formattedValue = `${Math.abs(value).toFixed(2)}%`;
  } else {
    formattedValue = new Intl.NumberFormat('en-US').format(Math.abs(value));
  }

  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  const displayValue = `${showSign ? sign : ''}${formattedValue}`;

  return (
    <span
      className={cn(
        'font-mono tabular-nums',
        {
          'text-emerald-500': isPositive && showSign,
          'text-red-500': isNegative && showSign,
          'text-foreground': !showSign || value === 0,
        },
        className
      )}
    >
      {displayValue}
    </span>
  );
}
