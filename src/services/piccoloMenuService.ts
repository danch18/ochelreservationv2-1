import { supabase } from '@/lib/supabase';
import { deleteImage, isSupabaseUrl } from '@/lib/storage';

// ============================================================================
// TYPE DEFINITIONS - PICCOLO MENU (No restaurant_id needed)
// ============================================================================

export interface PiccoloCategory {
  id: number;
  title: string;
  title_en?: string | null;
  title_it?: string | null;
  title_es?: string | null;
  text?: string | null;
  text_en?: string | null;
  text_it?: string | null;
  text_es?: string | null;
  order: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
  created_by?: number | null;
  updated_by?: number | null;
}

export interface PiccoloSubcategory {
  id: number;
  category_id: number;
  title: string;
  title_en?: string | null;
  title_it?: string | null;
  title_es?: string | null;
  text?: string | null;
  text_en?: string | null;
  text_it?: string | null;
  text_es?: string | null;
  order: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
  created_by?: number | null;
  updated_by?: number | null;
}

export interface PiccoloMenuItem {
  id: number;
  title: string;
  title_en?: string | null;
  title_it?: string | null;
  title_es?: string | null;
  text?: string | null;
  text_en?: string | null;
  text_it?: string | null;
  text_es?: string | null;
  description: string;
  description_en?: string | null;
  description_it?: string | null;
  description_es?: string | null;
  image_path?: string | null;
  model_3d_url?: string | null;
  redirect_3d_url?: string | null;
  additional_image_url?: string | null;
  is_special: boolean;
  price: number;
  subcategory_id: number;
  order: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
  created_by?: number | null;
  updated_by?: number | null;
}

export interface PiccoloAddon {
  id: number;
  title: string;
  title_en?: string | null;
  title_it?: string | null;
  title_es?: string | null;
  description?: string | null;
  description_en?: string | null;
  description_it?: string | null;
  description_es?: string | null;
  image_path?: string | null;
  price: number;
  category_id?: number | null;
  subcategory_id?: number | null;
  order: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
  created_by?: number | null;
  updated_by?: number | null;
}

// ============================================================================
// TRANSLATION HELPER
// ============================================================================

export function getPiccoloTranslatedField<T extends Record<string, any>>(
  item: T,
  field: string,
  locale: 'fr' | 'en' | 'it' | 'es'
): string {
  if (locale === 'fr') {
    return (item[field] as string) || '';
  }

  const translatedField = `${field}_${locale}`;
  return (item[translatedField] as string) || (item[field] as string) || '';
}

// ============================================================================
// PICCOLO CATEGORIES
// ============================================================================

