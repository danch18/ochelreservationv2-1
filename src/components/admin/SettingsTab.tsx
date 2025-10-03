'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';

interface DateStatus {
  id?: string;
  date: string; // YYYY-MM-DD format
  is_closed: boolean;
  reason?: string | null;
  opening_time: string; // HH:MM format
  closing_time: string; // HH:MM format
  created_at?: string;
  updated_at?: string;
  // Split hours support
  morning_opening?: string;
  morning_closing?: string;
  afternoon_opening?: string;
  afternoon_closing?: string;
  use_split_hours?: boolean;
}

// Weekly schedule management interface
interface WeeklySchedule {
  day_of_week: number; // 0-6 (Sunday=0, Monday=1, etc.)
  is_open: boolean;
  morning_opening?: string;  // For split hours - first opening time
  morning_closing?: string;  // For split hours - first closing time
  afternoon_opening?: string; // For split hours - second opening time  
  afternoon_closing?: string; // For split hours - second closing time
  single_opening?: string;   // For single slot - opening time
  single_closing?: string;   // For single slot - closing time
  use_split_hours: boolean;  // Whether to use split hours or single slot
}

interface OpeningHoursModalProps {
  date: string;
  currentHours: { 
    opening_time?: string; 
    closing_time?: string;
    morning_opening?: string;
    morning_closing?: string;
    afternoon_opening?: string;
    afternoon_closing?: string;
    use_split_hours?: boolean;
  };
  onSave: (hours: { 
    opening_time: string; 
    closing_time: string;
    morning_opening?: string;
    morning_closing?: string;
    afternoon_opening?: string;
    afternoon_closing?: string;
    use_split_hours?: boolean;
  }) => void;
  onClose: () => void;
}

