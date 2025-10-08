import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reservationSchema, type ReservationFormInput } from '@/lib/validations';
import { reservationService } from '@/services';
import { getErrorMessage, getTodayDate } from '@/lib/utils';
import type { Reservation } from '@/types';

const defaultValues: ReservationFormInput = {
  name: '',
  email: '',
  phone: '',
  date: getTodayDate(),
  time: '',
  guests: '2',
  specialRequests: ''
};

export function useReservationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedReservation, setSubmittedReservation] = useState<Reservation | null>(null);

  const form = useForm<ReservationFormInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues,
    mode: 'onChange'
  });

  const onSubmit = async (data: ReservationFormInput) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Extract start time from time slot format (e.g., "20:30-21:00" -> "20:30")
      const startTime = data.time.includes('-')
        ? data.time.split('-')[0].trim()
        : data.time;

      const reservationData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        reservation_date: data.date,
        reservation_time: startTime,
        guests: parseInt(data.guests),
        special_requests: data.specialRequests || null
      };

      const newReservation = await reservationService.createReservation(reservationData);
      setSubmittedReservation(newReservation);
      return newReservation;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setSubmitError(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    form.reset(defaultValues);
    setSubmitError(null);
    setSubmittedReservation(null);
  };

  return {
    form,
    isSubmitting,
    submitError,
    submittedReservation,
    onSubmit,
    resetForm
  };
}