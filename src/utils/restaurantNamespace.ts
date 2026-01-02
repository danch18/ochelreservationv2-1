/**
 * Utility functions for handling restaurant-specific namespacing in menu items
 * This prevents conflicts between different restaurants while keeping the UI clean
 */

export const PICCOLO_SUFFIX = ' piccolo';

/**
 * Determines if a restaurant should have its suffix applied
 */
export function shouldApplySuffix(restaurantId: string): boolean {
  return restaurantId === 'piccolo' || restaurantId === 'piccolo-next';
}

/**
 * Adds the piccolo suffix to a string if it doesn't already have it
 * @param value - The string to modify
 * @param restaurantId - The restaurant identifier
 * @returns The string with suffix if applicable, otherwise unchanged
 */
export function addRestaurantSuffix(value: string | null | undefined, restaurantId: string): string | null | undefined {
  if (!value) return value;
  if (!shouldApplySuffix(restaurantId)) return value;

  const trimmedValue = value.trim();
  if (trimmedValue.endsWith(PICCOLO_SUFFIX)) {
    return trimmedValue; // Already has suffix
  }

  return `${trimmedValue}${PICCOLO_SUFFIX}`;
}

/**
 * Removes the piccolo suffix from a string if it exists
 * @param value - The string to modify
 * @param restaurantId - The restaurant identifier (optional, for consistency)
 * @returns The string without suffix
 */
export function removeRestaurantSuffix(value: string | null | undefined, restaurantId?: string): string | null | undefined {
  if (!value) return value;

  // If restaurantId is provided and it shouldn't have suffix, return as-is
  if (restaurantId && !shouldApplySuffix(restaurantId)) {
    return value;
  }

  const trimmedValue = value.trim();
  if (trimmedValue.endsWith(PICCOLO_SUFFIX)) {
    return trimmedValue.slice(0, -PICCOLO_SUFFIX.length).trim();
  }

  return trimmedValue;
}

/**
 * Processes an object with multiple language fields, adding suffix to all text fields
 * Useful for categories, subcategories, and menu items
 */
export function addSuffixToFields<T extends Record<string, any>>(
  obj: T,
  restaurantId: string,
  fields: string[]
): T {
  if (!shouldApplySuffix(restaurantId)) return obj;

  const result = { ...obj };

  for (const field of fields) {
    if (field in result) {
      result[field] = addRestaurantSuffix(result[field] as string, restaurantId);
    }
  }

  return result;
}

/**
 * Processes an object with multiple language fields, removing suffix from all text fields
 */
export function removeSuffixFromFields<T extends Record<string, any>>(
  obj: T,
  restaurantId: string,
  fields: string[]
): T {
  if (!shouldApplySuffix(restaurantId)) return obj;

  const result = { ...obj };

  for (const field of fields) {
    if (field in result) {
      result[field] = removeRestaurantSuffix(result[field] as string, restaurantId);
    }
  }

  return result;
}
