'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { RestaurantConfig, RestaurantId, getRestaurantConfig, getRestaurantIdFromPath } from '@/config/restaurants';

interface RestaurantContextType {
  restaurant: RestaurantConfig;
  restaurantId: RestaurantId;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

/**
 * Restaurant Context Provider
 * Automatically determines the current restaurant based on the URL path
 * - /piccolo/* -> Piccolo restaurant
 * - /* -> Magnifiko restaurant (default)
 */
export function RestaurantProvider({
  children,
  restaurantId: overrideRestaurantId
}: {
  children: React.ReactNode;
  restaurantId?: RestaurantId;
}) {
  const pathname = usePathname();

  const restaurantId = useMemo(() => {
    // If restaurant ID is explicitly provided, use it
    if (overrideRestaurantId) {
      return overrideRestaurantId;
    }
    // Otherwise, determine from URL path
    return getRestaurantIdFromPath(pathname);
  }, [pathname, overrideRestaurantId]);

  const restaurant = useMemo(() => {
    return getRestaurantConfig(restaurantId);
  }, [restaurantId]);

  const value = useMemo(() => ({
    restaurant,
    restaurantId,
  }), [restaurant, restaurantId]);

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

/**
 * Hook to access current restaurant configuration
 * @returns {RestaurantContextType} Current restaurant config and ID
 */
export function useRestaurant(): RestaurantContextType {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}

/**
 * Hook to get restaurant-specific content file path
 * @returns {string} Path to restaurant's content JSON file
 */
export function useRestaurantContent(): string {
  const { restaurant } = useRestaurant();
  return restaurant.contentFile;
}
