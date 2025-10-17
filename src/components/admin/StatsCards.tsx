import { Card, CardContent } from '@/components/ui';
import type { ReservationStats } from '@/types';
import { useTranslation } from '@/contexts/LanguageContext';

interface StatsCardsProps {
  stats: ReservationStats;
  totalGuests: number;
}

export function StatsCards({ stats, totalGuests }: StatsCardsProps) {
  const { t } = useTranslation();
  /**
   * Configuration for each statistics card
   * Each item represents a metric to display in the admin dashboard
   */
  const statItems = [
    {
      title: t('admin.stats.total'),
      value: stats.total,
      subtitle: t('admin.stats.totalSubtitle'),
      color: 'text-black'                    // Neutral color for total count
    },
    {
      title: t('admin.stats.confirmed'),
      value: stats.confirmed,
      subtitle: t('admin.stats.confirmedSubtitle'),
      color: 'text-green-600'               // Green for confirmed/active reservations
    },
    {
      title: t('admin.stats.pending'),
      value: stats.pending || 0,             // Fallback to 0 if pending is undefined
      subtitle: t('admin.stats.pendingSubtitle'),
      color: 'text-orange-600'              // Orange for pending/awaiting confirmation
    },
    {
      title: t('admin.stats.completed'),
      value: stats.completed,
      subtitle: t('admin.stats.completedSubtitle'),
      color: 'text-blue-600'                // Blue for completed reservations
    },
    {
      title: t('admin.stats.cancelled'),
      value: stats.cancelled,
      subtitle: t('admin.stats.cancelledSubtitle'),
      color: 'text-red-600'                 // Red for cancelled reservations
    },
    {
      title: t('admin.stats.totalGuests'),
      value: totalGuests,
      subtitle: t('admin.stats.totalGuestsSubtitle'),
      color: 'text-[#F34A23]'               // Restaurant brand color for guest count
    }
  ];

  return (
    /* Statistics Cards Grid - Responsive layout: 2 columns mobile, 6 columns desktop */
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-6 mb-8 font-forum">
      {statItems.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-3 md:p-6">
            {/* Card Title */}
            <h3 className="text-sm md:text-lg font-semibold text-black mb-1 md:mb-2">
              {item.title}
            </h3>
            {/* Main Statistic Value - Large, bold, and colored */}
            <p className={`text-xl md:text-3xl font-bold ${item.color}`}>
              {item.value}
            </p>
            {/* Subtitle/Description */}
            <p className="text-xs md:text-sm text-gray-600">{item.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}