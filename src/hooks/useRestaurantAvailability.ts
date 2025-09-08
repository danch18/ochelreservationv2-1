import { useState, useEffect } from 'react';

interface DateStatus {
  date: string;
  is_closed: boolean;
  opening_time?: string;
  closing_time?: string;
  reason?: string;
}

interface UseRestaurantAvailabilityReturn {
  isDateClosed: (date: string) => boolean;
  getTimeSlots: (date: string) => string[];
  loading: boolean;
  error: string | null;
}

export function useRestaurantAvailability(): UseRestaurantAvailabilityReturn {
  const [dateStatuses, setDateStatuses] = useState<Record<string, DateStatus>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadAvailability = async () => {
      try {
        setLoading(true);
        setError(null);

        // Only fetch for next 30 days to keep it simple
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + 30);

        const startDateStr = today.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        const response = await fetch(`/api/admin/restaurant-status?start=${startDateStr}&end=${endDateStr}`);
        
        if (!response.ok) {
          throw new Error('Failed to load availability');
        }

        const data: DateStatus[] = await response.json();
        
        if (mounted) {
          const statusMap: Record<string, DateStatus> = {};
          data.forEach((status) => {
            statusMap[status.date] = status;
          });
          setDateStatuses(statusMap);
        }
      } catch (err) {
        if (mounted) {
          console.error('Error loading restaurant availability:', err);
          setError('Failed to load restaurant availability');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAvailability();

    return () => {
      mounted = false;
    };
  }, []);

  const isDateClosed = (date: string): boolean => {
    return dateStatuses[date]?.is_closed || false;
  };

  const getTimeSlots = (date: string): string[] => {
    const status = dateStatuses[date];
    
    // If date is closed, return empty array
    if (status?.is_closed) {
      return [];
    }

    // If no custom hours, use default 10:00-20:00
    const openTime = status?.opening_time || '10:00';
    const closeTime = status?.closing_time || '20:00';

    // Generate time slots
    const slots: string[] = [];
    const [openHour, openMin] = openTime.split(':').map(Number);
    const [closeHour, closeMin] = closeTime.split(':').map(Number);
    
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    
    for (let minutes = openMinutes; minutes < closeMinutes; minutes += 30) {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      slots.push(timeStr);
    }
    
    return slots;
  };

  return {
    isDateClosed,
    getTimeSlots,
    loading,
    error,
  };
}