function OpeningHoursModal({ date, currentHours, onSave, onClose }: OpeningHoursModalProps) {
  const [useSplitHours, setUseSplitHours] = useState(currentHours.use_split_hours || false);
  const [openingTime, setOpeningTime] = useState(currentHours.opening_time || '10:00');
  const [closingTime, setClosingTime] = useState(currentHours.closing_time || '20:00');
  const [morningOpening, setMorningOpening] = useState(currentHours.morning_opening || '10:00');
  const [morningClosing, setMorningClosing] = useState(currentHours.morning_closing || '14:00');
  const [afternoonOpening, setAfternoonOpening] = useState(currentHours.afternoon_opening || '19:00');
  const [afternoonClosing, setAfternoonClosing] = useState(currentHours.afternoon_closing || '22:00');

  const handleSave = () => {
    if (useSplitHours) {
      onSave({ 
        opening_time: morningOpening,
        closing_time: afternoonClosing,
        morning_opening: morningOpening,
        morning_closing: morningClosing,
        afternoon_opening: afternoonOpening,
        afternoon_closing: afternoonClosing,
        use_split_hours: true
      });
    } else {
      onSave({ 
        opening_time: openingTime, 
        closing_time: closingTime,
        use_split_hours: false
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-base md:text-lg font-semibold mb-4">
          Modifier les horaires - {new Date(date).toLocaleDateString('fr-FR')}
        </h3>
        
        <div className="space-y-4">
          {/* Split Hours Toggle */}
          <div className="flex items-center gap-3">
            <label className="block text-sm font-medium text-gray-700">
              Type d'horaires
            </label>
            <button
              onClick={() => setUseSplitHours(!useSplitHours)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                useSplitHours
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {useSplitHours ? 'Horaires coupés' : 'Horaire continu'}
            </button>
          </div>

          {useSplitHours ? (
            // Split hours (morning + afternoon)
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Service Matin
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="time"
                    value={morningOpening}
                    onChange={(e) => setMorningOpening(e.target.value)}
                    className="flex-1"
                  />
                  <span className="flex items-center justify-center text-gray-500 py-2 sm:py-0">à</span>
                  <Input
                    type="time"
                    value={morningClosing}
                    onChange={(e) => setMorningClosing(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Service Soir
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="time"
                    value={afternoonOpening}
                    onChange={(e) => setAfternoonOpening(e.target.value)}
                    className="flex-1"
                  />
                  <span className="flex items-center justify-center text-gray-500 py-2 sm:py-0">à</span>
                  <Input
                    type="time"
                    value={afternoonClosing}
                    onChange={(e) => setAfternoonClosing(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          ) : (
            // Single continuous hours
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure d'ouverture
                </label>
                <Input
                  type="time"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure de fermeture
                </label>
                <Input
                  type="time"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <Button onClick={handleSave} className="flex-1 order-2 sm:order-1">
            Enregistrer
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1 order-1 sm:order-2">
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
}

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

// Weekly Schedule Tabs Component
interface WeeklyScheduleTabsProps {
  weeklySchedule: Record<number, WeeklySchedule>;
  updatingWeeklySchedule: number | null;
  updateWeeklySchedule: (dayOfWeek: number, scheduleData: Partial<WeeklySchedule>) => Promise<void>;
  dayNames: string[];
}

function WeeklyScheduleTabs({ weeklySchedule, updatingWeeklySchedule, updateWeeklySchedule, dayNames }: WeeklyScheduleTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const daySchedule = weeklySchedule[activeTab];
  const isUpdating = updatingWeeklySchedule === activeTab;

  if (!daySchedule) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {dayNames.map((dayName, dayIndex) => (
          <button
            key={dayIndex}
            onClick={() => setActiveTab(dayIndex)}
            className={`px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === dayIndex
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            <span className="hidden sm:inline">{dayName}</span>
            <span className="sm:hidden">{dayName.slice(0, 3)}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {dayNames[activeTab]}
          </h3>
          {isUpdating && <LoadingSpinner size="sm" />}
        </div>

        <div className="space-y-4">
          {/* Open/Closed Toggle */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Statut :</label>
            <button
              onClick={() => updateWeeklySchedule(activeTab, { 
                is_open: !daySchedule.is_open 
              })}
              disabled={isUpdating}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                daySchedule.is_open
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              {daySchedule.is_open ? 'Ouvert' : 'Fermé'}
            </button>
          </div>

          {/* Hours Configuration */}
          {daySchedule.is_open && (
            <>
              {/* Split Hours Toggle */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Type d'horaires :</label>
                <button
                  onClick={() => {
                    const newSplitHours = !daySchedule.use_split_hours;
                    const updateData: Partial<WeeklySchedule> = {
                      use_split_hours: newSplitHours
                    };
                    
                    // When switching to split hours, ensure all split hour fields are initialized
                    if (newSplitHours) {
                      updateData.morning_opening = daySchedule.morning_opening || '10:00';
                      updateData.morning_closing = daySchedule.morning_closing || '14:00';
                      updateData.afternoon_opening = daySchedule.afternoon_opening || '19:00';
                      updateData.afternoon_closing = daySchedule.afternoon_closing || '22:00';
                    } else {
                      // When switching to continuous hours, ensure single hour fields are initialized
                      updateData.single_opening = daySchedule.single_opening || '10:00';
                      updateData.single_closing = daySchedule.single_closing || '20:00';
                    }
                    
                    updateWeeklySchedule(activeTab, updateData);
                  }}
                  disabled={isUpdating}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    daySchedule.use_split_hours
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {daySchedule.use_split_hours ? 'Horaires coupés' : 'Horaire continu'}
                </button>
              </div>

              {daySchedule.use_split_hours ? (
                // Split hours (morning + afternoon)
                <div className="space-y-6 md:space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Service Matin
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
                        <Input
                          type="time"
                          value={daySchedule.morning_opening || '10:00'}
                          onChange={(e) => updateWeeklySchedule(activeTab, { 
                            morning_opening: e.target.value 
                          })}
                          disabled={isUpdating}
                          className="w-full sm:w-42 sm:flex-1"
                        />
                        <span className="text-gray-500 font-medium text-center py-1 sm:py-0">à</span>
                        <Input
                          type="time"
                          value={daySchedule.morning_closing || '14:00'}
                          onChange={(e) => updateWeeklySchedule(activeTab, { 
                            morning_closing: e.target.value 
                          })}
                          disabled={isUpdating}
                          className="w-full sm:w-42 sm:flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Service Soir
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
                        <Input
                          type="time"
                          value={daySchedule.afternoon_opening || '19:00'}
                          onChange={(e) => updateWeeklySchedule(activeTab, { 
                            afternoon_opening: e.target.value 
                          })}
                          disabled={isUpdating}
                          className="w-full sm:w-42 sm:flex-1"
                        />
                        <span className="text-gray-500 font-medium text-center py-1 sm:py-0">à</span>
                        <Input
                          type="time"
                          value={daySchedule.afternoon_closing || '22:00'}
                          onChange={(e) => updateWeeklySchedule(activeTab, { 
                            afternoon_closing: e.target.value 
                          })}
                          disabled={isUpdating}
                          className="w-full sm:w-42 sm:flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Single continuous hours
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Horaires d'ouverture
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
                    <Input
                      type="time"
                      value={daySchedule.single_opening || '10:00'}
                      onChange={(e) => updateWeeklySchedule(activeTab, { 
                        single_opening: e.target.value 
                      })}
                      disabled={isUpdating}
                      className="w-full sm:w-42"
                    />
                    <span className="text-gray-500 font-medium text-center py-1 sm:py-0">à</span>
                    <Input
                      type="time"
                      value={daySchedule.single_closing || '20:00'}
                      onChange={(e) => updateWeeklySchedule(activeTab, { 
                        single_closing: e.target.value 
                      })}
                      disabled={isUpdating}
                      className="w-full sm:w-42"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export function SettingsTab() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateStatuses, setDateStatuses] = useState<Record<string, DateStatus>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [showHoursModal, setShowHoursModal] = useState<string | null>(null);
  // Guest limit settings for automatic confirmation system
  const [guestLimit, setGuestLimit] = useState(4);              // Default: 4 guests max for auto-confirmation
  const [updatingGuestLimit, setUpdatingGuestLimit] = useState(false);

  // Header text settings for reservation form
  const [headerText1, setHeaderText1] = useState('NO RESERVATIONS AT LUNCH ON WEEKDAYS');
  const [headerText2, setHeaderText2] = useState('OPEN ALL MONTH OF AUGUST');
  const [headerText3, setHeaderText3] = useState('For any special request, send us a WhatsApp message at 06 42 66 87 03: we will respond to you as soon as possible.');
  const [updatingHeaderTexts, setUpdatingHeaderTexts] = useState(false);
  
  // Weekly schedule management state
  const [weeklySchedule, setWeeklySchedule] = useState<Record<number, WeeklySchedule>>({});
  const [loadingWeeklySchedule, setLoadingWeeklySchedule] = useState(true);
  const [updatingWeeklySchedule, setUpdatingWeeklySchedule] = useState<number | null>(null);
  
  // Calendar section collapse state
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  
  // Header texts section collapse state
  const [isHeaderTextsExpanded, setIsHeaderTextsExpanded] = useState(false);

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

  // Load date statuses for current month using Supabase MCP
  const loadDateStatuses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get first and last day of current month for API query
      const startDate = formatDate(currentYear, currentMonth, 1);
      const endDate = formatDate(currentYear, currentMonth, daysInMonth);

      // Use MCP server to execute SQL query
      const query = `
        SELECT date, is_closed, reason, opening_time, closing_time, created_at, updated_at 
        FROM closed_dates 
        WHERE date >= '${startDate}' AND date <= '${endDate}'
        ORDER BY date
      `;

      // Use direct Supabase call instead of API
      const { supabase } = await import('@/lib/supabase');
      
      const { data, error } = await supabase
        .from('closed_dates')
        .select('date, is_closed, reason, opening_time, closing_time, created_at, updated_at')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) {
        throw new Error(`Erreur base de données: ${error.message}`);
      }
      
      // Convert array to object for easier lookup
      const statusMap: Record<string, DateStatus> = {};
      (data || []).forEach((status: DateStatus) => {
        statusMap[status.date] = status;
      });
      
      setDateStatuses(statusMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Toggle date status (open/closed) using direct Supabase call
  const toggleDateStatus = async (day: number) => {
    const dateStr = formatDate(currentYear, currentMonth, day);
    const currentStatus = dateStatuses[dateStr];
    const newStatus = !currentStatus?.is_closed;

    try {
      setUpdating(dateStr);
      setError(null);

      const { supabase } = await import('@/lib/supabase');

      if (newStatus) {
        // Setting to closed - check if record exists and update accordingly
        const { data: existingRecord } = await supabase
          .from('closed_dates')
          .select('*')
          .eq('date', dateStr)
          .single();

        let data, error;

        if (existingRecord) {
          // Update existing record to closed
          const result = await supabase
            .from('closed_dates')
            .update({
              is_closed: true,
              reason: 'Fermé manuellement',
              opening_time: currentStatus?.opening_time || '10:00',
              closing_time: currentStatus?.closing_time || '20:00',
              updated_at: new Date().toISOString(),
            })
            .eq('date', dateStr)
            .select()
            .single();
          
          data = result.data;
          error = result.error;
        } else {
          // Create new record
          const result = await supabase
            .from('closed_dates')
            .insert({
              date: dateStr,
              is_closed: true,
              reason: 'Fermé manuellement',
              opening_time: currentStatus?.opening_time || '10:00',
              closing_time: currentStatus?.closing_time || '20:00',
            })
            .select()
            .single();
          
          data = result.data;
          error = result.error;
        }

        if (error) {
          throw new Error(`Erreur Supabase lors de la fermeture: ${error.message} (code: ${error.code})`);
        }

        setDateStatuses(prev => ({
          ...prev,
          [dateStr]: data,
        }));
      } else {
        // Setting to open - either update to false or delete if default hours
        const hasCustomHours = 
          (currentStatus?.opening_time && currentStatus.opening_time !== '10:00') ||
          (currentStatus?.closing_time && currentStatus.closing_time !== '20:00');

        if (hasCustomHours) {
          // Keep record but set is_closed to false
          const { data, error } = await supabase
            .from('closed_dates')
            .update({
              is_closed: false,
              reason: null,
            })
            .eq('date', dateStr)
            .select()
            .single();

          if (error) {
            throw new Error(`Erreur Supabase lors de l'ouverture: ${error.message} (code: ${error.code})`);
          }

          setDateStatuses(prev => ({
            ...prev,
            [dateStr]: data,
          }));
        } else {
          // Delete record (default open state)
          const { error } = await supabase
            .from('closed_dates')
            .delete()
            .eq('date', dateStr);

          if (error) {
            throw new Error(`Erreur Supabase lors de la suppression: ${error.message} (code: ${error.code})`);
          }

          setDateStatuses(prev => {
            const newState = { ...prev };
            delete newState[dateStr];
            return newState;
          });
        }
      }

    } catch (err) {
      // Enhanced error logging to capture all error details
      console.error('Error updating date status:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        type: typeof err,
        dateStr,
        newStatus,
        currentStatus,
        hasCustomHours: currentStatus ? (
          (currentStatus?.opening_time && currentStatus.opening_time !== '10:00') ||
          (currentStatus?.closing_time && currentStatus.closing_time !== '20:00')
        ) : false
      });
      setError(err instanceof Error ? err.message : `Erreur lors de la mise à jour du statut: ${JSON.stringify(err)}`);
    } finally {
      setUpdating(null);
    }
  };

  // Update opening hours using direct Supabase call
  const updateOpeningHours = async (date: string, hours: { 
    opening_time: string; 
    closing_time: string;
    morning_opening?: string;
    morning_closing?: string;
    afternoon_opening?: string;
    afternoon_closing?: string;
    use_split_hours?: boolean;
  }) => {
    try {
      setUpdating(date);
      setError(null);

      const { supabase } = await import('@/lib/supabase');
      const currentStatus = dateStatuses[date];

      // Check if record exists and update accordingly
      const { data: existingRecord } = await supabase
        .from('closed_dates')
        .select('*')
        .eq('date', date)
        .single();

      let data, error;

      if (existingRecord) {
        // Update existing record
        const result = await supabase
          .from('closed_dates')
          .update({
            is_closed: currentStatus?.is_closed || false,
            reason: currentStatus?.reason || null,
            opening_time: hours.opening_time,
            closing_time: hours.closing_time,
            morning_opening: hours.morning_opening || null,
            morning_closing: hours.morning_closing || null,
            afternoon_opening: hours.afternoon_opening || null,
            afternoon_closing: hours.afternoon_closing || null,
            use_split_hours: hours.use_split_hours || false,
            updated_at: new Date().toISOString(),
          })
          .eq('date', date)
          .select()
          .single();
        
        data = result.data;
        error = result.error;
      } else {
        // Create new record
        const result = await supabase
          .from('closed_dates')
          .insert({
            date,
            is_closed: currentStatus?.is_closed || false,
            reason: currentStatus?.reason || null,
            opening_time: hours.opening_time,
            closing_time: hours.closing_time,
            morning_opening: hours.morning_opening || null,
            morning_closing: hours.morning_closing || null,
            afternoon_opening: hours.afternoon_opening || null,
            afternoon_closing: hours.afternoon_closing || null,
            use_split_hours: hours.use_split_hours || false,
          })
          .select()
          .single();
        
        data = result.data;
        error = result.error;
      }

      if (error) {
        throw new Error(`Erreur base de données: ${error.message}`);
      }

      // Update local state
      setDateStatuses(prev => ({
        ...prev,
        [date]: data,
      }));

    } catch (err) {
      console.error('Error updating opening hours:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour des horaires');
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

  // Refresh data
  const refreshData = () => {
    loadDateStatuses();
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Load data when month changes
  /**
   * Load the current guest limit setting from database
   * This setting determines when reservations require manual admin approval
   */
  const loadGuestLimit = async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      
      const { data, error } = await supabase
        .from('restaurant_settings')
        .select('setting_value')
        .eq('setting_key', 'auto_confirm_guest_limit')
        .single();

      // Ignore "no rows" error as this means setting doesn't exist yet
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading guest limit:', error);
      return;
    }

      if (data) {
        setGuestLimit(parseInt(data.setting_value) || 4);
      }
    } catch (err) {
      console.error('Error loading guest limit:', err);
    }
  };

  /**
   * Update the guest limit setting in database
   * This affects the entire reservation system's auto-confirmation behavior
   */
  const updateGuestLimit = async () => {
    try {
      setUpdatingGuestLimit(true);
      setError(null);
      const { supabase } = await import('@/lib/supabase');
      
      const settingKey = 'auto_confirm_guest_limit';
      
      console.log('Updating guest limit:', guestLimit);
      
      // Check if record exists and update accordingly
      const { data: existingRecord } = await supabase
        .from('restaurant_settings')
        .select('*')
        .eq('setting_key', settingKey)
        .single();

      let data, error;

      if (existingRecord) {
        // Update existing record
        console.log('Updating existing guest limit record');
        const result = await supabase
          .from('restaurant_settings')
          .update({
            setting_value: guestLimit.toString(),
            description: 'Maximum number of guests for automatic confirmation. Groups larger than this require admin approval.',
            updated_at: new Date().toISOString(),
          })
          .eq('setting_key', settingKey)
          .select()
          .single();
        
        data = result.data;
        error = result.error;
      } else {
        // Create new record
        console.log('Creating new guest limit record');
        const result = await supabase
          .from('restaurant_settings')
          .insert({
            setting_key: settingKey,
            setting_value: guestLimit.toString(),
            description: 'Maximum number of guests for automatic confirmation. Groups larger than this require admin approval.'
          })
          .select()
          .single();
        
        data = result.data;
        error = result.error;
      }

      if (error) {
        throw new Error(`Erreur base de données: ${error.message} (code: ${error.code})`);
      }

      console.log('Successfully updated guest limit:', data);

    } catch (err) {
      console.error('Error updating guest limit:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la limite');
    } finally {
      setUpdatingGuestLimit(false);
    }
  };

  /**
   * Load the header text settings from database
   * These texts appear at the top of the reservation form
   */
  const loadHeaderTexts = async () => {
    try {
      console.log('Loading header text settings...');
      const { supabase } = await import('@/lib/supabase');
      
      const { data, error } = await supabase
        .from('restaurant_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['header_text_1', 'header_text_2', 'header_text_3']);

      if (error) {
        console.error('Error loading header texts:', error);
        return;
      }

      if (data) {
        data.forEach((setting) => {
          switch (setting.setting_key) {
            case 'header_text_1':
              setHeaderText1(setting.setting_value || 'NO RESERVATIONS AT LUNCH ON WEEKDAYS');
              break;
            case 'header_text_2':
              setHeaderText2(setting.setting_value || 'OPEN ALL MONTH OF AUGUST');
              break;
            case 'header_text_3':
              setHeaderText3(setting.setting_value || 'For any special request, send us a WhatsApp message at 06 42 66 87 03: we will respond to you as soon as possible.');
              break;
          }
        });
      }
    } catch (err) {
      console.error('Error loading header texts:', err);
    }
  };

  /**
   * Update the header text settings in database
   * These texts appear at the top of the reservation form
   */
  const updateHeaderTexts = async () => {
    try {
      setUpdatingHeaderTexts(true);
      setError(null);
      const { supabase } = await import('@/lib/supabase');
      
      console.log('Updating header texts...');
      console.log('Supabase client:', supabase);
      console.log('Header text values:', { headerText1, headerText2, headerText3 });
      
      // Test Supabase connection first
      const { data: testData, error: testError } = await supabase
        .from('restaurant_settings')
        .select('setting_key, setting_value')
        .limit(1);
      
      if (testError) {
        console.error('Supabase connection test failed:', testError);
        console.error('Test error details:', JSON.stringify(testError, null, 2));
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      
      console.log('Supabase connection test successful:', testData);
      
      // Validate header text values
      if (!headerText1.trim() || !headerText2.trim() || !headerText3.trim()) {
        throw new Error('All header text fields must be filled');
      }
      
      // Update all three header texts
      const settings = [
        { key: 'header_text_1', value: headerText1.trim() },
        { key: 'header_text_2', value: headerText2.trim() },
        { key: 'header_text_3', value: headerText3.trim() }
      ];

      for (const setting of settings) {
        try {
           console.log(`Processing setting: ${setting.key} = ${setting.value}`);
           
           // Try to upsert (insert or update) the record
           const { data, error } = await supabase
             .from('restaurant_settings')
             .upsert({
               setting_key: setting.key,
               setting_value: setting.value,
               description: `Header text line for reservation form (${setting.key})`,
               updated_at: new Date().toISOString()
             }, {
               onConflict: 'setting_key'
             })
             .select();

          if (error) {
            console.error(`Error upserting header text ${setting.key}:`, error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            throw new Error(`Failed to update ${setting.key}: ${error.message || 'Unknown error'}`);
          }

          console.log(`Successfully processed ${setting.key}:`, data);
        } catch (settingError) {
          console.error(`Error processing setting ${setting.key}:`, settingError);
          throw new Error(`Failed to update ${setting.key}: ${settingError instanceof Error ? settingError.message : 'Unknown error'}`);
        }
      }

      console.log('Successfully updated all header texts');
      setError(null);
      // Show success message (you could add a success state if needed)
      alert('Header texts updated successfully!');
    } catch (err) {
      console.error('Error updating header texts:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('Full error object:', JSON.stringify(err, null, 2));
      setError(`Erreur lors de la mise à jour des textes d'en-tête: ${errorMessage}`);
    } finally {
      setUpdatingHeaderTexts(false);
    }
  };

  /**
   * Load weekly schedule from restaurant_settings table
   * Each day of week (0-6) has its own configuration for open/close and hours
   */
  const loadWeeklySchedule = async () => {
    try {
      setLoadingWeeklySchedule(true);
      setError(null);
      
      console.log('Loading weekly schedule...');
      
      const { supabase } = await import('@/lib/supabase');
      
      const { data, error } = await supabase
        .from('restaurant_settings')
        .select('setting_key, setting_value')
        .like('setting_key', 'weekly_schedule_%');

      console.log('Weekly schedule query result:', { data, error });

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Erreur base de données: ${error.message}`);
      }

      // Parse weekly schedule data
      const schedule: Record<number, WeeklySchedule> = {};
      
      // Initialize default schedule for all days (0=Sunday, 1=Monday, etc.)
      for (let day = 0; day < 7; day++) {
        schedule[day] = {
          day_of_week: day,
          is_open: true,
          use_split_hours: false,
          single_opening: '10:00',
          single_closing: '20:00',
          // Initialize split hours fields with defaults too
          morning_opening: '10:00',
          morning_closing: '14:00',
          afternoon_opening: '19:00',
          afternoon_closing: '22:00',
        };
      }

      // Override with saved settings
      if (data && data.length > 0) {
        data.forEach(setting => {
          const match = setting.setting_key.match(/^weekly_schedule_(\d+)$/);
          if (match) {
            const dayOfWeek = parseInt(match[1]);
            try {
              const dayConfig = JSON.parse(setting.setting_value);
              schedule[dayOfWeek] = { ...schedule[dayOfWeek], ...dayConfig };
              console.log(`🏠 ADMIN - Loaded day ${dayOfWeek} (${dayNames[dayOfWeek]}):`, schedule[dayOfWeek]);
            } catch (parseError) {
              console.error(`Error parsing weekly schedule for day ${dayOfWeek}:`, parseError);
            }
          }
        });
      }

      setWeeklySchedule(schedule);
    } catch (err) {
      console.error('Error loading weekly schedule:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des horaires hebdomadaires');
      
      // Set default schedule even on error
      const defaultSchedule: Record<number, WeeklySchedule> = {};
      for (let day = 0; day < 7; day++) {
        defaultSchedule[day] = {
          day_of_week: day,
          is_open: true,
          use_split_hours: false,
          single_opening: '10:00',
          single_closing: '20:00',
        };
      }
      setWeeklySchedule(defaultSchedule);
    } finally {
      setLoadingWeeklySchedule(false);
    }
  };

  /**
   * Update weekly schedule for a specific day of week
   * Saves configuration to restaurant_settings table
   */
  const updateWeeklySchedule = async (dayOfWeek: number, scheduleData: Partial<WeeklySchedule>) => {
    try {
      setUpdatingWeeklySchedule(dayOfWeek);
      setError(null);
      const { supabase } = await import('@/lib/supabase');
      
      const updatedSchedule = { ...weeklySchedule[dayOfWeek], ...scheduleData };
      const settingKey = `weekly_schedule_${dayOfWeek}`;
      
      
      // Check if record exists and update accordingly
      const { data: existingRecord } = await supabase
        .from('restaurant_settings')
        .select('*')
        .eq('setting_key', settingKey)
        .single();

      let data, error;

      if (existingRecord) {
        // Update existing record
        console.log(`Updating existing weekly schedule record for day ${dayOfWeek}`);
        const result = await supabase
          .from('restaurant_settings')
          .update({
            setting_value: JSON.stringify(updatedSchedule),
            description: `Weekly schedule configuration for day ${dayOfWeek} (0=Sunday, 1=Monday, etc.)`,
            updated_at: new Date().toISOString(),
          })
          .eq('setting_key', settingKey)
          .select()
          .single();
        
        data = result.data;
        error = result.error;
      } else {
        // Create new record
        console.log(`Creating new weekly schedule record for day ${dayOfWeek}`);
        const result = await supabase
          .from('restaurant_settings')
          .insert({
            setting_key: settingKey,
            setting_value: JSON.stringify(updatedSchedule),
            description: `Weekly schedule configuration for day ${dayOfWeek} (0=Sunday, 1=Monday, etc.)`
          })
          .select()
          .single();
        
        data = result.data;
        error = result.error;
      }

      if (error) {
        throw new Error(`Erreur base de données: ${error.message} (code: ${error.code})`);
      }

      console.log(`Successfully updated weekly schedule for day ${dayOfWeek}:`, data);

      // Update local state
      setWeeklySchedule(prev => ({
        ...prev,
        [dayOfWeek]: updatedSchedule
      }));

    } catch (err) {
      console.error('Error updating weekly schedule:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour des horaires hebdomadaires');
    } finally {
      setUpdatingWeeklySchedule(null);
    }
  };

  useEffect(() => {
    loadDateStatuses();
    loadGuestLimit();
    loadHeaderTexts();
    loadWeeklySchedule();
  }, [currentMonth, currentYear]);

  // Get status for a specific date (combines weekly schedule + specific date overrides)
  const getDateStatus = (day: number): DateStatus | null => {
    const dateStr = formatDate(currentYear, currentMonth, day);
    const specificDateStatus = dateStatuses[dateStr];
    
    // Get the day of week (0=Sunday, 1=Monday, etc.)
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = date.getDay();
    const weeklyScheduleForDay = weeklySchedule[dayOfWeek];
    
    // If there's a specific date override, use that
    if (specificDateStatus) {
      return specificDateStatus;
    }
    
    // Otherwise, apply weekly schedule settings
    if (weeklyScheduleForDay && !weeklyScheduleForDay.is_open) {
      // Day is closed in weekly schedule
      return {
        date: dateStr,
        is_closed: true,
        reason: `Fermé ${dayNames[dayOfWeek]}`,
        opening_time: weeklyScheduleForDay.single_opening || '10:00',
        closing_time: weeklyScheduleForDay.single_closing || '20:00',
      };
    }
    
    // Day is open in weekly schedule, return hours based on split/continuous mode
    if (weeklyScheduleForDay) {
      if (weeklyScheduleForDay.use_split_hours) {
        // For split hours, we'll store both time ranges in the opening/closing fields
        const morningSlot = `${weeklyScheduleForDay.morning_opening || '10:00'}-${weeklyScheduleForDay.morning_closing || '14:00'}`;
        const afternoonSlot = `${weeklyScheduleForDay.afternoon_opening || '19:00'}-${weeklyScheduleForDay.afternoon_closing || '22:00'}`;
        
        return {
          date: dateStr,
          is_closed: false,
          reason: null,
          opening_time: weeklyScheduleForDay.morning_opening || '10:00',
          closing_time: weeklyScheduleForDay.afternoon_closing || '22:00',
          // Add custom fields to track split hours
          morning_opening: weeklyScheduleForDay.morning_opening,
          morning_closing: weeklyScheduleForDay.morning_closing,
          afternoon_opening: weeklyScheduleForDay.afternoon_opening,
          afternoon_closing: weeklyScheduleForDay.afternoon_closing,
          use_split_hours: true,
        };
      } else {
        // Continuous hours
        return {
          date: dateStr,
          is_closed: false,
          reason: null,
          opening_time: weeklyScheduleForDay.single_opening || '10:00',
          closing_time: weeklyScheduleForDay.single_closing || '20:00',
          use_split_hours: false,
        };
      }
    }
    
    // Fallback to default open status
    return null;
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

  // Day names for display (Sunday = 0, Monday = 1, etc.)
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  return (
    <div className="space-y-4 md:space-y-6 font-forum">
      {/* Weekly Schedule Management Section */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <h2 className="text-lg md:text-2xl font-bold text-gray-900">
              Horaires Hebdomadaires par Défaut
            </h2>
            <div className="relative group">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-help">
                <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 p-3 bg-white text-gray-700 text-sm rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">Comment ça marche :</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Ces horaires sont appliqués par défaut à toutes les dates du système</li>
                    <li>• Dans le calendrier ci-dessous : les jours fermés ici apparaissent en orange "Fermé (hebdo)"</li>
                    <li>• Vous pouvez créer des exceptions en cliquant sur les dates individuelles dans le calendrier</li>
                    <li>• "Horaires coupés" permet d'avoir un service midi et un service soir séparés</li>
                    <li>• "Horaire continu" pour un service en continu toute la journée</li>
                  </ul>
                </div>
                {/* Arrow */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45"></div>
              </div>
            </div>
          </div>
          <div className="text-xs md:text-sm text-gray-600">
            Configuration appliquée à tout le système
          </div>
        </div>

        {loadingWeeklySchedule ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="lg" />
            <span className="ml-2 text-gray-600">Chargement des horaires...</span>
          </div>
        ) : Object.keys(weeklySchedule).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Aucun horaire configuré</p>
            <Button 
              onClick={loadWeeklySchedule}
              variant="outline"
            >
              Charger les horaires par défaut
            </Button>
          </div>
        ) : (
          <WeeklyScheduleTabs 
            weeklySchedule={weeklySchedule}
            updatingWeeklySchedule={updatingWeeklySchedule}
            updateWeeklySchedule={updateWeeklySchedule}
            dayNames={dayNames}
          />
        )}

      </div>


      {/* Additional Settings Section */}
      <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-black">Paramètres par défaut</h2>
          <div className="relative group">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-help">
              <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            {/* Tooltip */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 p-3 bg-white text-gray-700 text-sm rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Comment ça marche :</p>
                <ul className="space-y-1 text-xs">
                  <li>• 1-{guestLimit} invités : Confirmation automatique + email immédiat</li>
                  <li>• {guestLimit + 1}+ invités : Statut "En attente" + validation manuelle requise</li>
                  <li>• L'email de confirmation est envoyé uniquement après validation admin</li>
                </ul>
              </div>
              {/* Arrow */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45"></div>
            </div>
          </div>
        </div>
        <div className="space-y-3 md:space-y-4">
          {/* Guest Limit Setting - Controls automatic vs manual confirmation */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm md:text-base">Limite de confirmation automatique</h3>
                <p className="text-xs md:text-sm text-gray-600">Nombre maximum d'invités pour confirmation automatique</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Guest Limit Input - Range 1-20 guests */}
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={guestLimit}
                  onChange={(e) => setGuestLimit(parseInt(e.target.value) || 4)}
                  className="w-16 md:w-20 text-center text-sm"
                />
                {/* Save Button - Updates system-wide setting */}
                <Button
                  onClick={updateGuestLimit}
                  disabled={updatingGuestLimit}
                  size="sm"
                  className="text-xs md:text-sm"
                >
                  {updatingGuestLimit ? '...' : 'Sauvegarder'}
                </Button>
              </div>
            </div>
          </div>

          {/* Header Text Settings - Collapsible Section */}
          <div className="bg-gray-50 rounded-lg border border-gray-200">
            {/* Header - Always visible */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setIsHeaderTextsExpanded(!isHeaderTextsExpanded)}
            >
              <div>
                <h3 className="font-medium text-gray-900 text-sm md:text-base">Textes d'en-tête du formulaire</h3>
                <p className="text-xs md:text-sm text-gray-600 mt-1">Modifiez les trois lignes affichées en haut du formulaire de réservation</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {isHeaderTextsExpanded ? 'Masquer' : 'Modifier'}
                </span>
                <svg 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    isHeaderTextsExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Collapsible Content */}
            {isHeaderTextsExpanded && (
              <div className="px-4 pb-4 border-t border-gray-200">
                <div className="space-y-4 pt-4">
                  {/* Header Text 1 */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Ligne 1 - Texte principal
                    </label>
                    <Input
                      type="text"
                      value={headerText1}
                      onChange={(e) => setHeaderText1(e.target.value)}
                      className="text-sm"
                      placeholder="NO RESERVATIONS AT LUNCH ON WEEKDAYS"
                    />
                  </div>

                  {/* Header Text 2 */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Ligne 2 - Texte secondaire
                    </label>
                    <Input
                      type="text"
                      value={headerText2}
                      onChange={(e) => setHeaderText2(e.target.value)}
                      className="text-sm"
                      placeholder="OPEN ALL MONTH OF AUGUST"
                    />
                  </div>

                  {/* Header Text 3 */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Ligne 3 - Message WhatsApp
                    </label>
                    <Input
                      type="text"
                      value={headerText3}
                      onChange={(e) => setHeaderText3(e.target.value)}
                      className="text-sm"
                      placeholder="For any special request, send us a WhatsApp message at 06 42 66 87 03: we will respond to you as soon as possible."
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <Button
                      onClick={updateHeaderTexts}
                      disabled={updatingHeaderTexts}
                      size="sm"
                      className="text-xs md:text-sm"
                    >
                      {updatingHeaderTexts ? 'Sauvegarde...' : 'Sauvegarder les textes'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Collapsible Calendar Section */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header - Always visible */}
        <div 
          className="flex items-center justify-between p-4 md:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
        >
          <h2 className="text-lg md:text-2xl font-bold text-gray-900">
            Calendrier & Horaires du Restaurant
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {isCalendarExpanded ? 'Masquer' : 'Afficher'}
            </span>
            <svg 
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                isCalendarExpanded ? 'rotate-180' : ''
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Collapsible Content */}
        {isCalendarExpanded && (
          <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-gray-200">
            {/* Calendar Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Button
                  onClick={goToToday}
                  variant="outline"
                  size="sm"
                  className="w-fit"
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
                
                <div className="min-w-[150px] md:min-w-[200px] text-center">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">
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
            <div className="flex items-center gap-3 md:gap-6 mb-4 text-xs md:text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
                <span className="text-gray-700">Ouvert</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
                <span className="text-gray-700">Fermé (spécifique)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-100 border-2 border-orange-500 rounded"></div>
                <span className="text-gray-700">Fermé (hebdomadaire)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
                <span className="text-gray-700">Aujourd'hui</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
                <span className="text-gray-700">Horaires personnalisés</span>
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
                        className="p-1 md:p-3 text-center text-xs md:text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0"
                      >
                        <span className="hidden sm:inline">{day}</span>
                        <span className="sm:hidden">{day.charAt(0)}</span>
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
                            className="h-20 md:h-28 border-r border-b border-gray-200 last:border-r-0"
                          />
                        );
                      }

                      const dateStr = formatDate(currentYear, currentMonth, day);
                      const status = getDateStatus(day);
                      const isClosed = status?.is_closed || false;
                      const isCurrentDay = isToday(day);
                      const isPast = isPastDate(day);
                      const isUpdatingThisDate = updating === dateStr;
                      const hasCustomHours = status?.opening_time && status?.closing_time;
                      
                      // Check if this date is closed due to weekly schedule
                      const date = new Date(currentYear, currentMonth, day);
                      const dayOfWeek = date.getDay();
                      const weeklyScheduleForDay = weeklySchedule[dayOfWeek];
                      const specificDateStatus = dateStatuses[dateStr];
                      const isClosedByWeeklySchedule = weeklyScheduleForDay && !weeklyScheduleForDay.is_open && !specificDateStatus;

                      return (
                        <div
                          key={day}
                          className={`h-20 md:h-28 border-r border-b border-gray-200 last:border-r-0 relative ${
                            isPast ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                          } transition-colors`}
                        >
                          <div className="w-full h-full p-1 md:p-2">
                            {/* Date number */}
                            <div
                              className={`inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full text-xs md:text-sm font-medium ${
                                isCurrentDay
                                  ? 'bg-blue-500 text-white'
                                  : isPast
                                  ? 'text-gray-400'
                                  : 'text-gray-900'
                              }`}
                            >
                              {day}
                            </div>

                            {/* Status and controls */}
                            {!isPast && (
                              <div className="mt-0.5 md:mt-1 space-y-0.5 md:space-y-1">
                                {/* Open/Close toggle */}
                                <button
                                  onClick={() => toggleDateStatus(day)}
                                  disabled={isUpdatingThisDate}
                                  className={`w-full text-[10px] md:text-xs px-1 md:px-2 py-0.5 md:py-1 rounded transition-colors ${
                                    isClosed
                                      ? isClosedByWeeklySchedule
                                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                                  }`}
                                >
                                  <span className="hidden sm:inline">
                                    {isClosed 
                                      ? isClosedByWeeklySchedule 
                                        ? 'Fermé (hebdo)' 
                                        : 'Fermé'
                                      : 'Ouvert'
                                    }
                                  </span>
                                  <span className="sm:hidden">
                                    {isClosed ? 'F' : 'O'}
                                  </span>
                                </button>

                                {/* Hours button */}
                                <button
                                  onClick={() => setShowHoursModal(dateStr)}
                                  disabled={isUpdatingThisDate}
                                  className={`w-full text-[9px] md:text-xs px-1 md:px-2 py-0.5 md:py-1 rounded transition-colors leading-tight ${
                                    hasCustomHours || status?.use_split_hours
                                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  <span className="hidden sm:inline">
                                    {status?.use_split_hours 
                                      ? `${status.morning_opening || '10:00'}-${status.morning_closing || '14:00'} • ${status.afternoon_opening || '19:00'}-${status.afternoon_closing || '22:00'}`
                                      : hasCustomHours 
                                        ? `${status.opening_time}-${status.closing_time}`
                                        : '10:00-20:00'
                                    }
                                  </span>
                                  <span className="sm:hidden">
                                    {status?.use_split_hours 
                                      ? `${status.morning_opening || '10:00'}-${status.afternoon_closing || '22:00'}`
                                      : hasCustomHours 
                                        ? `${status.opening_time}-${status.closing_time}`
                                        : '10-20'
                                    }
                                  </span>
                                </button>
                              </div>
                            )}

                            {/* Loading indicator */}
                            {isUpdatingThisDate && (
                              <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                                <LoadingSpinner size="sm" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Instructions */}
                <div className="mt-4 text-sm text-gray-600">
                  <p>• <span className="font-medium">Orange "Fermé (hebdo)"</span> : Fermé selon les horaires hebdomadaires ci-dessus</p>
                  <p>• <span className="font-medium">Rouge "Fermé"</span> : Fermé spécifiquement pour cette date</p>
                  <p>• Cliquez sur "Ouvert/Fermé" pour créer une exception à la règle hebdomadaire</p>
                  <p>• Cliquez sur les horaires pour personnaliser les heures d'ouverture</p>
                  <p>• Les dates passées ne peuvent pas être modifiées</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Opening Hours Modal */}
      {showHoursModal && (
        <OpeningHoursModal
          date={showHoursModal}
          currentHours={dateStatuses[showHoursModal] || { opening_time: '10:00', closing_time: '20:00' }}
          onSave={(hours) => updateOpeningHours(showHoursModal, hours)}
          onClose={() => setShowHoursModal(null)}
        />
      )}
    </div>
  );
}