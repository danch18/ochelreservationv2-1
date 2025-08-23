import { cn } from '@/lib/utils';
import type { ReservationStatus } from '@/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'success' | 'warning';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-muted text-muted-foreground border-border',
    secondary: 'bg-secondary text-secondary-foreground border-border',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20',
    success: 'bg-primary/10 text-primary border-primary/20',
    warning: 'bg-accent text-accent-foreground border-border'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: ReservationStatus | undefined;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusText = status || 'confirmed';
  
  const getVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'destructive';
      case 'completed':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Badge variant={getVariant(statusText)} className={className}>
      {statusText}
    </Badge>
  );
}