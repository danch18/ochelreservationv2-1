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
      subtitle: 'réservations',
      color: 'text-black'
    },
    {
      title: 'Confirmées',
      value: stats.confirmed,
      subtitle: 'réservations actives',
      color: 'text-green-600'
    },
    {
      title: 'Terminées',
      value: stats.completed,
      subtitle: 'repas terminés',
      color: 'text-blue-600'
    },
    {
      title: 'Annulées',
      value: stats.cancelled,
      subtitle: 'réservations annulées',
      color: 'text-red-600'
    },
    {
      title: 'Total Invités',
      value: totalGuests,
      subtitle: 'attendus aujourd\'hui',
      color: 'text-[#F34A23]'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      {statItems.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-black mb-2">
              {item.title}
            </h3>
            <p className={`text-3xl font-bold ${item.color}`}>
              {item.value}
            </p>
            <p className="text-sm text-gray-600">{item.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}