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
  price?: number | null;
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

export interface PiccoloSetMenu {
  id: number;
  title: string;
  title_en?: string | null;
  title_it?: string | null;
  title_es?: string | null;
  description?: string | null;
  description_en?: string | null;
  description_it?: string | null;
  description_es?: string | null;
  price: number;
  availability_text?: string | null;
  availability_text_en?: string | null;
  availability_text_it?: string | null;
  availability_text_es?: string | null;
  footer_text?: string | null;
  footer_text_en?: string | null;
  footer_text_it?: string | null;
  footer_text_es?: string | null;
  order: number;
  status: 'active' | 'inactive';
  groups?: PiccoloSetMenuGroup[];
  created_at?: string;
  updated_at?: string;
}

export interface PiccoloSetMenuGroup {
  id: number;
  set_menu_id: number;
  title: string;
  title_en?: string | null;
  title_it?: string | null;
  title_es?: string | null;
  order: number;
  items?: PiccoloSetMenuItem[];
  created_at?: string;
}

export interface PiccoloSetMenuItem {
  id: number;
  group_id: number;
  title: string;
  title_en?: string | null;
  title_it?: string | null;
  title_es?: string | null;
  description?: string | null;
  description_en?: string | null;
  description_it?: string | null;
  description_es?: string | null;
  order: number;
  created_at?: string;
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
    const { data, error } = await (supabase as any)
      .from('piccolo_categories' as any)
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return (data as any) || [];
  },

  async getById(id: number): Promise<PiccoloCategory | null> {
    const { data, error } = await (supabase as any)
      .from('piccolo_categories' as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return (data as any);
  },

  async create(category: Omit<PiccoloCategory, 'id' | 'created_at' | 'updated_at' | 'order'>): Promise<PiccoloCategory> {
    const { data: maxOrderData } = await (supabase as any)
      .from('piccolo_categories' as any)
      .select('order')
      .order('order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (maxOrderData?.order || 0) + 1;

    const { data, error } = await (supabase as any)
      .from('piccolo_categories' as any)
      .insert({ ...category, order: nextOrder, price: category.price })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error(`Une catégorie avec le titre "${category.title}" existe déjà.`);
      }
      throw new Error(error.message);
    }
    return (data as any);
  },

  async update(id: number, category: Partial<PiccoloCategory>): Promise<PiccoloCategory> {
    const { data, error } = await (supabase as any)
      .from('piccolo_categories' as any)
      .update(category)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error(`Une catégorie avec ce titre existe déjà.`);
      }
      throw new Error(error.message);
    }
    return (data as any);
  },

  async delete(id: number): Promise<void> {
    const { error } = await (supabase as any)
      .from('piccolo_categories' as any)
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async reorder(id: number, direction: 'up' | 'down'): Promise<void> {
    const current = await this.getById(id);
    if (!current) throw new Error('Category not found');

    const { data: allCategories } = await (supabase as any)
      .from('piccolo_categories' as any)
      .select('id, order')
      .order('order', { ascending: true });

    if (!allCategories || allCategories.length < 2) return;

    const currentIndex = allCategories.findIndex((c: any) => c.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= allCategories.length) return;

    const target = allCategories[targetIndex];

    await (supabase as any).from('piccolo_categories' as any).update({ order: target.order }).eq('id', current.id);
    await (supabase as any).from('piccolo_categories' as any).update({ order: current.order }).eq('id', target.id);
  },

  async updateBulkOrder(updates: { id: number; order: number }[]): Promise<void> {
    for (const update of updates) {
      await (supabase as any).from('piccolo_categories' as any).update({ order: update.order }).eq('id', update.id);
    }
  },
};

// ============================================================================
// PICCOLO SUBCATEGORIES
// ============================================================================

