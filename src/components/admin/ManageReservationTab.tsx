'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import type { Reservation } from '@/types';

interface ManageReservationTabProps {
  reservations: Reservation[];
  isLoading: boolean;
  onReservationsUpdate: () => void;
}

export function ManageReservationTab({ reservations, isLoading, onReservationsUpdate }: ManageReservationTabProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dateFilter, setDateFilter] = useState('today');
  
  // Update current time every minute for real-time status
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  /**
   * Get date in YYYY-MM-DD format
   */
  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  /**
   * Get date range based on filter
   */
  const getFilteredDateRange = () => {
    const today = new Date();
    const startDate = getDateString(today);
    
    let endDate: string;
    switch (dateFilter) {
      case 'today':
        endDate = startDate;
        break;
      case 'next3days':
        const next3Days = new Date(today);
        next3Days.setDate(today.getDate() + 2);
        endDate = getDateString(next3Days);
        break;
      case 'next7days':
        const next7Days = new Date(today);
        next7Days.setDate(today.getDate() + 6);
        endDate = getDateString(next7Days);
        break;
      default:
        endDate = startDate;
    }
    
    return { startDate, endDate };
  };

  /**
   * Filter reservations based on selected date range
   */
  const filteredReservations = reservations.filter(reservation => {
    const { startDate, endDate } = getFilteredDateRange();
    return reservation.reservation_date >= startDate && reservation.reservation_date <= endDate;
  }).sort((a, b) => {
    // Sort by date first, then by time
    if (a.reservation_date !== b.reservation_date) {
      return a.reservation_date.localeCompare(b.reservation_date);
    }
    return a.reservation_time.localeCompare(b.reservation_time);
  });

  /**
   * Calculate if reservation is late and by how many minutes
   */
  const getReservationStatus = (reservation: Reservation) => {
    const reservationDateTime = new Date(`${reservation.reservation_date}T${reservation.reservation_time}`);
    const diffMs = currentTime.getTime() - reservationDateTime.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes > 0) {
      return {
        isLate: true,
        minutesLate: diffMinutes,
        status: 'late'
      };
    } else if (diffMinutes > -15) {
      return {
        isLate: false,
        minutesLate: 0,
        status: 'upcoming'
      };
    } else {
      return {
        isLate: false,
        minutesLate: 0,
        status: 'scheduled'
      };
    }
  };

  /**
   * Handle customer arrived action
   */
  const handleCustomerArrived = async (reservationId: string) => {
    // TODO: Connect to database to update reservation status to 'completed'
    console.log('Customer arrived for reservation:', reservationId);
    // This will be replaced with actual API call:
    // await updateReservationStatus(reservationId, 'completed');
    // onReservationsUpdate();
  };

  /**
   * Handle no-show action
   */
  const handleNoShow = async (reservationId: string) => {
    // TODO: Connect to database to update reservation status to 'cancelled' with no-show flag
    console.log('No-show for reservation:', reservationId);
    // This will be replaced with actual API call:
    // await updateReservationStatus(reservationId, 'cancelled', { isNoShow: true });
    // onReservationsUpdate();
  };

  /**
   * Get status badge styling
   */
  const getStatusBadge = (reservation: Reservation) => {
    const status = getReservationStatus(reservation);
    
    if (reservation.status === 'completed') {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (reservation.status === 'cancelled') {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (status.isLate) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    } else if (status.status === 'upcoming') {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  /**
   * Get status text
   */
  const getStatusText = (reservation: Reservation) => {
    const status = getReservationStatus(reservation);
    
    if (reservation.status === 'completed') {
      return 'Arrivé';
    } else if (reservation.status === 'cancelled') {
      return 'No-show';
    } else if (status.isLate) {
      return `-${status.minutesLate} min`;
    } else if (status.status === 'upcoming') {
      return 'Bientôt';
    } else {
      return 'Programmé';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F34A23]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Statistics Cards - Same style as overview page */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-3 md:p-6">
            <h3 className="text-sm md:text-lg font-semibold text-black mb-1 md:mb-2">
              Arrivés
            </h3>
            <p className="text-xl md:text-3xl font-bold text-green-600">
              {filteredReservations.filter(r => r.status === 'completed').length}
            </p>
            <p className="text-xs md:text-sm text-gray-600">clients présents</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-3 md:p-6">
            <h3 className="text-sm md:text-lg font-semibold text-black mb-1 md:mb-2">
              En retard
            </h3>
            <p className="text-xl md:text-3xl font-bold text-orange-600">
              {filteredReservations.filter(r => {
                const status = getReservationStatus(r);
                return status.isLate && (r.status === 'confirmed' || r.status === 'pending');
              }).length}
            </p>
            <p className="text-xs md:text-sm text-gray-600">attendent encore</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-3 md:p-6">
            <h3 className="text-sm md:text-lg font-semibold text-black mb-1 md:mb-2">
              No-shows
            </h3>
            <p className="text-xl md:text-3xl font-bold text-red-600">
              {filteredReservations.filter(r => r.status === 'cancelled').length}
            </p>
            <p className="text-xs md:text-sm text-gray-600">absences</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-3 md:p-6">
            <h3 className="text-sm md:text-lg font-semibold text-black mb-1 md:mb-2">
              En attente
            </h3>
            <p className="text-xl md:text-3xl font-bold text-blue-600">
              {filteredReservations.filter(r => r.status === 'confirmed' || r.status === 'pending').length}
            </p>
            <p className="text-xs md:text-sm text-gray-600">à traiter</p>
          </div>
        </div>
      </div>

      {/* Date Range Filter Buttons - Same style as overview stats filter */}
      <div className="flex justify-end mb-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { key: 'today' as const, label: "Aujourd'hui" },
            { key: 'next3days' as const, label: '3 prochains jours' },
            { key: 'next7days' as const, label: '7 prochains jours' }
          ].map(option => (
            <button
              key={option.key}
              onClick={() => setDateFilter(option.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-out ${
                dateFilter === option.key
                  ? 'bg-white text-[#F34A23] shadow-sm transform scale-[1.02]'  // Active state: white background with restaurant color text and subtle scale
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'   // Inactive state: gray text with hover effect
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations */}
      <div className="bg-white rounded-2xl border border-[#F6F1F0] shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-black mb-2">
            Réservations ({filteredReservations.length})
          </h3>
          <p className="text-sm text-gray-600">
            Cliquez sur les actions pour confirmer l'arrivée ou signaler une absence
          </p>
        </div>

        <div className="p-6">
          {filteredReservations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {dateFilter === 'today' ? 'Aucune réservation aujourd\'hui' : 
                 dateFilter === 'next3days' ? 'Aucune réservation dans les 3 prochains jours' :
                 'Aucune réservation dans les 7 prochains jours'}
              </h3>
              <p className="text-gray-600">
                {dateFilter === 'today' ? 'Il n\'y a pas de réservations prévues pour aujourd\'hui.' :
                 dateFilter === 'next3days' ? 'Il n\'y a pas de réservations prévues dans les 3 prochains jours.' :
                 'Il n\'y a pas de réservations prévues dans les 7 prochains jours.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReservations.map((reservation) => {
                const status = getReservationStatus(reservation);
                const isActionable = reservation.status === 'confirmed' || reservation.status === 'pending';
                
                return (
                  <div
                    key={reservation.id}
                    className={`border rounded-lg p-4 max-sm:p-3 transition-all duration-200 ${
                      status.isLate && isActionable 
                        ? 'border-orange-300 bg-orange-50/50' 
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                      {/* Reservation Info */}
                      <div className="flex-1">
                        {/* First Row - Time, Status, and Guests */}
                        <div className="flex flex-wrap items-center gap-2 mb-2 max-sm:mb-1">
                          {dateFilter !== 'today' && (
                            <span className="text-xs max-sm:text-[10px] font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                              {new Date(reservation.reservation_date + 'T00:00:00').toLocaleDateString('fr-FR', { 
                                weekday: 'short', 
                                day: 'numeric', 
                                month: 'short' 
                              })}
                            </span>
                          )}
                          <span className="font-semibold text-lg max-sm:text-base">
                            {reservation.reservation_time}
                          </span>
                          <span 
                            className={`px-2 py-1 rounded-full text-xs max-sm:text-[10px] font-medium border ${getStatusBadge(reservation)}`}
                          >
                            {getStatusText(reservation)}
                          </span>
                          <span className="text-sm max-sm:text-xs text-gray-600">
                            {reservation.guests} invité{reservation.guests > 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        {/* Second Row - Contact Info (Stack on mobile, horizontal on desktop) */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 text-sm max-sm:text-xs text-gray-700">
                          <div className="font-medium">{reservation.name}</div>
                          <div className="max-sm:text-[11px] max-sm:text-gray-600">{reservation.email}</div>
                          <div className="max-sm:text-[11px] max-sm:text-gray-600">{reservation.phone}</div>
                        </div>
                        
                        {/* Special Requests */}
                        {reservation.special_requests && (
                          <div className="mt-2 text-xs max-sm:text-[10px] text-gray-600 bg-gray-50 rounded px-2 py-1">
                            <span className="font-medium">Note:</span> {reservation.special_requests}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 max-sm:gap-1 flex-shrink-0">
                        {isActionable ? (
                          <>
                            <Button
                              onClick={() => handleCustomerArrived(reservation.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 max-sm:px-2 max-sm:py-1 text-xs max-sm:text-[10px] whitespace-nowrap"
                            >
                              Client Arrivé
                            </Button>
                            <Button
                              onClick={() => handleNoShow(reservation.id)}
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50 px-3 py-1.5 max-sm:px-2 max-sm:py-1 text-xs max-sm:text-[10px] whitespace-nowrap"
                            >
                              No-show
                            </Button>
                          </>
                        ) : (
                          <div className="text-xs max-sm:text-[10px] text-gray-500 font-medium">
                            {reservation.status === 'completed' ? 'Traité' : 'Annulé'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}