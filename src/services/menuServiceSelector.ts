/**
 * Service Selector for Menu Management
 *
 * This module provides a way to select the appropriate menu service
 * based on the restaurant ID. Piccolo uses separate tables, while
 * Magnifiko uses the original tables with restaurant_id filtering.
 */

import { RestaurantId } from '@/config/restaurants';
import * as MagnifikoService from './menuService';
import * as PiccoloService from './piccoloMenuService';

/**
 * Get the appropriate translation function based on restaurant ID
 */
export function getTranslatedFieldForRestaurant(restaurantId: RestaurantId) {
  if (restaurantId === 'piccolo') {
    return PiccoloService.getPiccoloTranslatedField;
  }
  return MagnifikoService.getTranslatedField;
}

export function getMenuServices(restaurantId: RestaurantId) {
  const isPiccolo = restaurantId === 'piccolo';

  if (isPiccolo) {
    return {
      categoryService: {
        getAll: () => PiccoloService.piccoloCategoryService.getAll(),
        getById: (id: number) => PiccoloService.piccoloCategoryService.getById(id),
        create: (cat: any) => {
          const { restaurant_id, ...rest } = cat;
          return PiccoloService.piccoloCategoryService.create(rest);
        },
        update: (id: number, cat: any) => {
          const { restaurant_id, ...rest } = cat;
          return PiccoloService.piccoloCategoryService.update(id, rest);
        },
        delete: (id: number) => PiccoloService.piccoloCategoryService.delete(id),
        reorder: (id: number, dir: 'up' | 'down') => PiccoloService.piccoloCategoryService.reorder(id, dir),
        updateBulkOrder: (updates: any[]) => PiccoloService.piccoloCategoryService.updateBulkOrder(updates),
      },
      subcategoryService: {
        getAll: () => PiccoloService.piccoloSubcategoryService.getAll(),
        getByCategory: (id: number) => PiccoloService.piccoloSubcategoryService.getByCategory(id),
        getById: (id: number) => PiccoloService.piccoloSubcategoryService.getById(id),
        create: (subcat: any) => {
          const { restaurant_id, ...rest } = subcat;
          return PiccoloService.piccoloSubcategoryService.create(rest);
        },
        update: (id: number, subcat: any) => {
          const { restaurant_id, ...rest } = subcat;
          return PiccoloService.piccoloSubcategoryService.update(id, rest);
        },
        delete: (id: number) => PiccoloService.piccoloSubcategoryService.delete(id),
        reorder: (id: number, dir: 'up' | 'down') => PiccoloService.piccoloSubcategoryService.reorder(id, dir),
        updateBulkOrder: (updates: any[]) => PiccoloService.piccoloSubcategoryService.updateBulkOrder(updates),
      },
      menuItemService: {
        getAll: () => PiccoloService.piccoloMenuItemService.getAll(),
        getBySubcategory: (id: number) => PiccoloService.piccoloMenuItemService.getBySubcategory(id),
        getById: (id: number) => PiccoloService.piccoloMenuItemService.getById(id),
        create: (item: any) => {
          const { restaurant_id, ...rest } = item;
          return PiccoloService.piccoloMenuItemService.create(rest);
        },
        update: (id: number, item: any) => {
          const { restaurant_id, ...rest } = item;
          return PiccoloService.piccoloMenuItemService.update(id, rest);
        },
        delete: (id: number) => PiccoloService.piccoloMenuItemService.delete(id),
        getSpecialItems: () => PiccoloService.piccoloMenuItemService.getSpecialItems(),
        reorder: (id: number, dir: 'up' | 'down') => PiccoloService.piccoloMenuItemService.reorder(id, dir),
        updateBulkOrder: (updates: any[]) => PiccoloService.piccoloMenuItemService.updateBulkOrder(updates),
      },
      addonService: {
        getAll: () => PiccoloService.piccoloAddonService.getAll(),
        getByCategory: (id: number) => PiccoloService.piccoloAddonService.getByCategory(id),
        getBySubcategory: (id: number) => PiccoloService.piccoloAddonService.getBySubcategory(id),
        getById: (id: number) => PiccoloService.piccoloAddonService.getById(id),
        create: (addon: any) => {
          const { restaurant_id, ...rest } = addon;
          return PiccoloService.piccoloAddonService.create(rest);
        },
        update: (id: number, addon: any) => {
          const { restaurant_id, ...rest } = addon;
          return PiccoloService.piccoloAddonService.update(id, rest);
        },
        delete: (id: number) => PiccoloService.piccoloAddonService.delete(id),
        reorder: (id: number, dir: 'up' | 'down') => PiccoloService.piccoloAddonService.reorder(id, dir),
        updateBulkOrder: (updates: any[]) => PiccoloService.piccoloAddonService.updateBulkOrder(updates),
      },
      menuService: {
        getAllMenuData: () => PiccoloService.piccoloMenuService.getAllMenuData(),
        getActiveCategories: () => PiccoloService.piccoloMenuService.getActiveCategories(),
      },
      setMenuService: {
        getAll: () => PiccoloService.piccoloSetMenuService.getAll(),
        getById: (id: number) => PiccoloService.piccoloSetMenuService.getById(id),
        create: (item: any) => PiccoloService.piccoloSetMenuService.create(item),
        update: (id: number, item: any) => PiccoloService.piccoloSetMenuService.update(id, item),
        delete: (id: number) => PiccoloService.piccoloSetMenuService.delete(id),
        reorder: (id: number, dir: 'up' | 'down') => PiccoloService.piccoloSetMenuService.reorder(id, dir),
        updateBulkOrder: (updates: any[]) => PiccoloService.piccoloSetMenuService.updateBulkOrder(updates),

        // Groups
        getGroupById: (id: number) => PiccoloService.piccoloSetMenuService.getGroupById(id),
        createGroup: (group: any) => PiccoloService.piccoloSetMenuService.createGroup(group),
        updateGroup: (id: number, group: any) => PiccoloService.piccoloSetMenuService.updateGroup(id, group),
        deleteGroup: (id: number) => PiccoloService.piccoloSetMenuService.deleteGroup(id),
        reorderGroup: (id: number, dir: 'up' | 'down') => PiccoloService.piccoloSetMenuService.reorderGroup(id, dir),

        // Items
        getItemById: (id: number) => PiccoloService.piccoloSetMenuService.getItemById(id),
        createItem: (item: any) => PiccoloService.piccoloSetMenuService.createItem(item),
        updateItem: (id: number, item: any) => PiccoloService.piccoloSetMenuService.updateItem(id, item),
        deleteItem: (id: number) => PiccoloService.piccoloSetMenuService.deleteItem(id),
        reorderItem: (id: number, dir: 'up' | 'down') => PiccoloService.piccoloSetMenuService.reorderItem(id, dir),
      },
    };
  }

  // Magnifiko - use original services with restaurant filtering
  return {
    categoryService: {
      getAll: () => MagnifikoService.categoryService.getAll(restaurantId),
      getById: (id: number) => MagnifikoService.categoryService.getById(id),
      create: (cat: any) => MagnifikoService.categoryService.create({ ...cat, restaurant_id: restaurantId }),
      update: (id: number, cat: any) => MagnifikoService.categoryService.update(id, cat),
      delete: (id: number) => MagnifikoService.categoryService.delete(id),
      reorder: (id: number, dir: 'up' | 'down') => MagnifikoService.categoryService.reorder(id, dir),
      updateBulkOrder: (updates: any[]) => MagnifikoService.categoryService.updateBulkOrder(updates),
    },
    subcategoryService: {
      getAll: () => MagnifikoService.subcategoryService.getAll(restaurantId),
      getByCategory: (id: number) => MagnifikoService.subcategoryService.getByCategory(id),
      getById: (id: number) => MagnifikoService.subcategoryService.getById(id),
      create: (subcat: any) => MagnifikoService.subcategoryService.create({ ...subcat, restaurant_id: restaurantId }),
      update: (id: number, subcat: any) => MagnifikoService.subcategoryService.update(id, subcat),
      delete: (id: number) => MagnifikoService.subcategoryService.delete(id),
      reorder: (id: number, dir: 'up' | 'down') => MagnifikoService.subcategoryService.reorder(id, dir),
      updateBulkOrder: (updates: any[]) => MagnifikoService.subcategoryService.updateBulkOrder(updates),
    },
    menuItemService: {
      getAll: () => MagnifikoService.menuItemService.getAll(restaurantId),
      getBySubcategory: (id: number) => MagnifikoService.menuItemService.getBySubcategory(id),
      getById: (id: number) => MagnifikoService.menuItemService.getById(id),
      create: (item: any) => MagnifikoService.menuItemService.create({ ...item, restaurant_id: restaurantId }),
      update: (id: number, item: any) => MagnifikoService.menuItemService.update(id, item),
      delete: (id: number) => MagnifikoService.menuItemService.delete(id),
      getSpecialItems: () => MagnifikoService.menuItemService.getSpecialItems(),
      reorder: (id: number, dir: 'up' | 'down') => MagnifikoService.menuItemService.reorder(id, dir),
      updateBulkOrder: (updates: any[]) => MagnifikoService.menuItemService.updateBulkOrder(updates),
    },
    addonService: {
      getAll: () => MagnifikoService.addonService.getAll(restaurantId),
      getByCategory: (id: number) => MagnifikoService.addonService.getByCategory(id),
      getBySubcategory: (id: number) => MagnifikoService.addonService.getBySubcategory(id),
      getById: (id: number) => MagnifikoService.addonService.getById(id),
      create: (addon: any) => MagnifikoService.addonService.create({ ...addon, restaurant_id: restaurantId }),
      update: (id: number, addon: any) => MagnifikoService.addonService.update(id, addon),
      delete: (id: number) => MagnifikoService.addonService.delete(id),
      reorder: (id: number, dir: 'up' | 'down') => MagnifikoService.addonService.reorder(id, dir),
      updateBulkOrder: (updates: any[]) => MagnifikoService.addonService.updateBulkOrder(updates),
    },
    menuService: {
      getAllMenuData: () => MagnifikoService.menuService.getAllMenuData(restaurantId),
      getActiveCategories: () => MagnifikoService.menuService.getActiveCategories(restaurantId),
    },
  };
}
