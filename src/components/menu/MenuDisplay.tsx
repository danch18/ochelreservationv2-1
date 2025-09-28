'use client';

import { useState } from 'react';
import { cn } from '@/lib';
import MenuItemCard from './MenuItemCard';

interface MenuItem {
  image: string;
  title: string;
  subtitle?: string;
  price: string;
  hasCamera?: boolean;
  has3D?: boolean;
  model3DUrl?: string;
}

interface MenuCategory {
  title: string;
  subtitle?: string;
  isSpecial?: boolean;
  items: MenuItem[];
}

const menuTabs = [
  'Appetizers',
  'Pasta',
  'Pizzas',
  'Mains',
  'Desserts',
  'Beverages'
];

// Comprehensive menu data structure
const menuData: Record<string, MenuCategory[]> = {
  Appetizers: [
    {
      title: 'Cold Starters',
      subtitle: 'Fresh and light appetizers to begin your meal',
      items: [
        {
          image: '/images/menu/image-1.png',
          title: 'Bruschetta Classica',
          subtitle: 'Toasted bread with fresh tomatoes and basil',
          price: '$8.00',
          hasCamera: true,
          has3D: false
        },
        {
          image: '/images/menu/image-2.png',
          title: 'Antipasto Platter',
          subtitle: 'Selection of cured meats and cheeses',
          price: '$16.00',
          hasCamera: true,
          has3D: true,
          model3DUrl: 'https://example.com/3d-antipasto'
        }
      ]
    },
    {
      title: 'Hot Starters',
      items: [
        {
          image: '/images/menu/image-3.png',
          title: 'Arancini Siciliani',
          subtitle: 'Crispy risotto balls with mozzarella',
          price: '$12.00',
          hasCamera: false,
          has3D: true,
          model3DUrl: 'https://example.com/3d-arancini'
        }
      ]
    }
  ],
  Pasta: [
    {
      title: 'Fresh Pasta',
      subtitle: 'Made daily with imported Italian flour',
      items: [
        {
          image: '/images/menu/image-1.png',
          title: 'Spaghetti Carbonara',
          subtitle: 'Classic Roman pasta with eggs and pancetta',
          price: '$18.00',
          hasCamera: true,
          has3D: true,
          model3DUrl: 'https://example.com/3d-carbonara'
        },
        {
          image: '/images/menu/image-2.png',
          title: 'Penne Arrabbiata',
          subtitle: 'Spicy tomato sauce with garlic and chili',
          price: '$16.00',
          hasCamera: true,
          has3D: false
        }
      ]
    },
    {
      title: 'Filled Pasta',
      items: [
        {
          image: '/images/menu/image-3.png',
          title: 'Ravioli Ricotta e Spinaci',
          subtitle: 'Hand-made ravioli with ricotta and spinach',
          price: '$20.00',
          hasCamera: false,
          has3D: true,
          model3DUrl: 'https://example.com/3d-ravioli'
        }
      ]
    },
    {
      title: "Chef's Special",
      subtitle: 'Signature pasta creations',
      isSpecial: true,
      items: [
        {
          image: '/images/menu/image-4.png',
          title: 'Truffle Tagliatelle',
          subtitle: 'Fresh pasta with black truffle and parmesan',
          price: '$28.00',
          hasCamera: true,
          has3D: true,
          model3DUrl: 'https://example.com/3d-truffle'
        }
      ]
    }
  ],
  Pizzas: [
    {
      title: 'Classic Pizzas',
      subtitle: 'Traditional Neapolitan style pizzas',
      items: [
        {
          image: '/images/menu/image-1.png',
          title: 'Margherita',
          subtitle: 'Tomato, mozzarella, fresh basil',
          price: '$14.00',
          hasCamera: true,
          has3D: true,
          model3DUrl: 'https://example.com/3d-margherita'
        },
        {
          image: '/images/menu/image-2.png',
          title: 'Quattro Stagioni',
          subtitle: 'Four seasons pizza with varied toppings',
          price: '$18.00',
          hasCamera: true,
          has3D: false
        }
      ]
    },
    {
      title: 'Gourmet Pizzas',
      items: [
        {
          image: '/images/menu/image-3.png',
          title: 'Prosciutto e Rucola',
          subtitle: 'Prosciutto, arugula, and parmesan',
          price: '$20.00',
          hasCamera: false,
          has3D: true,
          model3DUrl: 'https://example.com/3d-prosciutto'
        }
      ]
    }
  ],
  Mains: [
    {
      title: 'Meat Dishes',
      subtitle: 'Premium cuts and traditional preparations',
      items: [
        {
          image: '/images/menu/image-1.png',
          title: 'Osso Buco alla Milanese',
          subtitle: 'Braised veal shanks with saffron risotto',
          price: '$32.00',
          hasCamera: true,
          has3D: true,
          model3DUrl: 'https://example.com/3d-ossobuco'
        }
      ]
    },
    {
      title: 'Fish & Seafood',
      items: [
        {
          image: '/images/menu/image-2.png',
          title: 'Branzino al Sale',
          subtitle: 'Sea bass baked in salt crust',
          price: '$28.00',
          hasCamera: true,
          has3D: false
        },
        {
          image: '/images/menu/image-3.png',
          title: 'Linguine alle Vongole',
          subtitle: 'Linguine with fresh clams',
          price: '$24.00',
          hasCamera: false,
          has3D: true,
          model3DUrl: 'https://example.com/3d-vongole'
        }
      ]
    }
  ],
  Desserts: [
    {
      title: 'Traditional Desserts',
      subtitle: 'Authentic Italian sweet endings',
      items: [
        {
          image: '/images/menu/image-1.png',
          title: 'Tiramisu',
          subtitle: 'Classic coffee-flavored dessert',
          price: '$10.00',
          hasCamera: true,
          has3D: true,
          model3DUrl: 'https://example.com/3d-tiramisu'
        },
        {
          image: '/images/menu/image-2.png',
          title: 'Panna Cotta',
          subtitle: 'Silky vanilla custard with berry coulis',
          price: '$9.00',
          hasCamera: true,
          has3D: false
        }
      ]
    },
    {
      title: 'Gelato & Sorbetto',
      items: [
        {
          image: '/images/menu/image-3.png',
          title: 'Gelato Selection',
          subtitle: 'Three scoops of artisanal gelato',
          price: '$8.00',
          hasCamera: false,
          has3D: false
        }
      ]
    }
  ],
  Beverages: [
    {
      title: 'Coffee & Espresso',
      items: [
        {
          image: '/images/menu/image-1.png',
          title: 'Espresso Romano',
          subtitle: 'Traditional Italian espresso',
          price: '$3.00',
          hasCamera: false,
          has3D: false
        },
        {
          image: '/images/menu/image-2.png',
          title: 'Cappuccino',
          subtitle: 'Espresso with steamed milk foam',
          price: '$4.50',
          hasCamera: true,
          has3D: false
        }
      ]
    },
    {
      title: 'Italian Wines',
      subtitle: 'Carefully selected wines from Italian regions',
      items: [
        {
          image: '/images/menu/image-3.png',
          title: 'Chianti Classico',
          subtitle: 'Full-bodied red wine from Tuscany',
          price: '$12.00',
          hasCamera: true,
          has3D: false
        }
      ]
    },
    {
      title: 'Signature Cocktails',
      subtitle: 'Italian-inspired cocktail creations',
      isSpecial: true,
      items: [
        {
          image: '/images/menu/image-4.png',
          title: 'Negroni Perfetto',
          subtitle: 'Classic Italian aperitif cocktail',
          price: '$14.00',
          hasCamera: true,
          has3D: true,
          model3DUrl: 'https://example.com/3d-negroni'
        }
      ]
    }
  ]
};

