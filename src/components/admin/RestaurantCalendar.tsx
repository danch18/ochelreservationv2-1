'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';

interface DateStatus {
  date: string; // YYYY-MM-DD format
  is_closed: boolean;
  reason?: string;
}

interface RestaurantCalendarProps {
  className?: string;
}

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export function RestaurantCalendar({ className }: RestaurantCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateStatuses, setDateStatuses] = useState<Record<string, DateStatus>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  // Get current month/year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Format date as YYYY-MM-DD
  const formatDate = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Load date statuses for current month
  const loadDateStatuses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get first and last day of current month for API query
      const startDate = formatDate(currentYear, currentMonth, 1);
      const endDate = formatDate(currentYear, currentMonth, daysInMonth);

      const response = await fetch(`/api/admin/restaurant-status?start=${startDate}&end=${endDate}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des statuts');
      }

      const data = await response.json();
      
      // Convert array to object for easier lookup
      const statusMap: Record<string, DateStatus> = {};
      data.forEach((status: DateStatus) => {
        statusMap[status.date] = status;
      });
      
      setDateStatuses(statusMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Toggle date status (open/closed)
  const toggleDateStatus = async (day: number) => {
    const dateStr = formatDate(currentYear, currentMonth, day);
    const currentStatus = dateStatuses[dateStr];
    const newStatus = !currentStatus?.is_closed;

    try {
      setUpdating(dateStr);
      setError(null);

      const response = await fetch('/api/admin/restaurant-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateStr,
          is_closed: newStatus,
          reason: newStatus ? 'Fermé manuellement' : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      const updatedStatus = await response.json();
      
      // Update local state
      setDateStatuses(prev => ({
        ...prev,
        [dateStr]: updatedStatus,
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setUpdating(null);
    }
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Load data when month changes
  useEffect(() => {
    loadDateStatuses();
  }, [currentMonth, currentYear]);

  // Get status for a specific date
  const getDateStatus = (day: number): DateStatus | null => {
    const dateStr = formatDate(currentYear, currentMonth, day);
    return dateStatuses[dateStr] || null;
  };

  // Check if date is today
  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  // Check if date is in the past
  const isPastDate = (day: number): boolean => {
    const today = new Date();
    const checkDate = new Date(currentYear, currentMonth, day);
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Calendrier du Restaurant
          </h2>
          <Button
            onClick={goToToday}
            variant="outline"
            size="sm"
          >
            Aujourd'hui
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={goToPreviousMonth}
            variant="outline"
            size="sm"
            className="px-3"
          >
            ←
          </Button>
          
          <div className="min-w-[200px] text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {MONTHS[currentMonth]} {currentYear}
            </h3>
          </div>
          
          <Button
            onClick={goToNextMonth}
            variant="outline"
            size="sm"
            className="px-3"
          >
            →
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
          <span>Ouvert</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
          <span>Fermé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
          <span>Aujourd'hui</span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {/* Calendar Grid */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7 bg-gray-50">
              {DAYS.map(day => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="h-24 border-r border-b border-gray-200 last:border-r-0"
                    />
                  );
                }

                const dateStr = formatDate(currentYear, currentMonth, day);
                const status = getDateStatus(day);
                const isClosed = status?.is_closed || false;
                const isCurrentDay = isToday(day);
                const isPast = isPastDate(day);
                const isUpdatingThisDate = updating === dateStr;

                return (
                  <div
                    key={day}
                    className={`h-24 border-r border-b border-gray-200 last:border-r-0 relative ${
                      isPast ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <button
                      onClick={() => !isPast && toggleDateStatus(day)}
                      disabled={isPast || isUpdatingThisDate}
                      className={`w-full h-full p-2 text-left relative ${
                        isPast ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      {/* Date number */}
                      <div
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                          isCurrentDay
                            ? 'bg-blue-500 text-white'
                            : isPast
                            ? 'text-gray-400'
                            : 'text-gray-900'
                        }`}
                      >
                        {day}
                      </div>

                      {/* Status indicator */}
                      {!isPast && (
                        <div
                          className={`absolute bottom-2 right-2 w-3 h-3 rounded-full ${
                            isClosed
                              ? 'bg-red-500'
                              : 'bg-green-500'
                          }`}
                        />
                      )}

                      {/* Loading indicator */}
                      {isUpdatingThisDate && (
                        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                          <LoadingSpinner size="sm" />
                        </div>
                      )}

                      {/* Hover tooltip */}
                      {!isPast && (
                        <div className="absolute bottom-1 left-2 text-xs text-gray-600">
                          {isClosed ? 'Fermé' : 'Ouvert'}
                          {status?.reason && (
                            <div className="text-xs text-gray-500 truncate max-w-[80px]">
                              {status.reason}
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 text-sm text-gray-600">
            <p>Cliquez sur une date pour basculer entre ouvert/fermé. Les dates passées ne peuvent pas être modifiées.</p>
          </div>
        </>
      )}
    </div>
  );
}
