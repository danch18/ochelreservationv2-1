'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useReservationForm, useHeaderTexts } from '@/hooks';
import { useRestaurantAvailability } from '@/hooks/useRestaurantAvailability';
import { Input, Select, Textarea, Button, Alert } from '@/components/ui';
import { GUEST_OPTIONS } from '@/lib/constants';
import { getTodayDate, validatePhoneFormat } from '@/lib/utils';
import type { Reservation } from '@/types';


interface ReservationFormProps {
  onSuccess?: (reservation: Reservation) => void;
  onBack?: () => void;
  onStepChange?: (step: 1 | 2) => void;
}

// Custom Date Dropdown Component
interface DateDropdownProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  icon?: string; // Path to icon image
  disabled?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

function DateDropdown({ value, onChange, error, label = "Date", icon, disabled, isOpen = false, onToggle, isDateClosed }: DateDropdownProps & { isDateClosed?: (date: string) => boolean }) {
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
        onToggle?.();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onToggle]);

  const formatDisplayDate = () => {
    if (value) {
      const date = new Date(value);
      const day = date.getDate();
      const month = date.toLocaleString('fr-FR', { month: 'long' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    }
    return "Date";
  };

  // Use the passed isDateClosed function or fallback to default behavior
  const checkDateClosed = (dateStr: string) => {
    return isDateClosed ? isDateClosed(dateStr) : false;
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
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const isCurrentMonth = date.getMonth() === month;
      const isPast = dateStr < today;
      const isClosed = checkDateClosed(dateStr);

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
    <div className="space-y-2" ref={dropdownRef} key={`date-dropdown-${currentMonth?.getTime()}`}>
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
          onClick={() => !disabled && onToggle?.()}
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
                <div
                  onClick={() => {
                    if (currentMonth) {
                      const newDate = new Date(currentMonth);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setCurrentMonth(newDate);
                    }
                  }}
                  className="w-10 h-10 rounded transition-all duration-200 flex items-center justify-center cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(239, 230, 210, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 230, 210, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 230, 210, 0.1)';
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="#EFE6D2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">
                  {currentMonth ? `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}` : ''}
                </h3>
                <div
                  onClick={() => {
                    if (currentMonth) {
                      const newDate = new Date(currentMonth);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setCurrentMonth(newDate);
                    }
                  }}
                  className="w-10 h-10 rounded transition-all duration-200 flex items-center justify-center cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(239, 230, 210, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 230, 210, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 230, 210, 0.1)';
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="#EFE6D2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
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
                  
                  {days.map((day) => (
                    <div
                      key={day.date}
                      onClick={() => {
                        if (!day.isPast && !day.isClosed) {
                          onChange(day.date);
                        }
                      }}
                      className={`
                        aspect-square p-1 text-xs sm:text-sm rounded transition-all duration-200 flex items-center justify-center
                        ${!day.isCurrentMonth
                          ? 'cursor-default'
                          : day.isPast
                          ? 'cursor-not-allowed'
                          : day.isClosed
                          ? 'cursor-not-allowed line-through'
                          : day.isSelected
                          ? 'font-medium cursor-pointer'
                          : 'cursor-pointer'
                        }
                      `}
                      title={day.isClosed ? 'Restaurant fermé' : ''}
                      style={{
                        backgroundColor: 'transparent',
                        color: (!day.isCurrentMonth || day.isPast || day.isClosed)
                          ? 'rgba(239, 230, 210, 0.1)'
                          : day.isSelected
                          ? '#EFE6D2'
                          : '#EFE6D2',
                        border: day.isSelected ? '1px solid rgba(239, 230, 210, 0.5)' : 'none'
                      }}
                    >
                      {day.day}
                    </div>
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
  timeSlots: readonly string[] | string[];
  disabled?: boolean;
  icon?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

function TimeSelector({ value, onChange, error, timeSlots, disabled, icon, isOpen = false, onToggle }: TimeSelectorProps) {
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize after mount to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle?.();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onToggle]);

  const formatDisplayTime = () => {
    if (value) {
      return value;
    }
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
          onClick={() => !disabled && onToggle?.()}
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
              {/* Time slots in grid layout */}
              <div className="px-4">
                <div className="border border-white/30 rounded-[8px] p-[6px]">
                  <div className="grid grid-cols-3 gap-1">
                    {timeSlots.map(time => (
                      <div
                        key={time}
                        onClick={() => !disabled && onChange(time)}
                        className={`
                          text-[14px] text-center rounded-[6px] transition-all duration-200 py-2 px-4
                          min-h-[40px] flex items-center justify-center whitespace-nowrap
                          ${value === time
                            ? 'text-[#FFD65A]'
                            : 'text-[#EFE6D2] hover:text-[#FFD65A]'
                          }
                          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                        style={{
                          backgroundColor: 'rgba(239, 230, 210, 0.1)',
                          border: value === time ? '1px solid rgba(239, 230, 210, 0.5)' : 'none'
                        }}
                      >
                        <span suppressHydrationWarning>{time}</span>
                      </div>
                    ))}
                  </div>
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

// Custom Guests Dropdown Component
interface GuestsDropdownProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  icon?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

function GuestsDropdown({ value, onChange, error, disabled, icon, isOpen = false, onToggle }: GuestsDropdownProps) {
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shortcuts = [1, 2, 3, 4, 5, 6];

  // Initialize after mount to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle?.();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onToggle]);

  const formatDisplayGuests = () => {
    if (value) {
      const num = parseInt(value);
      return `${num} invité${num > 1 ? 's' : ''}`;
    }
    return "Nombre d'invités";
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
                  alt="Guests icon" 
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
      {/* Entire Guests Section Container with Border */}
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
          onClick={() => !disabled && onToggle?.()}
        >
          <div className="flex items-center gap-3">
            {icon && (
              <Image 
                src={icon} 
                alt="Guests icon" 
                width={16} 
                height={16}
                className="w-4 h-4"
              />
            )}
            <span className="text-gray-900 font-medium">
              {formatDisplayGuests()}
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

        {/* Inline Guest Selection - expands within the border */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen && !disabled 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white">
            <div className="py-4">
              {/* Input Field */}
              <div className="px-4 mb-4">
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={value || ''}
                  onChange={(e) => !disabled && onChange(e.target.value)}
                  placeholder="Entrez le nombre d'invités"
                  disabled={disabled}
                />
              </div>
              
              {/* Quick shortcuts */}
              <div className="px-4">
                <div className="text-xs font-medium text-gray-500 mb-2">Sélection rapide</div>
                <div className="border border-white/30 rounded-[8px] p-[6px]">
                  <div className="grid grid-cols-3 grid-rows-2 gap-1">
                    {shortcuts.map(num => (
                      <div
                        key={num}
                        onClick={() => !disabled && onChange(num.toString())}
                        className={`
                          text-[14px] text-center rounded-[6px] transition-all duration-200 py-2 px-4
                          min-h-[40px] flex items-center justify-center whitespace-nowrap
                          ${value === num.toString()
                            ? 'text-[#FFD65A]'
                            : 'text-[#EFE6D2] hover:text-[#FFD65A]'
                          }
                          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                        style={{
                          backgroundColor: 'rgba(239, 230, 210, 0.1)',
                          border: value === num.toString() ? '1px solid rgba(239, 230, 210, 0.5)' : 'none'
                        }}
                      >
                        <span>{num}</span>
                        <span className="text-xs ml-1">invités</span>
                      </div>
                    ))}
                  </div>
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

export function ReservationForm({ onSuccess, onBack, onStepChange }: ReservationFormProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const {
    form: { register, handleSubmit, formState: { errors }, setValue, watch },
    isSubmitting,
    submitError,
    onSubmit
  } = useReservationForm();

  // Fetch header texts from database
  const { headerTexts, loading: headerTextsLoading } = useHeaderTexts();

  // Fetch restaurant availability and dynamic time slots
  const { getTimeSlots, isDateClosed, loading: availabilityLoading } = useRestaurantAvailability();

  const guestsValue = watch('guests');
  const selectedDate = watch('date');
  const selectedTime = watch('time');
  const nameValue = watch('name');
  const emailValue = watch('email');
  const phoneValue = watch('phone');

  // Phone validation state
  const phoneValidation = phoneValue ? validatePhoneFormat(phoneValue) : { isValid: true };

  // Get dynamic time slots for the selected date based on admin-configured weekly schedule
  // This replaces the static TIME_SLOTS constant with dynamic slots from database
  const availableTimeSlots = selectedDate ? getTimeSlots(selectedDate) : [];
  
  // Check if the selected date is closed based on weekly schedule or specific date override
  const selectedDateClosed = selectedDate ? isDateClosed(selectedDate) : false;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate step 1 fields
    const hasGuests = guestsValue && parseInt(guestsValue) > 0;
    const hasDate = selectedDate;
    const hasTime = selectedTime;
    
    if (hasGuests && hasDate && hasTime) {
      setCurrentStep(2);
      onStepChange?.(2);
    }
  };

  const handleFinalSubmit = handleSubmit(async (data) => {
    try {
      const reservation = await onSubmit(data);
      onSuccess?.(reservation);
    } catch {
      // Error is already handled by the hook
    }
  });

  const handleBackToStep1 = () => {
    setCurrentStep(1);
    onStepChange?.(1);
  };

  // Notify parent about initial step
  useEffect(() => {
    onStepChange?.(currentStep);
  }, [onStepChange, currentStep]);

  if (currentStep === 1) {
    return (
      <div className="bg-popover rounded-2xl p-2 flex flex-col h-full max-h-[90vh] font-forum">
        {/* Header Information Lines */}
        {!headerTextsLoading && (
          <div className="mb-6 max-sm:mb-4 space-y-2 max-sm:space-y-1">
            <p className="text-[18px] max-sm:text-[16px] font-semibold text-black text-left">
              {headerTexts.headerText1}
            </p>
            <p className="text-[16px] max-sm:text-[14px] font-medium text-black text-left">
              {headerTexts.headerText2}
            </p>
            <p className="text-[14px] max-sm:text-[12px] text-gray-700 text-left">
              {headerTexts.headerText3}
            </p>
          </div>
        )}

        {onBack && (
          <div className="mb-6">
            <div
              onClick={onBack}
              className="w-10 h-10 rounded transition-all duration-200 flex items-center justify-center cursor-pointer"
              style={{
                backgroundColor: 'rgba(239, 230, 210, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 230, 210, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 230, 210, 0.1)';
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="#EFE6D2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
        )}

        <form onSubmit={handleStep1Submit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto pb-4">
            <GuestsDropdown
              value={guestsValue}
              onChange={(value) => {
                setValue('guests', value);
                setOpenDropdown(null); // Close dropdown after selection
              }}
              error={errors.guests?.message}
              icon="/icons/guests.svg"
              isOpen={openDropdown === 'guests'}
              onToggle={() => setOpenDropdown(openDropdown === 'guests' ? null : 'guests')}
            />

            {/* Divider */}
            <div className="h-px bg-gray-200 my-4"></div>

            <DateDropdown
              value={selectedDate}
              onChange={(value) => {
                setValue('date', value);
                setOpenDropdown(null); // Close dropdown after selection
              }}
              error={errors.date?.message}
              icon="/icons/calendar.svg"
              isOpen={openDropdown === 'date'}
              onToggle={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
              isDateClosed={isDateClosed}
            />
            
            {/* Divider */}
            <div className="h-px bg-gray-200 my-4"></div>
            
            <TimeSelector
              value={selectedTime}
              onChange={(value) => {
                setValue('time', value);
                setOpenDropdown(null); // Close dropdown after selection
              }}
              error={errors.time?.message}
              timeSlots={availableTimeSlots}
              disabled={selectedDateClosed || availabilityLoading || availableTimeSlots.length === 0}
              icon="/icons/clock.svg"
              isOpen={openDropdown === 'time'}
              onToggle={() => setOpenDropdown(openDropdown === 'time' ? null : 'time')}
            />

            {/* Show helpful message when no time slots available */}
            {selectedDate && !availabilityLoading && (
              <>
                {selectedDateClosed && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    Restaurant fermé ce jour-là
                  </div>
                )}
                {!selectedDateClosed && availableTimeSlots.length === 0 && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                    Aucun créneau disponible pour cette date
                  </div>
                )}
              </>
            )}

            {/* Hidden inputs for form registration */}
            <input type="hidden" {...register('date')} />
            <input type="hidden" {...register('time')} />
          </div>

          {/* Fixed bottom section */}
          <div className="bg-muted/50 -mx-2 -mb-2 px-4 py-4 rounded-b-2xl border-t border-border/20">
            <Button
              type="submit"
              disabled={!guestsValue || !selectedDate || !selectedTime}
              className="w-full mb-2"
              size="md"
            >
              Réserver
            </Button>
            <div className="flex items-center justify-center gap-1 text-xs max-sm:text-[10px] text-muted-foreground">
              <span>propulsé par</span>
              <a
                href="https://www.ochel.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-75 transition-opacity"
              >
                <Image
                  src="/icons/ochelFullLogoWhite.png"
                  alt="Logo"
                  width={30}
                  height={12}
                  className="h-3 w-auto max-sm:h-2"
                  style={{ objectFit: 'contain' }}
                />
              </a>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // Step 2: Personal Details - Two Column Layout
  return (
    <div className="bg-popover rounded-2xl p-2 flex flex-col h-full max-h-[90vh] w-full max-w-6xl font-forum">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div
          onClick={handleBackToStep1}
          className="w-10 h-10 rounded transition-all duration-200 flex items-center justify-center cursor-pointer"
          style={{
            backgroundColor: 'rgba(239, 230, 210, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 230, 210, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 230, 210, 0.1)';
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="#EFE6D2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </div>

      {submitError && (
        <Alert variant="destructive" className="mb-6">
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleFinalSubmit} className="flex flex-col h-full">
        {/* Two Column Layout */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
          {/* Left Column - Contact Form */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto space-y-4 pb-4">
              {/* Title Field */}
              <div>
                <label className="block text-sm max-sm:text-xs font-medium text-gray-700 mb-2">Civilité</label>
                <div className="flex gap-4 max-sm:gap-3">
                  <label className="flex items-center gap-2 max-sm:gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="title"
                      value="Madame"
                      className="w-4 h-4 max-sm:w-3 max-sm:h-3 text-[#F34A23] accent-[#F34A23]"
                    />
                    <span className="text-sm max-sm:text-xs">Madame</span>
                  </label>
                  <label className="flex items-center gap-2 max-sm:gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="title"
                      value="Monsieur"
                      className="w-4 h-4 max-sm:w-3 max-sm:h-3 text-[#F34A23] accent-[#F34A23]"
                    />
                    <span className="text-sm max-sm:text-xs">Monsieur</span>
                  </label>
                  <label className="flex items-center gap-2 max-sm:gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="title"
                      value="Mx."
                      className="w-4 h-4 max-sm:w-3 max-sm:h-3 text-[#F34A23] accent-[#F34A23]"
                    />
                    <span className="text-sm max-sm:text-xs">Mx.</span>
                  </label>
                </div>
              </div>

              {/* Name Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Prénom"
                  placeholder="Jean"
                  error={errors.name?.message}
                  {...register('name')}
                />
                <Input
                  label="Nom"
                  placeholder="Dupont"
                  // We'll use the same name field for now, but you can add a separate lastName field if needed
                />
              </div>

              {/* Contact Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="tel"
                    label="Téléphone"
                    placeholder="612345678 ou +33612345678"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                  {phoneValue && !phoneValidation.isValid && phoneValidation.suggestion && (
                    <div className="mt-1 p-2 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-xs text-blue-700">
                        💡 <strong>Suggestion:</strong> {phoneValidation.suggestion}
                      </p>
                    </div>
                  )}
                  {!phoneValue && (
                    <p className="text-xs text-gray-500 mt-1">
                      Format: sans espaces, sans 0 initial (ex: 612345678)
                    </p>
                  )}
                  {phoneValue && phoneValidation.isValid && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Format valide
                    </p>
                  )}
                </div>
                <Input
                  type="email"
                  label="Email"
                  placeholder="jean@exemple.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>

              <Textarea
                label="Commentaires, préférences ou restrictions alimentaires (facultatif)"
                placeholder="Allergies, célébration, préférences de siège..."
                rows={3}
                error={errors.specialRequests?.message}
                {...register('specialRequests')}
              />

              {/* Checkboxes */}
              <div className="space-y-3 text-sm">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#F34A23] accent-[#F34A23] mt-0.5 rounded"
                  />
                  <span className="text-gray-600">Sauvegardez les informations pour mes prochaines réservations.</span>
                </label>
                
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#F34A23] accent-[#F34A23] mt-0.5 rounded"
                    required
                  />
                  <span className="text-gray-600">
                    J'accepte les conditions générales d'utilisation du service.
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#F34A23] accent-[#F34A23] mt-0.5 rounded"
                  />
                  <span className="text-gray-600">Envoyez-moi des offres et actualités par e-mail.</span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#F34A23] accent-[#F34A23] mt-0.5 rounded"
                  />
                  <span className="text-gray-600">Envoyez-moi des offres et actualités par SMS.</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Reservation Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-gray-50 rounded-lg p-4 h-full">
              <h4 className="text-lg font-semibold text-black mb-4">Votre réservation</h4>
              
              {/* Service Notice */}
              <div className="mb-4 p-3 bg-[#FF7043]/5 rounded-lg border border-[#FF7043]/20">
                <p className="text-sm text-[#FF7043]">Notre premier service commence à 19h30.</p>
              </div>

              <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  Merci de respecter votre horaire de réservation. La table devra être libérée à 
                  21h30 pour l'arrivée du second service.
                </p>
              </div>

              {/* Reservation Details */}
              <div className="space-y-3 mb-6 max-sm:mb-4 max-sm:space-y-2">
                <div className="flex items-center gap-3 max-sm:gap-2">
                  <Image 
                    src="/icons/guests.svg" 
                    alt="Guests" 
                    width={24} 
                    height={24} 
                    className="w-6 h-6 max-sm:w-5 max-sm:h-5"
                  />
                  <span className="font-medium text-lg max-sm:text-base">{guestsValue}</span>
                </div>
                
                <div className="flex items-center gap-3 max-sm:gap-2">
                  <Image 
                    src="/icons/calendar.svg" 
                    alt="Date" 
                    width={24} 
                    height={24} 
                    className="w-6 h-6 max-sm:w-5 max-sm:h-5"
                  />
                  <span className="font-medium max-sm:text-sm">
                    {selectedDate ? (() => {
                      const [year, month, day] = selectedDate.split('-').map(Number);
                      const date = new Date(year, month - 1, day);
                      return date.toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      });
                    })() : ''}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 max-sm:gap-2">
                  <Image 
                    src="/icons/clock.svg" 
                    alt="Time" 
                    width={24} 
                    height={24} 
                    className="w-6 h-6 max-sm:w-5 max-sm:h-5"
                  />
                  <span className="font-medium max-sm:text-sm">{selectedTime}</span>
                </div>
              </div>


              {/* Privacy Notice */}
              <div className="text-xs max-sm:text-[10px] text-gray-600 space-y-2 max-sm:space-y-1">
                <p>
                  Les informations que vous nous transmettez dans le cadre de votre réservation sont collectées par le restaurant et traitées via l'outil de réservation mis à disposition par Ochel.
                </p>
                <p>
                  Elles sont utilisées uniquement pour gérer votre demande (confirmation, modification, annulation) et pour assurer le suivi de votre venue (notifications par email ou SMS liées à votre réservation).
                  Ces données peuvent également être utilisées par le restaurant afin d'améliorer votre expérience et, si vous y avez consenti, pour vous adresser des communications personnalisées (actualités, offres spéciales, campagnes de fidélisation).
                </p>
                <p>
                  Conformément à la réglementation applicable (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données, ainsi que d'un droit d'opposition ou de limitation de leur traitement. Vous pouvez exercer ces droits directement auprès du restaurant.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed bottom section */}
        <div className="bg-muted/50 -mx-2 -mb-2 px-4 py-4 rounded-b-2xl border-t border-border/20 mt-4">
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting || !nameValue || !emailValue || !phoneValue}
            className="w-full mb-2"
            size="md"
          >
            {isSubmitting ? 'Création de la réservation...' : 'Confirmer la réservation'}
          </Button>
          <div className="flex items-center justify-center gap-1 text-xs max-sm:text-[10px] text-muted-foreground">
            <span>propulsé par</span>
            <a 
              href="https://www.ochel.fr/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-75 transition-opacity"
            >
              <Image 
                src="/icons/ochellogofull.png" 
                alt="Logo" 
                width={30}
                height={12}
                className="h-3 w-auto max-sm:h-2"
                style={{ objectFit: 'contain' }}
              />
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}