export default function MenuDisplay() {
  const [activeTab, setActiveTab] = useState(0);

  const currentMenuData = menuData[menuTabs[activeTab] as keyof typeof menuData];

  return (
    <div className="w-full h-full p-4 md:p-6 lg:p-8">
      {/* Tab Bar Container */}
      <div className="bg-[#101010] border border-white/30 rounded-[8px] p-[6px] mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
          {menuTabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={cn(
                "text-[14px] text-center rounded-[6px] cursor-pointer transition-all duration-200 py-2 px-2",
                "min-h-[40px] flex items-center justify-center",
                activeTab === index
                  ? "text-[#FFD65A] bg-[#FFD65A]/10"
                  : "text-white bg-white/10 hover:text-[#FFD65A]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Content Section */}
      <div className="w-full">
        {currentMenuData.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-8">
            {/* Category Title */}
            <div className="mb-4">
              <h2 className="text-[24px] font-forum text-[#FFF2CC] font-medium">
                {category.title}
              </h2>
              {category.subtitle && (
                <p className="text-[14px] font-forum text-[#FFD65A] mt-1">
                  ({category.subtitle})
                </p>
              )}
            </div>

            {/* Menu Items */}
            <div className="space-y-4">
              {category.items.map((item, itemIndex) => (
                <MenuItemCard
                  key={itemIndex}
                  image={item.image}
                  title={item.title}
                  subtitle={item.subtitle}
                  price={item.price}
                  hasCamera={item.hasCamera}
                  has3D={item.has3D}
                  model3DUrl={item.model3DUrl}
                  variant={category.isSpecial ? 'special' : 'regular'}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}