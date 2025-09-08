'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useReservationForm } from '@/hooks';
// import { useDateAvailability } from '@/hooks/useDateAvailability';
import { Input, Select, Textarea, Button, Alert } from '@/components/ui';
import { TIME_SLOTS, GUEST_OPTIONS } from '@/lib/constants';
import { getTodayDate } from '@/lib/utils';
import type { Reservation } from '@/types';


interface ReservationFormProps {
  onSuccess?: (reservation: Reservation) => void;
  onBack?: () => void;
}

// Custom Date Dropdown Component
interface DateDropdownProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  icon?: string; // Path to icon image
  disabled?: boolean;
}

function DateDropdown({ value, onChange, error, label = "Date", icon, disabled }: DateDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize currentMonth after component mounts to avoid hydration issues
  useEffect(() => {
    setCurrentMonth(new Date());
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDisplayDate = () => {
    return "Date";
  };

  // Mock function to check if date is closed (you'll replace this with actual admin panel data)
  const isDateClosed = (dateStr: string) => {
    // This should be replaced with actual closed dates from admin panel
    const closedDates = ['2024-12-25', '2024-01-01']; // Example closed dates
    return closedDates.includes(dateStr);
  };

  const generateCalendarDays = () => {
    if (!currentMonth) return [];
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const isCurrentMonth = date.getMonth() === month;
      const isPast = dateStr < today;
      const isClosed = isDateClosed(dateStr);
      
      days.push({
        date: dateStr,
        day: date.getDate(),
        isCurrentMonth,
        isPast,
        isClosed,
        isSelected: value === dateStr
      });
    }
    return days;
  };

  const days = generateCalendarDays();
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  // Don't render calendar content until mounted to avoid hydration issues
  if (!mounted || !currentMonth) {
    return (
      <div className="space-y-0" ref={dropdownRef}>
        <div className="flex items-center justify-between p-4 border-b border-gray-300 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-50">
          <div className="flex items-center gap-3">
            {icon && (
              <Image 
                src={icon} 
                alt="Date icon" 
                width={16} 
                height={16}
                className="w-4 h-4"
              />
            )}
            <span className="text-gray-900 font-medium">
              Chargement...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2" ref={dropdownRef}>
      {/* Entire Date Section Container with Border */}
      <div className={`border rounded-lg overflow-hidden transition-all duration-300 ease-in-out
        ${error ? 'border-red-500' : 'border-gray-300'}
        ${disabled ? 'opacity-50' : ''}
      `}>
        {/* Dropdown Header */}
        <div
          className={`flex items-center justify-between p-3 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-50
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            ${isOpen ? 'border-b border-gray-300' : ''}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-3">
            {icon && (
              <Image 
                src={icon} 
                alt="Date icon" 
                width={16} 
                height={16}
                className="w-4 h-4"
              />
            )}
            <span className="text-gray-900 font-medium">
              {formatDisplayDate()}
            </span>
          </div>
          
          {/* Dropdown Arrow SVG - you can replace this with your custom SVG */}
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Inline Calendar - expands within the border */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen && !disabled 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white">
            <div className="py-4">
              <div className="flex items-center justify-between mb-4 px-4">
                <button
                  type="button"
                  onClick={() => {
                    if (currentMonth) {
                      const newDate = new Date(currentMonth);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setCurrentMonth(newDate);
                    }
                  }}
                  className="p-2 hover:bg-gray-100 rounded transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="font-semibold text-gray-800">
                  {currentMonth ? `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}` : ''}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    if (currentMonth) {
                      const newDate = new Date(currentMonth);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setCurrentMonth(newDate);
                    }
                  }}
                  className="p-2 hover:bg-gray-100 rounded transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="px-4">
                <div className="grid grid-cols-7 gap-1 mb-4 text-center">
                  <div className="text-xs font-medium text-gray-500 py-2">Dim</div>
                  <div className="text-xs font-medium text-gray-500 py-2">Lun</div>
                  <div className="text-xs font-medium text-gray-500 py-2">Mar</div>
                  <div className="text-xs font-medium text-gray-500 py-2">Mer</div>
                  <div className="text-xs font-medium text-gray-500 py-2">Jeu</div>
                  <div className="text-xs font-medium text-gray-500 py-2">Ven</div>
                  <div className="text-xs font-medium text-gray-500 py-2">Sam</div>
                  
                  {days.map((day, index) => (
                    <button
                      key={index}
                      type="button"
                      disabled={day.isPast || day.isClosed}
                      onClick={() => {
                        if (!day.isPast && !day.isClosed) {
                          onChange(day.date);
                        }
                      }}
                      className={`
                        aspect-square p-1 text-xs sm:text-sm rounded transition-all duration-200
                        ${!day.isCurrentMonth 
                          ? 'text-gray-300 cursor-default' 
                          : day.isPast 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : day.isClosed
                          ? 'text-gray-400 cursor-not-allowed line-through' 
                          : day.isSelected
                          ? 'bg-[#FF7043]/5 !border !border-[#FF7043] text-[#FF7043] font-medium' 
                          : 'text-black hover:bg-[#FF7043]/5 hover:border hover:border-[#FF7043] cursor-pointer'
                        }
                      `}
                      title={day.isClosed ? 'Restaurant fermé' : ''}
                    >
                      {day.day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

// Custom Time Selector Component (Dropdown style)
interface TimeSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  timeSlots: string[];
  disabled?: boolean;
  icon?: string;
}

function TimeSelector({ value, onChange, error, timeSlots, disabled, icon }: TimeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize after mount to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDisplayTime = () => {
    return "Heure";
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="space-y-2">
        <div className="border rounded-lg">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              {icon && (
                <Image 
                  src={icon} 
                  alt="Time icon" 
                  width={16} 
                  height={16}
                  className="w-4 h-4"
                />
              )}
              <span className="text-gray-900 font-medium">
                Chargement...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2" ref={dropdownRef}>
      {/* Entire Time Section Container with Border */}
      <div className={`border rounded-lg overflow-hidden transition-all duration-300 ease-in-out
        ${error ? 'border-red-500' : 'border-gray-300'}
        ${disabled ? 'opacity-50' : ''}
      `}>
        {/* Dropdown Header */}
        <div
          className={`flex items-center justify-between p-3 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-50
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            ${isOpen ? 'border-b border-gray-300' : ''}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-3">
            {icon && (
              <Image 
                src={icon} 
                alt="Time icon" 
                width={16} 
                height={16}
                className="w-4 h-4"
              />
            )}
            <span className="text-gray-900 font-medium">
              {formatDisplayTime()}
            </span>
          </div>
          
          {/* Dropdown Arrow SVG */}
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Inline Time Selection - expands within the border */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen && !disabled 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white">
            <div className="py-4">
              {/* Time slots in tag layout */}
              <div className="flex flex-wrap gap-2 px-4">
                {timeSlots.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => !disabled && onChange(time)}
                    disabled={disabled}
                    className={`
                      px-3 py-2 rounded-2xl text-sm font-medium transition-all duration-200
                      border-2 whitespace-nowrap flex-shrink-0
                      ${value === time
                        ? '!border-[#FF7043] bg-[#FF7043] text-white' 
                        : '!border-[#F6F1F0] bg-black/[0.03] text-black hover:!border-[#FF7043] hover:bg-[#FF7043]/5'
                      }
                      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

// Custom Guests Input Component
interface GuestsInputProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

function GuestsInput({ value, onChange, error }: GuestsInputProps) {
  const [selectedShortcut, setSelectedShortcut] = useState<number | null>(null);
  const shortcuts = [5, 10, 15, 20];

  useEffect(() => {
    if (value && shortcuts.includes(parseInt(value))) {
      setSelectedShortcut(parseInt(value));
    } else {
      setSelectedShortcut(null);
    }
  }, [value]);

  const handleShortcutClick = (num: number) => {
    onChange(num.toString());
    setSelectedShortcut(num);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    
    // Update selected shortcut if input matches a shortcut
    const numValue = parseInt(inputValue);
    if (shortcuts.includes(numValue)) {
      setSelectedShortcut(numValue);
    } else {
      setSelectedShortcut(null);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        Nombre d'invités
        <span className="text-destructive ml-1">*</span>
      </label>
      
      <Input
        type="number"
        min="1"
        max="50"
        value={value || ''}
        onChange={handleInputChange}
        placeholder="Entrez le nombre d'invités"
        error={error}
      />
      
      <div className="flex flex-wrap gap-2 mt-3">
        {shortcuts.map(num => (
          <button
            key={num}
            type="button"
            onClick={() => handleShortcutClick(num)}
            className={`
              px-3 py-2 rounded-2xl text-sm font-medium transition-all duration-200
              border-2 min-w-[65px] flex-shrink-0
              ${selectedShortcut === num 
                ? '!border-[#FF7043] bg-[#FF7043] text-white' 
                : '!border-[#F6F1F0] bg-black/[0.03] text-black hover:!border-[#FF7043] hover:bg-[#FF7043]/5'
              }
            `}
          >
            <span>{num}</span>
            <span className="text-xs"> invités</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ReservationForm({ onSuccess, onBack }: ReservationFormProps) {
  const {
    form: { register, handleSubmit, formState: { errors }, setValue, watch },
    isSubmitting,
    submitError,
    onSubmit
  } = useReservationForm();

  const guestsValue = watch('guests');
  const selectedDate = watch('date');
  const selectedTime = watch('time');

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      const reservation = await onSubmit(data);
      onSuccess?.(reservation);
    } catch {
      // Error is already handled by the hook
    }
  });

  return (
    <div className="bg-popover rounded-2xl p-2 flex flex-col h-full max-h-[90vh]">
      <div className="flex items-center justify-between mb-6">
        {onBack ? (
          <button
            onClick={onBack}
            className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
          >
            ← Retour
          </button>
        ) : (
          <div />
        )}
        <h3 className="text-2xl font-bold text-black text-left w-full" suppressHydrationWarning>
          Réservez votre table
        </h3>
        <div className="w-16" />
      </div>

      {submitError && (
        <Alert variant="destructive" className="mb-6">
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleFormSubmit} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-2 pb-4">
          <div className="grid md:grid-cols-1 gap-4">
            <Input
              label="Nom complet"
              placeholder="Jean Dupont"
              error={errors.name?.message}
              {...register('name')}
            />
            
            <Input
              type="email"
              label="Email"
              placeholder="jean@exemple.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <Input
            type="tel"
            label="Numéro de téléphone"
            placeholder="+1 (555) 123-4567"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <div className="grid md:grid-cols-1 gap-4">
            <DateDropdown
              value={selectedDate}
              onChange={(value) => setValue('date', value)}
              error={errors.date?.message}
              icon="/calendar-icon.png" // You can replace this with your icon path
            />
            
            <TimeSelector
              value={selectedTime}
              onChange={(value) => setValue('time', value)}
              error={errors.time?.message}
              timeSlots={TIME_SLOTS}
              disabled={false}
              icon="/clock-icon.png" // You can replace this with your clock icon path
            />
          </div>

          {/* Hidden inputs for form registration */}
          <input type="hidden" {...register('date')} />
          <input type="hidden" {...register('time')} />

          <GuestsInput
            value={guestsValue}
            onChange={(value) => setValue('guests', value)}
            error={errors.guests?.message}
          />

          <Textarea
            label="Demandes spéciales (Optionnel)"
            placeholder="Allergies, célébration, préférences de siège..."
            rows={3}
            error={errors.specialRequests?.message}
            {...register('specialRequests')}
          />
        </div>

        {/* Fixed bottom section */}
        <div className="bg-muted/50 -mx-2 -mb-2 px-4 py-4 rounded-b-2xl border-t border-border/20">
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full mb-2"
            size="md"
          >
            {isSubmitting ? 'Création de la réservation...' : 'Réserver une table'}
          </Button>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <span>propulsé par</span>
            <a 
              href="https://www.ochel.fr/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-75 transition-opacity"
            >
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={30}
                height={12}
                className="h-3 w-auto"
                style={{ objectFit: 'contain' }}
              />
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}