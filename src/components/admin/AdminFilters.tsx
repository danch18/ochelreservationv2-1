'use client';

import { useState, useCallback, useEffect } from 'react';
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
  onExportCSV?: () => void;
  isExporting?: boolean;
}

export function AdminFilters({ filters, onFiltersChange, reservations, onExportCSV, isExporting = false }: AdminFiltersProps) {
  // Local search state for debouncing
  const [localSearch, setLocalSearch] = useState(filters.search);

  /**
   * Debounced search to improve performance with large datasets
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFiltersChange({
          ...filters,
          search: localSearch
        });
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [localSearch, filters, onFiltersChange]);

  // Sync local search with external changes
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  /**
   * Handles changes to individual filter values with performance optimization
   * @param key - The filter key to update (status, date, search)
   * @param value - The new filter value
   */
  const handleFilterChange = useCallback((key: string, value: string) => {
    if (key === 'search') {
      setLocalSearch(value);
    } else {
      onFiltersChange({
        ...filters,
        [key]: value
      });
    }
  }, [filters, onFiltersChange]);

  /**
   * Extract unique dates from all reservations for date filter dropdown
   * Sorted in reverse chronological order (newest first)
   */
  const availableDates = [...new Set(reservations.map(r => r.reservation_date))]
    .sort()
    .reverse();

  return (
    <div className="bg-white rounded-2xl p-6 !border !border-[#F6F1F0] shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-black">Filtres</h3>
        {onExportCSV && (
          <button
            onClick={onExportCSV}
            disabled={isExporting}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
              isExporting 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:shadow-sm transform hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isExporting ? (
              <>
                <svg 
                  className="w-4 h-4 animate-spin" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
                Export en cours...
              </>
            ) : (
              <>
                <svg 
                  className="w-4 h-4 transition-transform group-hover:scale-110" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                Exporter CSV ({reservations.length})
              </>
            )}
          </button>
        )}
      </div>
      
      {/* Filter Controls Grid - Responsive 3-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Filter - Searches across name, email, and phone */}
        <div>
          <Input
            placeholder="Rechercher par nom, email, ou téléphone..."
            value={localSearch}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-[#F34A23]/20 focus:border-[#F34A23]"
          />
        </div>
        
        {/* Status Filter - All reservation statuses including new 'pending' */}
        <div>
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-[#F34A23]/20 focus:border-[#F34A23]"
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
            className="transition-all duration-200 focus:ring-2 focus:ring-[#F34A23]/20 focus:border-[#F34A23]"
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
            className="text-sm text-[#F34A23] hover:underline font-medium transition-all duration-200 hover:text-[#d63e1e] hover:scale-105 active:scale-95"
          >
            Effacer tous les filtres
          </button>
        </div>
      )}
    </div>
  );
}