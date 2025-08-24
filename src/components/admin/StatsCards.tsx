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
      color: 'text-white'
    },
    {
      title: 'Confirmed',
      value: stats.confirmed,
      subtitle: 'active bookings',
      color: 'text-green-200'
    },
    {
      title: 'Completed',
      value: stats.completed,
      subtitle: 'finished meals',
      color: 'text-blue-200'
    },
    {
      title: 'Cancelled',
      value: stats.cancelled,
      subtitle: 'cancelled bookings',
      color: 'text-red-200'
    },
    {
      title: 'Total Guests',
      value: totalGuests,
      subtitle: 'expected today',
      color: 'text-amber-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      {statItems.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              {item.title}
            </h3>
            <p className={`text-3xl font-bold ${item.color}`}>
              {item.value}
            </p>
            <p className="text-sm text-gray-300">{item.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}