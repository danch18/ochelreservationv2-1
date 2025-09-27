// Application constants and configuration

export const RESTAURANT_CONFIG = {
  name: 'ochel',
  description: 'Experience Fine Dining at Its Best',
  tagline: 'Indulge in our exquisite cuisine crafted by world-renowned chefs. From fresh seafood to premium steaks, every dish tells a story of passion and perfection.',
  rating: 4.9,
  location: 'Downtown Fine Dining',
  hours: 'Open Daily 5PM-11PM',
  phone: '(555) 123-4567',
  email: 'info@ochel.com',
  address: '123 Fine Dining Street, Downtown'
} as const;

export const TIME_SLOTS = [
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00'
] as const;

export const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const RESERVATION_STATUS = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
} as const;

export const STATUS_COLORS = {
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200'
} as const;

export const FORM_VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 20,
  SPECIAL_REQUESTS_MAX_LENGTH: 500,
  MIN_GUESTS: 1,
  MAX_GUESTS: 50
} as const;

export const API_ERRORS = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  VALIDATION: 'Please check your input and try again.',
  NOT_FOUND: 'Requested resource not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.'
} as const;

export const SUCCESS_MESSAGES = {
  RESERVATION_CREATED: 'Reservation created successfully!',
  RESERVATION_UPDATED: 'Reservation updated successfully!',
  RESERVATION_CANCELLED: 'Reservation cancelled successfully!'
} as const;

// Environment configuration
export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production'
} as const;


export const DATA = {
    navbar: [
        {
            label: "Menu",
            link: "/menu"
        },
        {
            label: "Reservation",
            link: "/reservation"
        },
        {
            label: "Delivery",
            link: "#"
        },
        {
            label: "Certification",
            link: "/certification"
        }
    ],
    footer:{
        quickLinks:{
            heading: "Quick Links",
            items:[
                {
                    label: "Welcome",
                    link: "/"
                },
                {
                    label: "Menu",
                    link: "/menu"
                },
                {
                    label: "About",
                    link: "/about"
                },
                {
                    label: "Contact",
                    link: "/reservation"
                },
                
            ]
        },
        information:{
            heading: "Information",
            items:[
                {
                    label: "63 Bd Paul Vaillant Couturier,94200 Ivry-sur-Seine, France",
                    icon: "/icons/location.svg",
                },
                {
                    label: "01 49 59 00 94",
                    icon: "/icons/phone.svg"
                },
                {
                    label: "compte.magnifiko@gmail.com",
                    icon: "/icons/envelop.svg"
                }
            ]
        },
        schedules:{
            heading: "Schedules",
            items:[
                {
                    label: "Ouvert tous les jours",
                },
                {
                    label: "11H - Minuit",
                },
                {
                    label: "Vendredi",
                },
                {
                    label: "14H - Minuit",
                },  
            ]
            
        },
        social:[
            {
                icon: "/icons/facebook.svg",
                alt:"facebook-icon"
            },
            {
                icon: "/icons/instagram.svg",
                alt:"instagram-icon"
            },
            {
                icon: "/icons/tiktok.svg",
                alt:"tiktok-icon"
            }
        ],
        copyright: "Magnifiko. All rights reserved."

    },
    homePage:{
        hero:{
            title:"Welcome to",
            findUs: "Find Us",
        },
        history:{
            tag: "Notre Histoire",
            first:{
                title: "Une expérience unique au cœur d'Ivry-sur-Seine",
                description: `Magnifiko est né d'un rêve : créer un lieu où 
                            l'authenticité de l'Italie rencontre le respect des règles halal,
                            dans un cadre moderne, familial et chaleureux. Nous sommes bien
                            plus qu'un restaurant : nous sommes une référence de la cuisine 
                            italienne halal en Île-de-France, un espace de partage pour les 
                            amateurs de pâtes à l'italienne, de pizzas artisanales Napolitaine,
                            de desserts traditionnels et de produits 100% halal et certifiés.`,
                since: "Depuis 2020",
                image1: {
                    src: "/images/history/restaurant-image.png",
                    alt: "resturant-image"
                },
                image2: {
                    src: "/images/history/pasta.png",
                    alt: "pasta"
                },
                            
            },
            second:{
                title: "Secrets de Saveur",
                para1: `Nous croyons que le secret des bonnes pâtes réside aussi dans la sauce, c'est
                        pourquoi toutes nos sauces sont préparées sur place en utilisant uniquement les
                        meilleurs ingrédients. Que vous préfériez une Amatriciana classique, une
                        carbonara crémeuse ou une délicieuse bolognaise, nous avons une sauce qui saura
                        satisfaire vos papilles.`,
                para2: `Dans notre restaurant, nous proposons une variété de 
                        formes et de tailles de pâtes artisanales, chacune avec sa propre
                        texture et saveur unique. Que vous préfériez de simples
                        spaghettis ou de copieux tonnarelli, notre sélection de 
                        plats de pâtes saura vous plaire.`,
                image: {
                    src: "/images/history/pasta-pizza.png",
                    alt: "pasta-pizza"
                }
            }
        },
        welcome:{
            bgImage:{
                src: "/images/resturant-ambiance.png",
                alt: "resturant-ambiance"
            },
            text: "on vous attend",
            title: "Tous les jours",
            time: "11H - MINUIT",
            note : "Except Friday: 2 p.m. - Midnight"
        },
        review:{
            title: "Nos Témoignages",
            subtitle: "Ce Que Disent Nos Clients",
            share: "Vous souhaitez partager votre expérience ?",
            reviewButton: "Laissez-nous un avis",
            items: [
                {
                    rating: 5, 
                    title: "The food was tasty",
                    description: "The waiters were incredibly polite and professional. The food was tasty, and everything was prepared on time.",
                    name: "Abdelrahman Mohamed",
                    type: "Google Review",
                    avatar:"/images/reviews/avatar-1.png"
                },
                {
                    rating: 5, 
                    title: "Would highly recommend",
                    description: "Cute little pizza joint with a great aesthetic and even better food. Would highly recommend for a casual dine in experience.",
                    name: "Abdelrahman Mohamed",
                    type: "Google Review",
                    avatar:"/images/reviews/avatar-1.png"
                },
                {
                    rating: 5, 
                    title: "Food was just delicious",
                    description: "Lovely service and the food was just delicious. I would recommend it to anyone who likes Italian . Also portions are big and the prices are great.",
                    name: "Abdelrahman Mohamed",
                    type: "Google Review",
                    avatar:"/images/reviews/avatar-1.png"
                }

            ]
        },
        menu:{
            title: "LUNCH",
            gotoMenuButton: "Voir notre menu complet",
            items:[
                {
                    image: {
                        src: "/images/menu/nos-pasta.png",
                        alt: "nos-pasta"
                    },
                    name:"NOS PASTA",
                    description: "Nos pâtes importées d'Italie sont sublimées par les sauces maison préparées par notre chef.",
                    list: [
                        "Sans gluten disponible avec toutes nos pâtes"
                    ]
                },
                {
                    image: {
                        src: "/images/menu/pizza.png",
                        alt: "pizza"
                    },
                    name:"Pizzas Napolitaines",
                    description: "Pizzas napolitaines cuites à la pierre, avec des farines italiennes de qualité supérieure et notre mozzarella fior di latte.",
                    list: []
                },
                {
                    image: {
                        src: "/images/menu/dessert.png",
                        alt: "dessert"
                    },
                    name:"Desserts Italiens",
                    description: "Découvrez nos desserts traditionnels italiens, des fraises à la crème aux panna cotta artisanales, préparés avec amour.",
                    list: []
                }
            ]
        }
    }
} as const