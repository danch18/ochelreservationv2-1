'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface HeaderTexts {
  headerText1: string;
  headerText2: string;
  headerText3: string;
}

/**
 * Custom hook to fetch header texts from the database
 * These texts appear at the top of the reservation form
 */
export function useHeaderTexts() {
  const [headerTexts, setHeaderTexts] = useState<HeaderTexts>({
    headerText1: 'Bienvenue au Magnifiko !',
    headerText2: 'Réservez votre table en quelques clics (sans réservation après 20h)',
    headerText3: 'Pour toute demande particulière, contactez-nous au 01 49 59 00 94'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHeaderTexts = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('restaurant_settings')
          .select('setting_key, setting_value')
          .in('setting_key', ['header_text_1', 'header_text_2', 'header_text_3']);

        if (error) {
          console.error('Error loading header texts:', error);
          setError('Failed to load header texts');
          return;
        }

        // Initialize with default values
        const texts: HeaderTexts = {
          headerText1: 'Bienvenue au Magnifiko !',
          headerText2: 'Réservez votre table en quelques clics (sans réservation après 20h)',
          headerText3: 'Pour toute demande particulière, contactez-nous au 01 49 59 00 94'
        };

        // Update with database values if they exist
        if (data) {
          data.forEach((setting) => {
            switch (setting.setting_key) {
              case 'header_text_1':
                texts.headerText1 = setting.setting_value || texts.headerText1;
                break;
              case 'header_text_2':
                texts.headerText2 = setting.setting_value || texts.headerText2;
                break;
              case 'header_text_3':
                texts.headerText3 = setting.setting_value || texts.headerText3;
                break;
            }
          });
        }

        setHeaderTexts(texts);
      } catch (err) {
        console.error('Error loading header texts:', err);
        setError('Failed to load header texts');
      } finally {
        setLoading(false);
      }
    };

    loadHeaderTexts();
  }, []);

  return { headerTexts, loading, error };
}

