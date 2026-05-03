/**
 * Restaurant Configuration
 * Defines settings for each restaurant location
 */

export type RestaurantId = 'magnifiko' | 'piccolo';

export interface RestaurantConfig {
  id: RestaurantId;
  name: string;
  displayName: string;
  description: string;

  // Contact Information
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  email: string;

  // Hours
  hours: {
    regular: string;
    special?: string; // e.g., "Except Friday: 14h - Minuit"
  };

  // Branding
  logo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };

  // Social Media
  social: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };

  // SEO
  metadata: {
    title: string;
    description: string;
  };

  // Features
  features: {
    hasReservation: boolean;
    hasDelivery: boolean;
    hasCertification: boolean;
  };

  // Content file path
  contentFile: string;
}

export const RESTAURANTS: Record<RestaurantId, RestaurantConfig> = {
  magnifiko: {
    id: 'magnifiko',
    name: 'Magnifiko',
    displayName: 'Magnifiko',
    description: 'Restaurant Italien Halal à Ivry-sur-Seine',

    address: {
      street: '63 Bd Paul Vaillant Couturier',
      city: 'Ivry-sur-Seine',
      postalCode: '94200',
      country: 'France',
    },
    phone: '01 49 59 00 94',
    email: 'compte.magnifiko@gmail.com',

    hours: {
      regular: 'Lun-Jeu: 11h - 22h30',
      special: 'Ven: 13h30 - Minuit | Sam: 11h - Minuit | Dim: 11h - 22h30',
    },

    logo: {
      src: '/icons/MagnifikoLogo.png',
      alt: 'Magnifiko halal Italian restaurant logo',
      width: 50,
      height: 17,
    },

    social: {
      instagram: 'https://www.instagram.com/magnifiko.ivry',
      facebook: '#',
      tiktok: '#',
    },

    metadata: {
      title: 'Magnifiko - Restaurant Italien Halal à Ivry-sur-Seine',
      description: 'Magnifiko - La référence de la cuisine italienne halal en Île-de-France, certifiée Achahada. Pizzas, pâtes fraîches et desserts traditionnels.',
    },

    features: {
      hasReservation: false, // Currently disabled
      hasDelivery: true,
      hasCertification: true,
    },

    contentFile: '/data/content-magnifiko.json',
  },

  piccolo: {
    id: 'piccolo',
    name: 'Piccolo',
    displayName: 'Piccolo Magnifiko',
    description: 'Restaurant Italien Halal à Paris',

    address: {
      street: '60 Rue Jean-Baptiste Pigalle',
      city: 'Paris',
      postalCode: '75009',
      country: 'France',
    },
    phone: '01 XX XX XX XX', // TODO: Add Piccolo phone
    email: 'contact@piccolo-magnifiko.fr', // TODO: Add Piccolo email

    hours: {
      regular: 'Lun, Mer, Jeu: 10h30 - 15h, 18h - 23h',
      special: 'Mar: Fermé | Ven: 15h - Minuit | Sam: 10h - Minuit | Dim: 10h - 23h',
    },

    logo: {
      src: '/images/piccolo/PICCOLO MAGNIFKO LOGO.svg',
      alt: 'Piccolo Magnifiko halal Italian restaurant logo',
      width: 50,
      height: 50,
    },

    social: {
      instagram: '#', // TODO: Add Piccolo Instagram
      facebook: '#',
      tiktok: '#',
    },

    metadata: {
      title: 'Piccolo Magnifiko - Restaurant Italien Halal à Paris',
      description: 'Piccolo Magnifiko - Cuisine italienne halal authentique au cœur de Paris. Pizzas napolitaines, pâtes fraîches et desserts italiens.',
    },

    features: {
      hasReservation: false,
      hasDelivery: true,
      hasCertification: true,
    },

    contentFile: '/data/content-piccolo.json',
  },
};

/**
 * Get restaurant configuration by ID
 */
export function getRestaurantConfig(id: RestaurantId): RestaurantConfig {
  return RESTAURANTS[id];
}

/**
 * Get restaurant ID from URL path
 * /piccolo/* -> 'piccolo'
 * /* -> 'magnifiko'
 */
export function getRestaurantIdFromPath(pathname: string): RestaurantId {
  if (pathname.startsWith('/piccolo')) {
    return 'piccolo';
  }
  return 'magnifiko';
}
