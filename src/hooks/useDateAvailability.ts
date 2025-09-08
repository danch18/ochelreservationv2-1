import { useState, useEffect } from 'react';

interface DateStatus {
  date: string;
  is_closed: boolean;
  opening_time?: string;
  closing_time?: string;
  reason?: string;
}

interface UseDateAvailabilityReturn {
  isDateClosed: (date: string) => boolean;
  getDateHours: (date: string) => { opening_time: string; closing_time: string };
  getAvailableTimeSlots: (date: string) => string[];
  loading: boolean;
  error: string | null;
}

export function useDateAvailability(): UseDateAvailabilityReturn {
  const [dateStatuses, setDateStatuses] = useState<Record<string, DateStatus>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load date statuses for the next 30 days
  const loadDateStatuses = async () => {
    try {
      setLoading(true);
      setError(null);

      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + 30);

      const startDateStr = today.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Check if we're in a client environment that can access the API
      if (typeof window === 'undefined') {
        throw new Error('Hook called on server side');
      }
      
      const response = await fetch(`/api/admin/restaurant-status?start=${startDateStr}&end=${endDateStr}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des disponibilités');
      }

      const data: DateStatus[] = await response.json();
      
      // Convert array to object for easier lookup
      const statusMap: Record<string, DateStatus> = {};
      data.forEach((status) => {
        statusMap[status.date] = status;
      });
      
      setDateStatuses(statusMap);
    } catch (err) {
      console.error('Date availability error:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Check if a date is closed
  const isDateClosed = (date: string): boolean => {
    return dateStatuses[date]?.is_closed || false;
  };

  // Get opening hours for a specific date
  const getDateHours = (date: string): { opening_time: string; closing_time: string } => {
    const status = dateStatuses[date];
    return {
      opening_time: status?.opening_time || '10:00',
      closing_time: status?.closing_time || '20:00',
    };
  };

  // Generate available time slots for a date
  const getAvailableTimeSlots = (date: string): string[] => {
    if (isDateClosed(date)) {
      return [];
    }

    const { opening_time, closing_time } = getDateHours(date);
    
    // Parse opening and closing times
    const [openHour, openMin] = opening_time.split(':').map(Number);
    const [closeHour, closeMin] = closing_time.split(':').map(Number);
    
    const openTimeMinutes = openHour * 60 + openMin;
    const closeTimeMinutes = closeHour * 60 + closeMin;
    
    const slots: string[] = [];
    
    // Generate 30-minute intervals
    for (let minutes = openTimeMinutes; minutes < closeTimeMinutes; minutes += 30) {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      slots.push(timeStr);
    }
    
    return slots;
  };

  // Load data on mount
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      if (mounted) {
        await loadDateStatuses();
      }
    };
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, []);

  return {
    isDateClosed,
    getDateHours,
    getAvailableTimeSlots,
    loading,
    error,
  };
}
