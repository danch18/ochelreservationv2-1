import { supabase } from '@/lib/supabase';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Category {
  id: number;
  title: string;
  text?: string | null;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
  created_by?: number | null;
  updated_by?: number | null;
}

export interface Subcategory {
  id: number;
  category_id: number;
  title: string;
  text?: string | null;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
  created_by?: number | null;
  updated_by?: number | null;
}

export interface MenuItem {
  id: number;
  title: string;
  text?: string | null;
  description: string;
  image_path?: string | null;
  model_3d_url?: string | null;
  redirect_3d_url?: string | null;
  additional_image_url?: string | null;
  is_special: boolean;
  price: number;
  subcategory_id: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
  created_by?: number | null;
  updated_by?: number | null;
}

export interface Addon {
  id: number;
  title: string;
  description?: string | null;
  image_path?: string | null;
  price: number;
  category_id?: number | null;
  subcategory_id?: number | null;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
  created_by?: number | null;
  updated_by?: number | null;
}

// ============================================================================
// CATEGORIES
// ============================================================================

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: number, category: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// ============================================================================
// SUBCATEGORIES
// ============================================================================

export const subcategoryService = {
  async getAll(): Promise<Subcategory[]> {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByCategory(categoryId: number): Promise<Subcategory[]> {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<Subcategory | null> {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(subcategory: Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>): Promise<Subcategory> {
    const { data, error } = await supabase
      .from('subcategories')
      .insert(subcategory)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: number, subcategory: Partial<Subcategory>): Promise<Subcategory> {
    const { data, error } = await supabase
      .from('subcategories')
      .update(subcategory)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// ============================================================================
// MENU ITEMS
// ============================================================================

export const menuItemService = {
  async getAll(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getBySubcategory(subcategoryId: number): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('subcategory_id', subcategoryId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<MenuItem | null> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(menuItem: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(menuItem)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: number, menuItem: Partial<MenuItem>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .update(menuItem)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// ============================================================================
// MENU DATA - Composite query for menu display
// ============================================================================

export interface MenuData {
  category: Category;
  subcategories: Subcategory[];
  menuItems: MenuItem[];
  addons: Addon[];
}

export const menuService = {
  async getMenuByCategory(categoryId: number): Promise<MenuData> {
    // Fetch all data in parallel
    const [category, subcategories, allMenuItems, addons] = await Promise.all([
      categoryService.getById(categoryId),
      subcategoryService.getByCategory(categoryId),
      menuItemService.getAll(),
      addonService.getByCategory(categoryId),
    ]);

    if (!category) {
      throw new Error('Category not found');
    }

    // Filter menu items to only those in this category's subcategories
    const subcategoryIds = subcategories.map(s => s.id);
    const menuItems = allMenuItems.filter(item =>
      subcategoryIds.includes(item.subcategory_id) && item.status === 'active'
    );

    return {
      category,
      subcategories: subcategories.filter(s => s.status === 'active'),
      menuItems,
      addons: addons.filter(a => a.status === 'active'),
    };
  },

  async getActiveCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getAllMenuData(): Promise<Map<number, MenuData>> {
    // Fetch all data in one go
    const [categories, subcategories, menuItems, addons] = await Promise.all([
      this.getActiveCategories(),
      subcategoryService.getAll(),
      menuItemService.getAll(),
      addonService.getAll(),
    ]);

    // Build a map of category ID to menu data
    const menuDataMap = new Map<number, MenuData>();

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
// ADDONS
// ============================================================================

export const addonService = {
  async getAll(): Promise<Addon[]> {
    const { data, error } = await supabase
      .from('addons')
      .select('*')
      .order('created_at', { ascending: false});

    if (error) throw error;
    return data || [];
  },

  async getByCategory(categoryId: number): Promise<Addon[]> {
    // Get all subcategories for this category first
    const { data: subcategories, error: subcatError } = await supabase
      .from('subcategories')
      .select('id')
      .eq('category_id', categoryId);

    if (subcatError) throw subcatError;

    const subcategoryIds = subcategories?.map(s => s.id) || [];

    // Get addons that match this category OR any of its subcategories
    const { data, error } = await supabase
      .from('addons')
      .select('*')
      .or(`category_id.eq.${categoryId},subcategory_id.in.(${subcategoryIds.join(',')})`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getBySubcategory(subcategoryId: number): Promise<Addon[]> {
    const { data, error } = await supabase
      .from('addons')
      .select('*')
      .eq('subcategory_id', subcategoryId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<Addon | null> {
    const { data, error } = await supabase
      .from('addons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(addon: Omit<Addon, 'id' | 'created_at' | 'updated_at'>): Promise<Addon> {
    const { data, error } = await supabase
      .from('addons')
      .insert(addon)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: number, addon: Partial<Addon>): Promise<Addon> {
    const { data, error } = await supabase
      .from('addons')
      .update(addon)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('addons')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