export const piccoloSubcategoryService = {
  async getAll(): Promise<PiccoloSubcategory[]> {
    const { data, error } = await (supabase as any)
      .from('piccolo_subcategories' as any)
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return (data as any) || [];
  },

  async getByCategory(categoryId: number): Promise<PiccoloSubcategory[]> {
    const { data, error } = await (supabase as any)
      .from('piccolo_subcategories' as any)
      .select('*')
      .eq('category_id', categoryId)
      .order('order', { ascending: true });

    if (error) throw error;
    return (data as any) || [];
  },

  async getById(id: number): Promise<PiccoloSubcategory | null> {
    const { data, error } = await (supabase as any)
      .from('piccolo_subcategories' as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return (data as any);
  },

  async create(subcategory: Omit<PiccoloSubcategory, 'id' | 'created_at' | 'updated_at' | 'order'>): Promise<PiccoloSubcategory> {
    const { data: maxOrderData } = await (supabase as any)
      .from('piccolo_subcategories' as any)
      .select('order')
      .eq('category_id', subcategory.category_id)
      .order('order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (maxOrderData?.order || 0) + 1;

    const { data, error } = await (supabase as any)
      .from('piccolo_subcategories' as any)
      .insert({ ...subcategory, order: nextOrder })
      .select()
      .single();

    if (error) throw error;
    return (data as any);
  },

  async update(id: number, subcategory: Partial<PiccoloSubcategory>): Promise<PiccoloSubcategory> {
    const { data, error } = await (supabase as any)
      .from('piccolo_subcategories' as any)
      .update(subcategory)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return (data as any);
  },

  async delete(id: number): Promise<void> {
    const { error } = await (supabase as any)
      .from('piccolo_subcategories' as any)
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async reorder(id: number, direction: 'up' | 'down'): Promise<void> {
    const current = await this.getById(id);
    if (!current) throw new Error('Subcategory not found');

    const { data: allSubcategories } = await (supabase as any)
      .from('piccolo_subcategories' as any)
      .select('id, order')
      .eq('category_id', current.category_id)
      .order('order', { ascending: true });

    if (!allSubcategories || allSubcategories.length < 2) return;

    const currentIndex = allSubcategories.findIndex((s: any) => s.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= allSubcategories.length) return;

    const target = allSubcategories[targetIndex];

    await (supabase as any).from('piccolo_subcategories' as any).update({ order: target.order }).eq('id', current.id);
    await (supabase as any).from('piccolo_subcategories' as any).update({ order: current.order }).eq('id', target.id);
  },

  async updateBulkOrder(updates: { id: number; order: number }[]): Promise<void> {
    for (const update of updates) {
      await (supabase as any).from('piccolo_subcategories' as any).update({ order: update.order }).eq('id', update.id);
    }
  },
};

// ============================================================================
// PICCOLO MENU ITEMS
// ============================================================================

export const piccoloMenuItemService = {
  async getAll(): Promise<PiccoloMenuItem[]> {
    const { data, error } = await (supabase as any)
      .from('piccolo_menu_items' as any)
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return (data as any) || [];
  },

  async getBySubcategory(subcategoryId: number): Promise<PiccoloMenuItem[]> {
    const { data, error } = await (supabase as any)
      .from('piccolo_menu_items' as any)
      .select('*')
      .eq('subcategory_id', subcategoryId)
      .order('order', { ascending: true });

    if (error) throw error;
    return (data as any) || [];
  },

  async getById(id: number): Promise<PiccoloMenuItem | null> {
    const { data, error } = await (supabase as any)
      .from('piccolo_menu_items' as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return (data as any);
  },

  async create(menuItem: Omit<PiccoloMenuItem, 'id' | 'created_at' | 'updated_at' | 'order'>): Promise<PiccoloMenuItem> {
    const { data: maxOrderData } = await (supabase as any)
      .from('piccolo_menu_items' as any)
      .select('order')
      .eq('subcategory_id', menuItem.subcategory_id)
      .order('order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (maxOrderData?.order || 0) + 1;

    const { data, error } = await (supabase as any)
      .from('piccolo_menu_items' as any)
      .insert({ ...menuItem, order: nextOrder })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error(`Un élément avec le titre "${menuItem.title}" existe déjà. Veuillez utiliser un titre différent.`);
      }
      throw error;
    }
    return (data as any);
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

    const { data, error } = await (supabase as any)
      .from('piccolo_menu_items' as any)
      .update(menuItem)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return (data as any);
  },

  async delete(id: number): Promise<void> {
    const menuItem = await this.getById(id);

    const { error } = await (supabase as any)
      .from('piccolo_menu_items' as any)
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
    const { data, error } = await (supabase as any)
      .from('piccolo_menu_items' as any)
      .select('*')
      .eq('is_special', true)
      .eq('status', 'active')
      .order('order', { ascending: true });

    if (error) throw error;
    return (data as any) || [];
  },

  async reorder(id: number, direction: 'up' | 'down'): Promise<void> {
    const current = await this.getById(id);
    if (!current) throw new Error('Menu item not found');

    const { data: allItems } = await (supabase as any)
      .from('piccolo_menu_items' as any)
      .select('id, order')
      .eq('subcategory_id', current.subcategory_id)
      .order('order', { ascending: true });

    if (!allItems || allItems.length < 2) return;

    const currentIndex = allItems.findIndex((i: any) => i.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= allItems.length) return;

    const target = allItems[targetIndex];

    await (supabase as any).from('piccolo_menu_items' as any).update({ order: target.order }).eq('id', current.id);
    await (supabase as any).from('piccolo_menu_items' as any).update({ order: current.order }).eq('id', target.id);
  },

  async updateBulkOrder(updates: { id: number; order: number }[]): Promise<void> {
    for (const update of updates) {
      await (supabase as any).from('piccolo_menu_items' as any).update({ order: update.order }).eq('id', update.id);
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
  setMenus?: PiccoloSetMenu[];
}

export const piccoloSetMenuService = {
  async getAll(): Promise<PiccoloSetMenu[]> {
    // 1. Fetch Active Set Menus
    const { data: setMenus, error: menuError } = await (supabase as any)
      .from('piccolo_set_menus' as any)
      .select('*')
      // .eq('status', 'active') // Admin needs all statuses
      .order('order', { ascending: true });

    if (menuError) throw menuError;
    if (!setMenus || setMenus.length === 0) return [];

    const setMenuIds = setMenus.map((m: any) => m.id);

    // 2. Fetch Groups
    const { data: groups, error: groupError } = await (supabase as any)
      .from('piccolo_set_menu_groups' as any)
      .select('*')
      .in('set_menu_id', setMenuIds)
      .order('order', { ascending: true });

    if (groupError) throw groupError;

    const groupIds = groups?.map((g: any) => g.id) || [];

    // 3. Fetch Items
    const { data: items, error: itemError } = await (supabase as any)
      .from('piccolo_set_menu_items' as any)
      .select('*')
      .in('group_id', groupIds)
      .order('order', { ascending: true });

    if (itemError) throw itemError;

    // 4. Assemble
    const result: PiccoloSetMenu[] = setMenus.map((menu: PiccoloSetMenu) => {
      const menuGroups = groups
        ?.filter((g: PiccoloSetMenuGroup) => g.set_menu_id === menu.id)
        .map((group: PiccoloSetMenuGroup) => ({
          ...group,
          items: items?.filter((i: PiccoloSetMenuItem) => i.group_id === group.id) || [],
        })) || [];

      return {
        ...menu,
        groups: menuGroups
      };
    });

    return result;
  },

  // --- SET MENUS ---

  async getById(id: number): Promise<PiccoloSetMenu | null> {
    const { data, error } = await (supabase as any)
      .from('piccolo_set_menus' as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return (data as any);
  },

  async create(menu: Omit<PiccoloSetMenu, 'id' | 'created_at' | 'updated_at' | 'order'>): Promise<PiccoloSetMenu> {
    const { data: maxOrderData } = await (supabase as any)
      .from('piccolo_set_menus' as any)
      .select('order')
      .order('order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (maxOrderData?.order || 0) + 1;

    const { data, error } = await (supabase as any)
      .from('piccolo_set_menus' as any)
      .insert({ ...menu, order: nextOrder })
      .select()
      .single();

    if (error) throw error;
    return (data as any);
  },

  async update(id: number, menu: Partial<PiccoloSetMenu>): Promise<PiccoloSetMenu> {
    const { data, error } = await (supabase as any)
      .from('piccolo_set_menus' as any)
      .update(menu)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return (data as any);
  },

  async delete(id: number): Promise<void> {
    const { error } = await (supabase as any)
      .from('piccolo_set_menus' as any)
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async reorder(id: number, direction: 'up' | 'down'): Promise<void> {
    const current = await this.getById(id);
    if (!current) throw new Error('Set Menu not found');

    const { data: allMenus } = await (supabase as any)
      .from('piccolo_set_menus' as any)
      .select('id, order')
      .order('order', { ascending: true });

    if (!allMenus || allMenus.length < 2) return;

    const currentIndex = allMenus.findIndex((m: any) => m.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= allMenus.length) return;

    const target = allMenus[targetIndex];

    await (supabase as any).from('piccolo_set_menus' as any).update({ order: target.order }).eq('id', current.id);
    await (supabase as any).from('piccolo_set_menus' as any).update({ order: current.order }).eq('id', target.id);
  },

  async updateBulkOrder(updates: { id: number; order: number }[]): Promise<void> {
    for (const update of updates) {
      await (supabase as any).from('piccolo_set_menus' as any).update({ order: update.order }).eq('id', update.id);
    }
  },

  // --- GROUPS ---

  async getGroupById(id: number): Promise<PiccoloSetMenuGroup | null> {
    const { data, error } = await (supabase as any)
      .from('piccolo_set_menu_groups' as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return (data as any);
  },

  async createGroup(group: Omit<PiccoloSetMenuGroup, 'id' | 'created_at' | 'order'>): Promise<PiccoloSetMenuGroup> {
    const { data: maxOrderData } = await (supabase as any)
      .from('piccolo_set_menu_groups' as any)
      .select('order')
      .eq('set_menu_id', group.set_menu_id)
      .order('order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (maxOrderData?.order || 0) + 1;

    const { data, error } = await (supabase as any)
      .from('piccolo_set_menu_groups' as any)
      .insert({ ...group, order: nextOrder })
      .select()
      .single();

    if (error) throw error;
    return (data as any);
  },

  async updateGroup(id: number, group: Partial<PiccoloSetMenuGroup>): Promise<PiccoloSetMenuGroup> {
    const { data, error } = await (supabase as any)
      .from('piccolo_set_menu_groups' as any)
      .update(group)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return (data as any);
  },

  async deleteGroup(id: number): Promise<void> {
    const { error } = await (supabase as any)
      .from('piccolo_set_menu_groups' as any)
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async reorderGroup(id: number, direction: 'up' | 'down'): Promise<void> {
    const current = await this.getGroupById(id);
    if (!current) throw new Error('Group not found');

    const { data: allGroups } = await (supabase as any)
      .from('piccolo_set_menu_groups' as any)
      .select('id, order')
      .eq('set_menu_id', current.set_menu_id)
      .order('order', { ascending: true });

    if (!allGroups || allGroups.length < 2) return;

    const currentIndex = allGroups.findIndex((g: any) => g.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= allGroups.length) return;

    const target = allGroups[targetIndex];

    await (supabase as any).from('piccolo_set_menu_groups' as any).update({ order: target.order }).eq('id', current.id);
    await (supabase as any).from('piccolo_set_menu_groups' as any).update({ order: current.order }).eq('id', target.id);
  },

  // --- ITEMS ---

  async getItemById(id: number): Promise<PiccoloSetMenuItem | null> {
    const { data, error } = await (supabase as any)
      .from('piccolo_set_menu_items' as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return (data as any);
  },

  async createItem(item: Omit<PiccoloSetMenuItem, 'id' | 'created_at' | 'order'>): Promise<PiccoloSetMenuItem> {
    const { data: maxOrderData } = await (supabase as any)
      .from('piccolo_set_menu_items' as any)
      .select('order')
      .eq('group_id', item.group_id)
      .order('order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (maxOrderData?.order || 0) + 1;

    const { data, error } = await (supabase as any)
      .from('piccolo_set_menu_items' as any)
      .insert({ ...item, order: nextOrder })
      .select()
      .single();

    if (error) throw error;
    return (data as any);
  },

  async updateItem(id: number, item: Partial<PiccoloSetMenuItem>): Promise<PiccoloSetMenuItem> {
    const { data, error } = await (supabase as any)
      .from('piccolo_set_menu_items' as any)
      .update(item)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return (data as any);
  },

  async deleteItem(id: number): Promise<void> {
    const { error } = await (supabase as any)
      .from('piccolo_set_menu_items' as any)
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async reorderItem(id: number, direction: 'up' | 'down'): Promise<void> {
    const current = await this.getItemById(id);
    if (!current) throw new Error('Item not found');

    const { data: allItems } = await (supabase as any)
      .from('piccolo_set_menu_items' as any)
      .select('id, order')
      .eq('group_id', current.group_id)
      .order('order', { ascending: true });

    if (!allItems || allItems.length < 2) return;

    const currentIndex = allItems.findIndex((i: any) => i.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= allItems.length) return;

    const target = allItems[targetIndex];

    await (supabase as any).from('piccolo_set_menu_items' as any).update({ order: target.order }).eq('id', current.id);
    await (supabase as any).from('piccolo_set_menu_items' as any).update({ order: current.order }).eq('id', target.id);
  },
};


export const piccoloMenuService = {
  async getActiveCategories(): Promise<PiccoloCategory[]> {
    const { data, error } = await (supabase as any)
      .from('piccolo_categories' as any)
      .select('*')
      .eq('status', 'active')
      .order('order', { ascending: true });

    if (error) throw error;
    return (data as any) || [];
  },

  async getAllMenuData(): Promise<Map<number, PiccoloMenuData>> {
    const [categories, subcategories, menuItems, addons, setMenus] = await Promise.all([
      this.getActiveCategories(),
      piccoloSubcategoryService.getAll(),
      piccoloMenuItemService.getAll(),
      piccoloAddonService.getAll(),
      piccoloSetMenuService.getAll(),
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

    // Add a virtual "Formules" category if set menus exist
    if (setMenus && setMenus.length > 0) {
      // Use negative ID for virtual category
      const formulesCategory: PiccoloCategory = {
        id: -1,
        title: 'Formules',
        title_en: 'Set Menus',
        title_it: 'Menu fissi',
        title_es: 'Menús del día',
        order: -1,
        status: 'active',
        text: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      menuDataMap.set(-1, {
        category: formulesCategory,
        subcategories: [],
        menuItems: [],
        addons: [],
        setMenus: setMenus
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
    const { data, error } = await (supabase as any)
      .from('piccolo_addons' as any)
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return (data as any) || [];
  },

  async getByCategory(categoryId: number): Promise<PiccoloAddon[]> {
    const { data: subcategories, error: subcatError } = await (supabase as any)
      .from('piccolo_subcategories' as any)
      .select('id')
      .eq('category_id', categoryId);

    if (subcatError) throw subcatError;

    const subcategoryIds = subcategories?.map((s: any) => s.id) || [];

    const { data, error } = await (supabase as any)
      .from('piccolo_addons' as any)
      .select('*')
      .or(`category_id.eq.${categoryId},subcategory_id.in.(${subcategoryIds.join(',')})`)
      .order('order', { ascending: true });

    if (error) throw error;
    return (data as any) || [];
  },

  async getBySubcategory(subcategoryId: number): Promise<PiccoloAddon[]> {
    const { data, error } = await (supabase as any)
      .from('piccolo_addons' as any)
      .select('*')
      .eq('subcategory_id', subcategoryId)
      .order('order', { ascending: true });

    if (error) throw error;
    return (data as any) || [];
  },

  async getById(id: number): Promise<PiccoloAddon | null> {
    const { data, error } = await (supabase as any)
      .from('piccolo_addons' as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return (data as any);
  },

  async create(addon: Omit<PiccoloAddon, 'id' | 'created_at' | 'updated_at' | 'order'>): Promise<PiccoloAddon> {
    let nextOrder = 1;
    if (addon.subcategory_id) {
      const { data: maxOrderData } = await (supabase as any)
        .from('piccolo_addons' as any)
        .select('order')
        .eq('subcategory_id', addon.subcategory_id)
        .order('order', { ascending: false })
        .limit(1)
        .maybeSingle();

      nextOrder = (maxOrderData?.order || 0) + 1;
    }

    const { data, error } = await (supabase as any)
      .from('piccolo_addons' as any)
      .insert({ ...addon, order: nextOrder })
      .select()
      .single();

    if (error) throw error;
    return (data as any);
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

    const { data, error } = await (supabase as any)
      .from('piccolo_addons' as any)
      .update(addon)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return (data as any);
  },

  async delete(id: number): Promise<void> {
    const addon = await this.getById(id);

    const { error } = await (supabase as any)
      .from('piccolo_addons' as any)
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

    const { data: allAddons } = await (supabase as any)
      .from('piccolo_addons' as any)
      .select('id, order')
      .eq('subcategory_id', current.subcategory_id)
      .order('order', { ascending: true });

    if (!allAddons || allAddons.length < 2) return;

    const currentIndex = allAddons.findIndex((a: any) => a.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= allAddons.length) return;

    const target = allAddons[targetIndex];

    await (supabase as any).from('piccolo_addons' as any).update({ order: target.order }).eq('id', current.id);
    await (supabase as any).from('piccolo_addons' as any).update({ order: current.order }).eq('id', target.id);
  },

  async updateBulkOrder(updates: { id: number; order: number }[]): Promise<void> {
    for (const update of updates) {
      await (supabase as any).from('piccolo_addons' as any).update({ order: update.order }).eq('id', update.id);
    }
  },
};
