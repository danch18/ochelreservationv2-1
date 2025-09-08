'use client';

import { Input, Select } from '@/components/ui';
import type { Reservation } from '@/types';

interface AdminFiltersProps {
  filters: {
    status: string;
    date: string;
    search: string;
  };
  onFiltersChange: (filters: { status: string; date: string; search: string; }) => void;
  reservations: Reservation[];
}

export function AdminFilters({ filters, onFiltersChange, reservations }: AdminFiltersProps) {
  /**
   * Handles changes to individual filter values
   * @param key - The filter key to update (status, date, search)
   * @param value - The new filter value
   */
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  /**
   * Extract unique dates from all reservations for date filter dropdown
   * Sorted in reverse chronological order (newest first)
   */
  const availableDates = [...new Set(reservations.map(r => r.reservation_date))]
    .sort()
    .reverse();

  return (
    <div className="bg-white rounded-2xl p-6 !border !border-[#F6F1F0] shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-black">Filtres</h3>
      
      {/* Filter Controls Grid - Responsive 3-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Filter - Searches across name, email, and phone */}
        <div>
          <Input
            placeholder="Rechercher par nom, email, ou téléphone..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full"
          />
        </div>
        
        {/* Status Filter - All reservation statuses including new 'pending' */}
        <div>
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="confirmed">Confirmé</option>
            <option value="pending">En attente</option>      {/* New pending status */}
            <option value="cancelled">Annulé</option>
            <option value="completed">Terminé</option>
          </Select>
        </div>
        
        {/* Date Filter - Dynamically populated from existing reservations */}
        <div>
          <Select
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          >
            <option value="">Toutes les dates</option>
            {availableDates.map(date => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString()}
              </option>
            ))}
          </Select>
        </div>
      </div>
      
      {/* Clear Filters Section - Only shown when filters are active */}
      {(filters.status || filters.date || filters.search) && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Filtres appliqués
          </p>
          {/* Reset all filters button */}
          <button
            onClick={() => onFiltersChange({ status: '', date: '', search: '' })}
            className="text-sm text-[#F34A23] hover:underline font-medium"
          >
            Effacer tous les filtres
          </button>
        </div>
      )}
    </div>
  );
}