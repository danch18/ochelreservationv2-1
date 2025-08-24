'use client';

import { Card } from '@/components/ui';
import type { Reservation } from '@/types';

interface StatsCardsProps {
  reservations: Reservation[];
}

export function StatsCards({ reservations }: StatsCardsProps) {
  const today = new Date().toISOString().split('T')[0];
  
  const stats = {
    total: reservations.length,
    today: reservations.filter(r => r.reservation_date === today).length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  };

  const statCards = [
    {
      title: 'Total Reservations',
      value: stats.total,
      icon: '📊',
      color: 'text-blue-600'
    },
    {
      title: 'Today\'s Reservations',
      value: stats.today,
      icon: '📅',
      color: 'text-green-600'
    },
    {
      title: 'Confirmed',
      value: stats.confirmed,
      icon: '✅',
      color: 'text-emerald-600'
    },
    {
      title: 'Cancelled',
      value: stats.cancelled,
      icon: '❌',
      color: 'text-red-600'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="p-6 bg-[#191919] border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">
                {stat.title}
              </p>
              <p className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
            <div className="text-2xl">
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}