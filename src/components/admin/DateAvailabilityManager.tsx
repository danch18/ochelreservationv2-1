'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Button, Input, Select, Alert } from '@/components/ui';
import { dateAvailabilityService, type DateAvailability } from '@/services/dateAvailabilityService';
import { getTodayDate } from '@/lib/utils';

export function DateAvailabilityManager() {
  const [dateAvailability, setDateAvailability] = useState<DateAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [reason, setReason] = useState('');
  const [updating, setUpdating] = useState(false);

  // Load date availability records
  const loadDateAvailability = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await dateAvailabilityService.getAllDateAvailability();
      setDateAvailability(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load date availability');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDateAvailability();
  }, []);

  // Handle setting date availability
  const handleSetAvailability = async () => {
    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    setUpdating(true);
    setError(null);

    try {
      await dateAvailabilityService.setDateAvailability(selectedDate, isAvailable, reason || undefined);
      
      // Reset form
      setSelectedDate('');
      setIsAvailable(true);
      setReason('');
      
      // Reload data
      await loadDateAvailability();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update date availability');
    } finally {
      setUpdating(false);
    }
  };

  // Handle deleting date availability (revert to default)
  const handleDeleteAvailability = async (date: string) => {
    setUpdating(true);
    setError(null);

    try {
      await dateAvailabilityService.deleteDateAvailability(date);
      await loadDateAvailability();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete date availability');
    } finally {
      setUpdating(false);
    }
  };

  // Quick actions for common scenarios
  const handleQuickAction = async (action: 'close_tomorrow' | 'close_weekend' | 'open_all_week') => {
    setUpdating(true);
    setError(null);

    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      switch (action) {
        case 'close_tomorrow':
          await dateAvailabilityService.setDateAvailability(
            tomorrow.toISOString().split('T')[0], 
            false, 
            'Closed for the day'
          );
          break;
          
        case 'close_weekend':
          const nextSaturday = new Date(today);
          const daysUntilSaturday = (6 - today.getDay()) % 7;
          nextSaturday.setDate(today.getDate() + daysUntilSaturday);
          
          const nextSunday = new Date(nextSaturday);
          nextSunday.setDate(nextSaturday.getDate() + 1);
          
          await dateAvailabilityService.bulkSetDateAvailability([
            { 
              date: nextSaturday.toISOString().split('T')[0], 
              is_available: false, 
              reason: 'Weekend closure' 
            },
            { 
              date: nextSunday.toISOString().split('T')[0], 
              is_available: false, 
              reason: 'Weekend closure' 
            }
          ]);
          break;
          
        case 'open_all_week':
          const dates = [];
          for (let i = 1; i <= 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push({
              date: date.toISOString().split('T')[0],
              is_available: true,
              reason: 'Open for business'
            });
          }
          await dateAvailabilityService.bulkSetDateAvailability(dates);
          break;
      }

      await loadDateAvailability();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute quick action');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader>
        <h3 className="text-lg font-semibold text-card-foreground">Restaurant Operating Schedule</h3>
        <p className="text-sm text-muted-foreground">
          Manage which dates your restaurant is open or closed for reservations.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            {error}
          </Alert>
        )}

        {/* Quick Actions */}
        <div>
          <h4 className="text-md font-medium text-card-foreground mb-3">Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleQuickAction('close_tomorrow')}
              disabled={updating}
              variant="outline"
              size="sm"
            >
              Close Tomorrow
            </Button>
            <Button
              onClick={() => handleQuickAction('close_weekend')}
              disabled={updating}
              variant="outline"
              size="sm"
            >
              Close This Weekend
            </Button>
            <Button
              onClick={() => handleQuickAction('open_all_week')}
              disabled={updating}
              variant="outline"
              size="sm"
            >
              Open Next 7 Days
            </Button>
          </div>
        </div>

        {/* Manual Date Setting */}
        <div>
          <h4 className="text-md font-medium text-card-foreground mb-3">Set Specific Date</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input
              type="date"
              label="Date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getTodayDate()}
            />
            
            <Select
              label="Status"
              value={isAvailable ? 'open' : 'closed'}
              onChange={(e) => setIsAvailable(e.target.value === 'open')}
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </Select>
            
            <Input
              label="Reason (Optional)"
              placeholder="Holiday, maintenance, etc."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            
            <div className="flex items-end">
              <Button
                onClick={handleSetAvailability}
                disabled={updating || !selectedDate}
                className="w-full"
                size="sm"
              >
                {updating ? 'Updating...' : 'Set Status'}
              </Button>
            </div>
          </div>
        </div>

        {/* Current Schedule */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-md font-medium text-card-foreground">Current Schedule Overrides</h4>
            <Button
              onClick={loadDateAvailability}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
          
          {dateAvailability.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No schedule overrides set. Restaurant is open by default.</p>
              <p className="text-sm mt-1">Add dates above to override the default schedule.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {dateAvailability.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-card-foreground">
                        {new Date(record.date + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          record.is_available
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'bg-destructive/10 text-destructive border border-destructive/20'
                        }`}
                      >
                        {record.is_available ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    {record.reason && (
                      <p className="text-sm text-muted-foreground mt-1">{record.reason}</p>
                    )}
                  </div>
                  <Button
                    onClick={() => handleDeleteAvailability(record.date)}
                    disabled={updating}
                    variant="outline"
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
