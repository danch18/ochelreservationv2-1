import { Card, CardContent } from '@/components/ui';
import type { ReservationStats } from '@/types';

interface StatsCardsProps {
  stats: ReservationStats;
  totalGuests: number;
}

export function StatsCards({ stats, totalGuests }: StatsCardsProps) {
  const statItems = [
    {
      title: 'Total',
      value: stats.total,
      subtitle: 'reservations',
      color: 'text-card-foreground'
    },
    {
      title: 'Confirmed',
      value: stats.confirmed,
      subtitle: 'active bookings',
      color: 'text-primary'
    },
    {
      title: 'Completed',
      value: stats.completed,
      subtitle: 'finished meals',
      color: 'text-secondary'
    },
    {
      title: 'Cancelled',
      value: stats.cancelled,
      subtitle: 'cancelled bookings',
      color: 'text-destructive'
    },
    {
      title: 'Total Guests',
      value: totalGuests,
      subtitle: 'expected today',
      color: 'text-accent'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      {statItems.map((item, index) => (
        <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              {item.title}
            </h3>
            <p className={`text-3xl font-bold ${item.color}`}>
              {item.value}
            </p>
            <p className="text-sm text-muted-foreground">{item.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}