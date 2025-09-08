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
}

interface OpeningHoursModalProps {
  date: string;
  currentHours: { opening_time?: string; closing_time?: string };
  onSave: (hours: { opening_time: string; closing_time: string }) => void;
  onClose: () => void;
}

function OpeningHoursModal({ date, currentHours, onSave, onClose }: OpeningHoursModalProps) {
  const [openingTime, setOpeningTime] = useState(currentHours.opening_time || '10:00');
  const [closingTime, setClosingTime] = useState(currentHours.closing_time || '20:00');

  const handleSave = () => {
    onSave({ opening_time: openingTime, closing_time: closingTime });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          Modifier les horaires - {new Date(date).toLocaleDateString('fr-FR')}
        </h3>
        
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
        
        <div className="flex gap-2 mt-6">
          <Button onClick={handleSave} className="flex-1">
            Enregistrer
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
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
  const updateOpeningHours = async (date: string, hours: { opening_time: string; closing_time: string }) => {
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
      const { supabase } = await import('@/lib/supabase');
      
      // Use upsert to create or update the setting
      const { error } = await supabase
        .from('restaurant_settings')
        .upsert({
          setting_key: 'auto_confirm_guest_limit',
          setting_value: guestLimit.toString(),
          description: 'Maximum number of guests for automatic confirmation. Groups larger than this require admin approval.'
        });

      if (error) {
        throw new Error(`Erreur base de données: ${error.message}`);
      }

    } catch (err) {
      console.error('Error updating guest limit:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la limite');
    } finally {
      setUpdatingGuestLimit(false);
    }
  };

  useEffect(() => {
    loadDateStatuses();
    loadGuestLimit();
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
    <div className="space-y-6">
      {/* Calendar Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Calendrier & Horaires du Restaurant
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
            <span className="text-gray-700">Ouvert</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
            <span className="text-gray-700">Fermé</span>
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
                        className="h-28 border-r border-b border-gray-200 last:border-r-0"
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

                  return (
                    <div
                      key={day}
                      className={`h-28 border-r border-b border-gray-200 last:border-r-0 relative ${
                        isPast ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <div className="w-full h-full p-2">
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

                        {/* Status and controls */}
                        {!isPast && (
                          <div className="mt-1 space-y-1">
                            {/* Open/Close toggle */}
                            <button
                              onClick={() => toggleDateStatus(day)}
                              disabled={isUpdatingThisDate}
                              className={`w-full text-xs px-2 py-1 rounded ${
                                isClosed
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              } transition-colors`}
                            >
                              {isClosed ? 'Fermé' : 'Ouvert'}
                            </button>

                            {/* Hours button */}
                            <button
                              onClick={() => setShowHoursModal(dateStr)}
                              disabled={isUpdatingThisDate}
                              className={`w-full text-xs px-2 py-1 rounded transition-colors ${
                                hasCustomHours
                                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {hasCustomHours 
                                ? `${status.opening_time}-${status.closing_time}`
                                : '10:00-20:00'
                              }
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
              <p>• Cliquez sur "Ouvert/Fermé" pour basculer l'état du restaurant</p>
              <p>• Cliquez sur les horaires pour personnaliser les heures d'ouverture</p>
              <p>• Les dates passées ne peuvent pas être modifiées</p>
            </div>
          </>
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

      {/* Additional Settings Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
        <h2 className="text-xl font-semibold text-black mb-4">Paramètres par défaut</h2>
        <div className="space-y-4">
          {/* Guest Limit Setting - Controls automatic vs manual confirmation */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-900">Limite de confirmation automatique</h3>
                <p className="text-sm text-gray-600">Nombre maximum d'invités pour confirmation automatique</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Guest Limit Input - Range 1-20 guests */}
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={guestLimit}
                  onChange={(e) => setGuestLimit(parseInt(e.target.value) || 4)}
                  className="w-20 text-center"
                />
                {/* Save Button - Updates system-wide setting */}
                <Button
                  onClick={updateGuestLimit}
                  disabled={updatingGuestLimit}
                  size="sm"
                  className="ml-2"
                >
                  {updatingGuestLimit ? '...' : 'Sauvegarder'}
                </Button>
              </div>
            </div>
            {/* Explanation Panel - Shows current behavior */}
            <div className="text-xs text-gray-500 bg-white p-3 rounded border">
              <p className="font-medium mb-1">Comment ça marche :</p>
              <p>• 1-{guestLimit} invités : Confirmation automatique + email immédiat</p>
              <p>• {guestLimit + 1}+ invités : Statut "En attente" + validation manuelle requise</p>
              <p>• L'email de confirmation est envoyé uniquement après validation admin</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Horaires par défaut</h3>
              <p className="text-sm text-gray-600">Horaires appliqués aux nouvelles dates</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">10:00 - 20:00</p>
              <p className="text-sm text-gray-600">Lundi à Dimanche</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}