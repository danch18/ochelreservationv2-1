import { RestaurantId } from '@/config/restaurants';
import { menuService, type MenuData } from './menuService';
import { piccoloMenuService, type PiccoloMenuData } from './piccoloMenuService';

export interface SerializedMenuEntry {
  categoryId: number;
  data: MenuData | PiccoloMenuData;
}

export async function fetchMenuDataServer(restaurantId: RestaurantId): Promise<SerializedMenuEntry[]> {
  if (restaurantId === 'piccolo') {
    const menuDataMap = await piccoloMenuService.getAllMenuData();
    return Array.from(menuDataMap.entries()).map(([categoryId, data]) => ({
      categoryId,
      data,
    }));
  }

  const menuDataMap = await menuService.getAllMenuData(restaurantId);
  return Array.from(menuDataMap.entries()).map(([categoryId, data]) => ({
    categoryId,
    data,
  }));
}
