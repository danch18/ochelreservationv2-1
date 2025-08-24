'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface Translations {
  [key: string]: {
    fr: string;
    en: string;
  };
}

const translations: Translations = {
  // Header
  'reserveTable': { fr: 'Réserver une table', en: 'Reserve Table' },
  'close': { fr: 'Fermer', en: 'Close' },
  
  // Form
  'name': { fr: 'Nom', en: 'Name' },
  'email': { fr: 'Email', en: 'Email' },
  'phone': { fr: 'Téléphone', en: 'Phone' },
  'guests': { fr: 'Invités', en: 'Guests' },
  'date': { fr: 'Date', en: 'Date' },
  'time': { fr: 'Heure', en: 'Time' },
  'specialRequests': { fr: 'Demandes spéciales', en: 'Special Requests' },
  'specialRequestsPlaceholder': { fr: 'Allergies, célébrations, préférences de siège, etc.', en: 'Allergies, celebrations, seating preferences, etc.' },
  'submitReservation': { fr: 'Soumettre la réservation', en: 'Submit Reservation' },
  'viewExistingReservations': { fr: 'Voir les réservations existantes', en: 'View Existing Reservations' },
  
  // Success
  'reservationConfirmed': { fr: 'Réservation confirmée !', en: 'Reservation Confirmed!' },
  'thankYouMessage': { fr: 'Merci, {name}! Votre table pour {guests} a été réservée pour {date} à {time}.', en: 'Thank you, {name}! Your table for {guests} has been reserved for {date} at {time}.' },
  'makeAnotherReservation': { fr: 'Faire une autre réservation', en: 'Make Another Reservation' },
  
  // Lookup
  'findYourReservations': { fr: 'Trouvez vos réservations', en: 'Find Your Reservations' },
  'enterEmailToView': { fr: 'Entrez votre email pour voir les réservations existantes', en: 'Enter your email to view existing reservations' },
  'enterYourEmail': { fr: 'Entrez votre email', en: 'Enter your email' },
  'lookupReservations': { fr: 'Rechercher les réservations', en: 'Lookup Reservations' },
  'back': { fr: 'Retour', en: 'Back' },
  
  // Reservation List
  'yourReservations': { fr: 'Vos réservations', en: 'Your Reservations' },
  'noReservations': { fr: 'Aucune réservation trouvée pour cet email.', en: 'No reservations found for this email.' },
  'guest': { fr: 'invité', en: 'guest' },
  'guests': { fr: 'invités', en: 'guests' },
  'cancel': { fr: 'Annuler', en: 'Cancel' },
  'confirmCancel': { fr: 'Êtes-vous sûr de vouloir annuler cette réservation ?', en: 'Are you sure you want to cancel this reservation?' },
  'yes': { fr: 'Oui', en: 'Yes' },
  'no': { fr: 'Non', en: 'No' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    let text = translation[language] || translation['en'] || key;
    
    // Replace parameters in the text
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, String(value));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}