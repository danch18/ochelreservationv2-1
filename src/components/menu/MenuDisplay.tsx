'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib';
import MenuItemCard from './MenuItemCard';
import {
  menuService,
  type Category,
  type MenuItem,
  type Addon,
  type Subcategory
} from '@/services/menuService';

interface MenuDisplaySection {
  title: string;
  subtitle?: string | null;
  isSpecial?: boolean;
  items: {
    id: number;
    image?: string;
    title: string;
    subtitle?: string;
    price: string;
    has3D?: boolean;
    model3DGlbUrl?: string;
    model3DUsdzUrl?: string;
  }[];
}

export default function MenuDisplay() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [sections, setSections] = useState<MenuDisplaySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuDataCache, setMenuDataCache] = useState<Map<number, {
    category: Category;
    subcategories: Subcategory[];
    menuItems: MenuItem[];
    addons: Addon[];
  }>>(new Map());
  const [isFading, setIsFading] = useState(false);

  // Load all menu data on mount
  useEffect(() => {
    const loadAllMenuData = async () => {
      try {
        setLoading(true);
        setError(null);

        let allMenuData: Map<number, {
          category: Category;
          subcategories: Subcategory[];
          menuItems: MenuItem[];
          addons: Addon[];
        }>;

        // Check sessionStorage first
        const cachedData = sessionStorage.getItem('menuData');
        const cacheTimestamp = sessionStorage.getItem('menuDataTimestamp');
        const now = Date.now();
        const cacheAge = cacheTimestamp ? now - parseInt(cacheTimestamp) : Infinity;

        // Use cache if it exists and is less than 5 minutes old
        if (cachedData && cacheAge < 5 * 60 * 1000) {
          const parsedData = JSON.parse(cachedData);
          allMenuData = new Map(parsedData);
        } else {
          // Fetch fresh data
          allMenuData = await menuService.getAllMenuData();
          sessionStorage.setItem('menuData', JSON.stringify(Array.from(allMenuData.entries())));
          sessionStorage.setItem('menuDataTimestamp', now.toString());
        }

        setMenuDataCache(allMenuData);

        const cats = Array.from(allMenuData.values()).map(data => data.category);
        setCategories(cats);

        if (cats.length > 0) {
          setCurrentCategory(cats[0]);
        }
      } catch (err) {
        console.error('Failed to load menu data:', err);
        setError('Failed to load menu data');
      } finally {
        setLoading(false);
      }
    };

    loadAllMenuData();

    // Listen for menu data changes from admin panel via BroadcastChannel
    const menuUpdateChannel = new BroadcastChannel('menu-data-updates');

    menuUpdateChannel.onmessage = (event) => {
      if (event.data === 'invalidate') {
        console.log('Menu data changed, refreshing...');
        sessionStorage.removeItem('menuData');
        sessionStorage.removeItem('menuDataTimestamp');
        loadAllMenuData();
      }
    };

    // Cleanup on unmount
    return () => {
      menuUpdateChannel.close();
    };
  }, []);

  // Build sections when active tab changes (no API call)
  useEffect(() => {
    if (!categories[activeTab]) return;

    const categoryId = categories[activeTab].id;
    const menuData = menuDataCache.get(categoryId);

    if (!menuData) return;

    // Trigger fade out
    setIsFading(true);

    setTimeout(() => {
      setCurrentCategory(menuData.category);

      // Build sections based on the structure:
      // 1. General subcategory items (regular, non-special)
      // 2. Custom subcategories with their items
      // 3. Special items
      // 4. Add-ons

      const newSections: MenuDisplaySection[] = [];

      // Find General subcategory
      const generalSubcat = menuData.subcategories.find(s =>
        s.title.toLowerCase().includes('general')
      );

      // 1. General subcategory items (non-special) - NO HEADING
      if (generalSubcat) {
        const generalItems = menuData.menuItems.filter(
          item => item.subcategory_id === generalSubcat.id && !item.is_special
        );

        if (generalItems.length > 0) {
          newSections.push({
            title: '', // No heading for general items
            subtitle: null,
            items: generalItems.map(item => ({
              id: item.id,
              image: item.image_path || undefined,
              title: item.title,
              subtitle: item.text || item.description,
              price: `€${item.price.toFixed(2)}`,
              has3D: !!item.model_3d_url || !!item.redirect_3d_url,
              model3DGlbUrl: item.model_3d_url || undefined,
              model3DUsdzUrl: item.redirect_3d_url || undefined,
            })),
          });
        }
      }

      // 2. Custom subcategories with their items
      const customSubcats = menuData.subcategories.filter(
        s => !s.title.toLowerCase().includes('general')
      );

      for (const subcat of customSubcats) {
        const subcatItems = menuData.menuItems.filter(
          item => item.subcategory_id === subcat.id
        );

        if (subcatItems.length > 0) {
          newSections.push({
            title: subcat.title,
            subtitle: subcat.text,
            items: subcatItems.map(item => ({
              id: item.id,
              image: item.image_path || undefined,
              title: item.title,
              subtitle: item.text || item.description,
              price: `€${item.price.toFixed(2)}`,
              has3D: !!item.model_3d_url || !!item.redirect_3d_url,
              model3DGlbUrl: item.model_3d_url || undefined,
              model3DUsdzUrl: item.redirect_3d_url || undefined,
            })),
          });
        }
      }

      // 3. Special items
      const specialItems = menuData.menuItems.filter(item => item.is_special);

      if (specialItems.length > 0) {
        newSections.push({
          title: "Magnifiko Specials",
          subtitle: null,
          isSpecial: true,
          items: specialItems.map(item => ({
            id: item.id,
            image: item.image_path || undefined,
            title: item.title,
            subtitle: item.text || item.description,
            price: `€${item.price.toFixed(2)}`,
            has3D: !!item.model_3d_url || !!item.redirect_3d_url,
            model3DGlbUrl: item.model_3d_url || undefined,
            model3DUsdzUrl: item.redirect_3d_url || undefined,
          })),
        });
      }

      // 4. Add-ons (Supplements)
      if (menuData.addons.length > 0) {
        newSections.push({
          title: 'Supplements',
          subtitle: null,
          items: menuData.addons.map(addon => ({
            id: addon.id,
            image: addon.image_path || undefined,
            title: addon.title,
            subtitle: addon.description || undefined,
            price: `€${addon.price.toFixed(2)}`,
            has3D: false,
          })),
        });
      }

      setSections(newSections);

      // Trigger fade in
      setTimeout(() => setIsFading(false), 50);
    }, 150);
  }, [activeTab, categories, menuDataCache]);

  if (categories.length === 0 && !loading) {
    return (
      <div className="w-full h-full p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <p className="text-white/60 text-center">
          No menu categories available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 pb-8">
      {/* Tab Bar Container */}
      <div className="bg-[#101010] border border-white/30 rounded-[8px] p-[6px] mb-6">
        <div className="overflow-x-auto scrollbar-hide md:overflow-x-visible">
          <div className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-1 md:gap-1">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveTab(index);
                  // Scroll selected tab to center on mobile
                  const button = document.getElementById(`tab-${index}`);
                  if (button && window.innerWidth < 768) {
                    button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }
                }}
                id={`tab-${index}`}
                className={cn(
                  "text-[14px] text-center rounded-[6px] cursor-pointer transition-all duration-200 py-2 px-4",
                  "min-h-[40px] flex items-center justify-center whitespace-nowrap flex-shrink-0",
                  activeTab === index
                    ? "text-[#FFD65A] bg-[#FFD65A]/10"
                    : "text-white bg-white/10 hover:text-[#FFD65A]"
                )}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Title and Description */}
      {currentCategory && (
        <div className="mb-6">
          <h2 className="text-[28px] md:text-[32px] font-forum text-[#FFF2CC] font-medium">
            {currentCategory.title}
          </h2>
          {currentCategory.text && (
            <p className="text-[14px] md:text-[16px] font-forum text-[#FFD65A]/80 mt-2">
              {currentCategory.text}
            </p>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-white/60">Loading menu...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-12">
          <div className="text-red-400">{error}</div>
        </div>
      )}

      {/* Menu Content Section */}
      {!loading && !error && (
        <div className={`w-full transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
          {sections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60">No items available in this category.</p>
            </div>
          ) : (
            sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                {/* Section Title - Only show if title is not empty */}
                {section.title && (
                  <div className="mb-4">
                    <h3 className="text-[24px] font-forum text-[#FFF2CC] font-medium">
                      {section.title}
                    </h3>
                    {section.subtitle && (
                      <p className="text-[14px] font-forum text-[#FFD65A] mt-1">
                        ({section.subtitle})
                      </p>
                    )}
                  </div>
                )}

                {/* Menu Items */}
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      image={item.image}
                      title={item.title}
                      subtitle={item.subtitle}
                      price={item.price}
                      has3D={item.has3D}
                      model3DGlbUrl={item.model3DGlbUrl}
                      model3DUsdzUrl={item.model3DUsdzUrl}
                      variant={section.isSpecial ? 'special' : 'regular'}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
