import { useState, useEffect } from 'react';

interface WeeklySchedule {
  day_of_week: number;
  is_open: boolean;
  morning_opening?: string;
  morning_closing?: string;
  afternoon_opening?: string;
  afternoon_closing?: string;
  single_opening?: string;
  single_closing?: string;
  use_split_hours: boolean;
}

interface DateStatus {
  date: string;
  is_closed: boolean;
  opening_time?: string;
  closing_time?: string;
  reason?: string;
  // Split hours support
  morning_opening?: string;
  morning_closing?: string;
  afternoon_opening?: string;
  afternoon_closing?: string;
  use_split_hours?: boolean;
}

interface UseRestaurantAvailabilityReturn {
  isDateClosed: (date: string) => boolean;
  getTimeSlots: (date: string) => string[];
  loading: boolean;
  error: string | null;
}

export function useRestaurantAvailability(): UseRestaurantAvailabilityReturn {
  const [dateStatuses, setDateStatuses] = useState<Record<string, DateStatus>>({});
  const [weeklySchedule, setWeeklySchedule] = useState<Record<number, WeeklySchedule>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadAvailability = async () => {
      try {
        setLoading(true);
        setError(null);

        const { supabase } = await import('@/lib/supabase');

        // Load weekly schedule
        const { data: weeklyData, error: weeklyError } = await supabase
          .from('restaurant_settings')
          .select('setting_key, setting_value')
          .like('setting_key', 'weekly_schedule_%');

        if (weeklyError && weeklyError.code !== 'PGRST116') {
          throw new Error(`Error loading weekly schedule: ${weeklyError.message}`);
        }

        // Parse weekly schedule
        const schedule: Record<number, WeeklySchedule> = {};
        for (let day = 0; day < 7; day++) {
          schedule[day] = {
            day_of_week: day,
            is_open: true,
            use_split_hours: false,
            single_opening: '10:00',
            single_closing: '20:00',
          };
        }

        if (weeklyData) {
          weeklyData.forEach(setting => {
            const match = setting.setting_key.match(/^weekly_schedule_(\d+)$/);
            if (match) {
              const dayOfWeek = parseInt(match[1]);
              try {
                const dayConfig = JSON.parse(setting.setting_value);
                schedule[dayOfWeek] = { ...schedule[dayOfWeek], ...dayConfig };
              } catch (parseError) {
                console.error(`Error parsing weekly schedule for day ${dayOfWeek}:`, parseError);
              }
            }
          });
        }

        // Load specific date overrides for next 30 days
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + 30);
        const startDateStr = today.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        const { data: dateData, error: dateError } = await supabase
          .from('closed_dates')
          .select('date, is_closed, reason, opening_time, closing_time')
          .gte('date', startDateStr)
          .lte('date', endDateStr);

        if (dateError && dateError.code !== 'PGRST116') {
          throw new Error(`Error loading date data: ${dateError.message}`);
        }

        if (mounted) {
          setWeeklySchedule(schedule);
          
          const statusMap: Record<string, DateStatus> = {};
          if (dateData) {
            dateData.forEach((status) => {
              statusMap[status.date] = status;
            });
          }
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

  const getDateStatus = (date: string) => {
    const specificDateStatus = dateStatuses[date];
    
    // Get the day of week (0=Sunday, 1=Monday, etc.)
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    const weeklyScheduleForDay = weeklySchedule[dayOfWeek];
    
    // If there's a specific date override, use that
    if (specificDateStatus) {
      return specificDateStatus;
    }
    
    // Otherwise, apply weekly schedule settings
    if (weeklyScheduleForDay && !weeklyScheduleForDay.is_open) {
      // Day is closed in weekly schedule
      return {
        date,
        is_closed: true,
        reason: `Fermé selon horaire hebdomadaire`,
        opening_time: weeklyScheduleForDay.single_opening || '10:00',
        closing_time: weeklyScheduleForDay.single_closing || '20:00',
      };
    }
    
    // Day is open in weekly schedule, return hours based on split/continuous mode
    if (weeklyScheduleForDay) {
      if (weeklyScheduleForDay.use_split_hours) {
        return {
          date,
          is_closed: false,
          reason: null,
          opening_time: weeklyScheduleForDay.morning_opening || '10:00',
          closing_time: weeklyScheduleForDay.afternoon_closing || '22:00',
          morning_opening: weeklyScheduleForDay.morning_opening,
          morning_closing: weeklyScheduleForDay.morning_closing,
          afternoon_opening: weeklyScheduleForDay.afternoon_opening,
          afternoon_closing: weeklyScheduleForDay.afternoon_closing,
          use_split_hours: true,
        };
      } else {
        return {
          date,
          is_closed: false,
          reason: null,
          opening_time: weeklyScheduleForDay.single_opening || '10:00',
          closing_time: weeklyScheduleForDay.single_closing || '20:00',
          use_split_hours: false,
        };
      }
    }
    
    // Fallback to default open status
    return {
      date,
      is_closed: false,
      reason: null,
      opening_time: '10:00',
      closing_time: '20:00',
      use_split_hours: false,
    };
  };

  const isDateClosed = (date: string): boolean => {
    const status = getDateStatus(date);
    return status?.is_closed || false;
  };

  const generateTimeSlots = (startTime: string, endTime: string): string[] => {
    const slots: string[] = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      slots.push(timeStr);
    }
    
    return slots;
  };

  const getTimeSlots = (date: string): string[] => {
    const status = getDateStatus(date);
    
    // If date is closed, return empty array
    if (status?.is_closed) {
      return [];
    }

    // Handle split hours
    if (status?.use_split_hours) {
      const morningSlots = generateTimeSlots(
        status.morning_opening || '10:00',
        status.morning_closing || '14:00'
      );
      const afternoonSlots = generateTimeSlots(
        status.afternoon_opening || '19:00',
        status.afternoon_closing || '22:00'
      );
      return [...morningSlots, ...afternoonSlots];
    }

    // Handle continuous hours
    const openTime = status?.opening_time || '10:00';
    const closeTime = status?.closing_time || '20:00';
    
    return generateTimeSlots(openTime, closeTime);
  };

  return {
    isDateClosed,
    getTimeSlots,
    loading,
    error,
  };
}
