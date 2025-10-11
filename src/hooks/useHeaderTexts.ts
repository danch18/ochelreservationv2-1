'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useTranslation } from '@/contexts/LanguageContext';

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
  const { t } = useTranslation();
  const [headerTexts, setHeaderTexts] = useState<HeaderTexts>({
    headerText1: t('reservation.header.text1'),
    headerText2: t('reservation.header.text2'),
    headerText3: t('reservation.header.text3')
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

        // Initialize with default values from translations
        const texts: HeaderTexts = {
          headerText1: t('reservation.header.text1'),
          headerText2: t('reservation.header.text2'),
          headerText3: t('reservation.header.text3')
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
  }, [t]);

  return { headerTexts, loading, error };
}

