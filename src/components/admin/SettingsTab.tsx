'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Alert } from '@/components/ui';
import { dateAvailabilityService } from '@/services';
import { getTodayDate } from '@/lib/utils';

export function SettingsTab() {
  const [closedDates, setClosedDates] = useState<string[]>([]);
  const [newClosedDate, setNewClosedDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load existing closed dates
  useEffect(() => {
    loadClosedDates();
  }, []);

  const loadClosedDates = async () => {
    try {
      const dates = await dateAvailabilityService.getClosedDates();
      setClosedDates(dates);
    } catch (error) {
      console.error('Failed to load closed dates:', error);
      setError('Failed to load closed dates');
    }
  };

  const handleAddClosedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClosedDate) return;

    // Check if date is already closed
    if (closedDates.includes(newClosedDate)) {
      setError('This date is already marked as closed');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await dateAvailabilityService.setDateClosed(newClosedDate, true);
      setClosedDates(prev => [...prev, newClosedDate].sort());
      setNewClosedDate('');
      setSuccess('Date marked as closed successfully');
    } catch (error) {
      console.error('Failed to mark date as closed:', error);
      setError('Failed to mark date as closed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveClosedDate = async (dateToRemove: string) => {
    const confirmed = confirm(`Are you sure you want to reopen the restaurant on ${new Date(dateToRemove).toLocaleDateString()}?`);
    if (!confirmed) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await dateAvailabilityService.setDateClosed(dateToRemove, false);
      setClosedDates(prev => prev.filter(date => date !== dateToRemove));
      setSuccess('Date reopened successfully');
    } catch (error) {
      console.error('Failed to reopen date:', error);
      setError('Failed to reopen date');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#191919] rounded-lg p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">Restaurant Availability</h2>
        <p className="text-white/70 mb-6">
          Mark specific dates when the restaurant will be closed. Customers won&apos;t be able to make reservations on these dates.
        </p>

        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="default" className="mb-4 bg-green-900/20 border-green-600 text-green-400">
            {success}
          </Alert>
        )}

        {/* Add Closed Date Form */}
        <form onSubmit={handleAddClosedDate} className="mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Mark Date as Closed</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="date"
                value={newClosedDate}
                onChange={(e) => setNewClosedDate(e.target.value)}
                min={getTodayDate()}
                placeholder="Select date to close"
                className="bg-black border-white/20 text-white"
                required
              />
            </div>
            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading || !newClosedDate}
              className="!text-black"
            >
              Mark as Closed
            </Button>
          </div>
        </form>

        {/* List of Closed Dates */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4">
            Closed Dates ({closedDates.length})
          </h3>
          
          {closedDates.length === 0 ? (
            <p className="text-white/70 text-center py-8 bg-black/20 rounded-lg">
              No closed dates set. The restaurant is open every day.
            </p>
          ) : (
            <div className="space-y-2">
              {closedDates.map((date) => (
                <div
                  key={date}
                  className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-red-400">🚫</span>
                    <div>
                      <p className="text-white font-medium">
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-white/70 text-sm">Restaurant closed</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveClosedDate(date)}
                    disabled={isLoading}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Reopen
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Additional Settings Section */}
      <div className="bg-[#191919] rounded-lg p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">Additional Settings</h2>
        <p className="text-white/70">
          More restaurant settings will be available here in future updates.
        </p>
      </div>
    </div>
  );
}