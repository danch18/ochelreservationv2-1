'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminFilterSchema, type AdminFilterInput } from '@/lib/validations';
import { Input, Select, Button, Card, CardContent } from '@/components/ui';
import { getTodayDate } from '@/lib/utils';
import type { FilterOptions } from '@/types';

interface AdminFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function AdminFilters({ 
  filters, 
  onFiltersChange, 
  onRefresh, 
  isLoading = false 
}: AdminFiltersProps) {
  const {
    watch,
    setValue
  } = useForm<AdminFilterInput>({
    resolver: zodResolver(adminFilterSchema),
    defaultValues: {
      date: filters.date || getTodayDate(),
      status: (filters.status as 'all' | 'confirmed' | 'cancelled' | 'completed') || 'all',
      searchTerm: filters.searchTerm || ''
    }
  });

  // Watch form values and update parent component
  const watchedValues = watch();
  
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setValue(key as keyof AdminFilterInput, value);
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <Card className="mb-8 bg-card/80 backdrop-blur-sm border-border/50">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            type="date"
            label="Date"
            value={watchedValues.date || ''}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          />
          
          <Select
            label="Status"
            value={watchedValues.status || 'all'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          
          <Input
            label="Search"
            placeholder="Name, email, or phone"
            value={watchedValues.searchTerm || ''}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          />

          <div className="flex items-end">
            <Button
              onClick={onRefresh}
              loading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}