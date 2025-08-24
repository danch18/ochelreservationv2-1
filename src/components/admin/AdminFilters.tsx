'use client';

import { Input, Select } from '@/components/ui';
import type { Reservation } from '@/types';

interface AdminFiltersProps {
  filters: {
    status: string;
    date: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
  reservations: Reservation[];
}

export function AdminFilters({ filters, onFiltersChange, reservations }: AdminFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  // Get unique dates from reservations for date filter
  const availableDates = [...new Set(reservations.map(r => r.reservation_date))]
    .sort()
    .reverse();

  return (
    <div className="bg-[#191919] rounded-lg p-4 border border-white/10">
      <h3 className="text-lg font-semibold mb-4 text-white">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Input
            placeholder="Search by name, email, or phone..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>
        
        <div>
          <Select
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          >
            <option value="">All Dates</option>
            {availableDates.map(date => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString()}
              </option>
            ))}
          </Select>
        </div>
      </div>
      
      {(filters.status || filters.date || filters.search) && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-white/70">
            Filters applied
          </p>
          <button
            onClick={() => onFiltersChange({ status: '', date: '', search: '' })}
            className="text-sm text-[#644a40] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}