export const piccoloCategoryService = {
  async getAll(): Promise<PiccoloCategory[]> {
    const { data, error } = await supabase
      .from('piccolo_categories')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<PiccoloCategory | null> {
    const { data, error } = await supabase
      .from('piccolo_categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(category: Omit<PiccoloCategory, 'id' | 'created_at' | 'updated_at' | 'order'>): Promise<PiccoloCategory> {
    const { data: maxOrderData } = await supabase
      .from('piccolo_categories')
      .select('order')
      .order('order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (maxOrderData?.order || 0) + 1;

    const { data, error } = await supabase
      .from('piccolo_categories')
      .insert({ ...category, order: nextOrder })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: number, category: Partial<PiccoloCategory>): Promise<PiccoloCategory> {
    const { data, error } = await supabase
      .from('piccolo_categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('piccolo_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async reorder(id: number, direction: 'up' | 'down'): Promise<void> {
    const current = await this.getById(id);
    if (!current) throw new Error('Category not found');

    const { data: allCategories } = await supabase
      .from('piccolo_categories')
      .select('id, order')
      .order('order', { ascending: true });

    if (!allCategories || allCategories.length < 2) return;

    const currentIndex = allCategories.findIndex(c => c.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= allCategories.length) return;

    const target = allCategories[targetIndex];

    await supabase.from('piccolo_categories').update({ order: target.order }).eq('id', current.id);
    await supabase.from('piccolo_categories').update({ order: current.order }).eq('id', target.id);
  },

  async updateBulkOrder(updates: { id: number; order: number }[]): Promise<void> {
    for (const update of updates) {
      await supabase.from('piccolo_categories').update({ order: update.order }).eq('id', update.id);
    }
  },
};

// ============================================================================
// PICCOLO SUBCATEGORIES
// ============================================================================

export const piccoloSubcategoryService = {
  async getAll(): Promise<PiccoloSubcategory[]> {
    const { data, error } = await supabase
      .from('piccolo_subcategories')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getByCategory(categoryId: number): Promise<PiccoloSubcategory[]> {
    const { data, error } = await supabase
      .from('piccolo_subcategories')
      .select('*')
      .eq('category_id', categoryId)
      .order('order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<PiccoloSubcategory | null> {
    const { data, error } = await supabase
      .from('piccolo_subcategories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(subcategory: Omit<PiccoloSubcategory, 'id' | 'created_at' | 'updated_at' | 'order'>): Promise<PiccoloSubcategory> {
    const { data: maxOrderData } = await supabase
      .from('piccolo_subcategories')
      .select('order')
      .eq('category_id', subcategory.category_id)
      .order('order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (maxOrderData?.order || 0) + 1;

    const { data, error } = await supabase
      .from('piccolo_subcategories')
      .insert({ ...subcategory, order: nextOrder })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: number, subcategory: Partial<PiccoloSubcategory>): Promise<PiccoloSubcategory> {
    const { data, error } = await supabase
      .from('piccolo_subcategories')
      .update(subcategory)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('piccolo_subcategories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async reorder(id: number, direction: 'up' | 'down'): Promise<void> {
    const current = await this.getById(id);
    if (!current) throw new Error('Subcategory not found');

    const { data: allSubcategories } = await supabase
      .from('piccolo_subcategories')
      .select('id, order')
      .eq('category_id', current.category_id)
      .order('order', { ascending: true });

    if (!allSubcategories || allSubcategories.length < 2) return;

    const currentIndex = allSubcategories.findIndex(s => s.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= allSubcategories.length) return;

    const target = allSubcategories[targetIndex];

    await supabase.from('piccolo_subcategories').update({ order: target.order }).eq('id', current.id);
    await supabase.from('piccolo_subcategories').update({ order: current.order }).eq('id', target.id);
  },

  async updateBulkOrder(updates: { id: number; order: number }[]): Promise<void> {
    for (const update of updates) {
      await supabase.from('piccolo_subcategories').update({ order: update.order }).eq('id', update.id);
    }
  },
};

// ============================================================================
// PICCOLO MENU ITEMS
// ============================================================================

export const piccoloMenuItemService = {
  async getAll(): Promise<PiccoloMenuItem[]> {
    const { data, error } = await supabase
      .from('piccolo_menu_items')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getBySubcategory(subcategoryId: number): Promise<PiccoloMenuItem[]> {
    const { data, error } = await supabase
      .from('piccolo_menu_items')
      .select('*')
      .eq('subcategory_id', subcategoryId)
      .order('order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<PiccoloMenuItem | null> {
    const { data, error } = await supabase
      .from('piccolo_menu_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(menuItem: Omit<PiccoloMenuItem, 'id' | 'created_at' | 'updated_at' | 'order'>): Promise<PiccoloMenuItem> {
    const { data: maxOrderData } = await supabase
      .from('piccolo_menu_items')
      .select('order')
      .eq('subcategory_id', menuItem.subcategory_id)
      .order('order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (maxOrderData?.order || 0) + 1;

    const { data, error } = await supabase
      .from('piccolo_menu_items')
      .insert({ ...menuItem, order: nextOrder })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error(`Un élément avec le titre "${menuItem.title}" existe déjà. Veuillez utiliser un titre différent.`);
      }
      throw error;
    }
    return data;
  },

  async update(id: number, menuItem: Partial<PiccoloMenuItem>): Promise<PiccoloMenuItem> {
    if (menuItem.image_path !== undefined) {
      const existing = await this.getById(id);
      if (existing?.image_path && isSupabaseUrl(existing.image_path) && existing.image_path !== menuItem.image_path) {
        deleteImage(existing.image_path).catch(err =>
          console.warn('Failed to delete old menu item image:', err)
        );
      }
    }

    const { data, error } = await supabase
      .from('piccolo_menu_items')
      .update(menuItem)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const menuItem = await this.getById(id);

    const { error } = await supabase
      .from('piccolo_menu_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    if (menuItem?.image_path && isSupabaseUrl(menuItem.image_path)) {
      deleteImage(menuItem.image_path).catch(err =>
        console.warn('Failed to delete menu item image:', err)
      );
    }
  },

  async getSpecialItems(): Promise<PiccoloMenuItem[]> {
    const { data, error } = await supabase
      .from('piccolo_menu_items')
      .select('*')
      .eq('is_special', true)
      .eq('status', 'active')
      .order('order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async reorder(id: number, direction: 'up' | 'down'): Promise<void> {
    const current = await this.getById(id);
    if (!current) throw new Error('Menu item not found');

    const { data: allItems } = await supabase
      .from('piccolo_menu_items')
      .select('id, order')
      .eq('subcategory_id', current.subcategory_id)
      .order('order', { ascending: true });

    if (!allItems || allItems.length < 2) return;

    const currentIndex = allItems.findIndex(i => i.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= allItems.length) return;

    const target = allItems[targetIndex];

    await supabase.from('piccolo_menu_items').update({ order: target.order }).eq('id', current.id);
    await supabase.from('piccolo_menu_items').update({ order: current.order }).eq('id', target.id);
  },

  async updateBulkOrder(updates: { id: number; order: number }[]): Promise<void> {
    for (const update of updates) {
      await supabase.from('piccolo_menu_items').update({ order: update.order }).eq('id', update.id);
    }
  },
};

// ============================================================================
// PICCOLO MENU DATA - Composite query
// ============================================================================

export interface PiccoloMenuData {
  category: PiccoloCategory;
  subcategories: PiccoloSubcategory[];
  menuItems: PiccoloMenuItem[];
  addons: PiccoloAddon[];
}

export const piccoloMenuService = {
  async getActiveCategories(): Promise<PiccoloCategory[]> {
    const { data, error } = await supabase
      .from('piccolo_categories')
      .select('*')
      .eq('status', 'active')
      .order('order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getAllMenuData(): Promise<Map<number, PiccoloMenuData>> {
    const [categories, subcategories, menuItems, addons] = await Promise.all([
      this.getActiveCategories(),
      piccoloSubcategoryService.getAll(),
      piccoloMenuItemService.getAll(),
      piccoloAddonService.getAll(),
    ]);

    const menuDataMap = new Map<number, PiccoloMenuData>();

    for (const category of categories) {
      const categorySubcats = subcategories.filter(
        s => s.category_id === category.id && s.status === 'active'
      );

      const subcatIds = categorySubcats.map(s => s.id);

      const categoryMenuItems = menuItems.filter(
        item => subcatIds.includes(item.subcategory_id) && item.status === 'active'
      );

      const categoryAddons = addons.filter(
        addon =>
          (addon.category_id === category.id || subcatIds.includes(addon.subcategory_id ?? 0)) &&
          addon.status === 'active'
      );

      menuDataMap.set(category.id, {
        category,
        subcategories: categorySubcats,
        menuItems: categoryMenuItems,
        addons: categoryAddons,
      });
    }

    return menuDataMap;
  },
};

// ============================================================================
// PICCOLO ADDONS
// ============================================================================

export const piccoloAddonService = {
  async getAll(): Promise<PiccoloAddon[]> {
    const { data, error } = await supabase
      .from('piccolo_addons')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getByCategory(categoryId: number): Promise<PiccoloAddon[]> {
    const { data: subcategories, error: subcatError } = await supabase
      .from('piccolo_subcategories')
      .select('id')
      .eq('category_id', categoryId);

    if (subcatError) throw subcatError;

    const subcategoryIds = subcategories?.map(s => s.id) || [];

    const { data, error } = await supabase
      .from('piccolo_addons')
      .select('*')
      .or(`category_id.eq.${categoryId},subcategory_id.in.(${subcategoryIds.join(',')})`)
      .order('order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getBySubcategory(subcategoryId: number): Promise<PiccoloAddon[]> {
    const { data, error } = await supabase
      .from('piccolo_addons')
      .select('*')
      .eq('subcategory_id', subcategoryId)
      .order('order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<PiccoloAddon | null> {
    const { data, error } = await supabase
      .from('piccolo_addons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(addon: Omit<PiccoloAddon, 'id' | 'created_at' | 'updated_at' | 'order'>): Promise<PiccoloAddon> {
    let nextOrder = 1;
    if (addon.subcategory_id) {
      const { data: maxOrderData } = await supabase
        .from('piccolo_addons')
        .select('order')
        .eq('subcategory_id', addon.subcategory_id)
        .order('order', { ascending: false })
        .limit(1)
        .maybeSingle();

      nextOrder = (maxOrderData?.order || 0) + 1;
    }

    const { data, error } = await supabase
      .from('piccolo_addons')
      .insert({ ...addon, order: nextOrder })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: number, addon: Partial<PiccoloAddon>): Promise<PiccoloAddon> {
    if (addon.image_path !== undefined) {
      const existing = await this.getById(id);
      if (existing?.image_path && isSupabaseUrl(existing.image_path) && existing.image_path !== addon.image_path) {
        deleteImage(existing.image_path).catch(err =>
          console.warn('Failed to delete old addon image:', err)
        );
      }
    }

    const { data, error } = await supabase
      .from('piccolo_addons')
      .update(addon)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const addon = await this.getById(id);

    const { error } = await supabase
      .from('piccolo_addons')
      .delete()
      .eq('id', id);

    if (error) throw error;

    if (addon?.image_path && isSupabaseUrl(addon.image_path)) {
      deleteImage(addon.image_path).catch(err =>
        console.warn('Failed to delete addon image:', err)
      );
    }
  },

  async reorder(id: number, direction: 'up' | 'down'): Promise<void> {
    const current = await this.getById(id);
    if (!current) throw new Error('Addon not found');
    if (!current.subcategory_id) throw new Error('Addon must have a subcategory to reorder');

    const { data: allAddons } = await supabase
      .from('piccolo_addons')
      .select('id, order')
      .eq('subcategory_id', current.subcategory_id)
      .order('order', { ascending: true });

    if (!allAddons || allAddons.length < 2) return;

    const currentIndex = allAddons.findIndex(a => a.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= allAddons.length) return;

    const target = allAddons[targetIndex];

    await supabase.from('piccolo_addons').update({ order: target.order }).eq('id', current.id);
    await supabase.from('piccolo_addons').update({ order: current.order }).eq('id', target.id);
  },

  async updateBulkOrder(updates: { id: number; order: number }[]): Promise<void> {
    for (const update of updates) {
      await supabase.from('piccolo_addons').update({ order: update.order }).eq('id', update.id);
    }
  },
};
